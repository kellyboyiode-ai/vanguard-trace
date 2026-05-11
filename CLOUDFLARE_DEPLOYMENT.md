# VanguardTrace - Cloudflare Pages Deployment Guide

## Overview

VanguardTrace is now configured for **Cloudflare Pages** deployment with the following setup:

- **Frontend**: React + Vite (SPA)
- **Hosting**: Cloudflare Pages
- **Backend**: Ready for Cloudflare Workers
- **Domain**: Managed in Cloudflare

## Prerequisites

1. **GitHub Account**: Your repository must be on GitHub
2. **Cloudflare Account**: Free or paid account (Free tier works great)
3. **Domain**: Already in Cloudflare (as per your setup)
4. **Environment Variables**: For API tokens and account ID

## Deployment Steps

### Step 1: Prepare Your Repository

```bash
# Ensure all code is committed
git add .
git commit -m "Configure Cloudflare Pages deployment"
git push origin main
```

### Step 2: Set Up Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Pages**
3. Click **Create application** → **Connect to Git**
4. Select your GitHub account and **vanguard-trace** repository
5. Configure build settings:
   - **Framework preset**: Vue (or None)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

### Step 3: Configure GitHub Actions (Optional but Recommended)

For auto-deployment on every push, set up these secrets in GitHub:

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `CLOUDFLARE_API_TOKEN`: From Cloudflare Dashboard → My Profile → API Tokens
   - `CLOUDFLARE_ACCOUNT_ID`: From Cloudflare Dashboard → Overview (bottom right)

The included `.github/workflows/cloudflare-deploy.yml` will automatically deploy on push to `main` branch.

## Step 4: Connect Your Domain

Use Cloudflare Pages custom domains for `vanguardtrace.site` instead of adding a manual Workers route.

1. Open **Workers & Pages** → **vanguard-trace** → **Custom domains**
2. Click **Set up a custom domain**
3. Add `vanguardtrace.site`
4. Add `www.vanguardtrace.site` if you want both hostnames live
5. Set `vanguardtrace.site` as the primary domain and configure a redirect from `www` if desired

If the domain is already on Cloudflare nameservers, Pages will create and verify the needed DNS records for you.

## Configuration Files

### `wrangler.toml`

Central configuration for Cloudflare projects. Specifies:

- Build command and output directory
- Asset handling and caching
- Compatibility flags for Node.js APIs

### `public/_routes.json`

Handles SPA routing for React Router:

- All routes (except `/api/*`) redirect to `index.html`
- Enables client-side routing without server-side configuration
- Reserves `/api/*` for future backend/Workers integration

### `.github/workflows/cloudflare-deploy.yml`

Automated deployment pipeline:

- Runs on push to main branch
- Installs dependencies, lints, and builds
- Deploys using Cloudflare Wrangler CLI

## Environment Variables

Create a `.env` file for local development (not committed):

```env
VITE_API_URL=http://localhost:8787
VITE_APP_ENV=development
```

For Cloudflare Pages production, add variables in the Pages dashboard:

1. **Settings** → **Environment variables**

2. Add your production variables (API URLs, keys, etc.)

## For Future Backend Integration

### Cloudflare Workers

When you're ready to add backend APIs:

```bash
npm install -D wrangler
```

Workers will use the same account and can be integrated with Pages seamlessly.

### Database & Auth

Consider these Cloudflare services:

- **D1**: SQLite database (serverless)
- **Durable Objects**: For real-time data & sessions
- **Email Routing**: For transactional emails
- **R2**: For file storage (S3-compatible)

## Verification Checklist

- [ ] GitHub repository is public or has Cloudflare access
- [ ] `npm run build` works locally without errors
- [ ] `dist` folder contains all built assets
- [ ] Cloudflare Pages connected to GitHub
- [ ] `vanguardtrace.site` connected in Pages custom domains
- [ ] Optional `www.vanguardtrace.site` redirect configured
- [ ] GitHub secrets configured (if using GitHub Actions)
- [ ] Environmental variables set in Cloudflare dashboard (if needed)

## Testing Your Deployment

1. Push a small change to your `main` branch
2. Watch the build progress in Cloudflare Dashboard
3. Visit your deployed domain to verify it's working
4. Test routing: Navigate to different pages in the app

## Troubleshooting

### Build Fails in Cloudflare

Check the build logs in the Cloudflare dashboard. Common issues:

- Missing environment variables
- Node version incompatibility
- Missing dependencies in `package.json`

### Routes Not Working

Ensure `public/_routes.json` is being deployed:

- Verify the file is in your `dist` folder after building locally
- Check that Cloudflare Pages is serving the `_routes.json` file

### Domain Not Showing Deployment

- Clear DNS cache (cloudflarestat.com or your local DNS)
- Verify domain is in Cloudflare and using Cloudflare nameservers
- Check Pages custom domain settings

## Performance Tips

1. **Enable Caching**: Cloudflare automatically caches assets
2. **Image Optimization**: Use Cloudflare's Image Optimization
3. **Analytics**: Enable in Cloudflare dashboard to monitor traffic
4. **DDoS Protection**: Enabled by default on free tier

## Next Steps

1. **Deploy**: Follow the deployment steps above
2. **Monitor**: Set up analytics in Cloudflare dashboard
3. **Scale**: Add Workers backend as your SaaS grows
4. **Database**: Add D1 database when features require persistence

---

**Questions?** Check Cloudflare's [Pages Documentation](https://developers.cloudflare.com/pages/)
