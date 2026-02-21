import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  ProfileHeader,
  StatsCard,
  UserInfoCard,
  RecentTripsCard,
  UserGallery,
  ReviewsSection,
} from "./components";
import { mockTrips, mockStats } from "./data/mockData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const [trips] = useState(mockTrips);
  const [stats, setStats] = useState(mockStats);
  const [fullUser, setFullUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user && user.id) {
      const fetchFullUser = async () => {
        try {
          const res = await axios.get(`${API_URL}/users/${user.id}`);
          if (res.data && res.data.data) {
            setFullUser(res.data.data);

            // update stats with actual ratings
            setStats((prev) => ({
              ...prev,
              ratings: res.data.data.ratings || 0,
              ratingCount: res.data.data.ratingCount || 0,
              totalTrips: res.data.data.trips?.length || 0,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch user full profile", error);
        } finally {
          setLoadingProfile(false);
        }
      };

      fetchFullUser();
    }
  }, [user]);

  if (isLoading || loadingProfile || !user) {
    return <LoadingSpinner />;
  }

  // Parse JSON socials if we have stringified JSON
  let socialHandles = {};
  if (fullUser?.json) {
    try {
      socialHandles =
        typeof fullUser.json === "string"
          ? JSON.parse(fullUser.json)
          : fullUser.json;
    } catch {
      socialHandles = {};
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden animate-fade-in">
          <ProfileHeader
            name={fullUser?.name || user.name}
            username={fullUser?.username || user.username}
            image={fullUser?.profile_image ?? user.profile_image ?? null}
            bio={fullUser?.bio ?? user.bio ?? null}
            socials={socialHandles}
            onEdit={() => navigate("/profile/edit")}
          />
        </div>

        {/* Stats Cards */}
        <StatsCard stats={stats} />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info & Socials */}
          <div className="lg:col-span-1 space-y-6">
            <UserInfoCard about={fullUser?.about ?? user.about ?? null} />
          </div>

          {/* Right Column - Gallery & Trips */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery Component */}
            {fullUser?.images && fullUser.images.length > 0 && (
              <UserGallery images={fullUser.images} />
            )}

            {/* Trips Component */}
            <RecentTripsCard
              trips={fullUser?.trips?.length > 0 ? fullUser.trips : trips}
            />
          </div>
        </div>

        {/* Reviews Section at bottom */}
        {fullUser?.receivedReviews && fullUser.receivedReviews.length > 0 && (
          <ReviewsSection reviews={fullUser.receivedReviews} />
        )}
      </div>
    </div>
  );
}
