import { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import axios from "axios";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: any) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const { user, token } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    about: user?.about || "",
    image: user?.profile_image || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File) => {
    const body = new FormData();
    body.append("file", file);

    const res = await fetch(
      "https://backend.mrityunjay-jha2005.workers.dev/api/v1/image/upload",
      {
        method: "POST",
        body,
      },
    );
    const data = await res.json();
    if (res.ok && data.url) {
      return data.url;
    } else {
      throw new Error("Image upload failed");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setLoading(true);
        const url = await uploadImage(e.target.files[0]);
        setFormData((prev) => ({ ...prev, image: url }));
      } catch (err) {
        setError("Failed to upload image");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const res = await axios.put(`${API_URL}/users/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // The backend uses req.user.id in updateProfile, which is routed through what?
      // Wait, let's check authRoutes.js to see if updateProfile is exposed there.
      // Above I saw userRoutes.js had `router.put("/:id", authenticateToken, updateUser);`.
      // It's mapped to `/api/users/:id`.
      // Let's use that instead if /users/profile isn't there! We'll change the URL soon.
      onSuccess(res.data.data);
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans">
      <div className="bg-card border border-border p-6 rounded-[var(--radius-card)] w-full max-w-md shadow-2xl animate-fade-in-up">
        <h2 className="text-xl font-headline mb-4 text-foreground">Edit Profile</h2>
        {error && <div className="text-red-500 font-button text-[12px] mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-headline text-sm text-foreground/70 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-[var(--radius-pill)] px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="block font-headline text-sm text-foreground/70 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-[var(--radius-pill)] px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="block font-headline text-sm text-foreground/70 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-[var(--radius-card)] px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              rows={3}
            ></textarea>
          </div>
          <div>
            <label className="block font-headline text-sm text-foreground/70 mb-1">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-[var(--radius-card)] px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              rows={4}
            ></textarea>
          </div>
          <div>
            <label className="block font-headline text-sm text-foreground/70 mb-1">
              Profile Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full bg-background border border-border rounded-[var(--radius-card)] px-4 py-3 text-foreground/80 font-body-sm text-[12px]"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-16 h-16 rounded-[var(--radius-pill)] object-cover border border-border"
              />
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-background hover:bg-card text-foreground/80 font-button text-[12px] rounded-[var(--radius-pill)] border border-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-[var(--radius-pill)] font-button text-[12px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
