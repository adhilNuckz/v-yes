# 👀 Split-Screen Watch Mode

## Feature Overview

V-yes Code now supports **split-screen collaboration** where you can watch other developers code in real-time!

## How It Works

### 1. **Your Editor (Left Side)**
- Your own code editor where you can write and edit code
- Auto-saves your changes
- Full editing capabilities
- Shows as "Your Code - [Your Name]"

### 2. **Watch Mode (Right Side)**
- Click the **👁️ Eye icon** next to any member in the Members list
- Their code editor appears on the right side of your screen
- You can see their code updates in real-time
- **Read-only mode** - you can't edit their code
- Shows as "Watching: [Their Name]"

## How to Use

### Step 1: Join a Workspace
```
Go to: http://localhost:5173/workspace/{workspace-id}
```

### Step 2: Select a Member to Watch
1. Look at the **Members** panel on the right sidebar
2. Find the member you want to watch
3. Click the **👁️ Eye icon** next to their name
4. Their code session will appear on the right half of your screen

### Step 3: Watch in Real-Time
- See their code changes as they type
- Watch their cursor movements (if implemented)
- See which file/session they're working on
- All updates happen in real-time via Appwrite

### Step 4: Stop Watching
- Click the **"Stop Watching"** button at the top of their editor
- Or click the **👁️ Eye icon** again to toggle off
- The split-screen will close and your editor expands to full width

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Workspace Name, Share Button, Controls            │
├──────────┬──────────────────────────────┬───────────────────┤
│          │ YOUR CODE (Left Side)        │ WATCHED CODE      │
│ Sessions │ ┌─────────────────────────┐  │ (Right Side)      │
│ List     │ │ Your Editor             │  │ ┌───────────────┐ │
│          │ │ - Full editing          │  │ │ Their Editor  │ │
│ • JS     │ │ - Auto-save             │  │ │ - Read-only   │ │
│ • Python │ │ - Download              │  │ │ - Real-time   │ │
│ • Java   │ │                         │  │ │               │ │
│          │ └─────────────────────────┘  │ └───────────────┘ │
│          │                              │                   │
├──────────┴──────────────────────────────┴───────────────────┤
│ Right Sidebar:                                              │
│ • Members List (👁️ click to watch)                         │
│ • Voice Chat Panel                                          │
│ • Text Chat                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Use Cases

### 1. **Code Review**
- Watch a teammate's code session
- See their thought process
- Discuss via text/voice chat while watching

### 2. **Pair Programming**
- One person codes, others watch
- Collaborate on problem-solving
- Switch who's coding by creating new sessions

### 3. **Learning/Mentoring**
- Mentors can watch students code
- Students can watch experienced developers
- Real-time code explanations via chat

### 4. **Live Coding Demos**
- Present your code to team members
- Everyone watches the same session
- Interactive Q&A via chat

## Technical Details

### Real-Time Updates
- Uses Appwrite Realtime subscriptions
- Updates propagate instantly (<100ms)
- Code changes sync automatically
- Session changes reflect immediately

### Session Detection
- Automatically finds the watched user's active session
- Updates when they switch sessions
- Shows "hasn't started coding yet" if no session exists
- Waits for them to create a session

### Read-Only Protection
- Watched editor is completely read-only
- No accidental edits to their code
- Can't save or download from watch mode
- Your own editor remains fully editable

## Member List Features

### Visual Indicators
- **Green highlight**: Member you're currently watching
- **Green ring**: Active watch status
- **Purple "(You)"**: Your own entry (can't watch yourself)
- **👑 Crown icon**: Workspace owner
- **Green dot**: Online status

### Watch Button
- **👁️ Eye icon**: Click to watch/unwatch
- **Green background**: Currently watching this member
- **Gray background**: Not watching
- **Hidden**: On your own entry (can't watch yourself)

## Tips

1. **Watch Multiple Users**: Currently supports watching one user at a time (future: multi-watch)
2. **Session Switching**: If watched user switches sessions, view updates automatically
3. **Full Screen**: Toggle off chat/members panels for more code space
4. **Performance**: Watching doesn't affect your own editor performance

## Future Enhancements

- [ ] Watch multiple users (quad-split screen)
- [ ] See their cursor position in real-time
- [ ] See their text selections
- [ ] Follow mode (auto-scroll to their view)
- [ ] Replay mode (watch recording of past session)
- [ ] Audio reactions while watching
- [ ] Collaborative annotations

## Troubleshooting

**Q: Watch button does nothing?**
- Make sure the member has created a code session
- Check if they're in the same workspace
- Refresh the page if real-time updates stop

**Q: Code not updating?**
- Check your internet connection
- Verify Appwrite real-time is working
- Look for console errors

**Q: Can't see their session?**
- They might not have created one yet
- Wait for them to start coding
- Message them in chat to create a session

---

**Happy Collaborative Coding! 🚀**
