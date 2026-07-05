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
    <div className="relative font-sans rounded-[var(--radius-4xl)] overflow-hidden glass-panel group/header shadow-2xl transition-all duration-500 hover:shadow-primary/5">
      {/* Animated Background */}
      <div className="absolute inset-0 superhuman-gradient opacity-15 animate-gradient-x pointer-events-none" />
      
      {/* Floating abstract blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] animate-float-delayed pointer-events-none" />

      {/* Main Content wrapper */}
      <div className="relative p-10 flex flex-col md:flex-row items-center md:items-start gap-10 z-10">
        
        {/* Avatar with glow and float */}
        <div className="relative group shrink-0">
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-[var(--radius-pill)] scale-90 group-hover:scale-110 transition-transform duration-700 animate-pulse-glow" />
          <div className="relative w-44 h-44 rounded-[var(--radius-pill)] border-[6px] border-background/40 backdrop-blur-md overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-primary/30">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary text-6xl font-headline bg-gradient-to-br from-background to-primary/10">
                {name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Info & Actions */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-5 w-full pt-2">
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="space-y-1">
               <div className="flex items-center gap-3 justify-center md:justify-start">
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-display-lg text-foreground tracking-tight drop-shadow-sm">
                   {name}
                 </h1>
                 <span className="text-primary animate-pulse-glow bg-primary/10 p-1.5 rounded-full" title="Verified">
                   <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                 </span>
               </div>
               <p className="text-foreground/50 font-body-lg text-lg md:text-xl tracking-wide">@{username}</p>
             </div>
             
             {/* Action Buttons */}
             <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 z-10 shrink-0">
                <button
                  onClick={onChat || (() => navigate("/chat"))}
                  className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-[var(--radius-pill)] hover:scale-105 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 font-button"
                >
                  <MessageCircle className="w-5 h-5" /> <span>Message</span>
                </button>
                <button
                  onClick={() => navigate("/map")}
                  className="flex items-center gap-2 px-6 py-3.5 glass-panel border-foreground/10 text-foreground rounded-[var(--radius-pill)] hover:bg-foreground/5 hover:scale-105 transition-all duration-300 font-button"
                >
                  <Map className="w-5 h-5" /> <span>Map</span>
                </button>
                {isOwnProfile && (
                  <>
                    <button
                      onClick={onEdit}
                      className="p-3.5 glass-panel border-foreground/10 text-foreground/80 rounded-[var(--radius-pill)] hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 hover:rotate-90 group"
                      title="Edit Profile"
                    >
                      <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => navigate("/auth")}
                      className="p-3.5 glass-panel border-red-500/20 text-red-500 rounded-[var(--radius-pill)] hover:bg-red-500 hover:text-white transition-all duration-300 hover:rotate-12 group"
                      title="Log Out"
                    >
                      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={onOpenRequests}
                      className="relative p-3.5 glass-panel border-foreground/10 text-foreground/80 rounded-[var(--radius-pill)] hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 group"
                      title="Requests"
                    >
                      <Bell className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:animate-bounce" />
                      {pendingRequestsCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-[var(--radius-pill)] bg-red-500 text-xs font-bold text-white shadow-lg animate-pulse-glow">
                          {pendingRequestsCount}
                        </span>
                      )}
                    </button>
                  </>
                )}
             </div>
          </div>

          {bio && (
            <div className="w-full max-w-3xl glass-panel bg-background/30 p-5 rounded-2xl border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
              <p className="text-foreground/80 font-body text-base md:text-lg leading-relaxed text-left">
                {bio}
              </p>
            </div>
          )}

          {socials && Object.keys(socials).length > 0 && (
            <div className="pt-4 flex justify-center md:justify-start w-full">
              <SocialHandles socials={socials} variant="inline" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
