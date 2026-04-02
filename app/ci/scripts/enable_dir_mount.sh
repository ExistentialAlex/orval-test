#!/bin/bash -e

# Enable config and creds for k8 cluster and gcloud to be accessed by python user (UID: 1000). This is required to enable
# python base image user accessing cluster and gcloud services.

NEW_USER=python
NEW_USER_AND_GRP_ID=1000

function set_permissions() {
  _mount_dir=$1  
  (addgroup -g $NEW_USER_AND_GRP_ID "$NEW_USER" && adduser -u $NEW_USER_AND_GRP_ID -G "$NEW_USER" -D "$NEW_USER") || true
  chown -R $NEW_USER_AND_GRP_ID:$NEW_USER_AND_GRP_ID "$_mount_dir" && chmod -R g+srw "$_mount_dir"
}

for dir in "$@"
do
    echo "Setting up permissions for dir: $dir"
    mkdir -p "$dir" || true
    set_permissions "$dir"
done
