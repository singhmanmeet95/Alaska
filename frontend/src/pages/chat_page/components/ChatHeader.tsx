import { useState, useRef, useEffect } from "react";
import type { User } from "../types";

type ChatHeaderProps = {
  user: User | null;
  onBackClick?: () => void;
  showBack?: boolean;
  onClearChat?: () => void;
  onRemoveFriend?: () => void;
};

export default function ChatHeader({
  user,
  onBackClick,
  showBack = false,
  onClearChat,
  onRemoveFriend,
}: ChatHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="h-16 bg-zinc-950 border-b border-zinc-800 flex items-center px-4">
        <h1 className="text-zinc-100 text-lg font-medium">Select a chat</h1>
      </div>
    );
  }

  return (
    <div className="h-16 bg-zinc-950 border-b border-zinc-800 flex items-center px-4 justify-between">
      <div className="flex items-center flex-1">
        {showBack && (
          <button
            onClick={onBackClick}
            className="mr-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-full p-2 transition-colors md:hidden"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <img
          src={user.avatar}
          alt={user.name}
          className="w-9 h-9 rounded-full bg-zinc-800 object-cover"
        />
        <div className="ml-3">
          <h2 className="text-zinc-100 font-medium text-sm">{user.name}</h2>
          <p className="text-zinc-500 text-xs">
            {user.status === "online"
              ? "Online"
              : user.lastSeen
                ? `Last seen ${user.lastSeen}`
                : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1 relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-full p-2 transition-colors relative"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>

        {showMenu && (
          <div className="absolute top-12 right-0 w-48 bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl overflow-hidden z-50 animate-fade-in-up origin-top-right">
            <button
              onClick={() => {
                setShowMenu(false);
                if (onClearChat) onClearChat();
              }}
              className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Clear Chat
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                if (onRemoveFriend) onRemoveFriend();
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border-t border-zinc-800"
            >
              Remove Friend
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
