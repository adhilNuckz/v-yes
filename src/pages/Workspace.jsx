import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useCodeSessionStore } from '../store/codeSessionStore';
import { useChatStore } from '../store/chatStore';
import CodeEditor from '../components/CodeEditor';
import ChatPanel from '../components/ChatPanel';
import VoiceChatPanel from '../components/VoiceChatPanel';
import SessionsList from '../components/SessionsList';
import MembersList from '../components/MembersList';
import ThemeToggle from '../components/ThemeToggle';
import { 
  Code2, 
  MessageSquare, 
  Mic, 
  Users, 
  Copy, 
  Check,
  ArrowLeft,
  Settings,
  LogOut,
  Bell,
  GitPullRequest
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Workspace() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentWorkspace, 
    getWorkspace, 
    joinWorkspace,
    leaveWorkspace,
    deleteWorkspace, 
    subscribeToWorkspace,
    unsubscribeFromWorkspace 
  } = useWorkspaceStore();
  const { 
    sessions, 
    currentSession,
    createCodeSession,
    getWorkspaceCodeSessions 
  } = useCodeSessionStore();
  const { getMessages, subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  const [showChat, setShowChat] = useState(true);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const [showSessions, setShowSessions] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedMemberToWatch, setSelectedMemberToWatch] = useState(null);
  const [watchedSession, setWatchedSession] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [forkedSession, setForkedSession] = useState(null);
  const [originalSession, setOriginalSession] = useState(null);
  const [mergeRequests, setMergeRequests] = useState([]);
  const [showMergeRequests, setShowMergeRequests] = useState(false);

  useEffect(() => {
    if (workspaceId && user) {
      initializeWorkspace();
    }

    return () => {
      unsubscribeFromWorkspace();
      unsubscribeFromMessages();
    };
  }, [workspaceId, user]);

  const initializeWorkspace = async () => {
    try {
      // Get workspace details
      const workspace = await getWorkspace(workspaceId);
      
      // Join workspace if not already a member
      if (!workspace.members.includes(user.$id)) {
        await joinWorkspace(workspaceId, user.$id, user.name);
        toast.success('Joined workspace!');
      }

      // Subscribe to real-time updates
      subscribeToWorkspace(workspaceId);
      subscribeToMessages(workspaceId);

      // Get code sessions and messages
      await getWorkspaceCodeSessions(workspaceId);
      await getMessages(workspaceId);
    } catch (error) {
      console.error('Error initializing workspace:', error);
      toast.error('Failed to load workspace');
      navigate('/workspaces');
    }
  };

  const copyWorkspaceId = () => {
    navigator.clipboard.writeText(workspaceId);
    setCopied(true);
    toast.success('Workspace ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWatchMember = async (memberId, memberName) => {
    if (selectedMemberToWatch?.id === memberId) {
      // Stop watching
      setSelectedMemberToWatch(null);
      setWatchedSession(null);
      toast.success('Stopped watching');
    } else {
      // Start watching
      setSelectedMemberToWatch({ id: memberId, name: memberName });
      toast.success(`Now watching ${memberName}'s code`);
      
      // Find their active session
      const memberSession = sessions.find(s => s.userId === memberId);
      if (memberSession) {
        setWatchedSession(memberSession);
      } else {
        setWatchedSession(null);
      }
    }
  };

  const handleLeaveWorkspace = async () => {
    if (isOwner) {
      toast.error("Workspace owner cannot leave. Delete the workspace instead.");
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to leave this workspace? You can rejoin later with the workspace ID.'
    );

    if (confirmed) {
      try {
        await leaveWorkspace(workspaceId, user.$id);
        toast.success('Left workspace successfully');
        navigate('/workspaces');
      } catch (error) {
        console.error('Error leaving workspace:', error);
        toast.error('Failed to leave workspace');
      }
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!isOwner) {
      toast.error("Only the workspace owner can delete this workspace.");
      return;
    }

    const confirmed = window.confirm(
      '⚠️ WARNING: Are you sure you want to DELETE this workspace?\n\n' +
      'This will:\n' +
      '• Remove all members\n' +
      '• Delete all code sessions\n' +
      '• Delete all chat messages\n' +
      '• Cannot be undone!\n\n' +
      'Type the workspace name to confirm deletion.'
    );

    if (confirmed) {
      const workspaceName = prompt(`Type "${currentWorkspace.name}" to confirm deletion:`);
      
      if (workspaceName === currentWorkspace.name) {
        try {
          await deleteWorkspace(workspaceId);
          toast.success('Workspace deleted successfully');
          navigate('/workspaces');
        } catch (error) {
          console.error('Error deleting workspace:', error);
          toast.error('Failed to delete workspace');
        }
      } else if (workspaceName !== null) {
        toast.error('Workspace name did not match. Deletion cancelled.');
      }
    }
  };

  const handleForkSession = async () => {
    if (!currentSession) return;
    
    try {
      // Create a new session with the forked code
      const forkedSessionData = await createCodeSession({
        workspaceId,
        userId: user.$id,
        userName: user.name,
        language: currentSession.language,
        title: `${currentSession.title} (Forked from ${currentSession.userName})`,
        code: currentSession.code
      });
      
      setForkedSession(forkedSessionData);
      setOriginalSession(currentSession);
      toast.success(`Forked "${currentSession.title}"! You can now edit your copy.`);
    } catch (error) {
      console.error('Error forking session:', error);
      toast.error('Failed to fork session');
    }
  };

  const handleMergeRequest = async () => {
    if (!forkedSession || !originalSession) return;
    
    // Create a merge request notification
    const mergeRequest = {
      id: Date.now().toString(),
      fromUser: user.name,
      fromUserId: user.$id,
      toUserId: originalSession.userId,
      sessionId: originalSession.$id,
      forkedSessionId: forkedSession.$id,
      message: `${user.name} wants to merge their changes into "${originalSession.title}"`,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    setMergeRequests(prev => [...prev, mergeRequest]);
    toast.success('Merge request sent!');
    
    // TODO: Send this via Appwrite database to persist notifications
    // For now, it's just in local state
  };

  const handleAcceptMerge = async (mergeRequest) => {
    try {
      // Get the forked session code
      const forkedSess = sessions.find(s => s.$id === mergeRequest.forkedSessionId);
      if (!forkedSess) {
        toast.error('Forked session not found');
        return;
      }
      
      // Update original session with forked code
      const { updateCode } = useCodeSessionStore.getState();
      await updateCode(mergeRequest.sessionId, forkedSess.code);
      
      // Update merge request status
      setMergeRequests(prev => 
        prev.map(mr => mr.id === mergeRequest.id ? { ...mr, status: 'accepted' } : mr)
      );
      
      toast.success(`Merged changes from ${mergeRequest.fromUser}!`);
    } catch (error) {
      console.error('Error accepting merge:', error);
      toast.error('Failed to merge changes');
    }
  };

  const handleRejectMerge = (mergeRequest) => {
    setMergeRequests(prev => 
      prev.map(mr => mr.id === mergeRequest.id ? { ...mr, status: 'rejected' } : mr)
    );
    toast.success('Merge request rejected');
  };

  // Update watched session when sessions change
  useEffect(() => {
    if (selectedMemberToWatch) {
      const memberSession = sessions.find(s => s.userId === selectedMemberToWatch.id);
      setWatchedSession(memberSession || null);
    }
  }, [sessions, selectedMemberToWatch]);

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSettingsMenu && !event.target.closest('.settings-menu-container')) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettingsMenu]);

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 spinner border-[#FF9D00]" style={{borderTopColor: '#FF9D00'}}></div>
      </div>
    );
  }

  const isOwner = currentWorkspace.ownerId === user.$id;

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="glass-strong border-b border-[#FF9D00]/20 px-4 py-3 flex items-center justify-between backdrop-blur-xl relative z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/workspaces')}
            className="p-2 glass hover:border-[#FF9D00] border border-[#FF9D00]/20 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[#FF9D00]" />
          </button>
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-[#FF9D00] glow-orange animate-pulse" />
            <div>
              <h1 className="text-lg font-bold text-gradient-orange">{currentWorkspace.name}</h1>
              <p className="text-xs text-gray-400">
                {currentWorkspace.members?.length || 0} members online
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <button
            onClick={copyWorkspaceId}
            className="flex items-center gap-2 px-3 py-2 glass border border-[#FF9D00]/30 hover:border-[#FF9D00] rounded-lg transition-all text-sm text-gray-300 hover:text-[#FF9D00]"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share'}
          </button>

          <button
            onClick={() => setShowMembers(!showMembers)}
            className={`p-2 rounded-lg transition-all ${
              showMembers ? 'bg-gradient-to-r from-[#FF9D00] to-[#FFB733] text-black glow-orange' : 'glass border border-[#FF9D00]/30 hover:border-[#FF9D00] text-gray-300'
            }`}
          >
            <Users className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowVoiceChat(!showVoiceChat)}
            className={`p-2 rounded-lg transition-all ${
              showVoiceChat ? 'bg-gradient-to-r from-[#FF9D00] to-[#FFB733] text-black glow-orange' : 'glass border border-[#FF9D00]/30 hover:border-[#FF9D00] text-gray-300'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg transition-all ${
              showChat ? 'bg-gradient-to-r from-[#FF9D00] to-[#FFB733] text-black glow-orange' : 'glass border border-[#FF9D00]/30 hover:border-[#FF9D00] text-gray-300'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Merge Requests Notification */}
          {mergeRequests.filter(mr => mr.toUserId === user.$id && mr.status === 'pending').length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowMergeRequests(!showMergeRequests)}
                className="relative p-2 bg-gradient-to-r from-[#FF9D00] to-[#FFB733] text-black rounded-lg transition-all glow-orange hover-glow"
                title="Merge requests"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-xs flex items-center justify-center text-white font-bold animate-pulse">
                  {mergeRequests.filter(mr => mr.toUserId === user.$id && mr.status === 'pending').length}
                </span>
              </button>

              {showMergeRequests && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto glass-strong border border-[#FF9D00]/30 rounded-lg shadow-xl z-[9999] animate-slideInUp">
                  <div className="p-3 border-b border-[#FF9D00]/20">
                    <h3 className="font-bold flex items-center gap-2 text-[#FF9D00]">
                      <GitPullRequest className="w-4 h-4" />
                      Merge Requests
                    </h3>
                  </div>
                  <div className="divide-y divide-[#FF9D00]/10">
                    {mergeRequests
                      .filter(mr => mr.toUserId === user.$id && mr.status === 'pending')
                      .map(mr => (
                        <div key={mr.id} className="p-3 hover:bg-white/5 transition-colors">
                          <p className="text-sm mb-2 text-white">{mr.message}</p>
                          <p className="text-xs text-gray-400 mb-3">
                            {new Date(mr.timestamp).toLocaleString()}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                handleAcceptMerge(mr);
                                setShowMergeRequests(false);
                              }}
                              className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors font-medium"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                handleRejectMerge(mr);
                                setShowMergeRequests(false);
                              }}
                              className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isOwner ? (
            <button
              onClick={handleLeaveWorkspace}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
              title="Leave this workspace"
            >
              <LogOut className="w-4 h-4" />
              Leave
            </button>
          ) : (
            <div className="relative settings-menu-container">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 glass border border-[#FF9D00]/30 hover:border-[#FF9D00] rounded-lg transition-all text-gray-300 hover:text-[#FF9D00]"
                title="Workspace settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-56 glass-strong border border-[#FF9D00]/30 rounded-lg shadow-xl z-[9999] animate-slideInUp">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        handleDeleteWorkspace();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-600/80 transition-colors flex items-center gap-2 text-red-400 hover:text-white rounded font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Delete Workspace
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Sessions */}
        {showSessions && (
          <div className="w-64 glass border-r border-[#FF9D00]/20 flex flex-col">
            <SessionsList workspaceId={workspaceId} />
          </div>
        )}

        {/* Center - Split Screen Editors */}
        <div className="flex-1 flex">
          {/* Left Editor - Current User's Code */}
          <div className={`flex flex-col border-r border-[#FF9D00]/20 ${selectedMemberToWatch ? 'w-1/2' : 'w-full'}`}>
            <div className="glass px-4 py-2 border-b border-[#FF9D00]/20 flex items-center justify-between">
              <span className="text-sm font-bold text-[#FF9D00]">
                Your Code - {user.name}
              </span>
              {currentSession && (
                <span className="text-xs text-gray-400">
                  {currentSession.language} • {currentSession.title}
                </span>
              )}
            </div>
            {currentSession ? (
              <CodeEditor 
                session={forkedSession || currentSession}
                showForkButton={!forkedSession && currentSession.userId !== user.$id}
                onFork={handleForkSession}
                onMergeRequest={forkedSession ? handleMergeRequest : null}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-black/40">
                <div className="text-center">
                  <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50 text-[#FF9D00] animate-pulse" />
                  <p className="text-lg mb-2 font-semibold">No code session selected</p>
                  <p className="text-sm">Create or select a session to start coding</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Editor - Watched User's Code (if selected) */}
          {selectedMemberToWatch && (
            <div className="w-1/2 flex flex-col">
              <div className="glass px-4 py-2 border-b border-[#FF9D00]/20 flex items-center justify-between">
                <span className="text-sm font-bold text-green-400">
                  Watching: {selectedMemberToWatch.name}
                </span>
                <button
                  onClick={() => {
                    setSelectedMemberToWatch(null);
                    setWatchedSession(null);
                  }}
                  className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition-colors font-medium"
                >
                  Stop Watching
                </button>
              </div>
              {watchedSession ? (
                <CodeEditor 
                  session={watchedSession} 
                  readOnly={true}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 bg-black/40">
                  <div className="text-center">
                    <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50 text-[#FF9D00] animate-pulse" />
                    <p className="text-lg mb-2 font-semibold">{selectedMemberToWatch.name} hasn't started coding yet</p>
                    <p className="text-sm">Waiting for them to create a session...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - Members, Voice Chat, Text Chat */}
        <div className="w-80 glass border-l border-[#FF9D00]/20 flex flex-col">
          {showMembers && (
            <div className="border-b border-[#FF9D00]/20">
              <MembersList 
                workspace={currentWorkspace} 
                isOwner={isOwner}
                onWatchMember={handleWatchMember}
                watchedMemberId={selectedMemberToWatch?.id}
              />
            </div>
          )}

          {showVoiceChat && (
            <div className="border-b border-[#FF9D00]/20">
              <VoiceChatPanel 
                workspaceId={workspaceId}
                isOwner={isOwner}
                settings={currentWorkspace.settings}
              />
            </div>
          )}

          {showChat && (
            <div className="flex-1 flex flex-col min-h-0">
              <ChatPanel workspaceId={workspaceId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
