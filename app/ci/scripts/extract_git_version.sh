#!/bin/sh
set -x

# create directory for repo
mkdir -p work_dir

git checkout main

git describe --tag --match "v*" --abbrev=0 --exact-match $GIT_COMMIT > ../$REPO_NAME/tag.txt
cat ../$REPO_NAME/tag.txt