AWS_GITHUB_PWD_SECRET_NAME = /concourse/orval-test/github_pat
AWS_GITHUB_WEBHOOK_TOKEN_NAME = /concourse/orval-test/orval-test-app-webhook-token
AWS_REGION ?= eu-west-1

build: docker-compose
	docker-compose build concourse-setup

concourse-login:
	fly login -t orval-test --team-name orval-test --concourse-url https://concourse.at.sky
	
concourse-apply-pipeline: docker-compose
	docker-compose run --rm concourse-setup bash -c 'fly -t orval-test set-pipeline --pipeline orval-test-app-generator --config ./ci/pipelines/pipeline_generator.yaml -n && fly -t orval-test  unpause-pipeline  --pipeline orval-test-app-generator'

concourse-apply-pr-pipeline: docker-compose
	docker-compose run --rm concourse-setup bash -c 'fly -t orval-test set-pipeline --pipeline orval-test-app-pr --config ./ci/pipelines/check.yaml -n'

concourse-apply-deploy-pipeline: docker-compose
	docker-compose run --rm concourse-setup bash -c 'fly -t orval-test set-pipeline --pipeline orval-test-app-deploy --config ./ci/pipelines/deploy.yaml -n'

aws-create-git-token: docker-compose
	@read -p "Enter Github bot user PAT token for svc-adtech-cicd-bot account:" secret_value; \
	docker-compose run --rm concourse-setup bash -c 'aws secretsmanager create-secret --name $(AWS_GITHUB_PWD_SECRET_NAME) --description "Github bot PAT token" --secret-string "$$secret_value" --region $(AWS_REGION);'
	
aws-update-git-token: docker-compose
	@read -p "Enter Github bot user PAT token:" secret_value; \
	docker-compose run --rm concourse-setup bash -c 'aws secretsmanager put-secret-value --secret-id $(AWS_GITHUB_PWD_SECRET_NAME) --secret-string "$$secret_value" --region $(AWS_REGION);'	
	
aws-create-webhook-token: docker-compose	
	docker-compose run --rm concourse-setup bash -c 'aws secretsmanager create-secret --name $(AWS_GITHUB_WEBHOOK_TOKEN_NAME) --description "Github webhook token" --secret-string "$(shell uuidgen)" --region $(AWS_REGION);'
	
aws-update-webhook-token: docker-compose	
	docker-compose run --rm concourse-setup bash -c 'aws secretsmanager put-secret-value --secret-id $(AWS_GITHUB_WEBHOOK_TOKEN_NAME) --secret-string "$(shell uuidgen)" --region $(AWS_REGION);'

# Dependencies
docker-compose: docker
	docker-compose version || (echo "Could not find Docker Compose"; exit 1)

docker:
	docker -v || (echo "Could not find Docker"; exit 1)
