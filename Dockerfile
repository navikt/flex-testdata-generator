FROM gcr.io/distroless/nodejs20-debian13@sha256:6371e8393937b59f0cb0d57d24c33468830444c726c18b494b75e5510c9e5e3e

ENV NODE_ENV=production

COPY /next.config.js ./
COPY /.next ./.next
COPY /node_modules ./node_modules

ENV PORT=8080

CMD ["./node_modules/next/dist/bin/next", "start"]
