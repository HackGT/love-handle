WORKDIR /workspace
ADD . .
FROM nginx:stable-alpine
COPY --from=0 /workspace/dist/ /usr/share/nginx/html/
