FROM gcr.io/distroless/nodejs24-debian13@sha256:10e262383ceb3a2a5f6f5ceaca5ecebe74951eff21868a055589676eec3a8001

ENV NODE_ENV=production

COPY /next.config.js ./
COPY /.next ./.next
COPY /node_modules ./node_modules

ENV PORT=8080

CMD ["./node_modules/next/dist/bin/next", "start"]
