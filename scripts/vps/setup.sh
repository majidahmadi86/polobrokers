#!/usr/bin/env bash
# One-time setup of Polo Brokers on the VPS. Safe to run again (idempotent).
# Run as the site user polobrokers, after cloning the repository into the app folder:
#   bash /home/polobrokers/htdocs/polobrokers.com/scripts/vps/setup.sh
# Steps: nvm + Node 24 (default) + pm2, data folder (700), .env.local if missing (600, never
# overwritten), npm ci, build, pm2 process "polo" on port 3002, health check, then the one command
# root must run so pm2 starts again after a reboot.
set -euo pipefail

# shellcheck source=scripts/vps/lib.sh
. "$(dirname "$(readlink -f "$0")")/lib.sh"
require_site_user

step "Node $NODE_MAJOR via nvm ($NVM_DIR)"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "nvm not found: installing nvm $NVM_VERSION"
  # The installer refuses an NVM_DIR that does not exist yet.
  mkdir -p "$NVM_DIR"
  curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh" | NVM_DIR="$NVM_DIR" PROFILE=/dev/null bash
fi
export NVM_DIR
set +u
# shellcheck source=/dev/null
. "$NVM_DIR/nvm.sh"
nvm install "$NODE_MAJOR"
nvm alias default "$NODE_MAJOR"
set -u
load_node
echo "node $(node -v), npm $(npm -v), in $NODE_BIN_DIR"

step "pm2"
if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi
echo "pm2 $(pm2 -v)"

step "Data folder $DATA_DIR"
mkdir -p "$DATA_DIR"
chmod 700 "$DATA_DIR"

step "Environment file $APP_DIR/.env.local"
if [ -f "$APP_DIR/.env.local" ]; then
  echo "exists, left untouched"
else
  (
    umask 077
    cat >"$APP_DIR/.env.local" <<EOF
# Polo Brokers production settings. See .env.example for every key.
IG_DATA_DIR=$DATA_DIR
EOF
  )
  chmod 600 "$APP_DIR/.env.local"
  echo "created (600) with IG_DATA_DIR only"
fi

step "Port $PORT"
if ! pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  if (exec 3<>"/dev/tcp/127.0.0.1/$PORT") 2>/dev/null; then
    fail "port $PORT is already in use and no pm2 process \"$PM2_NAME\" exists. Find what listens on it (ss -ltnp | grep :$PORT) before going on."
  fi
  echo "free"
else
  echo "already served by pm2 process \"$PM2_NAME\""
fi

step "Install and build"
cd "$APP_DIR"
npm ci
npm run build

step "pm2 process $PM2_NAME"
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 restart "$PM2_NAME" --update-env
else
  pm2 start npm --name "$PM2_NAME" --cwd "$APP_DIR" -- start
fi
pm2 save

step "Health check"
health_check

PM2_BIN="$(readlink -f "$(command -v pm2)")"
echo
echo "RUN AS ROOT: env PATH=\$PATH:$NODE_BIN_DIR $PM2_BIN startup systemd -u $SITE_USER --hp $SITE_HOME"
