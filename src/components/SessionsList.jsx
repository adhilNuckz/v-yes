import { useState } from 'react';
import { useCodeSessionStore } from '../store/codeSessionStore';
import { useAuthStore } from '../store/authStore';
import { Plus, Code, Trash2, FileCode } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'cpp', label: 'C++', icon: '⚙️' },
  { value: 'go', label: 'Go', icon: '🔵' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
];

export default function SessionsList({ workspaceId }) {
  const { user } = useAuthStore();
  const { sessions, currentSession, createCodeSession, setCurrentSession, deleteCodeSession } = useCodeSessionStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({
    language: 'javascript',
    title: '',
  });

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const session = await createCodeSession({
        workspaceId,
        userId: user.$id,
        userName: user.name,
        language: newSession.language,
        title: newSession.title || `${newSession.language} Session`,
      });
      toast.success('Code session created!');
      setShowCreateModal(false);
      setNewSession({ language: 'javascript', title: '' });
      setCurrentSession(session);
    } catch (error) {
      toast.error('Failed to create session');
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteCodeSession(sessionId);
        toast.success('Session deleted');
      } catch (error) {
        toast.error('Failed to delete session');
      }
    }
  };

  return (
    <>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <FileCode className="w-5 h-5" />
          Code Sessions
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-1.5 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No code sessions yet</p>
            <p className="text-xs mt-1">Create one to start coding</p>
          </div>
        ) : (
          <div className="p-2">
            {sessions.map((session) => (
              <div
                key={session.$id}
                onClick={() => setCurrentSession(session)}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                  currentSession?.$id === session.$id
                    ? 'bg-purple-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">
                        {LANGUAGES.find((l) => l.value === session.language)?.icon}
                      </span>
                      <p className="font-medium text-sm truncate">{session.title}</p>
                    </div>
                    <p className="text-xs text-gray-300 truncate">{session.userName}</p>
                  </div>
                  {session.userId === user.$id && (
                    <button
                      onClick={(e) => handleDeleteSession(session.$id, e)}
                      className="p-1 hover:bg-red-600 rounded transition-colors ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Create Code Session</h3>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  value={newSession.language}
                  onChange={(e) => setNewSession({ ...newSession, language: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.icon} {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title (optional)</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="My awesome code"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSession({ language: 'javascript', title: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
