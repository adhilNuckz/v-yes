import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWorkspaceStore } from '../store/workspaceStore';
import { Plus, Users, LogOut, Trash2, ExternalLink, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

export default function Workspaces() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { workspaces, getUserWorkspaces, createWorkspace, loading } = useWorkspaceStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });
  const [joinWorkspaceId, setJoinWorkspaceId] = useState('');

  useEffect(() => {
    if (user) {
      getUserWorkspaces(user.$id);
    }
  }, [user]);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    try {
      const workspace = await createWorkspace({
        name: newWorkspace.name,
        description: newWorkspace.description,
        ownerId: user.$id,
        ownerName: user.name,
      });
      toast.success('Workspace created!');
      setShowCreateModal(false);
      setNewWorkspace({ name: '', description: '' });
      navigate(`/workspace/${workspace.$id}`);
    } catch (error) {
      toast.error('Failed to create workspace');
    }
  };

  const handleJoinWorkspace = () => {
    if (joinWorkspaceId.trim()) {
      navigate(`/workspace/${joinWorkspaceId.trim()}`);
      setShowJoinModal(false);
      setJoinWorkspaceId('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen animated-bg checker-background">
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF9D00] rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute top-40 right-40 w-96 h-96 bg-[#FF9D00] rounded-full opacity-10 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#FF9D00] rounded-full opacity-15 blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="glass-strong border-b border-[#FF9D00]/20 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code2 className="w-8 h-8 text-[#FF9D00] glow-orange animate-pulse" />
              <h1 className="text-2xl font-bold text-gradient-orange">
                V-yes Code
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300">
                Welcome, <span className="font-semibold text-[#FF9D00]">{user?.name}</span>
              </div>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 glass border border-[#FF9D00]/20 hover:border-[#FF9D00] text-gray-300 hover:text-[#FF9D00] rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 animate-slideInLeft">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF9D00] to-[#FFB733] hover:from-[#FFB733] hover:to-[#FF9D00] text-black font-bold px-6 py-3 rounded-lg transition-all glow-orange hover-glow"
          >
            <Plus className="w-5 h-5" />
            Create Workspace
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 glass border border-[#FF9D00]/30 hover:border-[#FF9D00] text-gray-300 hover:text-[#FF9D00] px-6 py-3 rounded-lg font-medium transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            Join Workspace
          </button>
        </div>

        {/* Workspaces Grid */}
        <div className="animate-fadeIn">
          <h2 className="text-2xl font-bold text-gradient-orange mb-6">Your Workspaces</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto spinner border-[#FF9D00]" style={{borderTopColor: '#FF9D00'}}></div>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="glass-strong glow-orange rounded-xl p-12 text-center card-hover">
              <Users className="w-16 h-16 text-[#FF9D00] mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">No workspaces yet</h3>
              <p className="text-gray-400 mb-6">Create your first workspace to start collaborating</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF9D00] to-[#FFB733] hover:from-[#FFB733] hover:to-[#FF9D00] text-black font-bold px-6 py-3 rounded-lg transition-all glow-orange hover-glow"
              >
                <Plus className="w-5 h-5" />
                Create Workspace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace, index) => (
                <div
                  key={workspace.$id}
                  onClick={() => navigate(`/workspace/${workspace.$id}`)}
                  className="glass-strong border border-[#FF9D00]/30 hover:border-[#FF9D00] rounded-xl transition-all cursor-pointer overflow-hidden group card-hover glow-orange animate-fadeIn"
                  style={{animationDelay: `${index * 0.15}s`}}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#FF9D00] transition-colors">
                          {workspace.name}
                        </h3>
                        {workspace.description && (
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {workspace.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{workspace.members?.length || 0} members</span>
                      </div>
                      <div className="text-xs">
                        {workspace.ownerId === user.$id && (
                          <span className="px-3 py-1 bg-gradient-to-r from-[#FF9D00] to-[#FFB733] text-black rounded-full font-bold">
                            Owner
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="rotating-border"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="glass-strong glow-orange rounded-2xl max-w-md w-full p-6 border border-[#FF9D00]/30 animate-slideInUp">
            <h3 className="text-2xl font-bold text-gradient-orange mb-6">Create New Workspace</h3>
            <form onSubmit={handleCreateWorkspace} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  className="w-full px-4 py-3 glass border border-[#FF9D00]/20 rounded-lg focus:border-[#FF9D00] focus:ring-2 focus:ring-[#FF9D00]/30 outline-none transition text-white placeholder-gray-500"
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newWorkspace.description}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                  className="w-full px-4 py-3 glass border border-[#FF9D00]/20 rounded-lg focus:border-[#FF9D00] focus:ring-2 focus:ring-[#FF9D00]/30 outline-none transition resize-none text-white placeholder-gray-500"
                  rows="3"
                  placeholder="Describe your workspace..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewWorkspace({ name: '', description: '' });
                  }}
                  className="flex-1 px-4 py-3 glass border border-[#FF9D00]/30 hover:border-[#FF9D00] text-gray-300 hover:text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF9D00] to-[#FFB733] hover:from-[#FFB733] hover:to-[#FF9D00] text-black font-bold rounded-lg transition-all glow-orange hover-glow"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Workspace Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="glass-strong glow-orange rounded-2xl max-w-md w-full p-6 border border-[#FF9D00]/30 animate-slideInUp">
            <h3 className="text-2xl font-bold text-gradient-orange mb-6">Join Workspace</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workspace ID or Link
                </label>
                <input
                  type="text"
                  value={joinWorkspaceId}
                  onChange={(e) => setJoinWorkspaceId(e.target.value)}
                  className="w-full px-4 py-3 glass border border-[#FF9D00]/20 rounded-lg focus:border-[#FF9D00] focus:ring-2 focus:ring-[#FF9D00]/30 outline-none transition text-white placeholder-gray-500"
                  placeholder="Enter workspace ID"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinWorkspaceId('');
                  }}
                  className="flex-1 px-4 py-3 glass border border-[#FF9D00]/30 hover:border-[#FF9D00] text-gray-300 hover:text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinWorkspace}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF9D00] to-[#FFB733] hover:from-[#FFB733] hover:to-[#FF9D00] text-black font-bold rounded-lg transition-all glow-orange hover-glow"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
