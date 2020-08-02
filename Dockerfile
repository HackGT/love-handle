FROM nginx:stable-alpine
WORKDIR /workspace
ADD . .
COPY ./dist/ /usr/share/nginx/html/
