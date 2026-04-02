COMPOSE_RUN_CMD=docker-compose run --rm
PNPM_INIT_CMD=pnpm install --no-optional --prefer-offline --frozen-lockfile
TARGET_ENV?=test
NAMESPACE?="<launchpad namespace>"
K8_SERVICE_NAME?="<launchpad service>"

# If git is present and GIT_TAG is not defined, set GIT_TAG to latest commit hash
ifneq (, $(shell which git))
	GIT_TAG ?= $(shell git rev-parse --short HEAD)
endif

# Image management
.PHONY: docker-build-server
docker-build-server: docker-compose ## Build app docker image	
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) docker-compose build server

.PHONY: docker-push-server
docker-push-server: docker-compose ## Push local image to GCP registry
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) docker-compose push server

.PHONY: docker-build-app
docker-build-app: docker-compose ## Build app docker image
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) docker-compose build app

.PHONY: docker-push-app
docker-push-app: docker-compose ## Push local image to GCP registry
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) docker-compose push app

# Application
.PHONY: run-from-scratch
run-from-scratch: docker-compose ## Restart the application from scratch
	docker-compose down -v --remove-orphans && \
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) docker-compose up --build -d server app

.PHONY: run
run: docker-compose ## Run the application using docker-compose
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) docker-compose up --build -d server app

.PHONY: run-server
run-server: docker-compose
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) $(COMPOSE_RUN_CMD) --service-ports server

.PHONY: run-app
run-app: docker-compose
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) $(COMPOSE_RUN_CMD) --service-ports app

# Testing
.PHONY: unit-tests
unit-tests:
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) $(COMPOSE_RUN_CMD) --build --entrypoint sh ci -c 'pnpm run test:unit'

.PHONY: e2e-tests
e2e-tests:
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) $(COMPOSE_RUN_CMD) --build --entrypoint sh e2e -c 'export CI=true && pnpm run test:e2e'

.PHONY: lint
lint:
	TARGET_ENV=$(TARGET_ENV) GIT_TAG=$(GIT_TAG) $(COMPOSE_RUN_CMD) --build --entrypoint sh ci -c 'pnpm run lint'

# Dependencies
.PHONY: docker-compose
docker-compose: docker ##  Check to make sure docker-compose is installed
	@docker-compose version || (echo "Could not find Docker Compose"; exit 1)

.PHONY: docker
docker: ##  Check to make sure docker-compose is installed
	@docker -v || (echo "Could not find Docker"; exit 1)

.PHONY: deploy-server
deploy-server: docker-compose
	GIT_TAG=$(GIT_TAG) TARGET_ENV=$(TARGET_ENV) $(COMPOSE_RUN_CMD) kubernetes -c 'kubectl kustomize server/kubernetes/overlays/$${TARGET_ENV} | envsubst > manifest.yaml && kubectl apply -f manifest.yaml' 

.PHONY: deploy-app
deploy-app: docker-compose
	GIT_TAG=$(GIT_TAG) TARGET_ENV=$(TARGET_ENV) $(COMPOSE_RUN_CMD) kubernetes -c 'kubectl kustomize app/kubernetes/overlays/$${TARGET_ENV} | envsubst > manifest.yaml && kubectl apply -f manifest.yaml'