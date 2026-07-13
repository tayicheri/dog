# Dog — Site vitrine dépanneur informatique

Site one-page avec panneau admin pour édition du contenu, upload d'images et formulaire de contact.

## Stack

- **Frontend** : Vue 3, TypeScript, Vite, Tailwind CSS v4, vite-ssg, @unhead/vue
- **Backend** : Node.js, Express, TypeScript, stockage JSON local
- **Prod** : Docker, nginx (conteneur `dog-web`), **Caddy global** sur le serveur (HTTPS)

---

## Prérequis

- Node.js 20+ (dev local)
- Docker + Docker Compose (dev Docker et prod)
- En prod : un conteneur **Caddy global** (`caddy-global`) déjà en place sur le serveur (modèle `site-cccpg`)

---

## Première installation

À exécuter une fois (ou après un clone) :

```bash
./scripts/setup-env.sh
```

Ce script :

1. Crée les fichiers d'environnement manquants :
   - `.env` (racine, prod)
   - `backend/.env`
   - `frontend/.env.development`
   - `frontend/.env.production`
2. Migre les anciens placeholders (`example.com` → `dog.tayi.pro`) **sans écraser** vos valeurs personnalisées
3. Régénère `Caddyfile` depuis `.env` via `./scripts/render-caddy-snippet.sh`

Ensuite, éditez au minimum :

- `backend/.env` : `JWT_SECRET`, `ADMIN_PASSWORD` (et `CORS_ORIGIN` si besoin)
- `.env` racine : domaine et URLs prod (voir ci-dessous)

---

## Développement

Deux modes possibles. Choisissez **un seul** à la fois.

### Option A — Local (npm, recommandé pour coder)

```bash
./scripts/setup-env.sh

# Terminal 1 — API
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

| Service   | URL |
|-----------|-----|
| Site      | http://localhost:5173 |
| Admin     | http://localhost:5173/admin |
| API       | http://localhost:8080/api |
| Health    | http://localhost:8080/api/health |

Données et fichiers sur l'hôte :

- `backend/data/` → `site.json`, `auth.json`, `smtp.json`
- `backend/uploads/` → images uploadées

Compte admin par défaut (premier démarrage uniquement) : `admin` / `changeme` (depuis `backend/.env`).

### Option B — Docker dev

```bash
./scripts/setup-env.sh
./scripts/docker-dev.sh
```

| Service   | URL |
|-----------|-----|
| Site      | http://localhost:5173 |
| Admin     | http://localhost:5173/admin |
| API       | http://localhost:8080/api |

Les dossiers `backend/data/` et `backend/uploads/` sont **bind-mountés** dans le conteneur : les fichiers restent visibles sur votre machine.

Arrêter : `Ctrl+C` dans le terminal, ou `docker compose -f docker-compose.yml down`.

---

## Production

En prod, ce projet **ne lance pas de conteneur Caddy**. Seuls `dog-api` et `dog-web` démarrent, connectés au réseau Docker externe `caddy_net`. Le HTTPS est géré par **Caddy global** (`caddy-global`), comme sur `site-cccpg`.

### Architecture

```
Internet → caddy-global (80/443)
              ↓ caddy_net
         dog-web:80  (frontend nginx)
         dog-api:8080 (/api, /uploads)
```

### 1. Prérequis serveur (une fois)

```bash
docker network create caddy_net   # si le réseau n'existe pas déjà
```

Vérifier que `caddy-global` est démarré et connecté à `caddy_net`.

### 2. Configuration

```bash
./scripts/setup-env.sh
```

Éditer `.env` à la racine (valeurs par défaut) :

```env
VITE_API_URL=https://dog.tayi.pro/api
VITE_SITE_URL=https://dog.tayi.pro
CADDY_DOMAIN=dog.tayi.pro
CADDY_ACME_EMAIL=taissirmohamed@gmail.com
```

Éditer `backend/.env` pour la prod :

- `JWT_SECRET` : **obligatoire** et fort (le conteneur démarre avec `NODE_ENV=production`)
- `ADMIN_PASSWORD` : changer après la première connexion
- `CORS_ORIGIN` : doit correspondre à `VITE_SITE_URL` (injecté aussi via `docker-compose.prod.yml`)

### 3. Snippet Caddy (une fois, puis à chaque changement de domaine)

Le fichier `Caddyfile` est un snippet à monter dans Caddy global :

```bash
./scripts/render-caddy-snippet.sh   # lit .env et régénère Caddyfile
```

Sur le serveur, monter ce fichier dans `caddy-global` (ex. `/etc/caddy/projects/dog.caddy`), puis :

```bash
docker exec caddy-global caddy reload --config /etc/caddy/Caddyfile
```

Le snippet route :

- `/api/*` et `/uploads/*` → `dog-api:8080`
- le reste → `dog-web:80`

### 4. Lancer l'application

```bash
./scripts/docker-prod.sh
```

Ce script :

1. Vérifie `backend/.env` et `.env`
2. Régénère `Caddyfile`
3. Lance `docker compose -f docker-compose.prod.yml up -d --build`

Vérifications :

```bash
docker compose -f docker-compose.prod.yml ps
curl -s https://dog.tayi.pro/api/health
```

### 5. Changer de domaine ou d'email TLS

1. Modifier `CADDY_DOMAIN`, `CADDY_ACME_EMAIL`, `VITE_SITE_URL`, `VITE_API_URL` dans `.env`
2. `./scripts/render-caddy-snippet.sh`
3. Recharger Caddy global
4. Rebuild prod : `./scripts/docker-prod.sh`

### Données prod

- `dog-data` (volume Docker) → `/app/data` (`site.json`, `auth.json`, `smtp.json`)
- `dog-uploads` (volume Docker) → `/app/uploads`

Pensez à sauvegarder ces volumes régulièrement.

---

## Variables d'environnement

| Fichier | Variables | Usage |
|---------|-----------|-------|
| `.env` (racine) | `VITE_API_URL`, `VITE_SITE_URL`, `CADDY_DOMAIN`, `CADDY_ACME_EMAIL` | Build frontend prod + snippet Caddy |
| `backend/.env` | `JWT_SECRET`, `ADMIN_*`, `DATA_DIR`, `UPLOADS_DIR`, `CORS_ORIGIN` | API |
| `backend/.env` | `SMTP_*`, `MAIL_*` | Fallback dev uniquement (config principale via `/admin`) |
| `frontend/.env.development` | `VITE_*` | Dev local / Docker dev |
| `frontend/.env.production` | `VITE_*` | Build frontend prod |

Fichiers générés :

- `Caddyfile` ← généré par `scripts/render-caddy-snippet.sh` depuis `Caddyfile.template` + `.env`

---

## Admin (`/admin`)

- Compte initial créé au **premier démarrage** depuis `ADMIN_USERNAME` / `ADMIN_PASSWORD` dans `backend/.env`
- **Important** : les modifications (portfolio, textes, images) ne sont persistées qu'après le bouton global **« Enregistrer »** en haut de la page
- Un indicateur **« Modifications non enregistrées »** apparaît tant que le brouillon n'est pas sauvegardé

### Email (formulaire contact)

Configurer un compte **Gmail** dans la section « Configuration email (Gmail) » :

- Adresse `@gmail.com` obligatoire
- Mot de passe d'application Google (pas le mot de passe de connexion)
- Stockage local dans `backend/data/smtp.json` (non versionné)
- Les messages sont envoyés vers cette même adresse Gmail

---

## Design

Le design source provient de Google Stitch (projet **dog**). Voir `DESIGN.md`.

```bash
node scripts/fetch-stitch.mjs
```

### Images locales

Les images Stitch/Google sont stockées localement dans `backend/assets/images/` (versionnées) et servies via `/uploads/`.

```bash
# Télécharger / rafraîchir les images depuis les URLs externes
node scripts/mirror-external-images.mjs --patch-site-json
```

Au démarrage de l'API, les fichiers manquants sont copiés vers `uploads/` et `site.json` est migré automatiquement (URLs externes → `/uploads/...`).

---

## SEO et référencement

### Génération automatique (build / deploy)

```bash
./scripts/render-seo-files.sh
```

Ce script (appelé aussi par `setup-env.sh` et `docker-prod.sh`) :

- Régénère `frontend/public/sitemap.xml` et `robots.txt` depuis `VITE_SITE_URL`
- Génère `frontend/public/og-image.jpg` depuis `backend/assets/images/hero.jpg`
- Exclut `/admin` du crawl (`robots.txt`)

### Métadonnées

- **Statiques** (fallback crawlable) : [`frontend/index.html`](frontend/index.html) — OG, Twitter, JSON-LD, canonical
- **Dynamiques** (contenu admin) : [`frontend/src/composables/useSeo.ts`](frontend/src/composables/useSeo.ts) — title, description, keywords, Schema.org `LocalBusiness`
- **`/admin`** : `noindex, nofollow` (meta + `Disallow` robots)

### Checklist mise en production

1. Vérifier `VITE_SITE_URL=https://dog.tayi.pro` dans `.env` racine
2. Lancer `./scripts/render-seo-files.sh` puis `./scripts/docker-prod.sh`
3. Vérifier :
   ```bash
   curl -sI https://dog.tayi.pro/og-image.jpg
   curl -s https://dog.tayi.pro/robots.txt
   grep -E 'og:image|LocalBusiness' frontend/dist/index.html
   ```
4. Soumettre `https://dog.tayi.pro/sitemap.xml` dans [Google Search Console](https://search.google.com/search-console)
5. Valider le JSON-LD via [Rich Results Test](https://search.google.com/test/rich-results)
6. Tester le partage sur un réseau social (preview avec image)
7. Compléter la fiche **Google Business Profile** (adresse, téléphone, horaires réels dans l'admin)
8. Personnaliser title / description / keywords dans `/admin` → section SEO → **Enregistrer**

