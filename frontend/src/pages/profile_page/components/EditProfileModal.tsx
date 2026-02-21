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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-white">Edit Profile</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white resize-none"
              rows={3}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white resize-none"
              rows={4}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Profile Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-400 text-sm"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-16 h-16 rounded-full object-cover"
              />
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded font-medium"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
