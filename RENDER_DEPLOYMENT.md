# Render.com Deployment Guide

This guide explains how to deploy your Thobe Store application to Render.com.

## Prerequisites

1. **Git repository**: Your code must be in a Git repository (GitHub, GitLab, or Bitbucket)
2. **Render account**: Sign up at [render.com](https://render.com)
3. **Environment variables**: You'll need to configure SMTP and other settings

## Deployment Steps

### Step 1: Prepare Your Repository

1. Make sure all files are committed to git:
   ```bash
   git add .
   git commit -m "Setup for Render deployment"
   git push
   ```

### Step 2: Create a Render Account & Connect Git

1. Go to [render.com](https://render.com) and sign up
2. Create a new account or log in
3. Connect your Git repository (GitHub, GitLab, or Bitbucket)

### Step 3: Deploy Using render.yaml (Recommended)

This is the easiest method. Render will automatically use the `render.yaml` file in your repository:

1. In Render dashboard, click **"New" → "Blueprint"**
2. Connect your repository
3. Select the repository containing your code
4. Render will automatically detect and use `render.yaml`
5. Review the configuration and click **"Create"**

### Step 4: Configure Environment Variables

1. Go to your deployed service in Render dashboard
2. Click **"Environment"** tab
3. Add the following environment variables:

#### Required for Email (SMTP)

```
SMTP_HOST=smtp.gmail.com          # or your email provider's SMTP host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password   # NOT your regular Gmail password!
SMTP_FROM_EMAIL=noreply@thobe-store.com
SMTP_REPLY_TO=support@thobe-store.com
CUSTOMER_PORTAL_URL=https://your-render-domain.onrender.com
```

#### For Gmail Specifically:

1. Enable **2-Factor Authentication** on Gmail
2. Generate App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the generated 16-character password as `SMTP_PASSWORD`

#### For Other Email Providers:

- **SendGrid**: Get credentials from SendGrid dashboard
- **AWS SES**: Use AWS IAM credentials
- **Ethereal** (for testing): Get free credentials at [ethereal.email](https://ethereal.email)

#### Optional

```
GEMINI_API_KEY=your-gemini-api-key    # Only if using Gemini AI features
```

### Step 5: Wait for Deployment

1. Render will build your Docker image
2. This usually takes 3-5 minutes
3. You'll see **"Live"** when deployment is complete
4. You'll receive a unique URL like: `https://thobe-store.onrender.com`

### Step 6: Test Your Deployment

1. Visit your Render URL
2. Test the application functionality
3. Check that API endpoints respond: `https://your-url.onrender.com/api/health`
4. Test email functionality if available in UI

## Application Structure

Your deployed application will have:

- **Frontend**: React app served at `/` (from `dist/` folder)
- **API Routes**:
  - `/api/health` - Health check
  - `/api/orders` - Order management
  - `/api/reviews` - Product reviews
  - `/api/test-email` - Email testing

## Database Persistence

Your application uses SQLite database stored in `/app/data/`. Render provides a persistent disk that automatically saves your database between deployments:

- Database file: `/app/data/ecommerce.db`
- Disk size: 1GB (can be upgraded if needed)
- Data persists across redeploys and server restarts

**Backup your database regularly:**
```bash
# Download database from Render
# Use Render dashboard → Service → Disk → Download files
```

## Auto-Deploy on Git Push

With the `render.yaml` file, your app will automatically redeploy whenever you push to your main branch:

```bash
git add .
git commit -m "Your changes"
git push  # Render auto-deploys!
```

To disable auto-deploy:
1. Go to Render dashboard
2. Service settings → **"Auto-Deploy"** → Turn off

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify `Dockerfile` is valid

### Application Won't Start
- Check runtime logs: Dashboard → Service → Logs
- Verify all environment variables are set
- Check database path is accessible

### Email Not Working
- Verify SMTP credentials in environment variables
- Check Email service logs
- Test with `/api/test-email` endpoint if available

### Application is Slow
- Starter plan may have limited resources
- Consider upgrading to Standard plan
- Check for unnecessary database queries

## Useful Render Commands

Via Render Dashboard:

- **Restart Service**: Service page → "Restart"
- **View Logs**: Service page → "Logs" tab
- **Check Disk Usage**: Service page → "Disk" tab
- **Scale Up**: Service page → Settings → Change plan

## Estimated Costs

| Resource | Starter | Standard |
|----------|---------|----------|
| Web Service | $7/month | $12/month |
| Disk Storage | Included | Included (10GB) |
| Bandwidth | Generous free tier | Overage after limit |

Free tier available with restrictions.

## Manual Deployment (Alternative)

If you don't want to use `render.yaml`:

1. In Render dashboard, click **"New" → "Web Service"**
2. Connect your repository
3. Fill in these settings:
   - **Name**: `thobe-store` (or your choice)
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Starter (or higher)
4. Click **"Create Web Service"**
5. Add environment variables in the service settings
6. Render will build and deploy automatically

## Next Steps

- Monitor your application with Render's monitoring tools
- Set up error alerts if needed
- Plan for database backups
- Consider upgrading plan if needed
- Monitor costs

For support, visit [Render documentation](https://render.com/docs)
