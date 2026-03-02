# Quick Start: Deploy to Ubuntu Server

Deploy your Thobe Store to an Ubuntu server via SSH in 5 minutes.

## TL;DR - One-Liner Deployment

```bash
# On your Ubuntu server:
cd ~
git clone <your-repo-url> thobe-app
cd thobe-app
cp .env.example .env
nano .env  # Edit with your SMTP and API keys
chmod +x deploy.sh
./deploy.sh
```

Then open `http://your-server-ip` in your browser.

---

## Full Step-by-Step

### 1. SSH into your Ubuntu server

```bash
# From Windows PowerShell:
ssh user@your-server-ip
# Example: ssh user@192.168.1.100
```

### 2. Install Docker (if not already installed)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

Verify: `docker --version`

### 3. Clone or copy the application

```bash
# Option A: Git clone
cd ~
git clone <your-repo> thobe-app
cd thobe-app

# Option B: Via SCP from local machine
# Run from PowerShell on your Windows machine:
scp -r c:\Users\User\Desktop\uzman\thobe\* user@server-ip:~/thobe-app/
```

### 4. Configure environment variables

```bash
cd ~/thobe-app
cp .env.example .env
nano .env
```

**Minimum required settings:**

```env
GEMINI_API_KEY=your-key-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
APP_URL=http://your-server-ip
```

**Email Setup Guide**: See [EMAIL_SETUP.md](EMAIL_SETUP.md)

### 5. Deploy with one command

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

**Or use Docker Compose:**

```bash
docker-compose up -d
```

### 6. Verify it's running

```bash
# Check container status
docker ps

# View logs
docker logs -f thobe-store

# Test endpoints
curl http://localhost/api/health
curl http://localhost/health
```

### 7. Access from your local machine

Open browser and go to: `http://your-server-ip`

---

## Common Commands

```bash
# View logs (follow mode)
docker logs -f thobe-store

# Stop application
docker stop thobe-store

# Start application
docker start thobe-store

# Restart application
docker restart thobe-store

# Check status
docker ps | grep thobe

# Check data volume
docker volume ls | grep thobe

# Backup database
./deploy.sh backup

# Full deployment script help
./deploy.sh help
```

---

## Troubleshooting

### "curl: command not found"

SSH into the server and install curl:

```bash
sudo apt-get update
sudo apt-get install -y curl
```

### Port 80 already in use

```bash
# Find what's using port 80
sudo lsof -i :80

# Or use a different port in docker-compose.yml
# Change: - "80:80" to - "8080:80"
```

### Container won't start

```bash
# Check logs for errors
docker logs thobe-store

# Common issues:
# 1. .env file missing: cp .env.example .env
# 2. Gemini API key missing: check GEMINI_API_KEY in .env
# 3. Database directory not writable: chmod 755 ~/thobe-app/data
```

### Frontend shows blank page

```bash
# Check if frontend files were built
docker exec -it thobe-store ls -la /app/dist/

# Check browser console for errors (F12)
```

### Email not sending

```bash
# Test email endpoint
curl -X POST http://localhost/api/test-email

# Check SMTP settings in .env
# Verify credentials at your email provider
```

### Database persistence issue

```bash
# Check if volume is mounted correctly
docker inspect thobe-store | grep -A 5 Mounts

# Check if data directory exists on host
ls -la ~/thobe-app/data/

# Verify volume contents
docker run --rm -v thobe-data:/data alpine ls -la /data/
```

---

## Updating the Application

```bash
# Pull latest code
git pull

# Rebuild and restart
./deploy.sh  # or docker-compose up -d --build
```

---

## Security & HTTPS

### HTTP → HTTPS with reverse proxy

For production, use Let's Encrypt:

```bash
# Install Certbot
sudo apt-get install -y certbot

# Get certificate (for your domain)
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificate into app
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ~/thobe-app/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ~/thobe-app/
sudo chown $USER:$USER ~/thobe-app/*.pem
```

Then uncomment HTTPS config in `nginx.conf` and redeploy.

### Firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Getting Help

1. **Check logs**: `docker logs -f thobe-store`
2. **Test API**: `curl http://localhost/api/health`
3. **See documentation**:
   - [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) - Detailed guide
   - [EMAIL_SETUP.md](EMAIL_SETUP.md) - Email provider setup
   - [README.md](README.md) - Application overview

---

## Next Steps

- [ ] Set up domain name (optional)
- [ ] Configure HTTPS/SSL certificate
- [ ] Set up automated backups
- [ ] Configure monitoring/alerts
- [ ] Set up CI/CD for automated deployments
