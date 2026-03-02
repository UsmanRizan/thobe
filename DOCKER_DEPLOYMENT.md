# Docker Deployment Guide for Thobe Store

This guide explains how to build and deploy the Thobe Store application using Docker on your Ubuntu server.

## Architecture

- **Single Docker Container**: Runs both frontend (Vite-built SPA) and backend (Express API)
- **Nginx Reverse Proxy**: Acts as the entry point, routes traffic appropriately
- **SQLite Database**: Persisted via Docker volume on the host machine
- **Ports**: Port 80 (HTTP) exposed, internal ports 3000 (frontend) and 3001 (backend)

## Prerequisites

On your Ubuntu server, install:

```bash
# Update package manager
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Add current user to docker group (so you don't need sudo)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker-compose --version

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

## Step 1: Prepare Your Ubuntu Server

### Create deployment directory

```bash
# Create app directory
mkdir -p ~/thobe-app
cd ~/thobe-app

# Create data directory for SQLite database (persists between restarts)
mkdir -p data
```

### Clone or copy your application

```bash
# Option 1: Clone from GitHub (if your repo is public)
git clone <your-repo-url> .

# Option 2: Copy files from your local machine via SCP
# Run this from your local machine (Windows):
# scp -r c:\Users\User\Desktop\uzman\thobe/* user@server-ip:~/thobe-app/
```

## Step 2: Configure Environment Variables

```bash
cd ~/thobe-app

# Copy the example file
cp .env.example .env

# Edit with your actual values
nano .env
```

**Required variables to set:**

```env
# Application
NODE_ENV=production
PORT=3001
APP_URL=http://your-server-ip-or-domain.com

# Gemini API
GEMINI_API_KEY=your-actual-gemini-api-key

# SMTP (choose one provider from EMAIL_SETUP.md)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password

SMTP_FROM_EMAIL=noreply@thobe-store.com
SMTP_REPLY_TO=support@thobe-store.com
CUSTOMER_PORTAL_URL=http://your-server-ip/orders

# Database
DB_PATH=./data/ecommerce.db
```

**Email Setup**: See [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed instructions on configuring different email providers (Ethereal, Gmail, SendGrid, AWS SES).

## Step 3: Build the Docker Image

### Option A: Build on your Ubuntu server (slower, but works)

```bash
cd ~/thobe-app

# Build the image (takes 2-5 minutes)
docker build -t thobe-app:latest .

# Verify build succeeded
docker images | grep thobe-app
```

### Option B: Build locally and push to Docker Hub (faster)

```bash
# On your local machine:
cd c:\Users\User\Desktop\uzman\thobe

# Using Docker Desktop (Windows):
docker build -t your-dockerhub-username/thobe-app:latest .

# Login to Docker Hub
docker login

# Push to Docker Hub
docker push your-dockerhub-username/thobe-app:latest

# On Ubuntu server:
docker pull your-dockerhub-username/thobe-app:latest
docker tag your-dockerhub-username/thobe-app:latest thobe-app:latest
```

## Step 4: Run the Container

### Basic deployment (HTTP only)

```bash
cd ~/thobe-app

# Create a named volume for database persistence
docker volume create thobe-data

# Run the container
docker run -d \
  --name thobe-store \
  -p 80:80 \
  -p 3001:3001 \
  -v thobe-data:/app/data \
  --env-file .env \
  --restart unless-stopped \
  thobe-app:latest
```

### With Docker Compose (recommended)

Create `docker-compose.yml` in `~/thobe-app/`:

```yaml
version: "3.8"

services:
  app:
    image: thobe-app:latest
    container_name: thobe-store
    ports:
      - "80:80"
      - "3001:3001"
    volumes:
      - thobe-data:/app/data
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    env_file:
      - .env
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

volumes:
  thobe-data:
    driver: local
```

Then run:

```bash
# Start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Stop but keep data
docker-compose stop
```

## Step 5: Verify Deployment

```bash
# Check if container is running
docker ps

# View logs
docker logs thobe-store

# Test health endpoint
curl http://localhost/health

# Test API is accessible
curl http://localhost/api/health

# Test frontend is served
curl http://localhost/

# Check if database file exists
ls -la ~/thobe-app/data/ecommerce.db
```

## Step 6: Access Your Application

From your local machine:

```bash
# Replace server-ip with your actual server IP
curl http://server-ip
curl http://server-ip/api/health

# Or open in browser
# http://server-ip
```

## Useful Commands

```bash
# View container logs (real-time)
docker logs -f thobe-store

# Enter container shell for debugging
docker exec -it thobe-store sh

# Stop the container
docker stop thobe-store

# Start the container
docker start thobe-store

# Remove the container (data in volume persists)
docker rm thobe-store

# View volume information
docker volume ls
docker volume inspect thobe-data

# Remove volume (deletes all database data!)
docker volume rm thobe-data

# Restart container (useful after .env changes)
docker restart thobe-store
```

## Updating the Application

### When you update code on your local machine:

```bash
# Option A: Rebuild image on server
cd ~/thobe-app
git pull  # or copy updated files
docker build -t thobe-app:latest .
docker-compose down
docker-compose up -d

# Option B: Push to Docker Hub and pull on server
# (on local machine)
docker build -t your-username/thobe-app:latest .
docker push your-username/thobe-app:latest

# (on server)
docker pull your-username/thobe-app:latest
docker-compose down
docker-compose up -d
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs thobe-store

# Common issues:
# 1. Port 80 already in use: sudo lsof -i :80
# 2. Missing .env file: cp .env.example .env
# 3. Database directory not writable: chmod 755 ~/thobe-app/data
```

### Can't access the frontend

```bash
# Check if container is running
docker ps | grep thobe

# Check Nginx is forwarding correctly
docker exec -it thobe-store curl http://localhost/health

# Check frontend build exists
docker exec -it thobe-store ls -la /app/dist/
```

### Email not sending

```bash
# Test email configuration
curl -X POST http://server-ip/api/test-email

# Check SMTP settings in .env
# See EMAIL_SETUP.md for provider-specific setup
```

### Database issues

```bash
# View database file
ls -la ~/thobe-app/data/ecommerce.db

# Backup database before making changes
cp ~/thobe-app/data/ecommerce.db ~/thobe-app/data/ecommerce.db.backup

# Seed sample data
docker exec thobe-store npm run seed:db
```

## Security Recommendations

1. **Change default ports** if exposing to internet:

   ```bash
   # Use non-standard ports (e.g., 8080 instead of 80)
   -p 8080:80
   ```

2. **Set up HTTPS/SSL** (uncomment HTTPS config in nginx.conf):

   ```bash
   # Generate self-signed certificate
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout key.pem -out cert.pem

   # Copy to container or mount
   docker run ... -v ./cert.pem:/etc/nginx/ssl/cert.pem ...
   ```

3. **Firewall rules**:

   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

4. **Regular backups**:
   ```bash
   # Backup database volume
   docker run --rm -v thobe-data:/data -v $(pwd):/backup \
     alpine tar czf /backup/thobe-db-backup.tar.gz /data
   ```

## Environment Variables Reference

See [.env.example](.env.example) for:

- All configurable options
- SMTP provider setup instructions
- Commented examples for different email services

## Support

For issues with:

- **Express/Server**: See [server/index.ts](server/index.ts)
- **Email Configuration**: See [EMAIL_SETUP.md](EMAIL_SETUP.md)
- **Database**: See [server/db/database.ts](server/db/database.ts)
- **Frontend**: See [src/App.tsx](src/App.tsx)
