# Multi-stage build for Thobe Store
# Stage 1: Build stage - compile frontend and backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json tsconfig.server.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY server ./server
COPY public ./public
COPY vite.config.ts ./

# Build frontend (Vite)
RUN npm run build

# Build backend (TypeScript compilation)
RUN npm run build:server

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Install required tools
# - dumb-init: for proper signal handling
# - nginx: reverse proxy for frontend + API routing
# - curl: for health checks
RUN apk add --no-cache dumb-init nginx curl

# Copy package files for production dependencies only
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy compiled frontend from builder
COPY --from=builder /app/dist ./dist

# Copy compiled backend from builder
COPY --from=builder /app/dist ./backend-dist

# Copy public assets
COPY public ./public

# Copy server files needed at runtime (for any non-compiled assets)
COPY server ./server

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy docker entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Create data directory for SQLite database
RUN mkdir -p /app/data /var/run/nginx /var/log/nginx

# Expose ports
# 80: HTTP (Nginx reverse proxy and frontend)
# 3001: Express backend API (for direct access if needed)
EXPOSE 80 3001

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check - verify both Nginx and API are responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--", "/app/docker-entrypoint.sh"]
