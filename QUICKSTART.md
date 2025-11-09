# Quick Start Guide - V-yes Code

Get up and running with V-yes Code in 5 minutes!

## 🎯 Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Appwrite Cloud account (or self-hosted instance)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## ⚡ Quick Setup (5 Steps)

### Step 1: Install Dependencies (30 seconds)

```bash
npm install
```

### Step 2: Create Appwrite Project (2 minutes)

1. Go to https://cloud.appwrite.io
2. Click "Create Project" → Name it "V-yes-code"
3. Add Web Platform → Hostname: `localhost`
4. Copy your **Project ID**

### Step 3: Setup Database (2 minutes)

In Appwrite Console:

1. **Create Database** → Name: `v-yes-code` → Copy Database ID
2. **Create 3 Collections** with these exact IDs:
   - `workspaces`
   - `messages`  
   - `code_sessions`

For each collection:
- Go to Settings → Permissions
- Add Role: **"Users"**
- Enable: **All permissions** (Read, Create, Update, Delete)

**Important Attributes** (add these for each collection):

**workspaces:**
```
name (string, required)
ownerId (string, required)
ownerName (string, required)
members (string[], required)
memberNames (json as string, required)
settings (json as string, required)
createdAt (datetime, required)
description (string, optional)
```

**messages:**
```
workspaceId (string, required)
userId (string, required)
userName (string, required)
content (string, required)
timestamp (datetime, required)
type (string, required, default: "text")
```

**code_sessions:**
```
workspaceId (string, required)
userId (string, required)
userName (string, required)
language (string, required)
title (string, required)
code (string 1000000 chars, required)
createdAt (datetime, required)
lastModified (datetime, required)
cursorPositions (json as string, optional)
selections (json as string, optional)
```

### Step 4: Configure Environment (30 seconds)

1. Copy `.env.example` to `.env`
2. Update with your values:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=<your-project-id>
VITE_APPWRITE_PROJECT_NAME=V-yes-code
VITE_APPWRITE_DATABASE_ID=<your-database-id>
VITE_APPWRITE_WORKSPACES_COLLECTION_ID=workspaces
VITE_APPWRITE_MESSAGES_COLLECTION_ID=messages
VITE_APPWRITE_CODE_SESSIONS_COLLECTION_ID=code_sessions
```

### Step 5: Run the App (10 seconds)

```bash
npm run dev
```

Open http://localhost:5173 🎉

## 🚀 First Use

1. **Create Account**: Sign up with email or GitHub
2. **Create Workspace**: Click "Create Workspace" button
3. **Share ID**: Copy workspace ID to share with team
4. **Create Code Session**: Click "+" in Sessions panel
5. **Start Coding**: Write code, chat, and collaborate!

## ✅ Verify Setup

If everything works, you should be able to:
- ✓ Create an account
- ✓ See the workspaces dashboard
- ✓ Create a new workspace
- ✓ Create code sessions
- ✓ Send chat messages
- ✓ See real-time updates

## 🐛 Common Issues

**"Can't connect to Appwrite"**
→ Check Project ID in `.env`

**"Collection not found"**
→ Verify collection IDs are exactly: `workspaces`, `messages`, `code_sessions`

**"Unauthorized"**
→ Check collection permissions (Users role needs all permissions)

**Real-time not working**
→ Refresh page, check browser console for errors

## 📚 Next Steps

- Read full [README.md](./README.md) for detailed features
- Check [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) for detailed Appwrite configuration
- Explore the codebase in `src/` folder
- Customize and add your own features!

## 🎓 Learning Resources

- **Project Structure**: Check `src/` folder organization
- **Appwrite Docs**: https://appwrite.io/docs
- **React Docs**: https://react.dev
- **Monaco Editor**: https://microsoft.github.io/monaco-editor/

## 💡 Tips

- Open multiple browser windows to test real-time collaboration
- Use browser DevTools to debug real-time events
- Check Appwrite Console Logs section for backend issues
- Join Appwrite Discord for community support

---

**Ready to code together! 🚀**

Need detailed setup? → [APPWRITE_SETUP.md](./APPWRITE_SETUP.md)
