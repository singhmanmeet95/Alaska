import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "./components/LoadingSpinner";

// Lazy load pages for better performance
const MapMetro = lazy(() => import("./pages/map_page/mapbox"));
const ChatPage = lazy(() => import("./pages/chat_page/chat_page"));
const Credentials = lazy(() => import("./pages/auth_page/auth_index"));
const ProfilePage = lazy(() => import("./pages/profile_page/profile_page"));
const EditProfilePage = lazy(
  () => import("./pages/profile_page/EditProfilePage"),
);
const LandingPage = lazy(() => import("./pages/landing_page/LandingPage"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Route - Login/Signup */}
        <Route path="/auth" element={<Credentials />} />

        {/* Map Route */}
        <Route path="/map" element={<MapMetro />} />

        {/* Chat Route */}
        <Route path="/chat/:chatId?" element={<ChatPage />} />

        {/* Profile Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

// 404 Not Found Component
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-100">
      <div className="text-center space-y-6 max-w-md px-6">
        <h1 className="text-8xl font-bold text-zinc-800 tracking-tighter">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-zinc-100">
            Page Not Found
          </h2>
          <p className="text-zinc-500">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 w-full pt-4">
          <a
            href="/profile"
            className="w-full px-6 py-3 bg-white text-black font-medium rounded hover:bg-zinc-200 transition-colors text-center"
          >
            Return Home
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/map"
              className="px-4 py-2.5 bg-zinc-900 text-zinc-300 font-medium rounded border border-zinc-800 hover:bg-zinc-800 transition-colors text-center text-sm"
            >
              Map
            </a>
            <a
              href="/chat"
              className="px-4 py-2.5 bg-zinc-900 text-zinc-300 font-medium rounded border border-zinc-800 hover:bg-zinc-800 transition-colors text-center text-sm"
            >
              Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
