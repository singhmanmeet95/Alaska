import { useNavigate } from "react-router-dom";
import { Users, MessageCircle, ChevronRight } from "lucide-react";

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
    <div className="glass-panel rounded-[var(--radius-3xl)] p-8 shadow-xl overflow-hidden animate-fade-in font-sans relative bg-background/50 hover:shadow-2xl transition-shadow duration-500">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl shadow-inner border border-primary/20">
             <Users className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-headline tracking-tight text-foreground">
            Connections <span className="text-primary/70 text-xl font-normal ml-1">({friends.length})</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 relative z-10">
        {friends.map((friend, index) => (
          <div
            key={friend.id}
            onClick={() => navigate(`/user/${friend.id}`)}
            className="flex items-center gap-5 p-4 rounded-[var(--radius-2xl)] glass-panel bg-card/30 hover:bg-card/80 border border-transparent hover:border-primary/30 transition-all duration-500 cursor-pointer group hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-md group-hover:scale-125 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
              {friend.profile_image ? (
                <img
                  src={friend.profile_image}
                  alt={friend.name}
                  className="relative w-16 h-16 rounded-full object-cover border-2 border-background/50 group-hover:border-primary transition-colors duration-500 z-10 shadow-sm"
                />
              ) : (
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-2xl font-headline border-2 border-background/50 group-hover:border-primary transition-colors duration-500 z-10 shadow-sm">
                  {friend.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex flex-col flex-1 overflow-hidden pr-2">
              <span className="text-foreground font-headline text-lg truncate group-hover:text-primary transition-colors duration-300">
                {friend.name}
              </span>
              <span className="text-foreground/50 font-body text-sm truncate mt-0.5">
                @{friend.username}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/${friend.id}`);
                }}
                className="p-3 bg-background/50 hover:bg-primary hover:text-primary-foreground rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 group/btn"
                title="Chat"
              >
                <MessageCircle className="w-5 h-5 group-hover/btn:animate-pulse" />
              </button>
              <div className="p-3 text-foreground/30 group-hover:text-primary/70 group-hover:translate-x-1 transition-all duration-300">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
