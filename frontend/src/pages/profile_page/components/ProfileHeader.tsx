import { useNavigate } from "react-router-dom";
import { MessageCircle, Map, LogOut, Settings } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  image: string | null;
  bio: string | null;
}

export default function ProfileHeader({
  name,
  username,
  image,
  bio,
}: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Background Banner (Minimalist Dark) */}
      <div className="h-48 bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Subtle grid pattern or gradient could go here if needed, but keeping it clean */}
      </div>

      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="flex justify-between items-end -mt-16 mb-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-zinc-950 bg-zinc-800 overflow-hidden shadow-xl">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-4xl font-bold bg-zinc-900">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-zinc-950 rounded-full"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-2">
            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-950 rounded hover:bg-white transition-colors font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => navigate("/map")}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 text-zinc-100 rounded border border-zinc-700 hover:bg-zinc-700 transition-colors font-medium text-sm"
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </button>

            <button className="p-2.5 bg-zinc-900 text-zinc-400 rounded border border-zinc-800 hover:text-zinc-200 transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate("/auth")}
              className="p-2.5 bg-red-950/30 text-red-400 rounded border border-red-900/50 hover:bg-red-950/50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
              {name}
            </h1>
            <span className="text-blue-500" title="Verified">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <p className="text-zinc-500 font-medium">@{username}</p>
          {bio && (
            <p className="text-zinc-400 text-base leading-relaxed max-w-2xl pt-2">
              {bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
