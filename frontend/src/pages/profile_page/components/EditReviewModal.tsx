import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../../store/useAuthStore";
import { Star } from "lucide-react";

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: any;
  onSuccess: () => void;
}

export default function EditReviewModal({
  isOpen,
  onClose,
  review,
  onSuccess,
}: EditReviewModalProps) {
  const { token } = useAuthStore();
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      await axios.put(
        `${API_URL}/reviews/${review.id}`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Failed to update review",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-white">Edit Review</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    star <= rating ? "text-amber-400" : "text-zinc-600"
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white resize-none"
              rows={4}
              placeholder="Write your review here..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
