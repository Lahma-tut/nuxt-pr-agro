# Этап 1: Сборка и Разработка
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем curl здесь, чтобы работал Healthcheck в docker-compose
RUN apk add --no-cache curl

COPY package*.json ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./

# Используем npm install вместо ci для гибкости в dev-режиме, 
# либо оставляем ci, если lock-файл строго соответствует
RUN npm install

COPY . .

# Продакшн сборка (оставляем для универсальности)
RUN npm run build

# Этап 2: Продакшн (не используется в твоем docker-compose.yaml, но пусть будет корректным)
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001 && \
    chown -R nuxt:nodejs /app

USER nuxt

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", ".output/server/index.mjs"]
