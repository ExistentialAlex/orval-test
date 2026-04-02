AWS_GITHUB_PWD_SECRET_NAME = /concourse/<platform-team-name>/github_pat
AWS_GITHUB_WEBHOOK_TOKEN_NAME = /concourse/<platform-team-name>/<project-name>-server-webhook-token
AWS_REGION ?= eu-west-1

build: docker-compose
	docker-compose build concourse-setup

concourse-login:
	fly login -t <platform-team-name> --team-name <platform-team-name> --concourse-url https://concourse.at.sky
	
concourse-apply-pipeline: docker-compose
	docker-compose run --rm concourse-setup bash -c 'fly -t <platform-team-name> set-pipeline --pipeline <project-name>-server-generator --config ./ci/pipelines/pipeline_generator.yaml -n && fly -t <platform-team-name>  unpause-pipeline  --pipeline <project-name>-server-generator'

concourse-apply-pr-pipeline: docker-compose
	docker-compose run --rm concourse-setup bash -c 'fly -t <platform-team-name> set-pipeline --pipeline <project-name>-server-pr --config ./ci/pipelines/check.yaml -n'

concourse-apply-deploy-pipeline: docker-compose
	docker-compose run --rm concourse-setup bash -c 'fly -t <platform-team-name> set-pipeline --pipeline <project-name>-server-deploy --config ./ci/pipelines/deploy.yaml -n'

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
