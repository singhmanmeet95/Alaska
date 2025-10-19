import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy load pages for better performance
const MapMetro = lazy(() => import("./pages/map_page/mapbox"));
const ChatPage = lazy(() => import("./pages/chat_page/chat_page"));
const Credentials = lazy(() => import("./pages/auth_page/auth_index"));
const ProfilePage = lazy(() => import("./pages/profile_page/profile_page"));

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="mt-4 text-white text-xl font-semibold">
            Loading Alaska...
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Auth Route - Login/Signup */}
        <Route path="/auth" element={<Credentials />} />

        {/* Map Route */}
        <Route path="/map" element={<MapMetro />} />

        {/* Chat Route */}
        <Route path="/chat" element={<ChatPage />} />

        {/* Profile Route */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Default route - redirect to auth */}
        <Route path="/" element={<Navigate to="/profile" replace />} />

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

// 404 Not Found Component
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center space-y-4">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <div className="flex space-x-4 justify-center mt-6">
          <a
            href="/auth"
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Go to Login
          </a>
          <a
            href="/map"
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Go to Map
          </a>
          <a
            href="/chat"
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Go to Chat
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
