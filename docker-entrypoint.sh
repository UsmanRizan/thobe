#!/bin/sh

# Entrypoint script for Thobe Store Docker container
# Manages both Nginx and Express.js processes

set -e

echo "🚀 Starting Thobe Store..."

# Create necessary directories
mkdir -p /app/data /var/log/nginx /var/run/nginx

# Start Nginx in the background
echo "📡 Starting Nginx reverse proxy..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Give Nginx a moment to start
sleep 2

# Start Express.js server
echo "⚙️ Starting Express.js API server..."
cd /app
node -r tsx/register server/index.ts &
NODE_PID=$!

# Function to handle signals
cleanup() {
    echo "⛔ Shutting down services..."
    kill $NGINX_PID 2>/dev/null || true
    kill $NODE_PID 2>/dev/null || true
    wait $NGINX_PID 2>/dev/null || true
    wait $NODE_PID 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# Wait for both processes
wait $NGINX_PID $NODE_PID

# If either process dies, exit
exit 1
