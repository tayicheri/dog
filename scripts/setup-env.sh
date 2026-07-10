#!/usr/bin/env sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

copy_if_missing() {
  src="$1"
  dest="$2"
  if [ ! -f "$dest" ]; then
    cp "$src" "$dest"
    echo "Créé : $dest"
  else
    echo "Conservé (existe déjà) : $dest"
  fi
}

copy_if_missing "backend/.env.example" "backend/.env"
copy_if_missing "frontend/.env.development.example" "frontend/.env.development"
copy_if_missing "frontend/.env.production.example" "frontend/.env.production"
copy_if_missing ".env.example" ".env"

echo ""
echo "Éditez backend/.env et .env avant un déploiement prod."
echo "En dev : ADMIN_PASSWORD est utilisé uniquement au premier démarrage."
