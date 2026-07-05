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
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-[var(--radius-pill)] border shadow-2xl animate-slide-in-right font-sans ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-button text-[12px]">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-button text-[12px]">Back to Profile</span>
          </button>
          <h1 className="font-headline text-lg tracking-tight">Edit Profile</h1>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-pill)] hover:opacity-90 transition-all font-button text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-10 font-sans">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Avatar Section */}
          <section className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[var(--radius-pill)] border-4 border-background bg-card overflow-hidden shadow-sm transition-all group-hover:border-primary/50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/50 text-5xl font-headline bg-card">
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
            </div>
            <p className="font-eyebrow text-[10px] text-foreground/50 lowercase">
              Click the avatar to change your photo
            </p>
          </section>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div className="group">
              <label className="flex items-center gap-2 font-headline text-sm text-foreground mb-2">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-card border border-border rounded-[var(--radius-pill)] px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Username */}
            <div className="group">
              <label className="flex items-center gap-2 font-headline text-sm text-foreground mb-2">
                <AtSign className="w-4 h-4 text-primary" />
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 font-body-sm text-[12px]">
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  className="w-full bg-card border border-border rounded-[var(--radius-pill)] pl-8 pr-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="group">
              <label className="flex items-center gap-2 font-headline text-sm text-foreground mb-2">
                <FileText className="w-4 h-4 text-primary" />
                Bio
                <span className="text-foreground/40 font-eyebrow text-[10px] ml-auto">
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
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
            </div>

            {/* About */}
            <div className="group">
              <label className="flex items-center gap-2 font-headline text-sm text-foreground mb-2">
                <Info className="w-4 h-4 text-primary" />
                About
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell the community more about yourself, your travel interests, favourite routes..."
                rows={5}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
            </div>
          </div>

          {/* Bottom Actions (visible on mobile) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 px-6 py-3 bg-card border border-border text-foreground rounded-[var(--radius-pill)] hover:bg-background transition-colors font-button text-[12px] text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-[var(--radius-pill)] hover:opacity-90 transition-all font-button text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-[var(--radius-pill)] animate-spin" />
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
