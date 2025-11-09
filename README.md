# V-yes Code - Real-time Collaborative Coding Platform

A powerful real-time collaborative coding platform built with React and Appwrite. Multiple developers can work together, share code sessions, communicate via text and voice chat, and see each other's cursor positions and selections in real-time.

## 🚀 Features

### ✨ Core Features
- **User Authentication**
  - Email/Password authentication
  - GitHub OAuth integration
  - Secure session management

- **Workspace Management**
  - Create unlimited workspaces
  - Share workspace via ID or link
  - Real-time member presence
  - Owner controls and permissions

- **Real-time Code Collaboration**
  - Multiple IDE instances per workspace
  - Support for 9+ programming languages (JavaScript, TypeScript, Python, Java, C++, Go, Rust, HTML, CSS)
  - Real-time cursor position tracking
  - Live code selection visibility
  - Auto-save functionality
  - Syntax highlighting with Monaco Editor

- **Communication**
  - **Text Chat**: Real-time messaging within workspace
  - **Voice Chat**: WebRTC-based voice communication
    - Owner can mute/unmute participants
    - Individual mute controls
    - Enable/disable voice chat for entire workspace

- **User Experience**
  - Beautiful gradient UI with Tailwind CSS
  - Responsive design
  - Toast notifications
  - Dark mode editor

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Appwrite (BaaS)
- **Code Editor**: Monaco Editor (VS Code editor)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Real-time**: Appwrite Realtime
- **Voice Chat**: WebRTC (SimplePeer ready)
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- An Appwrite instance (Cloud or Self-hosted)

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Appwrite Setup

#### A. Create an Appwrite Project

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Create a new project named "V-yes-code"
3. Note down your Project ID

#### B. Configure Platform

1. Go to your project settings
2. Add a new Web platform
3. Add your hostname (e.g., `http://localhost:5173` for development)

#### C. Enable Authentication

1. Go to Auth section
2. Enable Email/Password authentication
3. (Optional) Enable GitHub OAuth:
   - Create a GitHub OAuth App
   - Add Client ID and Secret to Appwrite

#### D. Create Database and Collections

Create a database named "v-yes-code" and create these collections:

**1. Workspaces Collection**
```
Collection ID: workspaces
Attributes:
- name (string, required)
- description (string)
- ownerId (string, required)
- ownerName (string, required)
- members (string[], required)
- memberNames (json, required)
- createdAt (datetime, required)
- settings (json, required)

Permissions:
- Read: users
- Create: users
- Update: users
- Delete: users
```

**2. Messages Collection**
```
Collection ID: messages
Attributes:
- workspaceId (string, required)
- userId (string, required)
- userName (string, required)
- content (string, required)
- type (string, required, default: "text")
- timestamp (datetime, required)

Permissions:
- Read: users
- Create: users
```

**3. Code Sessions Collection**
```
Collection ID: code_sessions
Attributes:
- workspaceId (string, required)
- userId (string, required)
- userName (string, required)
- language (string, required)
- title (string, required)
- code (string, required, size: 1000000)
- cursorPositions (json)
- selections (json)
- createdAt (datetime, required)
- lastModified (datetime, required)

Permissions:
- Read: users
- Create: users
- Update: users
- Delete: users
```

### 3. Environment Configuration

1. Copy `.env.example` to `.env`
2. Update `.env` with your Appwrite credentials:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_PROJECT_NAME=V-yes-code
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_WORKSPACES_COLLECTION_ID=workspaces
VITE_APPWRITE_MESSAGES_COLLECTION_ID=messages
VITE_APPWRITE_CODE_SESSIONS_COLLECTION_ID=code_sessions
```

### 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📖 Usage Guide

### Getting Started

1. **Sign Up / Login**
   - Create an account or login with GitHub
   - You'll be redirected to the workspaces dashboard

2. **Create a Workspace**
   - Click "Create Workspace"
   - Enter name and description
   - Share the workspace ID with team members

3. **Join a Workspace**
   - Click "Join Workspace"
   - Enter the workspace ID
   - Start collaborating!

### Working in a Workspace

#### Creating Code Sessions
1. Click the "+" button in the Sessions panel
2. Select programming language
3. Give it a title (optional)
4. Start coding!

#### Real-time Collaboration
- All code changes are synchronized in real-time
- See other users' cursor positions
- View code selections from team members
- Auto-save keeps your work safe

#### Communication
- **Text Chat**: Send messages in the right panel
- **Voice Chat**: 
  - Click the mic icon to enable voice chat
  - Click "Connect" to join voice channel
  - Mute/unmute your microphone
  - Owner can control participant audio

## 🎨 Project Structure

```
src/
├── components/          # React components
│   ├── CodeEditor.jsx   # Monaco editor with real-time features
│   ├── ChatPanel.jsx    # Text chat interface
│   ├── VoiceChatPanel.jsx # Voice chat controls
│   ├── SessionsList.jsx # Code sessions sidebar
│   ├── MembersList.jsx  # Active members list
│   └── ProtectedRoute.jsx # Auth guard
├── pages/              # Page components
│   ├── Login.jsx       # Authentication page
│   ├── Workspaces.jsx  # Workspaces dashboard
│   └── Workspace.jsx   # Main workspace view
├── services/           # Appwrite service layers
│   ├── authService.js  # Authentication
│   ├── workspaceService.js # Workspace operations
│   ├── chatService.js  # Chat operations
│   └── codeSessionService.js # Code session operations
├── store/             # Zustand state management
│   ├── authStore.js
│   ├── workspaceStore.js
│   ├── chatStore.js
│   └── codeSessionStore.js
└── lib/
    └── appwriteConfig.js # Appwrite client configuration
```

## 🔐 Security Notes

- All data is stored securely in Appwrite
- Real-time subscriptions are authenticated
- Workspace owners have special permissions
- Voice chat uses WebRTC for peer-to-peer connections

## 🚧 Future Enhancements

- File upload/download
- Code execution environment
- Screen sharing
- Video chat
- Whiteboard integration
- Version history
- AI code suggestions

## 📝 License

MIT License

## 🆘 Troubleshooting

### Common Issues

**Issue: "Appwrite connection failed"**
- Check your `.env` file has correct credentials
- Verify your Appwrite project is active
- Check if platform hostname is added in Appwrite Console

**Issue: "Real-time not working"**
- Ensure collections have proper permissions
- Check browser console for WebSocket errors
- Verify Appwrite Realtime is enabled

**Issue: "Voice chat not connecting"**
- Check microphone permissions in browser
- Verify WebRTC is supported
- Check firewall settings

## 📞 Support

For Appwrite-specific questions:
- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord](https://appwrite.io/discord)

---

Built with ❤️ for collaborative coding

**Happy Coding! 🚀**