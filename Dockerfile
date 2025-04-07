# syntax=docker.io/docker/dockerfile:1

FROM registry.redhat.io/rhel9/nodejs-22-minimal:latest AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /opt/app-root/src

COPY --chown=1001:0 package.json package-lock.json* ./

USER 0
RUN microdnf install -y findutils
USER 1001
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /opt/app-root/src

COPY --from=deps --chown=1001:0 /opt/app-root/src/node_modules ./node_modules
COPY --chown=1001:0 . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /opt/app-root/src

ENV NODE_ENV=production

COPY --chown=1001:0 --from=builder /opt/app-root/src/public ./public

COPY --chown=1001:0 --from=builder /opt/app-root/src/.next/standalone ./
COPY --chown=1001:0 --from=builder /opt/app-root/src/.next/static ./.next/static

USER 1001

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]