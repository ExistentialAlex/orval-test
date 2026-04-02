# Onboarding

**Initial onboarding**

In order to set up CICD please follow steps below:

1. [Request concourse team](#Concourse-Team)
2. [Create secrets](#Secrets-creation)
3. [Set up CI/CD](#CI/CD-initial-Setup)

## Concourse Team

You will also require a Concourse Team with the correct secrets in place, if you already have one please use your
existing team otherwise you can request new team by following the
process [here](https://wiki.at.sky/display/CEC/%5BCI%5D+Accessing+the+platform)

## CI/CD initial Setup

In order to create pipelines in concourse that can deploy to Adtech k8 platform, follow steps below:

1. Add the service account `svc-adtech-cicd-bot` to the repository with `Admin` access

   ```
   gh auth login # follow instructions to login
   gh api --method PUT -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/sky-uk/adtech-order-planner-api/collaborators/svc-adtech-cicd-bot -f permission='admin'
   ```

2. Export AWS credentials locally (copy from [here](https://awsatsky.awsapps.com/start/#/))

3. If you haven't already, enable the GKE API across your projects using this template url https://console.developers.google.com/apis/api/container.googleapis.com/overview?project=${PROJECT_ID}

4. Apply concourse pipeline by running below in project `bootstrap` directory:

   ```
   make concourse-login # login to concourse
   make concourse-apply-pipeline # create pipeline_generator pipeline in concourse
   ```

**_You pipeline should now be set up
in [concourse](https://concourse.at.sky/teams/adtech-order-planner/pipelines/adtech-order-planner-api-generator)_**

This pipeline once kicked off should create two pipelines:

- `<project-name>-app-pr` pipeline
- `<project-name>-app-deploy` pipeline

Each pipeline is configured to execute tests and deploy reference app successfully to the platform (as per cookiecutter
configuration). If your pipelines are not generated look at
our [troubleshooting section](#Troubleshooting-your-pipeline)

## Slack notification channel set up

Create an "Incoming Webhook" for the slack channel and add its token to KMS. - Go to https://sky.slack.com/apps

- Search for "incoming webhooks" and select it - On the "Incoming Webhooks" page, click on "Request Configuration" and
  optionally enter a description -
  e.g. `Kindly issue a new token so we can send alerts to our new channel #<your_notification_channel>`
- Once the request is approved, refresh the page and click "Add to Slack" to configure the integration with your channel
- On the configuration page look for the token in Integration Settings. It should be the last few elements that come after `https://hooks.slack.com/services/`
- Save the configuration. A notification will be automatically sent to your channel to confirm the integration
- Add the token to KMS

  ```
  aws secretsmanager create-secret --name "/concourse/adtech-order-planner/slack_webhook_secret" --description 'Slack channel webhook' --secret-string '<token>'
  ```

## GitHub bot account setup

- Please follow the instructions [here](https://github.com/sky-uk/github-usage/blob/master/guidelines.md#bot-accounts)

### Troubleshooting your pipeline

1. If your resource check is not finding any changes, check your webhook delivery. It's likely the webhook url is wrong.
2. To debug a container running on concourse:
   ```
    fly -t adtech-order-planner intercept -j adtech-order-planner-api-deploy/build
   ```
3. If your pipeline fails to push an image to your registry
   - Check your `concourse_team_name` matches the name of the team in your [tenants config](https://github.com/sky-uk/adtech-platform-config/blob/main/tenants/envs/uk-cti-adtech-platform-test/teams_config.yml)
   - Check your concourse service account (<service-account-email>) is able to push images to your repository.
     For instance given a service account `concourse-ui-bff@uk-cti-order-planner-test.iam.gserviceaccount.com` which json key file is stored under `concourse/adtech-order-planner/concourse-ui-bff@uk-cti-order-planner-test.iam.gserviceaccount.com-key` AWS secret

   ```
     1. aws secretsmanager get-secret-value --secret-id "/concourse/adtech-order-planner/concourse-ui-bff@uk-cti-order-planner-test.iam.gserviceaccount.com-key" --query SecretString --output text | jq -r '.keyfile' > /tmp/sa-keyfile

     2. gcloud auth activate-service-account concourse-ui-bff@uk-cti-order-planner-test.iam.gserviceaccount.com --key-file=/tmp/sa-keyfile --project=uk-cti-adtech-platform-test

     3. gcloud auth configure-docker europe-west1-docker.pkg.dev

     4. docker tag <someimage>:<sometag> europe-west1-docker.pkg.dev/uk-cti-adtech-platform-test/adtech-order-planner/<someimage>:<sometag>

     5. docker push europe-west1-docker.pkg.dev/uk-cti-adtech-platform-test/adtech-order-planner/<someimage>:<sometag>
   ```
