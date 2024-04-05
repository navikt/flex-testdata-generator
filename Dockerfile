FROM gcr.io/distroless/nodejs20-debian12@sha256:449d55e90d0a51724cc6caaa6628155ea03c929c09817a580c6c325eb404ac60

ENV NODE_ENV production

COPY /next.config.js ./
COPY /.next ./.next
COPY /node_modules ./node_modules

ENV PORT=8080

CMD ["./node_modules/next/dist/bin/next", "start"]
