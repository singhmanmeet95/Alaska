# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code and build
COPY . .
ARG VITE_API_URL
ARG VITE_CHAT_WORKER_URL
ARG VITE_CHAT_GATEWAY_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CHAT_WORKER_URL=$VITE_CHAT_WORKER_URL
ENV VITE_CHAT_GATEWAY_URL=$VITE_CHAT_GATEWAY_URL
RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
