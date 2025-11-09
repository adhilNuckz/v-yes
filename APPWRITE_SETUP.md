# V-yes Code - Appwrite Setup Guide

This guide will walk you through setting up Appwrite for the V-yes Code project.

## Step 1: Create Appwrite Project

1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io) or your self-hosted instance
2. Click "Create Project"
3. Name it "V-yes-code"
4. Copy the Project ID - you'll need this for your `.env` file

## Step 2: Configure Web Platform

1. In your project, go to "Settings" → "Platforms"
2. Click "Add Platform" → "Web App"
3. Configure:
   - **Name**: V-yes Code Web
   - **Hostname**: `localhost` (for development)
   - Click "Next" and "Register"

For production, add your production domain as another platform.

## Step 3: Enable Authentication

### Email/Password Authentication
1. Go to "Auth" section
2. Click on "Settings" tab
3. Enable "Email/Password" under "Auth Methods"
4. Save changes

### GitHub OAuth (Optional but Recommended)
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: V-yes Code
   - **Homepage URL**: `http://localhost:5173` (dev) or your production URL
   - **Authorization callback URL**: Get this from Appwrite console (Auth → Settings → GitHub OAuth)
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**
6. Go back to Appwrite Console → Auth → Settings
7. Enable GitHub OAuth
8. Paste your Client ID and Client Secret
9. Save changes

## Step 4: Create Database

1. Go to "Databases" section
2. Click "Create Database"
3. Name it: `v-yes-code`
4. Copy the Database ID for your `.env` file

## Step 5: Create Collections

### Collection 1: Workspaces

1. In your database, click "Create Collection"
2. **Collection ID**: `workspaces`
3. **Collection Name**: Workspaces
4. Click "Create"

**Add Attributes:**
Click "Create Attribute" for each:

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| name | String | 255 | ✓ | ✗ | - |
| description | String | 1000 | ✗ | ✗ | - |
| ownerId | String | 255 | ✓ | ✗ | - |
| ownerName | String | 255 | ✓ | ✗ | - |
| members | String | 255 | ✓ | ✓ | - |
| memberNames | String | 65535 | ✓ | ✗ | {} |
| createdAt | DateTime | - | ✓ | ✗ | - |
| settings | String | 65535 | ✓ | ✗ | {} |

**Note**: For `memberNames` and `settings`, use String type as JSON storage.

**Set Permissions:**
1. Go to "Settings" tab of the collection
2. Under "Permissions":
   - Click "Add Role"
   - Select "Users" (all authenticated users)
   - Enable: Read, Create, Update, Delete
   - Save

### Collection 2: Messages

1. Create new collection
2. **Collection ID**: `messages`
3. **Collection Name**: Messages

**Add Attributes:**

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| workspaceId | String | 255 | ✓ | ✗ | - |
| userId | String | 255 | ✓ | ✗ | - |
| userName | String | 255 | ✓ | ✗ | - |
| content | String | 10000 | ✓ | ✗ | - |
| type | String | 50 | ✓ | ✗ | text |
| timestamp | DateTime | - | ✓ | ✗ | - |

**Set Permissions:**
- Role: Users (all authenticated users)
- Enable: Read, Create
- Save

### Collection 3: Code Sessions

1. Create new collection
2. **Collection ID**: `code_sessions`
3. **Collection Name**: Code Sessions

**Add Attributes:**

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| workspaceId | String | 255 | ✓ | ✗ | - |
| userId | String | 255 | ✓ | ✗ | - |
| userName | String | 255 | ✓ | ✗ | - |
| language | String | 50 | ✓ | ✗ | - |
| title | String | 255 | ✓ | ✗ | - |
| code | String | 1000000 | ✓ | ✗ | - |
| cursorPositions | String | 65535 | ✗ | ✗ | {} |
| selections | String | 65535 | ✗ | ✗ | {} |
| createdAt | DateTime | - | ✓ | ✗ | - |
| lastModified | DateTime | - | ✓ | ✗ | - |

**Note**: For large code storage, you may need to adjust the `code` attribute size or use Appwrite Storage for very large files.

**Set Permissions:**
- Role: Users (all authenticated users)
- Enable: Read, Create, Update, Delete
- Save

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env` in your project root
2. Fill in the values:

```env
# Get from Appwrite Console → Settings → Project ID
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here

VITE_APPWRITE_PROJECT_NAME=V-yes-code

# Get from Databases section
VITE_APPWRITE_DATABASE_ID=your-database-id-here

# These should match your collection IDs
VITE_APPWRITE_WORKSPACES_COLLECTION_ID=workspaces
VITE_APPWRITE_MESSAGES_COLLECTION_ID=messages
VITE_APPWRITE_CODE_SESSIONS_COLLECTION_ID=code_sessions
```

## Step 7: Test Connection

1. Start your dev server:
```bash
npm run dev
```

2. Open `http://localhost:5173`
3. Try creating an account
4. If successful, you should be able to:
   - Create a workspace
   - Create code sessions
   - Send messages
   - See real-time updates

## Common Issues and Solutions

### Issue: "Invalid API Key"
**Solution**: Double-check your Project ID in `.env`

### Issue: "Collection not found"
**Solution**: Verify collection IDs match exactly in `.env`

### Issue: "Unauthorized"
**Solution**: Check collection permissions - ensure "Users" role has required permissions

### Issue: "Document size exceeds maximum"
**Solution**: For the `code` attribute, you may need to increase size or use Storage API for very large files

### Issue: "Real-time not working"
**Solution**: 
- Verify WebSocket is not blocked by firewall
- Check browser console for errors
- Ensure collections have read permissions

## Production Deployment

When deploying to production:

1. **Add Production Platform**:
   - Go to Settings → Platforms
   - Add your production domain
   - Update CORS settings if needed

2. **Update Environment Variables**:
   - Use production Appwrite endpoint if self-hosted
   - Keep Project ID and other IDs the same

3. **Security Checklist**:
   - ✓ GitHub OAuth configured with production URLs
   - ✓ Platform added for production domain
   - ✓ Environment variables secured (never commit `.env`)
   - ✓ Collection permissions reviewed
   - ✓ Rate limiting configured (if needed)

## Need Help?

- **Appwrite Docs**: https://appwrite.io/docs
- **Appwrite Discord**: https://appwrite.io/discord
- **GitHub Issues**: Create an issue in the project repository

## Next Steps

After completing setup:
1. Read the main [README.md](./README.md) for usage guide
2. Explore the codebase structure
3. Customize features for your needs
4. Deploy to production!

---

Happy Building! 🚀
