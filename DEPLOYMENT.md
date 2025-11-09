# Deployment Checklist for V-yes Code

Use this checklist when deploying V-yes Code to production.

## Pre-Deployment Checklist

### ✅ Development Complete
- [ ] All features working in development
- [ ] Tested with multiple users
- [ ] No console errors
- [ ] Real-time features working
- [ ] Voice/text chat functional
- [ ] Code editor saves properly

### ✅ Code Quality
- [ ] Removed console.log() statements
- [ ] No hardcoded values
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] User feedback for all actions

### ✅ Appwrite Setup
- [ ] Production Appwrite project created
- [ ] Collections created with correct schema
- [ ] Permissions configured properly
- [ ] Authentication methods enabled
- [ ] Production domain added as platform

## Deployment Steps

### 1. Build for Production

```bash
npm run build
```

This creates optimized files in `dist/` folder.

### 2. Environment Variables

Create production `.env` or configure in your hosting platform:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-production-project-id
VITE_APPWRITE_PROJECT_NAME=V-yes-code
VITE_APPWRITE_DATABASE_ID=your-production-database-id
VITE_APPWRITE_WORKSPACES_COLLECTION_ID=workspaces
VITE_APPWRITE_MESSAGES_COLLECTION_ID=messages
VITE_APPWRITE_CODE_SESSIONS_COLLECTION_ID=code_sessions
```

### 3. Configure Appwrite for Production

In Appwrite Console:

1. **Add Production Platform**
   - Go to Settings → Platforms
   - Add Web App
   - Hostname: `your-domain.com` (without http://)
   - Save

2. **Update OAuth Redirects**
   - If using GitHub OAuth
   - Update redirect URLs to production domain
   - Update in GitHub OAuth App settings too

3. **Review Permissions**
   - Ensure collections have correct permissions
   - Test with a fresh user account

### 4. Deploy to Hosting Platform

#### Option A: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Configure environment variables in Vercel dashboard.

#### Option B: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

Configure environment variables in Netlify dashboard.

#### Option C: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://your-username.github.io/v-yes-code"
}
```

3. Deploy:
```bash
npm run deploy
```

#### Option D: Self-Hosted (VPS)

1. Build the app
2. Copy `dist/` folder to your server
3. Configure Nginx/Apache to serve the files
4. Set up SSL certificate (Let's Encrypt)

## Post-Deployment Checklist

### ✅ Functionality Tests
- [ ] User registration works
- [ ] Login works (email & OAuth)
- [ ] Can create workspace
- [ ] Can join workspace via ID
- [ ] Code editor loads
- [ ] Code auto-saves
- [ ] Real-time updates work
- [ ] Text chat works
- [ ] Multiple users can collaborate
- [ ] Can download code files

### ✅ Performance
- [ ] Page loads in < 3 seconds
- [ ] No memory leaks (check DevTools)
- [ ] Real-time updates are instant
- [ ] Editor is responsive

### ✅ Security
- [ ] HTTPS enabled
- [ ] No sensitive data in client code
- [ ] API keys not exposed
- [ ] Collection permissions reviewed
- [ ] OAuth properly configured

### ✅ User Experience
- [ ] Mobile responsive
- [ ] Error messages clear
- [ ] Loading states present
- [ ] Toast notifications work
- [ ] UI looks good on all screens

## Monitoring & Maintenance

### Set Up Monitoring
1. **Appwrite Console**
   - Monitor API usage
   - Check for errors in Logs
   - Review user activity

2. **Browser Analytics** (Optional)
   - Google Analytics
   - Plausible Analytics
   - Simple Analytics

3. **Error Tracking** (Optional)
   - Sentry
   - LogRocket
   - Rollbar

### Regular Maintenance
- [ ] Check Appwrite usage limits
- [ ] Review user feedback
- [ ] Monitor performance
- [ ] Update dependencies monthly
- [ ] Backup database periodically

## Scaling Considerations

### When to Scale

**Free Tier Limits** (Appwrite Cloud):
- 75K executions/month
- 2GB bandwidth
- 2GB database

**Upgrade When**:
- > 1000 active users
- > 10,000 documents
- > 1GB bandwidth/month
- Need custom domains
- Need more storage

### Optimization Tips

1. **Code Sessions**
   - Implement code cleanup (delete old sessions)
   - Add size limits per session
   - Use compression for large code files

2. **Messages**
   - Implement message pagination
   - Delete old messages after X days
   - Archive important conversations

3. **Real-time**
   - Unsubscribe when component unmounts
   - Limit subscriptions per user
   - Implement connection pooling

4. **Performance**
   - Enable CDN for static assets
   - Implement code splitting
   - Lazy load components
   - Use React.memo for optimization

## Troubleshooting Production Issues

### Issue: Users Can't Connect
**Check**:
- Platform hostname in Appwrite
- CORS settings
- Environment variables
- Browser console for errors

### Issue: Real-time Not Working
**Check**:
- WebSocket not blocked by firewall
- Collection permissions
- Subscription code properly implemented
- Network tab for WebSocket connection

### Issue: OAuth Not Working
**Check**:
- Redirect URLs in OAuth provider
- OAuth enabled in Appwrite
- Client ID and Secret correct
- Domain matches OAuth settings

### Issue: Slow Performance
**Check**:
- Network requests (too many?)
- Document sizes (too large?)
- Memory leaks in DevTools
- Real-time subscriptions (too many?)

## Rollback Plan

If something goes wrong:

1. **Quick Fix**: Revert to previous deployment
   - Vercel/Netlify: Roll back in dashboard
   - GitHub Pages: Revert commit and redeploy

2. **Database Issue**: 
   - Keep backup of collections
   - Document structure changes
   - Test migrations in dev first

3. **Emergency**: 
   - Keep old version running
   - Fix issue in staging
   - Redeploy when ready

## Success Metrics

Track these to measure success:

- **Users**: Number of signups
- **Workspaces**: Number created
- **Sessions**: Code sessions created
- **Messages**: Chat activity
- **Retention**: Users returning
- **Performance**: Load times
- **Errors**: Error rate

## Support Plan

1. **User Support**
   - Create FAQ page
   - Add help documentation
   - Set up support email
   - Consider Discord/Slack community

2. **Technical Support**
   - Monitor Appwrite Discord
   - Check GitHub issues
   - Review error logs
   - Regular code reviews

## Legal Considerations

Before going live:

- [ ] Privacy Policy created
- [ ] Terms of Service written
- [ ] GDPR compliance (if EU users)
- [ ] Data retention policy
- [ ] Cookie consent (if needed)
- [ ] Contact information provided

## Marketing Checklist (Optional)

If promoting your app:

- [ ] Landing page created
- [ ] Demo video recorded
- [ ] Screenshots prepared
- [ ] Social media accounts created
- [ ] Blog post written
- [ ] Submit to Product Hunt
- [ ] Share on Hacker News
- [ ] Post on Reddit (relevant subs)
- [ ] LinkedIn post
- [ ] Tweet about it

## Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Install new dependency
npm install package-name

# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Appwrite Docs**: https://appwrite.io/docs
- **React Production**: https://react.dev/learn/production

---

## Final Checklist

Before announcing launch:

- [ ] Everything tested thoroughly
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Documentation updated
- [ ] Support plan in place
- [ ] Monitoring configured
- [ ] Backup strategy ready
- [ ] Team trained (if applicable)

**You're ready to launch! 🚀**

Good luck with V-yes Code!
