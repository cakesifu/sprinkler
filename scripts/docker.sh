#!/usr/bin/env bash

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

case $1 in
  build)
    docker build -t cakesifu/sprinkler:$PACKAGE_VERSION .
    ;;
  push)
    docker push cakesifu/sprinkler:$PACKAGE_VERSION
    ;;
  *)
    echo "Usage: $0 <build | push>"
esac

