#!/usr/bin/env sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  echo "Fichier .env manquant. Exécutez : ./scripts/setup-env.sh"
  exit 1
fi

# shellcheck disable=SC1091
set -a
. ./.env
set +a

: "${CADDY_DOMAIN:?définir CADDY_DOMAIN dans .env}"
: "${CADDY_ACME_EMAIL:?définir CADDY_ACME_EMAIL dans .env}"

export CADDY_DOMAIN CADDY_ACME_EMAIL
envsubst '${CADDY_DOMAIN} ${CADDY_ACME_EMAIL}' < Caddyfile.template > Caddyfile

echo "Caddyfile régénéré pour ${CADDY_DOMAIN}"
