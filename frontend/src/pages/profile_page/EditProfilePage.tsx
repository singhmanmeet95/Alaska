import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import Cookies from "js-cookie";
import axios from "axios";
import {
  ArrowLeft,
  Camera,
  Save,
  User,
  AtSign,
  FileText,
  Info,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function EditProfilePage() {
  const { user, token, isLoading, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    about: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Populate form once user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        about: user.about || "",
        image: user.profile_image || "",
      });
      setImagePreview(user.profile_image || null);
    }
  }, [user]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = useCallback(async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch(
      "https://backend.mrityunjay-jha2005.workers.dev/api/v1/image/upload",
      { method: "POST", body },
    );
    const data = await res.json();
    if (res.ok && data.url) return data.url;
    throw new Error("Image upload failed");
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Instant local preview
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
      try {
        setUploading(true);
        const url = await uploadImage(file);
        setFormData((prev) => ({ ...prev, image: url }));
        setImagePreview(url);
        setToast({ type: "success", message: "Image uploaded successfully!" });
      } catch {
        setToast({ type: "error", message: "Failed to upload image" });
        setImagePreview(formData.image || null);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = res.data.data;
      // Persist updated user to cookie so the store picks it up
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 7 });
      setToast({ type: "success", message: "Profile updated successfully!" });
      // Wait a moment so the user sees the toast, then redirect
      setTimeout(() => {
        checkAuth(); // refresh store from cookie
        navigate("/profile");
      }, 1200);
    } catch (err: any) {
      setToast({
        type: "error",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg border shadow-2xl animate-slide-in-right ${
            toast.type === "success"
              ? "bg-emerald-950/80 border-emerald-700 text-emerald-200"
              : "bg-red-950/80 border-red-700 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back to Profile</span>
          </button>
          <h1 className="text-lg font-semibold tracking-tight">Edit Profile</h1>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Avatar Section */}
          <section className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl transition-all group-hover:border-zinc-600">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-5xl font-bold bg-zinc-900">
                    {formData.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                {/* Overlay */}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  {uploading ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-7 h-7 text-white" />
                  )}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {/* Status dot */}
              <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-emerald-500 border-4 border-zinc-950 rounded-full" />
            </div>
            <p className="text-zinc-500 text-sm">
              Click the avatar to change your photo
            </p>
          </section>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
              />
            </div>

            {/* Username */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                <AtSign className="w-4 h-4" />
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                <FileText className="w-4 h-4" />
                Bio
                <span className="text-zinc-600 text-xs ml-auto">
                  {formData.bio.length}/160
                </span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                maxLength={160}
                placeholder="A short bio about yourself..."
                rows={3}
                className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all resize-none"
              />
            </div>

            {/* About */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                <Info className="w-4 h-4" />
                About
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell the community more about yourself, your travel interests, favourite routes..."
                rows={5}
                className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Bottom Actions (visible on mobile) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-colors font-medium text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}
