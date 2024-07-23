FROM registry.redhat.io/rhel9/nodejs-20

LABEL name="ahussey/silent-auction/frontend"

USER 0

RUN microdnf update -y

RUN npm install -g pnpm

RUN pnpm install && pnpm extract-messages && pnpm compile-messages

RUN pnpm build

USER 10001

CMD pnpm run server
