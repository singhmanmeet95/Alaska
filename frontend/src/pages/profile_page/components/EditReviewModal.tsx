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
      await axios.post(
        `${API_URL}/reviews`,
        { revieweeId: review.revieweeId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Failed to submit review",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md font-sans p-4">
      <div className="bg-card/95 backdrop-blur-xl border border-border/50 p-8 rounded-[var(--radius-3xl)] w-full max-w-md shadow-2xl animate-fade-in-up flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-headline text-foreground tracking-tight">
            Write a Review
          </h2>
          <p className="font-body-sm text-foreground/50 mt-2">
            Your feedback will be posted completely anonymously.
          </p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-500/10 text-red-500 font-button text-[12px] rounded-[var(--radius-card)] text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
          <div className="flex flex-col items-center gap-3 bg-background/50 p-6 rounded-[var(--radius-2xl)] border border-border/50">
            <label className="font-headline text-sm text-foreground/70 tracking-wide uppercase">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 transition-all duration-300 hover:scale-110 ${
                    star <= rating 
                      ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
                      : "text-foreground/20 hover:text-foreground/40"
                  }`}
                >
                  <Star className="w-10 h-10 fill-current" />
                </button>
              ))}
            </div>
          </div>
          </div>
          <div className="space-y-2">
            <label className="block font-headline text-sm text-foreground/70 ml-2">
              Your Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-background/50 border border-border/50 rounded-[var(--radius-2xl)] px-5 py-4 text-foreground font-body-sm text-[14px] placeholder-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none shadow-inner"
              rows={4}
              placeholder="Share your experience (this remains anonymous)..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-background hover:bg-card text-foreground/70 hover:text-foreground font-button text-sm rounded-[var(--radius-pill)] border border-border/50 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-pill)] font-button text-sm shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:-translate-y-0.5"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
