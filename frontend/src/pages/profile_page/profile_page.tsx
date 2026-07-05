import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Check, X, Bell } from "lucide-react";
import {
  ProfileHeader,
  StatsCard,
  UserInfoCard,
  RecentTripsCard,
  UserGallery,
  ReviewsSection,
  EditReviewModal,
  FriendsListCard,
} from "./components";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function ProfilePage() {
  const { user, token, isLoading, isAuthenticated, checkAuth } = useAuthStore();
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
  const [editingReview, setEditingReview] = useState<any>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const { userId } = useParams<{ userId: string }>();
  const isOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (targetUserId) {
      const fetchFullUser = async () => {
        try {
          const res = await axios.get(`${API_URL}/users/${targetUserId}`);
          if (res.data && res.data.data) {
            setFullUser(res.data.data);

            const userTrips = res.data.data.trips || [];
            let totalDistance = 0;
            const stationCounts: Record<string, number> = {};

            userTrips.forEach((trip: any) => {
              totalDistance += trip.length || 0;
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

            setStats({
              totalTrips: userTrips.length,
              totalDistance,
              favoriteStation: favorite !== "-" ? favorite : "None",
              memberSince: "2025",
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

    if (isOwnProfile && token) {
      axios
        .get(`${API_URL}/friendships/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data && res.data.data) {
            setPendingRequests(res.data.data);
          }
        })
        .catch((err) => console.error("Failed to fetch pending requests", err));
    }
  }, [targetUserId, refetchTrigger, isOwnProfile, token]);

  if (isLoading || loadingProfile || (!isOwnProfile && !fullUser)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
         <LoadingSpinner />
      </div>
    );
  }

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

  const handleAcceptRequest = async (id: string) => {
    try {
      await axios.put(
        `${API_URL}/friendships/accept/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPendingRequests((prev) => prev.filter((req) => req.id !== id));
      setRefetchTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert("Failed to accept request.");
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/friendships/reject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to reject request.");
    }
  };

  const handleUpdateGallery = async (newImages: string[]) => {
    try {
      if (!user) return;
      await axios.put(
        `${API_URL}/users/${user.id}`,
        { images: newImages },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFullUser((prev: any) => ({ ...prev, images: newImages }));
    } catch (error) {
      console.error("Failed to update gallery", error);
      alert("Failed to update gallery");
    }
  };

  const handleUploadGalleryImage = async (file: File) => {
    try {
      if (!user) return;
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${API_URL}/users/${user.id}/gallery`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data && res.data.success) {
        setFullUser((prev: any) => ({ ...prev, images: res.data.data.images }));
      }
    } catch (error) {
      console.error("Failed to upload gallery image", error);
      alert("Failed to upload gallery image");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden pb-20">
      {/* Global Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-float" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] animate-float-delayed" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-12 relative z-10 px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Profile Header */}
        <div className="animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
          <ProfileHeader
            name={fullUser?.name || user?.name || "User"}
            username={fullUser?.username || user?.username || "user"}
            image={fullUser?.profile_image ?? user?.profile_image ?? null}
            bio={fullUser?.bio ?? user?.bio ?? null}
            socials={socialHandles}
            onEdit={() => navigate("/profile/edit")}
            isOwnProfile={isOwnProfile}
            pendingRequestsCount={pendingRequests.length}
            onOpenRequests={() => setShowRequestsModal(true)}
            onChat={() => navigate(userId ? `/chat/${userId}` : `/chat`)}
          />
        </div>

        {/* Stats Cards */}
        <div className="animate-fade-in-up delay-100">
           <StatsCard stats={stats} />
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - User Info, Friends & Trips */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in-up delay-200">
            <UserInfoCard about={fullUser?.about ?? user?.about ?? null} />
            <FriendsListCard friends={fullUser?.friends || []} />
            <RecentTripsCard trips={fullUser?.trips || []} />
          </div>

          {/* Right Column - Gallery */}
          <div className="lg:col-span-5 space-y-8 animate-fade-in-up delay-300">
            {((fullUser?.images && fullUser.images.length > 0) ||
              isOwnProfile) && (
              <div className="glass-panel rounded-[var(--radius-3xl)] p-2">
                 <UserGallery
                   images={fullUser?.images || []}
                   isOwnProfile={isOwnProfile}
                   onUpdateImages={handleUpdateGallery}
                   onUploadImage={handleUploadGalleryImage}
                 />
              </div>
            )}
            
            {/* Reviews Section Sidebar style */}
            <div className="space-y-8">
               {fullUser?.receivedReviews && fullUser.receivedReviews.length > 0 && (
                 <div className="glass-panel rounded-[var(--radius-3xl)] p-6">
                    <ReviewsSection
                      reviews={fullUser.receivedReviews}
                      title="Reviews Received"
                      isAnonymous={true}
                    />
                 </div>
               )}

               {fullUser?.writtenReviews && fullUser.writtenReviews.length > 0 && (
                 <div className="glass-panel rounded-[var(--radius-3xl)] p-6">
                    <ReviewsSection
                      reviews={fullUser.writtenReviews}
                      title="Reviews Given"
                      onEditClick={
                        isOwnProfile ? (review) => setEditingReview(review) : undefined
                      }
                    />
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Edit Review Modal */}
        <EditReviewModal
          isOpen={!!editingReview}
          onClose={() => setEditingReview(null)}
          review={editingReview}
          onSuccess={() => setRefetchTrigger((prev) => prev + 1)}
        />

        {/* Connection Requests Modal */}
        {showRequestsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md font-sans p-4 animate-fade-in">
            <div
              className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-[var(--radius-3xl)] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden transform animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0 bg-background/50">
                <div className="flex items-center gap-3 text-primary font-semibold">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-headline text-foreground">Connection Requests</h2>
                </div>
                <button
                  onClick={() => setShowRequestsModal(false)}
                  className="text-foreground/50 hover:text-foreground p-2 bg-background/50 hover:bg-background rounded-full transition-all duration-300 hover:rotate-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-background/30 to-background/10">
                {pendingRequests.length === 0 ? (
                  <div className="text-foreground/50 font-body text-base py-16 text-center glass-panel rounded-[var(--radius-2xl)]">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    No new connection requests.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="glass-panel border border-border/50 rounded-[var(--radius-2xl)] p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div
                          className="flex items-center gap-4 cursor-pointer group flex-1 min-w-0"
                          onClick={() => {
                            setShowRequestsModal(false);
                            navigate(`/user/${req.requester.id}`);
                          }}
                        >
                          {req.requester.profile_image ? (
                            <img
                              src={req.requester.profile_image}
                              alt={req.requester.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-primary/50 transition-colors shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-headline border-2 border-transparent group-hover:border-primary/50 shrink-0">
                              {req.requester.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col truncate">
                            <span className="text-foreground font-headline text-base group-hover:text-primary transition-colors truncate">
                              {req.requester.name}
                            </span>
                            <span className="text-foreground/50 font-body text-xs truncate">
                              @{req.requester.username}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="p-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all duration-300 hover:scale-110"
                            title="Accept"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 hover:scale-110"
                            title="Reject"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
