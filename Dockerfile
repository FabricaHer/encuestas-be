FROM node:lts-alpine AS builder

WORKDIR /app

RUN apk update
RUN npm install pnpm -g

COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm install -P

COPY . .
RUN pnpm build



FROM node:lts-alpine AS production
WORKDIR /app
COPY --from=builder /app .

EXPOSE 3005

ENTRYPOINT [ "node","dist/main" ]


