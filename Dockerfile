FROM registry.access.redhat.com/ubi9/nodejs-20-minimal:latest

LABEL name="ahussey/silent-auction/frontend"

USER 0

RUN microdnf update -y

RUN microdnf install -y git

RUN npm install -g pnpm

RUN chown -R 10001:0 /opt/app-root/src

USER 10001

COPY --chown=10001:0 . /opt/app-root/src/

RUN rm -f /opt/app-root/src/.env.*

RUN git config --global --add safe.directory /opt/app-root/src

RUN pnpm install && pnpm extract-messages && pnpm compile-messages

RUN pnpm build

CMD pnpm serve
