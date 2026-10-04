#!/usr/bin/env bash
# shellcheck disable=SC2034 # the settings below are used by the scripts that source this file
# Shared by setup.sh and deploy.sh. Sourced, not run. Absolute paths only (no tilde: it gets eaten
# in the CloudPanel terminal).

APP_DIR=/home/polobrokers/htdocs/polobrokers.com
DATA_DIR=/home/polobrokers/data
SITE_USER=polobrokers
SITE_HOME=/home/polobrokers
NVM_DIR=/home/polobrokers/.nvm
NVM_VERSION=v0.40.8
NODE_MAJOR=24
PM2_NAME=polo
PORT=3002

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

step() {
  echo
  echo "==> $*"
}

require_site_user() {
  [ "$(id -un)" = "$SITE_USER" ] || fail "run this as the site user $SITE_USER (now: $(id -un))"
  [ -f "$APP_DIR/package.json" ] || fail "no app in $APP_DIR: clone the repository there first"
}

# nvm.sh is not written for "set -u", so it is loaded with that option off.
load_node() {
  export NVM_DIR
  [ -s "$NVM_DIR/nvm.sh" ] || fail "nvm not found in $NVM_DIR (run setup.sh)"
  set +u
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  nvm use --silent default >/dev/null || {
    set -u
    fail "no default Node version in nvm (run setup.sh)"
  }
  set -u
  NODE_BIN_DIR="$(dirname "$(command -v node)")"
  export PATH="$NODE_BIN_DIR:$PATH"
}

# Both languages must answer 200 on the local port; otherwise show the app log and stop.
health_check() {
  local path code
  for path in / /fr; do
    code=000
    for _ in $(seq 1 30); do
      code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT$path" || true)"
      [ "$code" = 200 ] && break
      sleep 2
    done
    if [ "$code" != 200 ]; then
      echo "Health check failed: http://127.0.0.1:$PORT$path answered $code" >&2
      pm2 logs "$PM2_NAME" --lines 40 --nostream || true
      exit 1
    fi
    echo "ok  http://127.0.0.1:$PORT$path  200"
  done
}
