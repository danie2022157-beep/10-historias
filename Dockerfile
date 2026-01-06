# Multi-stage Dockerfile for Vite app
FROM node:18-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

# install deps
COPY package*.json ./
RUN npm ci --silent

# copy sources and build
COPY . .
RUN npm run build

# production image
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
