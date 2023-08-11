FROM gcr.io/distroless/nodejs18-debian11@sha256:dd8857b47881d5db49ff47089de4866178b71b24558a8583c20250754a387b7d

ENV NODE_ENV production

COPY /next.config.js ./
COPY /.next ./.next
COPY /node_modules ./node_modules

ENV PORT=8080

CMD ["./node_modules/next/dist/bin/next", "start"]
