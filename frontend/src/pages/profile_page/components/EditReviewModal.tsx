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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans">
      <div className="bg-card border border-border p-6 rounded-[var(--radius-card)] w-full max-w-md shadow-2xl animate-fade-in-up">
        <h2 className="text-xl font-headline mb-4 text-foreground">Edit Review</h2>
        {error && <div className="text-red-500 font-button text-[12px] mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-headline text-sm text-foreground/70 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    star <= rating ? "text-amber-400" : "text-foreground/30"
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-headline text-sm text-foreground/70 mb-1">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-background border border-border rounded-[var(--radius-card)] px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              rows={4}
              placeholder="Write your review here..."
            ></textarea>
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
              disabled={loading || rating === 0}
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
