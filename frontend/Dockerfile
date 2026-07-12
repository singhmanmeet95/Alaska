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
FROM node:22-alpine

WORKDIR /app

# Install simple static server
RUN npm install -g serve

# Copy built assets
COPY --from=builder /app/dist ./dist

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]
