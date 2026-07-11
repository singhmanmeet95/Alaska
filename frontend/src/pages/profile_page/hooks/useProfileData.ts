import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../../store/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function useProfileData(targetUserId: string | undefined, isOwnProfile: boolean) {
  const { user, token } = useAuthStore();
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
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

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

  return {
    stats,
    fullUser,
    loadingProfile,
    pendingRequests,
    setRefetchTrigger,
    handleAcceptRequest,
    handleRejectRequest,
    handleUpdateGallery,
    handleUploadGalleryImage,
  };
}
