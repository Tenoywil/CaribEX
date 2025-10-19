# CaribEX Deployment Guide

## Quick Start

This guide will walk you through deploying CaribEX to production. The application is **production-ready** with real API integration and no mock data.

---

## Prerequisites

Before deploying, ensure you have:

1. ✅ **Backend API deployed** with all required endpoints
2. ✅ **Database configured** with proper migrations
3. ✅ **Blockchain RPC provider** account (Alchemy, Infura, or QuickNode)
4. ✅ **Domain names** registered (e.g., caribex.com, api.caribex.com)
5. ✅ **SSL certificates** ready (usually automatic with hosting providers)
6. ✅ **Hosting platform** account (Vercel recommended)

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best Next.js deployment experience with automatic CI/CD.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Configure Environment Variables

Create `.env.production` from the template:

```bash
cp .env.production.template .env.production
```

Edit `.env.production` with your production values:
- `NEXT_PUBLIC_API_URL` → Your backend API URL
- `NEXT_PUBLIC_RPC_URL` → Your blockchain RPC endpoint
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` → Your WalletConnect project ID
- Other analytics and monitoring IDs

#### Step 4: Deploy to Vercel

```bash
# First deployment
vercel

# Deploy to production
vercel --prod
```

#### Step 5: Add Environment Variables to Vercel

Go to your Vercel dashboard and add all environment variables from `.env.production`:

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable from `.env.production`
4. Select "Production" environment
5. Save and redeploy

#### Step 6: Configure Custom Domain

1. Go to "Settings" → "Domains"
2. Add your custom domain (e.g., caribex.com)
3. Update DNS records as instructed
4. Wait for SSL provisioning (automatic)

---

### Option 2: Netlify

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify

```bash
netlify login
```

#### Step 3: Initialize Site

```bash
netlify init
```

#### Step 4: Configure Build Settings

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

#### Step 5: Add Environment Variables

```bash
# Add each variable
netlify env:set NEXT_PUBLIC_API_URL "https://api.caribex.com"
netlify env:set NEXT_PUBLIC_CHAIN_ID "1"
# ... add all other variables
```

#### Step 6: Deploy

```bash
netlify deploy --prod
```

---

### Option 3: Docker + Any Cloud Provider

#### Step 1: Create Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Step 2: Create .dockerignore

```
node_modules
.next
.git
.env*.local
.env.production
npm-debug.log*
yarn-debug.log*
README.md
```

#### Step 3: Build Docker Image

```bash
docker build -t caribex-frontend .
```

#### Step 4: Run Locally to Test

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.caribex.com \
  -e NEXT_PUBLIC_CHAIN_ID=1 \
  caribex-frontend
```

#### Step 5: Push to Container Registry

**Docker Hub**:
```bash
docker tag caribex-frontend yourusername/caribex-frontend:latest
docker push yourusername/caribex-frontend:latest
```

**AWS ECR**:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker tag caribex-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/caribex-frontend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/caribex-frontend:latest
```

#### Step 6: Deploy to Cloud

**AWS ECS/Fargate**:
1. Create ECS cluster
2. Create task definition with your Docker image
3. Create service with load balancer
4. Configure environment variables in task definition

**Google Cloud Run**:
```bash
gcloud run deploy caribex-frontend \
  --image gcr.io/YOUR_PROJECT/caribex-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=https://api.caribex.com
```

**Azure Container Instances**:
```bash
az container create \
  --resource-group caribex \
  --name caribex-frontend \
  --image youracr.azurecr.io/caribex-frontend \
  --dns-name-label caribex \
  --ports 3000
```

---

## Post-Deployment Steps

### 1. Verify Deployment

Visit your deployed site and test:

- [ ] Homepage loads correctly
- [ ] Can browse marketplace
- [ ] Can filter products
- [ ] Pagination works
- [ ] Mobile menu works
- [ ] Can connect wallet
- [ ] Can sign in
- [ ] Can create product (as seller)
- [ ] Can upload images
- [ ] All navigation links work

### 2. Configure DNS

Point your domain to your deployed application:

**For Vercel**:
- Add CNAME record: `caribex.com` → `cname.vercel-dns.com`

**For Netlify**:
- Add CNAME record: `caribex.com` → `caribex.netlify.app`

**For Custom Server**:
- Add A record: `caribex.com` → `YOUR_SERVER_IP`

### 3. Enable SSL

**Vercel/Netlify**: Automatic

**Custom Server**: Use Let's Encrypt
```bash
sudo certbot --nginx -d caribex.com -d www.caribex.com
```

### 4. Configure Monitoring

**Sentry** (Error Tracking):
1. Create project at sentry.io
2. Add DSN to environment variables
3. Deploy with new variables

**Google Analytics**:
1. Create property at analytics.google.com
2. Add Measurement ID to environment variables
3. Deploy with new variables

### 5. Test Performance

Run performance tests:
```bash
# Lighthouse
lighthouse https://caribex.com --view

# WebPageTest
# Visit https://www.webpagetest.org
```

Target metrics:
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1

### 6. Setup CI/CD

#### GitHub Actions with Vercel

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

Add secrets to GitHub:
1. Go to repository Settings → Secrets
2. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

---

## Environment-Specific Configuration

### Development
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia testnet
NEXT_PUBLIC_NETWORK_NAME=sepolia
```

### Staging
```bash
# .env.staging
NEXT_PUBLIC_API_URL=https://api-staging.caribex.com
NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia testnet
NEXT_PUBLIC_NETWORK_NAME=sepolia
NEXT_PUBLIC_SENTRY_ENVIRONMENT=staging
```

### Production
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.caribex.com
NEXT_PUBLIC_CHAIN_ID=1  # Ethereum mainnet
NEXT_PUBLIC_NETWORK_NAME=mainnet
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: "Environment variable not found"**
- Ensure all required variables are set in hosting platform
- Check variable names match exactly (case-sensitive)

### Runtime Errors

**Error: "Failed to fetch"**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend API is running
- Verify CORS is configured on backend

**Error: "Network Error"**
- Check `NEXT_PUBLIC_RPC_URL` is valid
- Verify blockchain provider API key is active

### Performance Issues

**Slow Page Loads**:
- Enable caching headers on backend
- Use CDN for images (`NEXT_PUBLIC_CDN_URL`)
- Optimize images (convert to WebP)

**High API Latency**:
- Add Redis caching on backend
- Use edge functions if available
- Implement request batching

---

## Scaling Considerations

### Horizontal Scaling

For high traffic, scale your deployment:

**Vercel**: Automatic scaling included

**Docker + Kubernetes**:
```yaml
# kubernetes-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: caribex-frontend
spec:
  replicas: 3  # Scale to 3 instances
  selector:
    matchLabels:
      app: caribex-frontend
  template:
    metadata:
      labels:
        app: caribex-frontend
    spec:
      containers:
      - name: caribex
        image: caribex-frontend:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: caribex-frontend
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: caribex-frontend
```

### CDN Configuration

Use a CDN for static assets:

**Cloudflare**:
1. Add site to Cloudflare
2. Update DNS to Cloudflare nameservers
3. Enable caching rules for static assets
4. Enable Rocket Loader for JS optimization

**AWS CloudFront**:
1. Create CloudFront distribution
2. Set origin to your deployment
3. Configure cache behaviors
4. Enable compression

---

## Rollback Procedure

If issues occur in production:

### Vercel Rollback
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Git Rollback
```bash
# Revert last commit
git revert HEAD
git push origin main

# CI/CD will auto-deploy previous version
```

### Manual Rollback
1. Checkout previous working commit
2. Build and deploy manually
3. Investigate issue offline

---

## Security Checklist

Before going live:

- [ ] SSL certificate active (HTTPS everywhere)
- [ ] Environment variables not in code
- [ ] No API keys in frontend code
- [ ] CORS configured on backend
- [ ] Rate limiting enabled on backend
- [ ] File upload validation on both frontend and backend
- [ ] Session cookies are HTTP-only and Secure
- [ ] Content Security Policy configured
- [ ] Regular security updates scheduled

---

## Maintenance

### Regular Tasks

**Weekly**:
- Check error rates in Sentry
- Review performance metrics
- Check uptime reports

**Monthly**:
- Update dependencies (`npm audit fix`)
- Review and optimize slow pages
- Check disk space usage (if self-hosted)

**Quarterly**:
- Security audit
- Performance optimization review
- User feedback review and implementation

---

## Success Criteria

Your deployment is successful when:

1. ✅ Site loads in < 3 seconds
2. ✅ All features work correctly
3. ✅ Mobile experience is smooth
4. ✅ Error rate < 0.1%
5. ✅ Uptime > 99.9%
6. ✅ Users can complete transactions
7. ✅ Monitoring and alerts are active
8. ✅ SSL certificate is valid
9. ✅ DNS propagation complete
10. ✅ Team trained on rollback procedures

---

## Need Help?

- **Documentation**: See `PRODUCTION_READINESS.md` for detailed checklist
- **Issues**: Check GitHub issues or create new one
- **Community**: Join Discord/Telegram for support
- **Emergency**: Contact on-call engineer

---

## Congratulations! 🎉

You're now running CaribEX in production. Monitor closely for the first 24-48 hours and respond quickly to any issues.

**Next Steps**:
1. Announce launch to users
2. Monitor error logs and performance
3. Gather user feedback
4. Plan next features
5. Celebrate the launch! 🚀
