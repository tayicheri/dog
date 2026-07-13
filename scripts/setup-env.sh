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

set_env_value() {
  file="$1"
  key="$2"
  value="$3"
  if grep -q "^${key}=" "$file" 2>/dev/null; then
    sed "s|^${key}=.*|${key}=${value}|" "$file" > "${file}.tmp"
    mv "${file}.tmp" "$file"
  else
    echo "${key}=${value}" >> "$file"
  fi
}

get_env_value() {
  file="$1"
  key="$2"
  grep "^${key}=" "$file" 2>/dev/null | cut -d= -f2- || true
}

migrate_placeholder() {
  file="$1"
  key="$2"
  old="$3"
  new="$4"
  current="$(get_env_value "$file" "$key")"
  if [ "$current" = "$old" ]; then
    set_env_value "$file" "$key" "$new"
    echo "Migré dans ${file} : ${key} (${old} → ${new})"
  fi
}

sync_missing_keys_from_example() {
  dest="$1"
  example="$2"
  [ -f "$dest" ] || return 0
  [ -f "$example" ] || return 0

  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      ''|'#'*) continue ;;
    esac
    key="${line%%=*}"
    if ! grep -q "^${key}=" "$dest" 2>/dev/null; then
      echo "$line" >> "$dest"
      echo "Ajouté dans ${dest} : ${key}"
    fi
  done < "$example"
}

sync_root_env() {
  [ -f .env ] || return 0
  sync_missing_keys_from_example ".env" ".env.example"

  migrate_placeholder ".env" "VITE_API_URL" "https://example.com/api" "https://dog.tayi.pro/api"
  migrate_placeholder ".env" "VITE_SITE_URL" "https://example.com" "https://dog.tayi.pro"
  migrate_placeholder ".env" "CADDY_DOMAIN" "example.com" "dog.tayi.pro"
  migrate_placeholder ".env" "CADDY_ACME_EMAIL" "admin@example.com" "taissirmohamed@gmail.com"
}

sync_frontend_production_env() {
  [ -f frontend/.env.production ] || return 0
  sync_missing_keys_from_example "frontend/.env.production" "frontend/.env.production.example"

  migrate_placeholder "frontend/.env.production" "VITE_API_URL" "https://example.com/api" "https://dog.tayi.pro/api"
  migrate_placeholder "frontend/.env.production" "VITE_SITE_URL" "https://example.com" "https://dog.tayi.pro"
}

copy_if_missing "backend/.env.example" "backend/.env"
copy_if_missing "frontend/.env.development.example" "frontend/.env.development"
copy_if_missing "frontend/.env.production.example" "frontend/.env.production"
copy_if_missing ".env.example" ".env"

sync_root_env
sync_frontend_production_env

if [ -f .env ]; then
  ./scripts/render-caddy-snippet.sh
fi

echo ""
echo "Éditez backend/.env et .env avant un déploiement prod."
echo "Variables globales prod (.env) : VITE_SITE_URL, VITE_API_URL, CADDY_DOMAIN, CADDY_ACME_EMAIL"
echo "Prod : réseau Docker externe caddy_net + Caddy global (voir README)."
echo "En dev : ADMIN_PASSWORD est utilisé uniquement au premier démarrage."
