# Deployment Guide

This guide covers deploying your Real-Time Chat Application to various platforms.

## Prerequisites

Before deploying, ensure you have:
1. A Supabase project set up with the database schema
2. Your Supabase URL and Anon Key
3. Tested the application locally

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent support for React applications with automatic builds and deployments.

#### Steps:

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

3. **Deploy via GitHub** (Recommended)
   - Push your code to GitHub
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the framework settings

4. **Add Environment Variables**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = Your Supabase project URL
     - `VITE_SUPABASE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - Save and redeploy

5. **Domain Setup**
   - Vercel provides a free `.vercel.app` domain
   - Add custom domain in Settings > Domains

### Option 2: Netlify

Netlify is another excellent option for static site hosting.

#### Steps:

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Deploy via GitHub**
   - Push code to GitHub
   - Go to https://netlify.com
   - Click "Add new site" > "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

5. **Add Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add your Supabase credentials
   - Trigger a new deployment

### Option 3: Railway

Railway provides easy deployment with built-in database support.

#### Steps:

1. **Sign up** at https://railway.app

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Railway will auto-detect the build settings
   - Add environment variables in the Variables tab

4. **Deploy**
   - Push to GitHub to trigger automatic deployments

### Option 4: Render

Render offers free tier with automatic deploys from Git.

#### Steps:

1. **Sign up** at https://render.com

2. **Create New Web Service**
   - Click "New +" > "Web Service"
   - Connect your Git repository

3. **Configure**
   - Name: Your app name
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Environment Variables**
   - Add Supabase credentials in the Environment tab

5. **Deploy**
   - Click "Create Web Service"

## Supabase Configuration

### Production Setup

1. **Update RLS Policies**
   - Review Row Level Security policies
   - Ensure policies are restrictive enough for production

2. **Database Backups**
   - Enable automatic backups in Supabase dashboard
   - Go to Database > Backups

3. **API Rate Limits**
   - Monitor usage in Supabase dashboard
   - Upgrade plan if needed for higher limits

4. **Custom Domain** (Optional)
   - Add custom domain in Supabase Settings > API
   - Update VITE_SUPABASE_URL in your deployment

## Environment Variables Reference

Required environment variables for all deployments:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Post-Deployment Checklist

After deploying, verify:

- [ ] Users can register and login
- [ ] Messages send and receive in real-time
- [ ] Online status updates correctly
- [ ] Typing indicators work
- [ ] Dark mode toggles properly
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] SSL certificate is active (HTTPS)

## Performance Optimization

### Caching

Add these headers to your deployment platform:

```
Cache-Control: public, max-age=31536000, immutable (for static assets)
```

### CDN

Most platforms (Vercel, Netlify) provide CDN by default. For others:
- Use Cloudflare for additional caching and security
- Enable Brotli compression

### Database

Optimize Supabase:
- Create indexes on frequently queried columns (already done in migration)
- Monitor query performance in Supabase dashboard
- Use connection pooling (enabled by default)

## Monitoring

### Application Monitoring

Set up monitoring for:
- Error tracking (Sentry, LogRocket)
- Performance monitoring (Vercel Analytics, Google Analytics)
- Uptime monitoring (UptimeRobot, Pingdom)

### Supabase Monitoring

Monitor in Supabase dashboard:
- Database performance
- API requests
- Realtime connections
- Storage usage

## Troubleshooting

### Build Fails

If build fails:
1. Check Node.js version (should be 18+)
2. Verify all dependencies are in package.json
3. Check environment variables are set
4. Review build logs for specific errors

### Real-time Not Working

If real-time features don't work:
1. Check Supabase Realtime is enabled
2. Verify WebSocket connections aren't blocked
3. Check browser console for errors
4. Ensure RLS policies allow subscriptions

### CORS Issues

If you encounter CORS errors:
1. Add your domain to Supabase allowed origins
2. Go to Supabase Settings > API > URL Configuration
3. Add your production URL

### Slow Performance

If app is slow:
1. Enable caching headers
2. Optimize images and assets
3. Check database query performance
4. Consider using Supabase Edge Functions for heavy operations

## Security Best Practices

### Before Going Live

1. **Review RLS Policies**
   - Ensure all tables have proper RLS enabled
   - Test with different user accounts

2. **Rate Limiting**
   - Implement rate limiting for auth endpoints
   - Use Supabase built-in rate limits

3. **HTTPS Only**
   - Ensure SSL is active
   - Set secure cookie flags

4. **Environment Variables**
   - Never commit `.env` to Git
   - Use platform secret management
   - Rotate keys periodically

5. **Content Security Policy**
   - Add CSP headers in deployment config
   - Restrict inline scripts if possible

## Scaling Considerations

### When to Scale

Scale up when you notice:
- Slow response times
- High database CPU usage
- Realtime connection limits reached
- Storage capacity approaching limit

### Scaling Options

1. **Supabase**
   - Upgrade to Pro tier for better performance
   - Add read replicas for high traffic
   - Use connection pooling

2. **Frontend**
   - Most platforms auto-scale
   - Add CDN for global distribution
   - Implement code splitting

## Cost Optimization

### Free Tier Limits

Supabase Free Tier includes:
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth
- 50 MB file uploads

### Upgrade When Needed

Consider upgrading if you exceed free tier or need:
- More concurrent connections
- Daily backups
- Point-in-time recovery
- Priority support

## Support and Resources

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Community Support: GitHub Discussions

## Quick Deploy Buttons

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

---

Need help? Check the main README.md or open an issue on GitHub.
