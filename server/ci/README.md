# <project-name>-server CI/CD

## CI and Deployment Description

[Concourse](https://concourse.at.sky/) is used to manage all CI and deployments.

All configuration can be found under the `ci` directory

There are three types of pipelines:

- `pipeline_generator.yaml` - automated creation and management of other concourse pipelines. On pipeline template
  changes it'll update all other pipelines accordingly. It is triggered on a merge to `main`
- `deploy.yaml` - this is used to build the application and deployment to test, stage and prod. It is triggered on a
  merge to main, following automatic deployment to `test`. Higher environments are triggered manually per request.
- `check.yaml` - pull request branch build, used to build and test the code prior to merging in with the main branch.
  Pipeline will automatically update status of each PR per build result. You may want to
  use [branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging)
  to prevent merging PR with a broken build.

### Prerequisites

This repository follows the approach documented at [3Musketeers.io](https://3musketeers.io/), and as a result requires
that you install the following onto your development machine:

- [Docker](https://docker.io) with [Docker Desktop Kubernetes](https://docs.docker.com/desktop/kubernetes/) enabled
- [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/)

### CI/CD Setup

Follow docs [here](./bootstrap/README.md)

### Links

Once you've set up your cicd pipeline you can access links below:

- [concourse generator pipeline](https://concourse.at.sky/teams/adtech-order-planner/pipelines/adtech-order-planner-api-generator)
- [concourse deploy pipeline](https://concourse.at.sky/teams/adtech-order-planner/pipelines/adtech-order-planner-api-deploy)
- [concourse pr pipeline](https://concourse.at.sky/teams/adtech-order-planner/pipelines/adtech-order-planner-api-pr)

### Build logs retention

Concourse job retention policy has been set to always keep the last 3 successful amongst a max of 100 builds.
By default (when no retention policy is configured), up to 25 builds are kept regardless of whether there are successful.
This is now changed to 100 which is the cap on the concourse server.

Logs for older builds will be reclaimed, but it doesn't affect build triggering.
In fact old builds (regardless of whether they still have build logs) can still be triggered
and will still be associated to their original commit hash (even if that commit hash is no longer visible in its corresponding git resource)
