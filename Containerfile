FROM registry.redhat.io/ubi9/nodejs-20-minimal

USER 0

RUN corepack enable pnpm

USER 1001
