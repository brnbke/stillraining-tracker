# Deployment Guide - Data Tracker App

This guide will help you deploy your data tracker app to Google Cloud Platform (GCP) using Cloud Run with automated GitHub Actions deployment.

## Prerequisites

- GitHub account
- Google Cloud Platform account (free $300 credit available)
- Domain name (stillraining.com)

## Step-by-Step Setup

### 1. Set up Neon PostgreSQL Database (Free)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project called "stillraining-tracker"
3. Copy the connection string (looks like: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb`)
4. Save this connection string - you'll need it later

### 2. Create GitHub Repository

1. Go to GitHub and create a new repository named `stillraining-tracker`
2. Push your local code to the repository:
   ```bash
   git remote add origin https://github.com/yourusername/stillraining-tracker.git
   git branch -M main
   git push -u origin main
   ```

### 3. Set up Google Cloud Platform

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project called "stillraining-tracker"
3. Note your Project ID (usually something like `stillraining-tracker-123456`)
4. Enable the following APIs:
   - Cloud Run API
   - Artifact Registry API
   - Cloud Build API

### 4. Create Artifact Registry Repository

1. In GCP Console, go to Artifact Registry
2. Click "Create Repository"
3. Name: `stillraining-tracker`
4. Format: Docker
5. Location: `australia-southeast1` (same as Cloud Run region)
6. Click "Create"

### 5. Create Service Account

1. In GCP Console, go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Name: `github-actions-deploy`
4. Grant these roles:
   - Cloud Run Admin
   - Artifact Registry Writer
   - Storage Admin
5. Create and download the JSON key file
6. Copy the entire contents of the JSON file

### 6. Configure GitHub Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions, and add these secrets:

- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_SERVICE_ACCOUNT_KEY`: The entire JSON key file contents
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate a random 32+ character string
- `NEXTAUTH_URL`: `https://stillraining.com`

### 6. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

### 7. Initial Deployment

1. Push any changes to the main branch:

   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. Go to GitHub Actions tab in your repository to watch the deployment

3. Once successful, you'll get a Cloud Run URL (something like `https://stillraining-tracker-xxx-uc.a.run.app`)

### 8. Set up Custom Domain

1. In GCP Console, go to Cloud Run
2. Click on your `stillraining-tracker` service
3. Go to "Manage Custom Domains"
4. Click "Add Mapping"
5. Enter `stillraining.com`
6. Follow the DNS verification steps
7. Update your domain's DNS records as instructed

### 9. Run Database Migrations

The GitHub Actions workflow automatically runs migrations, but if you need to run them manually:

```bash
# Set your production database URL
export DATABASE_URL="your-neon-connection-string"

# Run migrations
npx prisma migrate deploy
```

## Future Deployments

After the initial setup, deployments are automatic:

1. Make changes to your code locally
2. Commit and push to the main branch:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. GitHub Actions will automatically build and deploy to Cloud Run
4. Your site at `stillraining.com` will be updated within 2-3 minutes

## Cost Breakdown

- **Neon Database**: Free (0.5GB storage)
- **Cloud Run**: ~$0-2/month (pay per request)
- **Container Registry**: ~$0.10/month (minimal storage)
- **Total**: Essentially free for personal projects

## Troubleshooting

### Build Failures

- Check GitHub Actions logs for specific errors
- Ensure all secrets are properly set
- Verify your Dockerfile builds locally: `docker build -t test .`

### Database Connection Issues

- Verify your Neon connection string is correct
- Check that the database is not sleeping (free tier sleeps after inactivity)
- Test connection locally first

### Domain Issues

- DNS changes can take up to 48 hours to propagate
- Verify DNS records are correctly pointing to Cloud Run
- Check SSL certificate status in Cloud Run console

## Monitoring

- **Cloud Run Logs**: GCP Console > Cloud Run > your-service > Logs
- **GitHub Actions**: Repository > Actions tab
- **Application Logs**: Available in Cloud Run console

## Security Notes

- Never commit `.env.production` with real values to Git
- Rotate your NextAuth secret periodically
- Monitor your GCP billing dashboard
- Use branch protection rules for production deployments

## Support

If you encounter issues:

1. Check the GitHub Actions logs first
2. Review Cloud Run logs in GCP Console
3. Verify all environment variables are set correctly
4. Test your Docker build locally
