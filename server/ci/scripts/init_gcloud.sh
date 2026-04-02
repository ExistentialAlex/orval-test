#!/bin/sh

# install and activate service account based on sa key path provided

set -e

: "${SERVICE_ACCOUNT_NAME:?SERVICE_ACCOUNT_NAME may not be empty $usage}"
: "${SERVICE_ACCOUNT_KEY_PATH:?SERVICE_ACCOUNT_KEY_PATH may not be empty $usage}"
: "${TARGET_ENV:?TARGET_ENV may not be empty $usage}"
: "${DEFAULT_GCLOUD_CRED_PATH:=~/.config/gcloud/application_default_credentials.json}"

# install gcloud client
echo "Install gcloud client"
{
  CLOUD_SDK_VERSION=390.0.0 ARCH=`uname -m` && apk --no-cache add \
        curl \
        python3 \
        py3-crcmod \
        py3-openssl \
        bash \
        libc6-compat \
        openssh-client \
        git \
        gnupg \
        && curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-${ARCH}.tar.gz && \
        tar -xzf google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-${ARCH}.tar.gz && \
        rm google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-${ARCH}.tar.gz
} > /dev/null 2>&1

echo 'export PATH=$PATH:$(pwd)/google-cloud-sdk/bin' >> ~/.bashrc
ln -sf $(pwd)/google-cloud-sdk/bin/gcloud /usr/bin/gcloud
ln -sf $(pwd)/google-cloud-sdk/bin/docker-credential-gcloud /usr/bin/docker-credential-gcloud

# activate concourse service account
gcloud auth activate-service-account $SERVICE_ACCOUNT_NAME \
  --key-file=$SERVICE_ACCOUNT_KEY_PATH --project=$TARGET_ENV

echo "Configure docker to authenticate with gcp service account"
gcloud auth configure-docker europe-west1-docker.pkg.dev -q
