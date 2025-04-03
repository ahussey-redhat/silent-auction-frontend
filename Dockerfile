# syntax=docker.io/docker/dockerfile:1

FROM registry.redhat.io/rhel9/nodejs-22-minimal:latest AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /opt/app-root/src

# Copy dependency files
COPY --chown=1001:0 package.json package-lock.json* ./

# Install dependencies using npm
USER 0
RUN microdnf install -y findutils # Ensure needed system utilities are available
USER 1001
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /opt/app-root/src

COPY --from=deps --chown=1001:0 /opt/app-root/src/node_modules ./node_modules
COPY --chown=1001:0 . .

# Disable telemetry if needed
# ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /opt/app-root/src

ENV NODE_ENV=production
# Disable telemetry if needed
# ENV NEXT_TELEMETRY_DISABLED=1

# Copy public assets
COPY --chown=1001:0 --from=builder /opt/app-root/src/public ./public

# Copy standalone build output
COPY --chown=1001:0 --from=builder /opt/app-root/src/.next/standalone ./
COPY --chown=1001:0 --from=builder /opt/app-root/src/.next/static ./.next/static

# Ensure we run as non-root
USER 1001

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use the server.js generated by Next.js standalone build
CMD ["node", "server.js"]