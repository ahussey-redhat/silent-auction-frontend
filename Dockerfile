# Stage 1: Build Stage
FROM registry.redhat.io/rhel9/nodejs-22-minimal:latest AS builder

LABEL name="ahussey/silent-auction/frontend"

USER 0

WORKDIR /opt/app-root/src

COPY --chown=1001:0 --chmod=777 package.json package-lock.json ./

# We have to use --force, as Patternfly doesn't support react 19 yet.
RUN npm install --frozen-lockfile --force

COPY --chown=1001:0 . .

RUN npm run build

RUN npm prune --omit=dev --force

# Stage 2: Production Stage
FROM registry.redhat.io/rhel9/nodejs-22-minimal:latest AS runner

USER 1001

WORKDIR /opt/app-root/src

COPY --chmod=664 --from=builder /opt/app-root/src/server.js ./
COPY --chmod=664 --from=builder /opt/app-root/src/.next/standalone ./
COPY --chmod=664 --from=builder /opt/app-root/src/.next/static ./.next/static
COPY --chmod=664 --from=builder /opt/app-root/src/next.config.js ./
COPY --chmod=664 --from=builder /opt/app-root/src/package.json /opt/app-root/src/package-lock.json ./
COPY --chmod=664 --from=builder /opt/app-root/src/public ./public
COPY --chmod=664 --from=builder /opt/app-root/src/node_modules ./node_modules

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]