# 🔀 Git-like Collaborative Workflow

## Overview

V-yes Code now implements a **Git-like Fork & Merge workflow** for safe, collaborative coding!

---

## 🔒 **Ownership & Permissions**

### Your Sessions
- ✅ Full edit access
- ✅ Save, download, modify freely
- ✅ Receive merge requests from others

### Others' Sessions  
- 🔒 **READ-ONLY** - You cannot edit
- 👁️ View-only mode
- 🍴 Can **Fork** to create your own copy
- 🔄 Can request to **Merge** changes back

---

## 📖 **How It Works**

### Step 1: View Someone's Code
When you select a code session created by another user:
- 🔒 **Lock icon** appears (Read-Only)
- You can see their code but cannot edit
- **Fork button** is available

### Step 2: Fork Their Code
Click the **"Fork"** button:
- Creates a new session in your name
- Copies all their code to your session
- Now you have full edit access!
- Title shows: `Original Title (Forked from Their Name)`

### Step 3: Make Your Changes
In your forked session:
- Edit the code freely
- Auto-save works normally
- All your changes are in YOUR session
- Original session remains unchanged

### Step 4: Request Merge
When ready to contribute back:
- Click **"Merge Request"** button
- Sends notification to original owner
- Your changes wait for approval

### Step 5: Owner Reviews
Original session owner sees:
- 🔔 **Notification bell** (orange, with count)
- Merge request details
- Who wants to merge
- Timestamp

### Step 6: Accept or Reject
Owner can:
- ✅ **Accept** - Your changes merge into their session
- ❌ **Reject** - No changes applied
- Instant notification to requester

---

## 🎨 **Visual Indicators**

### Code Editor Headers

**When viewing YOUR session:**
```
┌────────────────────────────────────┐
│ My Session                         │
│ javascript • Created by You        │
│ [Save] [Download]                  │
└────────────────────────────────────┘
```

**When viewing OTHERS' session (not forked):**
```
┌────────────────────────────────────┐
│ 🔒 Their Session                   │
│ python • Created by Alice          │
│ • Read Only (Not Your Session)     │
│ [Fork]                             │
└────────────────────────────────────┘
```

**When you've FORKED their session:**
```
┌────────────────────────────────────┐
│ Their Session (Forked from Alice)  │
│ python • Created by You            │
│ [Merge Request] [Save] [Download]  │
└────────────────────────────────────┘
```

**When WATCHING another user:**
```
┌────────────────────────────────────┐
│ 👁️ Their Session                   │
│ java • Created by Bob              │
│ • Watch Mode                       │
└────────────────────────────────────┘
```

---

## 🔔 **Merge Request Notifications**

### Visual Indicator
```
Header: [...] [🔔₃] [Leave/Settings]
           ↑
     Orange bell with count
```

### Notification Panel
Click the bell to see:
```
┌─────────────────────────────────────┐
│ 🔀 Merge Requests                   │
├─────────────────────────────────────┤
│ Alice wants to merge their changes  │
│ into "Python Script"                │
│ Nov 8, 2025 10:30 AM               │
│ [Accept]  [Reject]                  │
├─────────────────────────────────────┤
│ Bob wants to merge their changes... │
│ ...                                 │
└─────────────────────────────────────┘
```

---

## 🔄 **Complete Workflow Example**

### Scenario: Alice (Owner) and Bob (Collaborator)

1. **Alice creates a workspace and code session**
   - Session: "API Integration"
   - Language: JavaScript
   - Code: Initial API setup

2. **Bob joins the workspace**
   - Sees Alice's session in session list
   - Clicks on "API Integration"
   - 🔒 Read-only mode - can view but not edit

3. **Bob wants to add authentication**
   - Clicks **[Fork]** button
   - New session created: "API Integration (Forked from Alice)"
   - Bob adds authentication code
   - Saves his changes

4. **Bob requests to merge**
   - Clicks **[Merge Request]** button
   - Message sent: "Bob wants to merge their changes into 'API Integration'"

5. **Alice receives notification**
   - 🔔 Orange bell appears (count: 1)
   - Clicks bell, sees Bob's request
   - Reviews Bob's forked code (can switch between sessions)

6. **Alice accepts the merge**
   - Clicks **[Accept]**
   - Bob's authentication code merges into Alice's session
   - Both now see the updated code
   - Bob's contribution is live!

---

## 🎯 **Benefits**

### Safety
- ❌ No accidental edits to others' code
- ✅ All changes reviewed before merging
- ✅ Original always protected

### Collaboration
- 👥 Multiple people can fork and work simultaneously
- 🔄 Clean merge workflow
- 💬 Chat while discussing changes

### Learning
- 🎓 Students can fork teacher's examples
- 📚 Mentors review forks before merging
- 🔍 See the evolution of code

---

## 🚀 **Use Cases**

### 1. **Code Review**
- Developer submits code via fork
- Team lead reviews in split-screen
- Accept or request changes via chat
- Merge when approved

### 2. **Pair Programming**
- Driver creates main session
- Navigator forks and experiments
- Merge best solutions together

### 3. **Teaching**
- Instructor shares template
- Students fork and complete exercises
- Instructor reviews all submissions
- Accept exceptional solutions to main template

### 4. **Open Source Style**
- Maintainer owns main code
- Contributors fork and improve
- Pull request-style workflow
- Community collaboration

---

## ⚙️ **Technical Details**

### Fork Creates New Session
```javascript
{
  title: "Original (Forked from Owner)",
  userId: "your-user-id",
  code: "copied from original",
  language: "same as original"
}
```

### Merge Request Object
```javascript
{
  fromUser: "Bob",
  toUserId: "alice-id",
  sessionId: "original-session-id",
  forkedSessionId: "bob-fork-id",
  status: "pending" | "accepted" | "rejected"
}
```

### Real-Time Updates
- Original code syncs to all viewers
- Fork changes only sync to your editor
- Merge acceptance updates original instantly

---

## 🔧 **Future Enhancements**

Planned features:
- [ ] Diff viewer (see exact changes before merge)
- [ ] Merge conflict resolution
- [ ] Comment on specific lines
- [ ] Multiple merge request approval
- [ ] Merge request history
- [ ] Persistent merge requests (via Appwrite database)
- [ ] Email notifications for merge requests

---

## 💡 **Tips**

1. **Fork Early**: Fork before making any changes to others' code
2. **Small Merges**: Keep merge requests focused and small
3. **Test Before Merging**: Run code before requesting merge
4. **Use Chat**: Discuss changes via text chat
5. **Watch First**: Watch others code before forking to understand their approach

---

**Happy Collaborative Coding! 🎉**
