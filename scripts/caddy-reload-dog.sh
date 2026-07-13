#!/usr/bin/env sh
# Installe le snippet dog dans caddy-global et recharge — à exécuter sur le serveur
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! docker ps --format '{{.Names}}' | grep -qx 'caddy-global'; then
  echo "Conteneur caddy-global introuvable."
  exit 1
fi

./scripts/render-caddy-snippet.sh

DOG_SNIPPET_HOST="/etc/caddy/projects/dog.caddy"
DOG_SNIPPET_DIR="$(dirname "$DOG_SNIPPET_HOST")"

echo "→ Régénération OK : $ROOT/Caddyfile"
echo ""

# Option A : snippet monté dans le conteneur (modèle site-cccpg)
if docker exec caddy-global test -d /etc/caddy/projects 2>/dev/null; then
  sudo mkdir -p "$DOG_SNIPPET_DIR"
  sudo cp "$ROOT/Caddyfile" "$DOG_SNIPPET_HOST"
  echo "→ Copié vers $DOG_SNIPPET_HOST"
else
  echo "→ /etc/caddy/projects absent dans le conteneur — ajoutez le bloc dog dans /etc/caddy/Caddyfile"
fi

echo ""
echo "→ Vérifier que le Caddyfile principal importe le snippet :"
echo "    import /etc/caddy/projects/dog.caddy"
echo ""
echo "→ Snippet actuellement visible dans caddy-global :"
if docker exec caddy-global test -f /etc/caddy/projects/dog.caddy 2>/dev/null; then
  docker exec caddy-global cat /etc/caddy/projects/dog.caddy | sed 's/^/  /'
else
  echo "  (fichier encore absent — montage volume ou import manuel requis)"
fi

echo ""
echo "→ Validation…"
docker exec caddy-global caddy validate --config /etc/caddy/Caddyfile

echo "→ Reload…"
docker exec caddy-global caddy reload --config /etc/caddy/Caddyfile

echo ""
echo "✅ Reload envoyé. Vérifiez :"
echo "   curl -s https://\$(grep ^CADDY_DOMAIN= .env | cut -d= -f2)/api/health"
echo "   docker logs caddy-global --tail 20"
