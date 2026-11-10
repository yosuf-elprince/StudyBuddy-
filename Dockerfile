# Stage 1: Build
FROM alpine:latest AS builder

WORKDIR /app

COPY . .

# Stage 2: Production
FROM nginx:alpine

COPY --from=builder /app /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost/health.html || exit 1
CMD ["nginx", "-g", "daemon off;"]