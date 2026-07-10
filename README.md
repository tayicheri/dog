# Dog — Site vitrine dépanneur informatique

Site one-page avec panneau admin pour édition du contenu, upload d'images et formulaire de contact.

## Stack

- **Frontend** : Vue 3, TypeScript, Vite, Tailwind CSS v4, vite-ssg, @unhead/vue
- **Backend** : Node.js, Express, TypeScript, stockage JSON local
- **Prod** : Docker, nginx, Caddy (HTTPS)

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
./scripts/docker-prod.sh   # prod : Caddy 80/443
```

## Variables d'environnement

- Racine `.env` : `VITE_API_URL`, `VITE_SITE_URL`, `CADDY_*`
- `backend/.env` : `JWT_SECRET`, `ADMIN_*`, `SMTP_*`, `DATA_DIR`

## Design

Le design source provient de Google Stitch (projet **dog**). Voir `DESIGN.md`.

Rafraîchir le design depuis Stitch :

```bash
node scripts/fetch-stitch.mjs
```

## Admin

Au premier démarrage, un compte admin est créé depuis `ADMIN_USERNAME` / `ADMIN_PASSWORD` dans `backend/.env`.
Interface : `/admin`
