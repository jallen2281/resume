# Static resume site. CI builds dist/ (HTML + PDF) before this image is built.
# nginx-unprivileged is multi-arch (amd64 + arm64) and runs as non-root on port 8080.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/

EXPOSE 8080
