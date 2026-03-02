# Thobe Store - Docker Deployment Index

**Your application is now Dockerized and ready for deployment to your Ubuntu server!**

## 🚀 Get Started in 3 Steps

### 1. **Quick Start (5 minutes)**

Read [QUICKSTART_UBUNTU.md](QUICKSTART_UBUNTU.md) for the fastest path to deployment.

### 2. **Configure Secrets**

Copy and edit environment variables:

```bash
cp .env.example .env
# Edit: SMTP credentials, Gemini API key, server IP
```

### 3. **Deploy**

Run the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

Then open `http://your-server-ip` in your browser.

---

## 📚 Documentation

Choose based on your needs:

| Document                                                   | Best For                                         | Time        |
| ---------------------------------------------------------- | ------------------------------------------------ | ----------- |
| **[QUICKSTART_UBUNTU.md](QUICKSTART_UBUNTU.md)**           | Fast deployment to Ubuntu server                 | 5 min       |
| **[DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)**           | Complete step-by-step guide with troubleshooting | 20 min read |
| **[DOCKER_QUICK_REFERENCE.md](DOCKER_QUICK_REFERENCE.md)** | Quick command lookups                            | On-demand   |
| **[DOCKER_SETUP_FILES.md](DOCKER_SETUP_FILES.md)**         | Understanding all Docker files created           | 10 min read |
| **[.env.example](.env.example)**                           | Environment variables reference                  | On-demand   |

---

## 📁 Docker Files Created

```
├── Dockerfile                    # Multi-stage build (frontend + backend)
├── docker-compose.yml            # One-command deployment config
├── docker-entrypoint.sh          # Starts Nginx + Express in one container
├── nginx.conf                    # Reverse proxy configuration
├── deploy.sh                     # Deployment automation script
├── .dockerignore                 # Files excluded from Docker build
├── .env.example                  # Environment variables template (UPDATED)
│
└── Documentation:
    ├── QUICKSTART_UBUNTU.md      # 5-min quick start
    ├── DOCKER_DEPLOYMENT.md      # Complete guide with troubleshooting
    ├── DOCKER_QUICK_REFERENCE.md # Command quick lookup
    ├── DOCKER_SETUP_FILES.md     # Files documentation
    └── DOCKER_INDEX.md           # This file
```

---

## 🎯 Common Workflows

### Deploy from Scratch (First Time)

```bash
# On Ubuntu server:
cd ~
git clone <your-repo> thobe-app
cd thobe-app
cp .env.example .env
nano .env           # Edit SMTP and API keys
chmod +x deploy.sh
./deploy.sh
```

### Update Application After Code Changes

```bash
cd ~/thobe-app
git pull
./deploy.sh         # Rebuilds and redeploys
```

### Quick Management Commands

```bash
./deploy.sh logs     # View logs
./deploy.sh restart  # Restart container
./deploy.sh status   # Check status
./deploy.sh backup   # Backup database
```

---

## 🏗️ Application Architecture

```
Ubuntu Server
└── Docker Container
    ├── Nginx (Port 80)
    │   ├── Static Frontend (React/Vite)
    │   └── Reverse Proxy → Express API
    │
    ├── Express.js (Port 3001)
    │   ├── /api/health (health check)
    │   ├── /api/orders (order management)
    │   ├── /api/reviews (reviews)
    │   └── /api/test-email (email testing)
    │
    └── SQLite Database (Persistent Volume)
        └── /app/data/ecommerce.db
```

---

## ✅ Pre-Deployment Checklist

- [ ] Ubuntu server with SSH access
- [ ] Docker installed: `curl -fsSL https://get.docker.com | sh`
- [ ] Gemini API key (get at https://aistudio.google.com/app/apikey)
- [ ] SMTP credentials (Gmail, SendGrid, or other provider)
- [ ] Server IP address or domain name
- [ ] Read [QUICKSTART_UBUNTU.md](QUICKSTART_UBUNTU.md)

---

## 🔑 Key Features

✅ **Single Container**: Frontend + Backend + Nginx in one container
✅ **Production Ready**: Multi-stage build, health checks, graceful shutdown
✅ **Data Persistence**: SQLite database survives container restarts
✅ **Easy Deployment**: One-command deployment script
✅ **Environment Secrets**: .env file never baked into image
✅ **Reverse Proxy**: Nginx handles routing and HTTPS (optional)
✅ **Auto-Restart**: Container restarts on failure automatically
✅ **Easy Updates**: Pull code, rebuild, deploy in seconds

---

## 🆘 Help & Support

### Something Not Working?

1. **Check logs**: `docker logs -f thobe-store`
2. **Test endpoints**: `curl http://localhost/api/health`
3. **Read troubleshooting**: [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md#troubleshooting)
4. **Quick reference**: [DOCKER_QUICK_REFERENCE.md](DOCKER_QUICK_REFERENCE.md)

### Common Issues

| Issue                 | Solution                                        |
| --------------------- | ----------------------------------------------- |
| Container won't start | Check logs: `docker logs thobe-store`           |
| Can't access frontend | Verify port 80 is open: `sudo ufw allow 80/tcp` |
| Email not sending     | Check SMTP settings in .env                     |
| Database missing      | Create data dir: `mkdir -p ~/thobe-app/data`    |
| Can't SSH to server   | Verify IP: `ip addr show` on server             |

---

## 📖 Learning Resources

- **Docker**: https://docs.docker.com/get-started/
- **Nginx**: https://nginx.org/en/docs/
- **Express.js**: https://expressjs.com/
- **Vite**: https://vitejs.dev/
- **SQLite**: https://www.sqlite.org/docs.html

---

## 🔐 Security Notes

1. **Never commit .env file** - Use .github/workflows or secrets for CI/CD
2. **Change default passwords** - Update SMTP and API credentials
3. **Use HTTPS in production** - See SSL section in [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
4. **Backup database regularly** - Use `./deploy.sh backup`
5. **Restrict firewall** - Only allow necessary ports
6. **Update regularly** - Pull latest code and docker images

---

## 🚀 Next Steps

1. **Read**: [QUICKSTART_UBUNTU.md](QUICKSTART_UBUNTU.md)
2. **Configure**: Copy `.env.example` to `.env` and add your credentials
3. **Deploy**: Run `./deploy.sh` on your Ubuntu server
4. **Test**: Visit `http://your-server-ip` in browser
5. **Verify**: Check all endpoints work with [DOCKER_QUICK_REFERENCE.md](DOCKER_QUICK_REFERENCE.md)
6. **Optimize**: Setup HTTPS, domain, monitoring, automated backups

---

## 📊 Deployment Checklist

- [ ] Docker installed on Ubuntu
- [ ] Repository cloned to ~/thobe-app
- [ ] .env configured with credentials
- [ ] `./deploy.sh` executed successfully
- [ ] Frontend loads at http://server-ip
- [ ] API health check passes: `curl http://server-ip/api/health`
- [ ] Email test works: `curl -X POST http://server-ip/api/test-email`
- [ ] Database file exists: `ls -la ~/thobe-app/data/ecommerce.db`
- [ ] Logs look healthy: `docker logs thobe-store`
- [ ] Container auto-restarts on failure

---

## 📝 Quick Command Reference

```bash
# Deployment
./deploy.sh                      # Full deployment
docker-compose up -d             # Alternative: use docker-compose

# Management
docker logs -f thobe-store       # View logs
docker stop thobe-store          # Stop container
docker start thobe-store         # Start container
docker restart thobe-store       # Restart container
./deploy.sh status               # Check status

# Maintenance
./deploy.sh backup               # Backup database
docker exec -it thobe-store sh   # Shell access
docker ps                        # List containers
docker volume ls                 # List volumes

# Testing
curl http://localhost/           # Test frontend
curl http://localhost/api/health # Test API
curl http://localhost/health     # Test Nginx
```

---

## 🎉 Congratulations!

Your Thobe Store is now ready for production deployment. Follow [QUICKSTART_UBUNTU.md](QUICKSTART_UBUNTU.md) to get it live!

---

**Questions?** Check [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for detailed explanations or [DOCKER_QUICK_REFERENCE.md](DOCKER_QUICK_REFERENCE.md) for quick command lookups.
