#!/usr/bin/env sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f backend/.env ]; then
  echo "Fichier backend/.env manquant. Exécutez : ./scripts/setup-env.sh"
  exit 1
fi

if [ ! -f .env ]; then
  echo "Fichier .env racine manquant (VITE_API_URL, CADDY_*). Exécutez : ./scripts/setup-env.sh"
  exit 1
fi

./scripts/render-caddy-snippet.sh

exec docker compose -f docker-compose.prod.yml up -d --build "$@"
