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
      {/* Background Gradient */}
      <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-t-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>

        {/* Animated background circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-5 right-20 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="flex justify-between items-end -mt-16 mb-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full animate-pulse"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => navigate("/chat")}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700"
            >
              <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
              <span className="font-semibold">Chat</span>
            </button>

            <button
              onClick={() => navigate("/map")}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-emerald-700"
            >
              <Map className="w-5 h-5 group-hover:animate-bounce" />
              <span className="font-semibold">Map</span>
            </button>

            <button className="group p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105">
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <button
              onClick={() => navigate("/auth")}
              className="group p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-4 space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            {name}
            <span className="text-blue-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </h1>
          <p className="text-gray-600 font-medium">@{username}</p>
          {bio && (
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
              {bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
