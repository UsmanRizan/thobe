# Docker Quick Reference

Fast lookup for Docker deployment commands.

## One-Command Deployment

```bash
# On Ubuntu server after cloning repo:
cd ~/thobe-app && cp .env.example .env && nano .env && chmod +x deploy.sh && ./deploy.sh
```

## Common Commands

| Task             | Command                            |
| ---------------- | ---------------------------------- |
| **Deploy**       | `./deploy.sh`                      |
| **View logs**    | `docker logs -f thobe-store`       |
| **Stop**         | `docker stop thobe-store`          |
| **Start**        | `docker start thobe-store`         |
| **Restart**      | `docker restart thobe-store`       |
| **Status**       | `docker ps \| grep thobe`          |
| **Shell access** | `docker exec -it thobe-store sh`   |
| **Check API**    | `curl http://localhost/api/health` |
| **Backup DB**    | `./deploy.sh backup`               |
| **Full logs**    | `docker logs thobe-store \| less`  |

## Docker Compose Commands

```bash
docker-compose up -d       # Start
docker-compose down        # Stop
docker-compose logs -f     # View logs
docker-compose restart     # Restart
docker-compose ps          # Status
docker-compose exec app sh # Shell
```

## Setup Checklist

- [ ] Install Docker: `curl -fsSL https://get.docker.com | sh`
- [ ] Clone repo: `git clone <url> ~/thobe-app`
- [ ] Configure: `cd ~/thobe-app && cp .env.example .env && nano .env`
- [ ] Deploy: `./deploy.sh`
- [ ] Test: `curl http://localhost/api/health`
- [ ] Access: Open `http://server-ip` in browser

## Environment Variables to Set

```env
# Required
GEMINI_API_KEY=your-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
APP_URL=http://your-server-ip

# Optional
NODE_ENV=production
PORT=3001
DB_PATH=./data/ecommerce.db
```

## URLs After Deployment

| Endpoint   | URL                                    |
| ---------- | -------------------------------------- |
| Frontend   | `http://server-ip`                     |
| API Health | `http://server-ip/api/health`          |
| Orders     | `http://server-ip/api/orders`          |
| Reviews    | `http://server-ip/api/reviews`         |
| Test Email | `POST http://server-ip/api/test-email` |

## Port Mapping

| Service | Host Port | Container Port | Purpose                    |
| ------- | --------- | -------------- | -------------------------- |
| Nginx   | 80        | 80             | HTTP reverse proxy         |
| Express | 3001      | 3001           | API server (direct access) |

## Files Created

| File                    | Purpose                        |
| ----------------------- | ------------------------------ |
| `Dockerfile`            | Container image build config   |
| `docker-compose.yml`    | One-command deployment         |
| `docker-entrypoint.sh`  | Start both Nginx + Express     |
| `nginx.conf`            | Reverse proxy config           |
| `deploy.sh`             | Deployment automation          |
| `.dockerignore`         | Exclude files from build       |
| `DOCKER_DEPLOYMENT.md`  | Detailed guide                 |
| `QUICKSTART_UBUNTU.md`  | Quick start guide              |
| `DOCKER_SETUP_FILES.md` | Files documentation            |
| `.env.example`          | Environment variables template |

## Troubleshooting

| Problem               | Solution                                                        |
| --------------------- | --------------------------------------------------------------- |
| Port 80 in use        | `sudo lsof -i :80` to find what's using it                      |
| Container won't start | `docker logs thobe-store`                                       |
| No frontend           | Check `docker exec thobe-store ls /app/dist/`                   |
| No database           | `mkdir -p ~/thobe-app/data`                                     |
| Email not working     | Test with `curl -X POST http://localhost/api/test-email`        |
| Can't SSH             | Check IP with `ifconfig` on server                              |
| Slow build            | Use option B (push to Docker Hub) instead of building on server |

## Quick Build & Push (From Windows)

```powershell
cd c:\Users\User\Desktop\uzman\thobe
docker build -t username/thobe-app:latest .
docker login
docker push username/thobe-app:latest

# Then on Ubuntu server
docker pull username/thobe-app:latest
docker-compose up -d
```

## Backup Commands

```bash
# Backup database
./deploy.sh backup

# Manual backup
docker run --rm -v thobe-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/db-backup.tar.gz /data

# Restore backup
tar xzf backups/*.tar.gz -C ~/thobe-app/data/
docker restart thobe-store
```

## Security Commands

```bash
# Setup firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Generate SSL certificate
sudo apt-get install -y certbot
sudo certbot certonly --standalone -d yourdomain.com

# Copy cert to app
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ~/thobe-app/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ~/thobe-app/
sudo chown $USER ~/thobe-app/*.pem

# Edit HTTPS section in nginx.conf and restart
docker restart thobe-store
```

## Useful One-Liners

```bash
# Get server IP
ip addr show | grep "inet " | grep -v 127.0.0.1

# Test all endpoints
for url in /api/health /health / /api/orders /api/reviews; do
  echo "Testing $url..."; curl -s http://localhost$url | jq . || echo "Failed";
done

# Stream logs with timestamps
docker logs -f --timestamps thobe-store

# Monitor container resources
docker stats thobe-store

# Check container IP
docker inspect thobe-store | grep IPAddress

# View container environment
docker exec thobe-store env | sort

# Database shell access
docker exec -it thobe-store sqlite3 /app/data/ecommerce.db

# Full cleanup (WARNING - deletes data!)
docker stop thobe-store && docker rm thobe-store && docker rmi thobe-app
```

## Next Steps

1. **Read**: [QUICKSTART_UBUNTU.md](QUICKSTART_UBUNTU.md) - 5 min deployment
2. **Deploy**: `./deploy.sh` on Ubuntu server
3. **Test**: `curl http://localhost/api/health`
4. **Configure**: Email, API keys in `.env`
5. **Verify**: Visit `http://server-ip` in browser
6. **Prod**: Setup HTTPS, domain, monitoring
