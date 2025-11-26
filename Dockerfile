FROM node:20-slim AS builder

WORKDIR /app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Variables de base de datos (opcionales durante build)
ARG DATABASE_HOST
ENV DATABASE_HOST=${DATABASE_HOST}

ARG DATABASE_PORT
ENV DATABASE_PORT=${DATABASE_PORT}

ARG DATABASE_USER
ENV DATABASE_USER=${DATABASE_USER}

ARG DATABASE_PASSWORD=
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}

ARG DATABASE_NAME
ENV DATABASE_NAME=${DATABASE_NAME}

# Instalar dependencias del sistema y pnpm
RUN apt update && apt install -y --no-install-recommends \
    git \
    python3 \
    make \
    g++ \
    && npm install -g pnpm \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

FROM node:20-alpine AS production

WORKDIR /app

# Instalar solo producción dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Instalar pnpm en la etapa de producción si es necesario
RUN npm install -g pnpm

# Variables de entorno para producción
ENV NODE_ENV=production

EXPOSE 3000

USER node

CMD ["node", "dist/src/main"]