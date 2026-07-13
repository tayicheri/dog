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

: "${VITE_SITE_URL:?définir VITE_SITE_URL dans .env}"

export VITE_SITE_URL
envsubst '${VITE_SITE_URL}' < frontend/public/sitemap.xml.template > frontend/public/sitemap.xml
envsubst '${VITE_SITE_URL}' < frontend/public/robots.txt.template > frontend/public/robots.txt

HERO_SRC="backend/assets/images/hero.jpg"
OG_DEST="frontend/public/og-image.jpg"

if [ ! -f "$HERO_SRC" ]; then
  echo "AVERTISSEMENT : $HERO_SRC introuvable — og-image.jpg non généré"
else
  if command -v sips >/dev/null 2>&1; then
    sips -z 630 1200 "$HERO_SRC" --out "$OG_DEST" >/dev/null 2>&1 || cp "$HERO_SRC" "$OG_DEST"
  else
    cp "$HERO_SRC" "$OG_DEST"
  fi
  echo "og-image.jpg généré depuis hero.jpg"
fi

echo "SEO : sitemap.xml et robots.txt régénérés pour ${VITE_SITE_URL}"
