# Docker Deployment Files Summary

This document describes all the Docker-related files created for deploying Thobe Store to your Ubuntu server.

## Files Created

### 1. **Dockerfile**

- **Purpose**: Multi-stage Docker build configuration
- **Details**:
  - Stage 1 (Builder): Compiles Vite frontend and TypeScript backend
  - Stage 2 (Production): Lightweight Alpine Linux image with Node.js, Nginx, and deps
  - Installs both Nginx and Node.js runtime
  - Configures health checks
  - Exposes ports 80 (Nginx) and 3001 (Express)
  - Uses custom entrypoint script to manage both services
- **Location**: `/Dockerfile` (root of project)

### 2. **nginx.conf**

- **Purpose**: Nginx reverse proxy configuration
- **Details**:
  - Routes `/api/*` to Express server on port 3001
  - Serves static frontend files from `dist/` on port 80
  - Implements SPA routing (unknown paths load `/dist/index.html`)
  - Includes security headers (X-Frame-Options, X-Content-Type-Options, etc.)
  - Enables gzip compression for faster file transfer
  - Commented HTTPS/SSL configuration for future setup
  - Includes `/health` endpoint for Docker health checks
  - Cache-busting for assets, no-cache for HTML
- **Location**: `/nginx.conf` (root of project)

### 3. **docker-entrypoint.sh**

- **Purpose**: Bash script to start both Nginx and Express in a single container
- **Details**:
  - Creates necessary directories for Nginx and logs
  - Starts Nginx in the background
  - Starts Express.js API server
  - Properly handles SIGTERM/SIGINT signals for graceful shutdown
  - Maintains both processes and waits for either to fail
  - Logs startup messages for debugging
- **Location**: `/docker-entrypoint.sh` (root of project)

### 4. **.dockerignore**

- **Purpose**: Exclude unnecessary files from Docker image build context
- **Details**:
  - Excludes node_modules (reinstalled in container)
  - Excludes .git and documentation
  - Excludes .env file (security - not baked into image)
  - Excludes dist/ and build artifacts (rebuilt in container)
  - Excludes IDE configs and OS-specific files
- **Purpose**: Reduces Docker image build time and size
- **Location**: `/.dockerignore` (root of project)

### 5. **docker-compose.yml**

- **Purpose**: Docker Compose configuration for easy one-command deployment
- **Details**:
  - Defines single service `app` with Thobe Store image
  - Port mappings: 80 (HTTP), 3001 (API direct access)
  - Volume mount: `thobe-data:/app/data` for SQLite persistence
  - Environment file injection from `.env`
  - Health check configuration
  - Auto-restart policy: `unless-stopped`
  - Resource limit recommendations (commented)
  - Logging configuration (10MB max per file, 3 files rotation)
- **Usage**: `docker-compose up -d`
- **Location**: `/docker-compose.yml` (root of project)

### 6. **deploy.sh**

- **Purpose**: Bash deployment automation script for Ubuntu servers
- **Details**:
  - Comprehensive deployment CLI with multiple commands
  - `deploy`: Full deployment (build → stop old → start new)
  - `build`: Only build Docker image
  - `start/stop/restart`: Container management
  - `logs`: Stream container logs
  - `status`: Show container health
  - `clean`: Remove container/image (keeps data)
  - `backup`: Backup SQLite database
  - Color-coded console output (green for success, red for errors, yellow for warnings)
  - Automatic health verification after deployment
  - Helpful next-steps guide with sample commands
  - Error handling and Docker prerequisite checks
- **Usage**: `./deploy.sh` or `./deploy.sh help`
- **Location**: `/deploy.sh` (root of project)

### 7. **DOCKER_DEPLOYMENT.md**

- **Purpose**: Comprehensive deployment guide
- **Contents**:
  - Application architecture overview
  - Prerequisites and Docker installation instructions
  - Step-by-step deployment instructions:
    - Prepare Ubuntu server
    - Clone/copy application
    - Configure environment variables
    - Build Docker image (2 options: local or Docker Hub)
    - Run container (simple and Docker Compose methods)
  - Verification and testing procedures
  - Useful Docker commands
  - Troubleshooting section
  - Security recommendations (firewall, HTTPS, backups)
  - Environment variables reference
- **Location**: `/DOCKER_DEPLOYMENT.md` (root of project)

### 8. **QUICKSTART_UBUNTU.md**

- **Purpose**: Quick reference for fast deployment
- **Contents**:
  - TL;DR one-liner deployment
  - Full step-by-step instructions with git/SCP options
  - Minimal env configuration needed
  - Common management commands
  - Quick troubleshooting guide
  - Email configuration reference
  - Updating application guide
  - Security setup (HTTPS with Let's Encrypt)
  - Firewall configuration
- **Location**: `/QUICKSTART_UBUNTU.md` (root of project)

## Updated Files

### .env.example

- **Changes**: Updated with comprehensive Docker deployment configuration
- **Additions**:
  - Clear sections for Application, Gemini AI, and Email configuration
  - Docker volume mount documentation
  - Email provider examples (Ethereal, Gmail, SendGrid, AWS SES)
  - Setup links for each provider
  - APP_URL guidance for Ubuntu server deployment
- **Location**: `/.env.example` (already existed in project)

## Deployment Workflow

### On Your Windows Machine (Local Build)

```bash
cd c:\Users\User\Desktop\uzman\thobe
docker build -t thobe-app:latest .
docker tag thobe-app:latest your-dockerhub/thobe-app:latest
docker push your-dockerhub/thobe-app:latest
```

### On Your Ubuntu Server

```bash
# 1. SSH into server
ssh user@server-ip

# 2. Clone repo
git clone <repo-url> ~/thobe-app
cd ~/thobe-app

# 3. Configure
cp .env.example .env
nano .env  # Edit SMTP, API keys, APP_URL

# 4. Deploy
chmod +x deploy.sh
./deploy.sh

# OR with Docker Compose
docker-compose up -d
```

### Access Application

```bash
http://your-server-ip
```

## Architecture Summary

```
┌─────────────────────────────────────┐
│     Ubuntu Server (Docker Host)     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Docker Container          │   │
│  │  ─────────────────────────  │   │
│  │                             │   │
│  │  Nginx (Port 80)           │   │
│  │  ├─ Static Files (dist/)   │   │
│  │  └─ Proxy → Express        │   │
│  │                             │   │
│  │  Express.js (Port 3001)    │   │
│  │  ├─ /api/health            │   │
│  │  ├─ /api/orders            │   │
│  │  ├─ /api/reviews           │   │
│  │  └─ /api/test-email        │   │
│  │                             │   │
│  │  SQLite Database (Volume)  │   │
│  │  └─ /app/data/ecommerce.db │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│           ▲                          │
│           │ Port 80                  │
│           │ (HTTP)                   │
│  ┌─────────────────────┐            │
│  │ Nginx Volume Mount  │            │
│  │ nginx.conf          │            │
│  └─────────────────────┘            │
│                                     │
│  ┌─────────────────────┐            │
│  │ Data Volume         │            │
│  │ ~/thobe-app/data/   │            │
│  └─────────────────────┘            │
│                                     │
│  ┌─────────────────────┐            │
│  │ .env (secrets)      │            │
│  │ (mounted at runtime)│            │
│  └─────────────────────┘            │
│                                     │
└─────────────────────────────────────┘
        ▲
        │ Browser requests
        │ http://server-ip
```

## Volume Mounts

### thobe-data (SQLite Database)

- **Host path**: `~/thobe-app/data/` (on Ubuntu server)
- **Container path**: `/app/data/` (inside container)
- **Purpose**: Persistent database storage across container restarts
- **Persistence**: Survives `docker stop`, `docker rm`
- **Backup**: `./deploy.sh backup` or manual copy of ecommerce.db

### Environment Variables

- **Host file**: `~/.thobe-app/.env` (on Ubuntu server)
- **Mount**: `--env-file .env` in docker run
- **Not mounted as volume**: .env content is passed as environment variables
- **Security**: Secrets never baked into Docker image

### Nginx Configuration

- **Host file**: `./nginx.conf` in project root (copied into image during build)
- **Container path**: `/etc/nginx/nginx.conf`
- **Persistence**: Baked into Docker image (no volume mount needed)

## Environment Variables for Docker

### Application Configuration

- `NODE_ENV=production`
- `PORT=3001`
- `APP_URL=http://your-server-ip`
- `DB_PATH=./data/ecommerce.db`

### Gmail/Email Setup (Example)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

### API Keys

- `GEMINI_API_KEY=your-api-key`

See [.env.example](.env.example) for complete reference.

## Commands Reference

### Build

```bash
docker build -t thobe-app:latest .
```

### Run (Simple)

```bash
docker run -d --name thobe-store -p 80:80 -p 3001:3001 \
  -v thobe-data:/app/data --env-file .env thobe-app:latest
```

### Run (Docker Compose)

```bash
docker-compose up -d
docker-compose logs -f
docker-compose down
```

### Deploy (Automated)

```bash
./deploy.sh          # Full deployment
./deploy.sh logs     # View logs
./deploy.sh restart  # Restart container
./deploy.sh status   # Check status
```

## Troubleshooting

### Check Docker Logs

```bash
docker logs thobe-store
# or with Docker Compose
docker-compose logs app
```

### Verify Services

```bash
curl http://localhost/api/health    # Test API
curl http://localhost/health         # Test Nginx
curl http://localhost                # Test frontend
```

### Database Access

```bash
docker exec -it thobe-store sqlite3 /app/data/ecommerce.db ".tables"
```

### Environment Check

```bash
docker exec thobe-store env | grep -E "(NODE_ENV|PORT|SMTP|GEMINI)"
```

## Security Checklist

- [ ] SMTP credentials configured in .env (not in Dockerfile)
- [ ] Gemini API key set in .env
- [ ] APP_URL set to correct server address
- [ ] Firewall configured to allow ports 80/443
- [ ] Database volume backup created
- [ ] HTTPS/SSL configured (optional but recommended)
- [ ] Health checks enabled and passing
- [ ] Log rotation configured (10MB files)

## Next Steps

1. **Immediate**: Follow [QUICKSTART_UBUNTU.md](QUICKSTART_UBUNTU.md) to deploy
2. **Testing**: Verify all endpoints work with [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
3. **Production**: Set up HTTPS, domain name, automated backups
4. **Monitoring**: Add prometheus/grafana or similar monitoring
5. **CI/CD**: Set up GitHub Actions to auto-build and push to Docker Hub

## Support

- **Docker**: https://docs.docker.com/
- **Nginx**: https://nginx.org/en/docs/
- **Node.js**: https://nodejs.org/en/docs/
- **Troubleshooting**: See DOCKER_DEPLOYMENT.md and QUICKSTART_UBUNTU.md
