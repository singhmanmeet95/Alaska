import { useNavigate } from "react-router-dom";
import { MessageCircle, Map, LogOut, Settings, Bell } from "lucide-react";
import SocialHandles from "./SocialHandles";

interface ProfileHeaderProps {
  name: string;
  username: string;
  image: string | null;
  bio: string | null;
  socials?: Record<string, string>;
  onEdit?: () => void;
  isOwnProfile?: boolean;
  pendingRequestsCount?: number;
  onOpenRequests?: () => void;
  onChat?: () => void;
}

export default function ProfileHeader({
  name,
  username,
  image,
  bio,
  socials,
  onEdit,
  isOwnProfile = true,
  pendingRequestsCount = 0,
  onOpenRequests,
  onChat,
}: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative font-sans">
      {/* Background Banner (Minimalist) */}
      <div className="h-48 bg-card border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
      </div>

      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="flex justify-between items-end -mt-16 mb-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[var(--radius-pill)] border-4 border-background bg-card overflow-hidden shadow-sm">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/50 text-4xl font-headline bg-card">
                  {name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Right Side container */}
          <div className="flex flex-col items-end gap-3 -mb-10">
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onChat || (() => navigate("/chat"))}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-pill)] hover:opacity-90 transition-colors font-button text-[12px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => navigate("/map")}
                className="flex items-center gap-2 px-5 py-2.5 bg-background text-foreground rounded-[var(--radius-pill)] border border-border hover:bg-card transition-colors font-button text-[12px]"
              >
                <Map className="w-4 h-4" />
                <span>Map</span>
              </button>

              {isOwnProfile && (
                <>
                  <button
                    onClick={onEdit}
                    className="p-2.5 bg-background text-foreground/60 rounded-[var(--radius-pill)] border border-border hover:text-foreground transition-colors"
                    title="Edit Profile"
                  >
                    <Settings className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => navigate("/auth")}
                    className="p-2.5 bg-red-50 text-red-600 rounded-[var(--radius-pill)] border border-red-200 hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Social Handles Inline */}
            <div className="flex items-center gap-3">
              {socials && Object.keys(socials).length > 0 && (
                <SocialHandles socials={socials} variant="inline" />
              )}

              {isOwnProfile && (
                <button
                  onClick={onOpenRequests}
                  className="relative flex items-center justify-center p-2.5 bg-background border border-border text-foreground/50 rounded-[var(--radius-pill)] hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                  title="Connection Requests"
                >
                  <Bell className="w-5 h-5" />
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-[var(--radius-pill)] bg-primary text-[10px] font-bold text-primary-foreground shadow ring-2 ring-background">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-headline text-foreground tracking-tight">
              {name}
            </h1>
            <span className="text-primary" title="Verified">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <p className="text-foreground/50 font-body-sm text-[12px]">@{username}</p>
          {bio && (
            <p className="text-foreground/70 font-body-sm text-[12px] leading-relaxed max-w-2xl pt-2">
              {bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
