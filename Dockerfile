FROM registry.redhat.io/rhel9/nodejs-20:latest

LABEL name="ahussey/silent-auction/frontend"

USER 0

RUN dnf update -y

RUN npm install -g pnpm

COPY . /opt/app-root/src/

RUN git config --global --add safe.directory /opt/app-root/src

RUN pnpm install && pnpm extract-messages && pnpm compile-messages

RUN pnpm build

USER 10001

CMD pnpm serve
