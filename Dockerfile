FROM node:24-slim AS base
WORKDIR /application
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm install -g bun

FROM base AS dependencies
COPY package.json bun.lock* ./
COPY prisma ./prisma/
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

FROM dependencies AS prisma-generator
COPY prisma ./prisma/
COPY prisma7.config.ts* ./
RUN bunx prisma generate

FROM prisma-generator AS builder
COPY . .
RUN bun run build

FROM base AS production-dependencies
COPY package.json bun.lock* ./
COPY prisma ./prisma/

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production
COPY --from=prisma-generator /application/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma-generator /application/node_modules/@prisma/client ./node_modules/@prisma/client

FROM node:24-slim AS runner
WORKDIR /application
ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nestjs
COPY --from=production-dependencies --chown=nestjs:nodejs /application/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /application/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /application/package.json ./
COPY --from=builder --chown=nestjs:nodejs /application/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /application/prisma7.config.ts ./
COPY --chown=nestjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
USER nestjs
EXPOSE 50051
CMD ["./docker-entrypoint.sh"]