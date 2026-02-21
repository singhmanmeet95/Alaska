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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalDistance: 0,
    favoriteStation: "-",
    memberSince: "Loading...",
    ratings: 0,
    ratingCount: 0,
  });
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

            // calculate stats dynamically from trips if possible
            const userTrips = res.data.data.trips || [];
            let totalDistance = 0;
            const stationCounts: Record<string, number> = {};

            userTrips.forEach((trip: any) => {
              totalDistance += trip.length || 0; // assuming length represents something we can aggregate
              if (trip.stationList) {
                trip.stationList.forEach((station: string) => {
                  stationCounts[station] = (stationCounts[station] || 0) + 1;
                });
              }
            });

            let favorite = "-";
            let maxCount = 0;
            Object.entries(stationCounts).forEach(([station, count]) => {
              if (count > maxCount) {
                maxCount = count;
                favorite = station;
              }
            });

            // update stats with actual ratings
            setStats({
              totalTrips: userTrips.length,
              totalDistance,
              favoriteStation: favorite !== "-" ? favorite : "None",
              memberSince: "2025", // Since User doesn't have a createdAt field in schema right now
              ratings: res.data.data.ratings || 0,
              ratingCount: res.data.data.ratingCount || 0,
            });
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column - User Info & Trips */}
          <div className="space-y-6">
            <UserInfoCard about={fullUser?.about ?? user.about ?? null} />
            <RecentTripsCard trips={fullUser?.trips || []} />
          </div>

          {/* Right Column - Gallery */}
          <div className="space-y-6">
            {fullUser?.images && fullUser.images.length > 0 && (
              <UserGallery images={fullUser.images} />
            )}
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
