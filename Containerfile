FROM registry.redhat.io/devspaces/udi-rhel8:latest

USER 0

RUN dnf -y update
RUN npm install -g pnpm

USER 1001
