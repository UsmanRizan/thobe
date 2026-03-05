# Build stage for frontend (React app)
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json vite.config.ts ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY src ./src
COPY public ./public
COPY index.html ./

# Build React app
RUN npm run build

# Final stage - production runtime
FROM node:20-alpine
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files and install dependencies (including tsx for running TypeScript)
COPY package*.json ./
COPY tsconfig.server.json ./
RUN npm install && npm cache clean --force

# Copy backend source (TypeScript files)
COPY server ./server

# Copy frontend build from builder stage
COPY --from=frontend-builder /app/dist ./dist

# Create data directory for database
RUN mkdir -p data

# Set environment variables
ENV NODE_ENV=production
ENV SERVE_DIST=true

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port (default 3001, can be overridden via PORT env var)
EXPOSE 3001

# Use dumb-init to properly handle signals and run the server with tsx
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "--import", "tsx/esm", "server/index.ts"]
