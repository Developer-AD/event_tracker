# node block
FROM node:alpine3.16 AS nodework
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# nginx block
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=nodework /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf