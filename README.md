# Dog — Site vitrine dépanneur informatique

Site one-page avec panneau admin pour édition du contenu, upload d'images et formulaire de contact.

## Stack

- **Frontend** : Vue 3, TypeScript, Vite, Tailwind CSS v4, vite-ssg, @unhead/vue
- **Backend** : Node.js, Express, TypeScript, stockage JSON local
- **Prod** : Docker, nginx, Caddy global (HTTPS)

## Commandes locales

```bash
./scripts/setup-env.sh

# Backend
cd backend && npm install && npm run dev

# Frontend (autre terminal)
cd frontend && npm install && npm run dev
```

## Docker

```bash
./scripts/setup-env.sh
./scripts/docker-dev.sh    # dev : API :8080, Vite :5173
./scripts/docker-prod.sh   # prod : api + web sur réseau caddy_net (Caddy global)
```

## Variables d'environnement

- Racine `.env` : `VITE_API_URL`, `VITE_SITE_URL`, `CADDY_DOMAIN`, `CADDY_ACME_EMAIL`
- `backend/.env` : `JWT_SECRET`, `ADMIN_*`, `DATA_DIR`, `UPLOADS_DIR`
- `SMTP_*` / `MAIL_*` dans `backend/.env` : fallback optionnel pour le dev (la config principale se fait via l'admin)

## Design

Le design source provient de Google Stitch (projet **dog**). Voir `DESIGN.md`.

Rafraîchir le design depuis Stitch :

```bash
node scripts/fetch-stitch.mjs
```

## Admin

Au premier démarrage, un compte admin est créé depuis `ADMIN_USERNAME` / `ADMIN_PASSWORD` dans `backend/.env`.
Interface : `/admin`

### Email (formulaire contact)

Configurez un compte **Gmail** dans la section « Configuration email (Gmail) » de l'admin :
- Adresse `@gmail.com` obligatoire
- Mot de passe d'application Google (pas le mot de passe de connexion)
- Les identifiants sont stockés localement dans `backend/data/smtp.json` (non versionné)
- Les messages du formulaire contact sont envoyés vers cette même adresse Gmail

## Données & uploads (local, dev Docker, prod)

- **Local (npm run dev)** : par défaut, l'API lit/écrit dans `backend/data/` et sert les fichiers via `backend/uploads/` (configurable via `DATA_DIR` / `UPLOADS_DIR`).
- **Dev Docker (docker-compose.yml)** : `backend/data/` est bind-mounté sur `/app/data` et `backend/uploads/` sur `/app/uploads` pour que les fichiers soient visibles sur l'hôte.
- **Prod Docker (docker-compose.prod.yml)** : les répertoires `/app/data` et `/app/uploads` sont stockés dans des **volumes Docker** (`dog-data`, `dog-uploads`). Pensez backup.

## Production (Caddy global, modèle site-cccpg)

En prod, **aucun conteneur Caddy** n'est lancé par ce projet. Les services `dog-api` et `dog-web` rejoignent le réseau Docker externe `caddy_net` (Caddy global sur le serveur).

1. Créer le réseau une fois : `docker network create caddy_net`
2. Configurer `.env` racine (`CADDY_DOMAIN`, `CADDY_ACME_EMAIL`, `VITE_SITE_URL`, `VITE_API_URL`)
3. Régénérer le snippet : `./scripts/render-caddy-snippet.sh`
4. Monter `Caddyfile` dans `caddy-global` (ex. `/etc/caddy/projects/dog.caddy`) et recharger :
   `docker exec caddy-global caddy reload --config /etc/caddy/Caddyfile`
5. Lancer l'app : `./scripts/docker-prod.sh`

Pour changer de domaine ou d'email TLS, modifiez `CADDY_DOMAIN` / `CADDY_ACME_EMAIL` dans `.env`, relancez `render-caddy-snippet.sh`, puis rechargez Caddy global.
