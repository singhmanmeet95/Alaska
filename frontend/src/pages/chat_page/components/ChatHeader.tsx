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
      <div className="h-16 bg-background border-b border-border flex items-center px-4">
        <h1 className="font-headline text-foreground">Select a chat</h1>
      </div>
    );
  }

  return (
    <div className="h-16 bg-background border-b border-border flex items-center px-4 justify-between font-sans">
      <div className="flex items-center flex-1">
        {showBack && (
          <button
            onClick={onBackClick}
            className="mr-3 text-foreground/50 hover:text-foreground hover:bg-card rounded-full p-2 transition-colors md:hidden"
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
          className="w-9 h-9 rounded-[var(--radius-pill)] bg-card object-cover border border-border"
        />
        <div className="ml-3">
          <h2 className="font-headline text-foreground text-sm">{user.name}</h2>
          <p className="font-body-sm text-foreground/50 text-[10px]">
            {user.status === "online"
              ? "Online"
              : user.lastSeen
                ? `Last seen ${user.lastSeen}`
                : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1 relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-foreground/50 hover:text-foreground hover:bg-card rounded-full p-2 transition-colors relative"
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
          <div className="absolute top-12 right-0 w-48 bg-card rounded-xl border border-border shadow-xl overflow-hidden z-50 animate-fade-in-up origin-top-right">
            <button
              onClick={() => {
                setShowMenu(false);
                if (onClearChat) onClearChat();
              }}
              className="w-full text-left px-4 py-3 font-button text-foreground hover:bg-background transition-colors"
            >
              Clear Chat
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                if (onRemoveFriend) onRemoveFriend();
              }}
              className="w-full text-left px-4 py-3 font-button text-red-500 hover:bg-red-50 transition-colors border-t border-border"
            >
              Remove Friend
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
