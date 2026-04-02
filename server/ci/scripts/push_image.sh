set -e

export TAG=$(cat $REPO_NAME/tag.txt || echo latest)
echo $GOOGLE_JSON_CREDENTIALS > credentials.json

crane auth login -u _json_key --password-stdin europe-west1-docker.pkg.dev < credentials.json
crane push "image/image.tar" "$DESTINATION_IMAGE:$TAG"
