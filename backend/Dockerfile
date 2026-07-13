# --- ÉTAPE 1 : BASE ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- ÉTAPE 2 : DÉVELOPPEMENT (Cible : dev) ---
FROM base AS dev
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]

# --- ÉTAPE 3 : BUILDER (Pour la prod) ---
FROM base AS builder
COPY . .
RUN npm run build

# --- ÉTAPE 4 : PRODUCTION (Cible : prod) ---
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY assets ./assets
RUN mkdir -p data uploads
EXPOSE 8080
CMD ["node", "dist/index.js"]
