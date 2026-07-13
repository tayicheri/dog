#!/usr/bin/env sh
# Diagnostic Caddy global pour dog — à exécuter sur le serveur (ex. /srv/dog)
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DOMAIN="${CADDY_DOMAIN:-dog.tayi.pro}"
if [ -f .env ]; then
  # shellcheck disable=SC1091
  . ./.env
  DOMAIN="${CADDY_DOMAIN:-$DOMAIN}"
fi

echo "=== 1. Conteneurs dog ==="
docker ps --filter name=dog- --format 'table {{.Names}}\t{{.Status}}' || true

echo ""
echo "=== 2. Réseau caddy_net ==="
if docker network inspect caddy_net >/dev/null 2>&1; then
  docker network inspect caddy_net --format '{{range .Containers}}{{.Name}} {{end}}'
else
  echo "ERREUR : réseau caddy_net introuvable"
fi

echo ""
echo "=== 3. Snippet dog dans caddy-global ==="
if docker exec caddy-global test -f /etc/caddy/projects/dog.caddy 2>/dev/null; then
  docker exec caddy-global cat /etc/caddy/projects/dog.caddy
else
  echo "ABSENT : /etc/caddy/projects/dog.caddy"
fi

echo ""
echo "=== 4. Caddyfile principal (extrait dog / import) ==="
docker exec caddy-global sh -c 'grep -n "dog\|import.*projects" /etc/caddy/Caddyfile 2>/dev/null || echo "Aucune ligne dog/import trouvée"'

echo ""
echo "=== 5. Validation config ==="
docker exec caddy-global caddy validate --config /etc/caddy/Caddyfile

echo ""
echo "=== 6. Test interne (depuis caddy-global) ==="
docker exec caddy-global wget -qO- "http://dog-api:8080/api/health" 2>/dev/null && echo "" || echo "ERREUR : dog-api injoignable depuis caddy-global"
docker exec caddy-global wget -qO- "http://dog-web:80/" 2>/dev/null | head -c 80 && echo "" || echo "ERREUR : dog-web injoignable depuis caddy-global"

echo ""
echo "=== 7. Test HTTPS externe (${DOMAIN}) ==="
curl -sS -o /dev/null -w "health HTTP %{http_code}\n" "https://${DOMAIN}/api/health" || echo "ERREUR curl health"
curl -sS -o /dev/null -w "site   HTTP %{http_code}\n" "https://${DOMAIN}/" || echo "ERREUR curl site"
