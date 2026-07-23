import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useProfileData } from "./hooks/useProfileData";

import {
  ProfileHeader,
  StatsCard,
  UserInfoCard,
  RecentTripsCard,
  UserGallery,
  ReviewsSection,
  EditReviewModal,
  FriendsListCard,
  ConnectionRequestsModal,
} from "./components";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const [editingReview, setEditingReview] = useState<any>(null);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { userId } = useParams<{ userId: string }>();
  const isOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;

  const {
    stats,
    fullUser,
    loadingProfile,
    pendingRequests,
    setRefetchTrigger,
    handleAcceptRequest,
    handleRejectRequest,
    handleUpdateGallery,
    handleUploadGalleryImage,
  } = useProfileData(targetUserId, isOwnProfile);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

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

        {/* Custom Tabs Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1.5 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 animate-fade-in-up delay-200 sticky top-4 z-20 shadow-sm">
          {["overview", "connections", "gallery", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-headline text-sm capitalize transition-all duration-300 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="animate-fade-in-up delay-300 min-h-[400px]">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <UserInfoCard about={fullUser?.about ?? user?.about ?? null} />
              <RecentTripsCard trips={fullUser?.trips || []} />
            </div>
          )}

          {/* CONNECTIONS TAB */}
          {activeTab === "connections" && (
            <div className="animate-fade-in">
              <FriendsListCard friends={fullUser?.friends || []} />
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === "gallery" && (
            <div className="animate-fade-in">
              {((fullUser?.images && fullUser.images.length > 0) || isOwnProfile) ? (
                <div className="glass-panel rounded-[var(--radius-3xl)] p-2">
                   <UserGallery
                     images={fullUser?.images || []}
                     isOwnProfile={isOwnProfile}
                     onUpdateImages={handleUpdateGallery}
                     onUploadImage={handleUploadGalleryImage}
                   />
                </div>
              ) : (
                <div className="text-center py-20 text-foreground/50 font-body">
                  No photos uploaded yet.
                </div>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-8 animate-fade-in">
               {!isOwnProfile && (
                 <div className="flex justify-end">
                   <button
                     onClick={() => setEditingReview({ revieweeId: targetUserId })}
                     className="px-6 py-2.5 bg-primary hover:opacity-90 text-primary-foreground font-button text-sm rounded-[var(--radius-pill)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all hover:-translate-y-0.5"
                   >
                     Write a Review
                   </button>
                 </div>
               )}

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="space-y-8">
                   {fullUser?.receivedReviews && fullUser.receivedReviews.length > 0 ? (
                     <div className="glass-panel rounded-[var(--radius-3xl)] p-6 h-full">
                        <ReviewsSection
                          reviews={fullUser.receivedReviews}
                          title="Reviews Received"
                          isAnonymous={true}
                        />
                     </div>
                   ) : (
                     <div className="glass-panel rounded-[var(--radius-3xl)] p-12 text-center text-foreground/50">
                        No reviews received yet.
                     </div>
                   )}
                 </div>

                 <div className="space-y-8">
                   {fullUser?.writtenReviews && fullUser.writtenReviews.length > 0 ? (
                     <div className="glass-panel rounded-[var(--radius-3xl)] p-6 h-full">
                        <ReviewsSection
                          reviews={fullUser.writtenReviews}
                          title="Reviews Given"
                        />
                     </div>
                   ) : (
                     <div className="glass-panel rounded-[var(--radius-3xl)] p-12 text-center text-foreground/50">
                        No reviews written yet.
                     </div>
                   )}
                 </div>
               </div>
            </div>
          )}
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
          <ConnectionRequestsModal
            requests={pendingRequests}
            onClose={() => setShowRequestsModal(false)}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        )}
      </div>
    </div>
  );
}
