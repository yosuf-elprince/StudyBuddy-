# Stage 1: Build
FROM alpine:latest AS builder

WORKDIR /app

COPY . .

# Stage 2: Production
FROM nginx:alpine

COPY --from=builder /app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]