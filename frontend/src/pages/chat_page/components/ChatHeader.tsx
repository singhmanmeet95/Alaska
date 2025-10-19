import type { User } from "../types";

type ChatHeaderProps = {
  user: User | null;
  onBackClick?: () => void;
  showBack?: boolean;
};

export default function ChatHeader({
  user,
  onBackClick,
  showBack = false,
}: ChatHeaderProps) {
  if (!user) {
    return (
      <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center px-4 shadow-lg">
        <h1 className="text-white text-xl font-semibold">Select a chat</h1>
      </div>
    );
  }

  return (
    <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center px-4 shadow-lg">
      {showBack && (
        <button
          onClick={onBackClick}
          className="mr-3 text-white hover:bg-white/20 rounded-full p-2 transition-colors md:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      <img
        src={user.avatar}
        alt={user.name}
        className="w-10 h-10 rounded-full border-2 border-white"
      />
      <div className="ml-3 flex-1">
        <h2 className="text-white font-semibold">{user.name}</h2>
        <p className="text-white/80 text-xs">
          {user.status === "online"
            ? "Online"
            : user.lastSeen
            ? `Last seen ${user.lastSeen}`
            : "Offline"}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>
        <button className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
