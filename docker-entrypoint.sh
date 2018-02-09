#!/bin/bash

set -e

if [ "$1" = 'start' ]; then
  mkdir -p /storage/dropbox
  exec npm start
fi

exec "$@"
