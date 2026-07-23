import { lazy, Suspense } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { AppLayout } from "./components/AppLayout";
import { useAuthStore } from "./store/useAuthStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};
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
      <AppLayout>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Route - Login/Signup */}
          <Route path="/auth" element={<Credentials />} />

          {/* Map Route */}
          <Route path="/map" element={<ProtectedRoute><MapMetro /></ProtectedRoute>} />

          {/* Chat Route */}
          <Route path="/chat/:chatId?" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

          {/* Profile Routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="/user/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </Suspense>
  );
}

// Fallback Route for non-existent pages (404)
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground font-sans">
      <div className="space-y-6 text-center max-w-md px-6">
        <h1 className="text-8xl font-headline text-foreground/10 tracking-tighter">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-headline text-foreground">
            Lost in the cold?
          </h2>
          <p className="font-body-sm text-[12px] text-foreground/50 leading-relaxed">
            We couldn't find the page you're looking for. The coordinates might
            be wrong, or the page has moved.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-6">
          <Link
            to="/chat"
            className="w-full px-6 py-3 bg-primary text-primary-foreground font-button text-[12px] rounded-[var(--radius-pill)] hover:opacity-90 transition-colors text-center"
          >
            Back to Safety (Chat)
          </Link>
          <div className="flex gap-3">
            <Link
              to="/map"
              className="flex-1 px-4 py-2.5 bg-background text-foreground font-button text-[12px] rounded-[var(--radius-pill)] border border-border hover:bg-card transition-colors text-center"
            >
              Open Map
            </Link>
            <Link
              to="/profile"
              className="flex-1 px-4 py-2.5 bg-background text-foreground font-button text-[12px] rounded-[var(--radius-pill)] border border-border hover:bg-card transition-colors text-center"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
