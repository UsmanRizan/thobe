# Render Deployment Checklist

## Pre-Deployment ✓

- [ ] All code is committed to Git (GitHub, GitLab, or Bitbucket)
- [ ] Repository is public or you have granted access to Render
- [ ] `.env.example` exists with all required environment variables
- [ ] All sensitive data is in `.env.local` (not committed)

## Repository Setup ✓

- [ ] `render.yaml` file exists and is properly formatted
- [ ] `Dockerfile` exists and is valid
- [ ] `package.json` has build scripts:
  - [ ] `npm run build` (builds frontend)
  - [ ] `npm run build:server` (compiles backend)
  - [ ] `npm run start` (runs server)
- [ ] Server code is in `server/` directory
- [ ] React app is in `src/` directory
- [ ] TypeScript configuration files exist:
  - [ ] `tsconfig.json` (frontend)
  - [ ] `tsconfig.server.json` (backend)

## Render Account Setup

- [ ] Create account at [render.com](https://render.com)
- [ ] Connect Git repository to Render
- [ ] Choose deployment method:
  - [ ] **Option A (Recommended)**: Blueprint deployment using `render.yaml`
  - [ ] **Option B**: Manual web service creation

## Environment Variables (In Render Dashboard)

### Email Configuration (Required)

- [ ] `SMTP_HOST` - Your SMTP server (e.g., `smtp.gmail.com`)
- [ ] `SMTP_PORT` - Usually 587 or 465
- [ ] `SMTP_SECURE` - `true` or `false`
- [ ] `SMTP_USER` - Your email address
- [ ] `SMTP_PASSWORD` - Your email password or app password
- [ ] `SMTP_FROM_EMAIL` - Sender email address
- [ ] `SMTP_REPLY_TO` - Reply-to email address
- [ ] `CUSTOMER_PORTAL_URL` - Your Render URL (e.g., `https://yourapp.onrender.com`)

### Optional

- [ ] `GEMINI_API_KEY` - If using Gemini AI features
- [ ] `DB_PATH` - Usually `/app/data/ecommerce.db` (default)

### Automatically Set

- [ ] `NODE_ENV` = `production`
- [ ] `SERVE_DIST` = `true`
- [ ] `PORT` = `3001`

## Security Checklist

- [ ] Never commit `.env` file to Git
- [ ] Use app-specific passwords for Gmail (not your regular password)
- [ ] Keep `SMTP_PASSWORD` in Render secrets, not in code
- [ ] Review database backup and recovery plan
- [ ] Enable monitoring and alerts in Render

## Post-Deployment Testing

- [ ] Application loads at `https://your-app.onrender.com`
- [ ] Health check passes: `https://your-app.onrender.com/api/health`
- [ ] API endpoints are accessible:
  - [ ] `/api/orders`
  - [ ] `/api/reviews`
- [ ] Email is working (test via API if available)
- [ ] Database persists data across restarts
- [ ] Static files (CSS, JS, images) load correctly

## Monitoring & Maintenance

- [ ] Set up error alerts
- [ ] Monitor service logs regularly
- [ ] Plan database backup strategy
- [ ] Monitor disk usage and costs
- [ ] Keep dependencies updated

## Git Push to Deploy

Once set up with `render.yaml`:

```bash
git add .
git commit -m "Update for Render deployment"
git push  # Auto-deploys!
```

Every git push to main branch will automatically redeploy.

---

## Quick Links

- [Render.com Dashboard](https://dashboard.render.com)
- [Render Documentation](https://render.com/docs)
- [Docker + Node.js Best Practices](https://docs.docker.com/language/nodejs/)
- [Express.js Guide](https://expressjs.com/)

## Support

If deployment fails:

1. Check Render dashboard logs
2. Review this checklist
3. See `RENDER_DEPLOYMENT.md` for troubleshooting
4. Contact Render support at [support.render.com](https://support.render.com)
