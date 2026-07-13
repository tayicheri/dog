# --- ÉTAPE 1 : BASE ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- ÉTAPE 2 : DÉVELOPPEMENT (Cible : dev) ---
FROM base AS dev
COPY . .
EXPOSE 5173
# npm ci au démarrage : le volume anonyme /app/node_modules peut être obsolète après ajout de deps
CMD ["sh", "-c", "npm ci && exec npm run dev -- --host 0.0.0.0 --port 5173"]

# --- ÉTAPE 3 : BUILDER (Pour la prod) ---
FROM base AS builder
ARG VITE_API_URL
ARG VITE_SITE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
COPY . .
RUN npm run build

# --- ÉTAPE 4 : PRODUCTION (Cible : prod) ---
FROM nginx:stable-alpine AS prod
ARG VITE_API_URL
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /tmp/nginx.conf.template
RUN CSP_CONNECT_SRC="$(echo "${VITE_API_URL}" | sed -E 's|(https?://[^/]+).*|\1|')" \
    && export CSP_CONNECT_SRC \
    && envsubst '$CSP_CONNECT_SRC' < /tmp/nginx.conf.template > /etc/nginx/conf.d/default.conf \
    && rm /tmp/nginx.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
