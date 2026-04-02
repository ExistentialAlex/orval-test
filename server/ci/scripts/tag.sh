#!/bin/sh
set -x

# create directory for repo
mkdir -p work_dir

git checkout main

echo "Checking if the commit is already tagged"
if ! git describe --tag --match "bff-v*" --exact-match $GIT_COMMIT 2>&1 | grep "fatal";
then
  git describe --tag --match "bff-v*" --abbrev=0 --exact-match $GIT_COMMIT > ../$REPO_NAME/tag.txt
  echo "Commit is already tagged, using tag: $(cat ../$REPO_NAME/tag.txt)"
  exit 0
fi

echo "Getting previous tag with bff- prefix"
CURRENT_TAG=$(git describe --tag --match "bff-v*" --abbrev=0 2>/dev/null)
if [ "${CURRENT_TAG}" = "" ]
then
  echo "No bff- prefixed tags found, looking for v* tags as fallback"
  FALLBACK_TAG=$(git describe --tag --match "v*" --abbrev=0 2>/dev/null)
  if [ "${FALLBACK_TAG}" != "" ]
  then
    echo "Found fallback tag: ${FALLBACK_TAG}"
    CURRENT_TAG="${FALLBACK_TAG}"
  fi
fi
if [ "${CURRENT_TAG}" = "" ]
then
  echo "Can't find any tags"
  NEW_TAG="bff-v1.0.0"
else
  echo "Analyzing most recent commit for conventional commit format"
  COMMIT_MSG=$(git log -1 --pretty=format:"%s")
  echo "Most recent commit: $COMMIT_MSG"
  
  # Extract version from current tag (remove any prefix and 'v')
  VERSION_PART=$(echo "${CURRENT_TAG}" | sed 's/.*v//')
  MAJOR=$(echo "${VERSION_PART}" | awk -F'.' '{print $1}')
  MINOR=$(echo "${VERSION_PART}" | awk -F'.' '{print $2}')
  PATCH=$(echo "${VERSION_PART}" | awk -F'.' '{print $3}')
  
  # Determine version increment based on conventional commit
  if echo "$COMMIT_MSG" | grep -q "BREAKING CHANGE" || echo "$COMMIT_MSG" | grep -qE "^[a-zA-Z]+(\(.+\))?!:"; then
    # Major version increment for breaking changes
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    echo "Breaking change detected - incrementing major version"
  elif echo "$COMMIT_MSG" | grep -qE "^feat(\(.+\))?:"; then
    # Minor version increment for new features
    MINOR=$((MINOR + 1))
    PATCH=0
    echo "Feature detected - incrementing minor version"
  elif echo "$COMMIT_MSG" | grep -qE "^(fix|perf)(\(.+\))?:"; then
    # Patch version increment for fixes and performance improvements
    PATCH=$((PATCH + 1))
    echo "Fix or performance improvement detected - incrementing patch version"
  else
    # Default to patch increment for other changes (docs, style, refactor, test, chore, etc.)
    PATCH=$((PATCH + 1))
    echo "Other change detected - incrementing patch version (default)"
  fi
  
  NEW_TAG="bff-v${MAJOR}.${MINOR}.${PATCH}"
fi

echo "$NEW_TAG" > ./tag.txt
echo "Current tag is ${CURRENT_TAG}"
echo "New tag is ${NEW_TAG}"

echo "Creating new tag"
git tag "${NEW_TAG}"
