import { Users, Crown, Eye } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function MembersList({ workspace, isOwner, onWatchMember, watchedMemberId }) {
  const { user } = useAuthStore();
  const getMemberColor = (userId) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
    ];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold flex items-center gap-2 mb-3">
        <Users className="w-5 h-5" />
        Members ({workspace.members?.length || 0})
      </h3>
      <div className="space-y-2">
        {workspace.members?.map((memberId) => {
          const memberNamesObj = workspace.memberNames ? JSON.parse(workspace.memberNames) : {};
          const memberName = memberNamesObj[memberId] || 'Unknown User';
          const isMemberOwner = memberId === workspace.ownerId;

          const isCurrentUser = memberId === user.$id;
          const isWatching = watchedMemberId === memberId;

          return (
            <div
              key={memberId}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isWatching 
                  ? 'bg-green-700 ring-2 ring-green-500' 
                  : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full ${getMemberColor(
                  memberId
                )} flex items-center justify-center text-white font-semibold text-sm`}
              >
                {getInitials(memberName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate flex items-center gap-2">
                  {memberName}
                  {isMemberOwner && (
                    <Crown className="w-3.5 h-3.5 text-yellow-500" />
                  )}
                  {isCurrentUser && (
                    <span className="text-xs text-purple-400">(You)</span>
                  )}
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              </div>
              {!isCurrentUser && (
                <button
                  onClick={() => onWatchMember && onWatchMember(memberId, memberName)}
                  className={`p-1.5 rounded transition-colors ${
                    isWatching
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  title={isWatching ? 'Stop watching' : 'Watch their code'}
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
