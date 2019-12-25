FROM node:10-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install && yarn run build

# production stage
FROM alpine as production

WORKDIR /app

COPY --from=builder /app/dist .