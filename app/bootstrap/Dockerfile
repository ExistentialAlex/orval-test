# Generic image for Python apps
FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:402.0.0-alpine as base

WORKDIR /tmp
ENV FLY_VERSION '7.12.1'
RUN apk update && \
    apk add jq && \
    apk add --no-cache aws-cli && \
    wget https://github.com/concourse/concourse/releases/download/v${FLY_VERSION}/fly-${FLY_VERSION}-linux-amd64.tgz && \
    tar -xzf fly-${FLY_VERSION}-linux-amd64.tgz && \
    cp /tmp/fly /usr/bin/fly

CMD ["bash"]