#!/usr/bin/env bash

set +x -e -o pipefail

IMAGE_NAME=rethinkdb
CONTAINER_NAME=ptt-rethink
DOCKER_ID_FROM_IMAGE=$(docker ps -aq -f ancestor=$IMAGE_NAME)
DOCKER_ID_FROM_CONTAINER=$(docker ps -aq -f name=$CONTAINER_NAME)
IMAGE_VERSION=2.3.6

start () {
  set -u
  if [[ -z "$DOCKER_ID_FROM_IMAGE" && -z "$DOCKER_ID_FROM_CONTAINER" ]] ; then
    echo "--- Starting new docker container.."
    docker run --name $CONTAINER_NAME -d -P $IMAGE_NAME:$IMAGE_VERSION | xargs echo "--- Started container"
  else
    echo "--- Skipping start, container already running"
    exit 0
  fi
}

stop () {
  set -u
  if [[ ! -z "$DOCKER_ID_FROM_IMAGE" ]] ; then
    ID=$DOCKER_ID_FROM_IMAGE
  elif [[ ! -z "$DOCKER_ID_FROM_CONTAINER" ]] ; then
    ID=$DOCKER_ID_FROM_CONTAINER
  else
    echo "--- Skipping stop and remove, no container found"
    exit 0
  fi

  echo "--- Stopping and removing docker container.."
  docker stop $ID | xargs echo "--- Stopped container"
  docker rm $ID | xargs echo "--- Removed container"
}

info () {
cat <<EOF
  Usage: ./db/run.sh <target>
  Targets:
    start - start a docker container with rethinkdb
    stop - stop and remove the docker container
EOF
}

case $1 in
  start)      start       ;;
  stop)       stop        ;;
  *)          info        ;;
esac
