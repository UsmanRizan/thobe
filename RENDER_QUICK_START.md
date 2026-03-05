# Quick Render Deployment Steps

## 30-Second Overview

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [render.com](https://render.com)
3. Create account and connect git repo
4. Click "New → Blueprint"
5. Render auto-detects `render.yaml`
6. Add SMTP environment variables
7. Deploy! 🚀

---

## Detailed Steps

### 1. Prepare Your Git Repository

```bash
# Make sure everything is committed
git add .
git commit -m "Setup for Render deployment"
git push
```

### 2. Create Render Account

- Visit [render.com](https://render.com)
- Sign up and verify email
- Connect your Git provider (GitHub, GitLab, Bitbucket)

### 3. Deploy Using Blueprint (Easiest)

1. In Render dashboard → **"New"** → **"Blueprint"**
2. Select your repository
3. Render automatically finds `render.yaml`
4. Click **"Create from Blueprint"**

### 4. Configure Environment Variables

In Render dashboard, go to your service and click **"Environment"**:

**Required for Email:**

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=<your-app-password>
SMTP_FROM_EMAIL=noreply@thobe-store.com
SMTP_REPLY_TO=support@thobe-store.com
CUSTOMER_PORTAL_URL=https://your-app-name.onrender.com
```

**Optional:**

```
GEMINI_API_KEY=<your-key>
```

### 5. Wait for Deployment

- Build takes 3-5 minutes
- You'll get a URL like `https://thobe-store.onrender.com`
- Once "Live" appears, your app is deployed!

### 6. Test It Works

```bash
# Health check
curl https://your-app-name.onrender.com/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

---

## What Files Were Created/Updated

| File                      | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `Dockerfile`              | Docker configuration for containerization  |
| `render.yaml`             | Render deployment config (auto-deployment) |
| `RENDER_DEPLOYMENT.md`    | Detailed deployment guide                  |
| `DEPLOYMENT_CHECKLIST.md` | Pre-deployment checklist                   |
| `package.json`            | Added `start` and `build:prod` scripts     |
| `server/index.ts`         | Updated to serve React static files        |

---

## Key Environment Variables Needed

| Variable              | Example                    | Notes                                |
| --------------------- | -------------------------- | ------------------------------------ |
| `SMTP_HOST`           | `smtp.gmail.com`           | Your email provider's SMTP server    |
| `SMTP_PORT`           | `587`                      | Usually 587 (TLS) or 465 (SSL)       |
| `SMTP_USER`           | `your-email@gmail.com`     | Your email address                   |
| `SMTP_PASSWORD`       | `auto gener password`      | For Gmail: use app-specific password |
| `CUSTOMER_PORTAL_URL` | `https://app.onrender.com` | Your deployed app URL                |

---

## Troubleshooting

| Issue             | Solution                                  |
| ----------------- | ----------------------------------------- |
| Build fails       | Check build logs in Render dashboard      |
| App won't start   | Verify environment variables are set      |
| Email not working | Test SMTP credentials, check service logs |
| Database error    | Check disk space, verify DB path          |

---

## Auto-Deploy on Git Push

Once deployed with `render.yaml`, your app automatically redeploys when you push:

```bash
git add .
git commit -m "My changes"
git push  # Render auto-deploys!
```

To disable: Render Dashboard → Service Settings → Turn off "Auto-Deploy"

---

## Performance Tips

- **Starter Plan**: ~$7/month, good for testing/small traffic
- **Standard Plan**: ~$12/month, better for production
- Monitor logs to identify slow endpoints
- Consider upgrading if response times increase

---

## Next Steps

1. ✅ Verify app is live
2. ✅ Test email functionality
3. ✅ Set up monitoring
4. ✅ Plan database backups
5. ✅ Monitor costs and performance

---

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Docker + Node.js Guide](https://docs.docker.com/language/nodejs/)
- [Express.js Docs](https://expressjs.com/)
- Render Support: [support.render.com](https://support.render.com)

For detailed info, see `RENDER_DEPLOYMENT.md`
