FROM registry.redhat.io/devspaces/udi-rhel8:latest

USER 0

RUN npm install -g pnpm

USER 1001
