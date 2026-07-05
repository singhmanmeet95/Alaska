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

            // calculate stats dynamically from trips if possible
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
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-card backdrop-blur border border-border rounded-2xl overflow-hidden animate-fade-in">
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
        <StatsCard stats={stats} />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column - User Info, Friends & Trips */}
          <div className="space-y-6">
            <UserInfoCard about={fullUser?.about ?? user?.about ?? null} />
            <FriendsListCard friends={fullUser?.friends || []} />
            <RecentTripsCard trips={fullUser?.trips || []} />
          </div>

          {/* Right Column - Gallery */}
          <div className="space-y-6">
            {((fullUser?.images && fullUser.images.length > 0) ||
              isOwnProfile) && (
              <UserGallery
                images={fullUser?.images || []}
                isOwnProfile={isOwnProfile}
                onUpdateImages={handleUpdateGallery}
                onUploadImage={handleUploadGalleryImage}
              />
            )}
          </div>
        </div>

        {/* Reviews Section at bottom */}
        {fullUser?.receivedReviews && fullUser.receivedReviews.length > 0 && (
          <ReviewsSection
            reviews={fullUser.receivedReviews}
            title="Reviews Received"
            isAnonymous={true}
          />
        )}

        {/* Reviews Given Section */}
        {fullUser?.writtenReviews && fullUser.writtenReviews.length > 0 && (
          <ReviewsSection
            reviews={fullUser.writtenReviews}
            title="Reviews Given"
            onEditClick={
              isOwnProfile ? (review) => setEditingReview(review) : undefined
            }
          />
        )}

        {/* Edit Review Modal */}
        <EditReviewModal
          isOpen={!!editingReview}
          onClose={() => setEditingReview(null)}
          review={editingReview}
          onSuccess={() => setRefetchTrigger((prev) => prev + 1)}
        />

        {/* Connection Requests Modal */}
        {showRequestsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans p-4">
            <div
              className="bg-card border border-border rounded-[var(--radius-card)] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Bell className="w-5 h-5" />
                  <h2 className="text-xl font-headline text-foreground">Connection Requests</h2>
                </div>
                <button
                  onClick={() => setShowRequestsModal(false)}
                  className="text-foreground/50 hover:text-foreground p-1 rounded-[var(--radius-pill)] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {pendingRequests.length === 0 ? (
                  <div className="text-foreground/50 font-body-sm text-[12px] py-12 text-center border border-dashed border-border rounded-[var(--radius-card)]">
                    No new connection requests.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-background border border-border rounded-[var(--radius-card)] p-4 flex items-center justify-between shadow-sm"
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => {
                            setShowRequestsModal(false);
                            navigate(`/user/${req.requester.id}`);
                          }}
                        >
                          {req.requester.profile_image ? (
                            <img
                              src={req.requester.profile_image}
                              alt={req.requester.name}
                              className="w-10 h-10 rounded-[var(--radius-pill)] object-cover border border-border group-hover:border-primary/50 transition-colors"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-[var(--radius-pill)] bg-card flex items-center justify-center text-foreground/80 font-headline border border-border">
                              {req.requester.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-foreground font-headline text-sm group-hover:text-primary transition-colors">
                              {req.requester.name}
                            </span>
                            <span className="text-foreground/50 font-body-sm text-[12px]">
                              @{req.requester.username}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                            title="Accept"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
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
