#!/usr/bin/env bash
# Deploy the latest main to the VPS. Run as the site user polobrokers, after setup.sh:
#   bash /home/polobrokers/htdocs/polobrokers.com/scripts/vps/deploy.sh
# git pull (fast-forward only), npm ci, build, restart pm2 "polo", health check, deployed commit.
# Stops at the first failure with a clear message. During the build the running site keeps serving
# the previous build; it may answer errors for a moment while the new build replaces it.
set -euo pipefail

# shellcheck source=scripts/vps/lib.sh
. "$(dirname "$(readlink -f "$0")")/lib.sh"
require_site_user
load_node
pm2 describe "$PM2_NAME" >/dev/null 2>&1 || fail "no pm2 process \"$PM2_NAME\": run setup.sh first"

cd "$APP_DIR"
step "git pull --ff-only"
git pull --ff-only || fail "git pull could not fast-forward (local changes on the server, or history rewritten). Nothing was deployed."

step "npm ci"
npm ci || fail "npm ci failed. The previous build is still running."

step "build"
npm run build || fail "build failed, the app was not restarted. Fix the error above and run deploy.sh again."

step "restart"
pm2 restart "$PM2_NAME" --update-env

step "Health check"
health_check

echo
echo "Deployed $(git rev-parse --short HEAD): $(git log -1 --format=%s)"
