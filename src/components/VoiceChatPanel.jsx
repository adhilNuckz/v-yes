import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWorkspaceStore } from '../store/workspaceStore';
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VoiceChatPanel({ workspaceId, isOwner, settings }) {
  const { user } = useAuthStore();
  const { updateWorkspaceSettings } = useWorkspaceStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [participants, setParticipants] = useState([]);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});

  // This is a simplified implementation
  // In a real-world scenario, you would integrate with WebRTC signaling server
  // and use SimplePeer or similar library for P2P connections

  const handleConnect = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      setIsConnected(true);
      toast.success('Connected to voice chat');

      // Here you would establish WebRTC connections with other users
      // This would involve signaling through Appwrite Realtime
      
    } catch (error) {
      console.error('Error connecting to voice chat:', error);
      toast.error('Failed to connect to voice chat');
    }
  };

  const handleDisconnect = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Close all peer connections
    Object.values(peersRef.current).forEach((peer) => {
      peer.destroy();
    });
    peersRef.current = {};

    setIsConnected(false);
    setIsMuted(false);
    setIsDeafened(false);
    toast.success('Disconnected from voice chat');
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      toast.success(audioTrack.enabled ? 'Microphone unmuted' : 'Microphone muted');
    }
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened);
    toast.success(isDeafened ? 'Undeafened' : 'Deafened');
    // Implement muting all incoming audio streams
  };

  const handleMuteUser = async (userId) => {
    if (!isOwner) return;

    try {
      const mutedUsers = settings.voiceChatMuted || [];
      const newMutedUsers = mutedUsers.includes(userId)
        ? mutedUsers.filter((id) => id !== userId)
        : [...mutedUsers, userId];

      await updateWorkspaceSettings(workspaceId, {
        ...settings,
        voiceChatMuted: newMutedUsers,
      });

      toast.success('User mute status updated');
    } catch (error) {
      toast.error('Failed to update user mute status');
    }
  };

  const toggleVoiceChatForAll = async () => {
    if (!isOwner) return;

    try {
      await updateWorkspaceSettings(workspaceId, {
        ...settings,
        voiceChatEnabled: !settings.voiceChatEnabled,
      });

      toast.success(
        settings.voiceChatEnabled ? 'Voice chat disabled' : 'Voice chat enabled'
      );
    } catch (error) {
      toast.error('Failed to toggle voice chat');
    }
  };

  useEffect(() => {
    return () => {
      if (isConnected) {
        handleDisconnect();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Voice Chat
        </h3>
        {isOwner && (
          <button
            onClick={toggleVoiceChatForAll}
            className={`text-xs px-2 py-1 rounded ${
              settings.voiceChatEnabled
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            } transition-colors`}
          >
            {settings.voiceChatEnabled ? 'Enabled' : 'Disabled'}
          </button>
        )}
      </div>

      {!settings.voiceChatEnabled && !isOwner ? (
        <div className="text-center text-gray-400 text-sm py-4">
          <VolumeX className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Voice chat is disabled</p>
        </div>
      ) : (
        <>
          {/* Connection Controls */}
          <div className="mb-4">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-2 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                Connect
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={toggleMute}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                      isMuted
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleDeafen}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                      isDeafened
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isDeafened ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg transition-colors"
                >
                  <PhoneOff className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {/* Participants (placeholder) */}
          {isConnected && participants.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 mb-2">In voice ({participants.length})</p>
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      {participant.isMuted ? (
                        <MicOff className="w-3 h-3" />
                      ) : (
                        <Mic className="w-3 h-3" />
                      )}
                    </div>
                    <span className="text-sm">{participant.name}</span>
                  </div>
                  {isOwner && participant.id !== user.$id && (
                    <button
                      onClick={() => handleMuteUser(participant.id)}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                    >
                      {participant.isMutedByOwner ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {isConnected && participants.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-4">
              <p>No one else in voice chat</p>
            </div>
          )}
        </>
      )}

      <div className="mt-4 text-xs text-gray-400">
        <p>💡 Tip: Use voice chat for quick discussions while coding together</p>
      </div>
    </div>
  );
}
