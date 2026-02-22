import { useNavigate } from "react-router-dom";

interface Friend {
  id: string;
  name: string;
  username: string;
  profile_image: string | null;
  bio: string | null;
}

interface FriendsListCardProps {
  friends: Friend[];
}

export default function FriendsListCard({ friends }: FriendsListCardProps) {
  const navigate = useNavigate();

  if (!friends || friends.length === 0) return null;

  return (
    <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-6 shadow-sm overflow-hidden animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">
          Friends ({friends.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => navigate(`/user/${friend.id}`)}
            className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-700 transition-all cursor-pointer group"
          >
            {friend.profile_image ? (
              <img
                src={friend.profile_image}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover border border-zinc-700 group-hover:border-zinc-600 transition-colors"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-bold border border-zinc-600">
                {friend.name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-zinc-100 font-medium truncate group-hover:text-blue-400 transition-colors">
                {friend.name}
              </span>
              <span className="text-zinc-400 text-xs truncate">
                @{friend.username}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/chat/${friend.id}`);
              }}
              className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors"
              title="Chat"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
