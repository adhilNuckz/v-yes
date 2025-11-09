# Minimal Appwrite Setup - Get Started Quickly!

Your app is running but needs Appwrite collections to be created. Follow these steps:

## Step 1: Go to Appwrite Console

Open your Appwrite Console:
https://sgp.cloud.appwrite.io/console/project-690e91e90003acb7cddc/databases/database-690e93bf003c1b4265ff

## Step 2: Create 3 Collections

Click "Create Collection" and create these **3 collections** with exact IDs:

### Collection 1: workspaces
- Collection ID: `workspaces`
- Click "Create"

**Minimum Required Attributes:**
Click "Create Attribute" for each:
1. `name` - Type: String, Size: 255, Required: ✓
2. `ownerId` - Type: String, Size: 255, Required: ✓
3. `ownerName` - Type: String, Size: 255, Required: ✓
4. `members` - Type: String, Size: 255, Required: ✓, Array: ✓

**Set Permissions:**
- Go to Settings tab → Permissions
- Click "Add Role" → Select "Any" 
- Enable: Read, Create, Update, Delete
- Save

---

### Collection 2: messages
- Collection ID: `messages`
- Click "Create"

**Minimum Required Attributes:**
1. `workspaceId` - Type: String, Size: 255, Required: ✓
2. `userId` - Type: String, Size: 255, Required: ✓
3. `userName` - Type: String, Size: 255, Required: ✓
4. `content` - Type: String, Size: 10000, Required: ✓

**Set Permissions:**
- Settings → Permissions → Add Role → "Any"
- Enable: Read, Create
- Save

---

### Collection 3: code_sessions
- Collection ID: `code_sessions`
- Click "Create"

**Minimum Required Attributes:**
1. `workspaceId` - Type: String, Size: 255, Required: ✓
2. `userId` - Type: String, Size: 255, Required: ✓
3. `userName` - Type: String, Size: 255, Required: ✓
4. `language` - Type: String, Size: 50, Required: ✓
5. `title` - Type: String, Size: 255, Required: ✓
6. `code` - Type: String, Size: 100000, Required: ✓

**Set Permissions:**
- Settings → Permissions → Add Role → "Any"
- Enable: Read, Create, Update, Delete
- Save

---

## Step 3: Enable Email Authentication

1. Go to your project's **Auth** section
2. Click **Settings** tab
3. Scroll to "Auth Methods"
4. Enable **Email/Password**
5. Save

---

## Step 4: Refresh Your App

After creating all 3 collections:
1. Go back to your app: http://localhost:5174
2. Refresh the page (F5)
3. You should see the login page without errors!

---

## Quick Test

1. **Sign Up**: Create a new account
2. **Create Workspace**: Click "Create Workspace"
3. **Success!** If you can create a workspace, everything is working!

---

## Optional: Add More Attributes Later

For full features, you can add these optional attributes later:

**workspaces collection:**
- `description` - String, Size: 1000
- `memberNames` - String, Size: 65535 (for JSON)
- `settings` - String, Size: 65535 (for JSON)
- `createdAt` - DateTime

**messages collection:**
- `type` - String, Size: 50, Default: "text"
- `timestamp` - DateTime

**code_sessions collection:**
- `cursorPositions` - String, Size: 65535 (for JSON)
- `selections` - String, Size: 65535 (for JSON)
- `createdAt` - DateTime
- `lastModified` - DateTime

But the app will work fine without these!

---

## Still Having Issues?

Check:
1. ✓ Collection IDs are EXACTLY: `workspaces`, `messages`, `code_sessions`
2. ✓ Permissions are set to "Any" with proper access
3. ✓ Auth is enabled in Auth section
4. ✓ Browser console shows no red errors

Need help? The error messages in browser console will tell you what's missing!
