# Deployment Instructions for Appwrite

## The Issue You're Seeing

The CORS errors (`ERR_BLOCKED_BY_CLIENT`) are actually caused by browser extensions (ad blockers, privacy extensions) blocking external font resources. This is **NOT** a deployment issue with your app.

However, here's how to properly deploy and avoid any potential issues:

## Environment Variables Setup in Appwrite Console

**CRITICAL**: You MUST add these environment variables in your Appwrite Console:

1. Go to your Appwrite Project → **Settings** → **Environment Variables**
2. Add the following variables:

```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=<your-project-id>
VITE_APPWRITE_DATABASE_ID=<your-database-id>
VITE_APPWRITE_WORKSPACES_COLLECTION_ID=<your-workspaces-collection-id>
VITE_APPWRITE_MESSAGES_COLLECTION_ID=<your-messages-collection-id>
VITE_APPWRITE_CODE_SESSIONS_COLLECTION_ID=<your-code-sessions-collection-id>
```

## Deployment Settings

In your Appwrite Hosting settings, configure:

- **Root Directory**: `.` (or leave empty)
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Fix for CORS Font Issues

The font CORS errors are from browser extensions. To verify your app works:

1. **Disable browser extensions** temporarily
2. **Open in incognito/private mode**
3. **Try a different browser**

The fonts will load from Google Fonts (not Appwrite CDN), so this shouldn't be an actual issue for real users.

## Platform-Specific Headers

If you're using Appwrite Functions with custom domains, ensure:

1. **Custom Domain** is properly configured in Appwrite Console
2. **SSL Certificate** is issued and active
3. **Platform** is set to Web in your Appwrite Project settings

## Testing Locally

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
npm run preview
```

## After Deployment

1. Check your deployed URL: `https://<your-project-id>.sgp.appwrite.run`
2. Verify environment variables are loaded (check Network tab in DevTools)
3. Test in incognito mode to verify font loading

## Common Issues

### Issue: Fonts not loading
**Solution**: This is caused by browser extensions. Disable ad blockers or test in incognito mode.

### Issue: "Network Error" or API calls failing
**Solution**: Check your environment variables in Appwrite Console. They must be set there, not in `.env` file.

### Issue: White screen after deployment
**Solution**: Check browser console for actual errors. Usually means environment variables are missing.

## Platform Headers Configuration

The `public/_headers` file I created will handle caching and CORS for static assets. Make sure this file is included in your deployment.

## Need Help?

Check Appwrite deployment logs in the Console → Functions/Hosting → Deployments tab.
