import { Star, MessageSquare, Edit2, User } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer?: {
    id: string;
    name: string;
    profile_image: string | null;
  };
  reviewee?: {
    id: string;
    name: string;
    profile_image: string | null;
  };
}

interface ReviewsSectionProps {
  reviews: Review[];
  title?: string;
  isAnonymous?: boolean;
  onEditClick?: (review: Review) => void;
}

export default function ReviewsSection({
  reviews,
  title = "Recent Ratings",
  isAnonymous = false,
  onEditClick,
}: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-[var(--radius-card)] p-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-foreground">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-headline tracking-tight">{title}</h2>
          <span className="font-eyebrow text-[10px] text-foreground/50 ml-2">({reviews.length})</span>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x relative z-10">
        {reviews.map((rev) => {
          const otherUser = rev.reviewer || rev.reviewee;
          if (!otherUser) return null;

          return (
            <div
              key={rev.id}
              className="min-w-[250px] w-[250px] snap-center bg-background border border-border rounded-[var(--radius-card)] p-5 flex flex-col justify-center shrink-0 relative group hover:border-primary/30 transition-colors"
            >
              {onEditClick && (
                <button
                  onClick={() => onEditClick(rev)}
                  className="absolute top-2 right-2 p-1.5 bg-card border border-border text-foreground/50 rounded-[var(--radius-pill)] hover:bg-background hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Edit Review"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  {isAnonymous ? (
                    <div className="w-10 h-10 rounded-[var(--radius-pill)] bg-card flex items-center justify-center text-foreground/50 border border-border">
                      <User className="w-5 h-5" />
                    </div>
                  ) : otherUser.profile_image ? (
                    <img
                      src={otherUser.profile_image}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-[var(--radius-pill)] object-cover border border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-[var(--radius-pill)] bg-card flex items-center justify-center text-foreground/80 font-headline border border-border">
                      {otherUser.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-headline text-sm text-foreground">
                      {isAnonymous ? "Anonymous User" : otherUser.name}
                    </p>
                    <p className="font-body-sm text-[10px] text-foreground/50">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {!onEditClick && (
                  <div className="flex items-center gap-1 bg-card border border-border px-2 py-1 rounded-[var(--radius-pill)]">
                    <span className="font-headline text-[12px] text-yellow-500">
                      {Number(rev.rating).toFixed(1)}
                    </span>
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  </div>
                )}
                {onEditClick && (
                  <div className="flex items-center gap-1 bg-card border border-border px-2 py-1 rounded-[var(--radius-pill)]">
                    <span className="font-headline text-[12px] text-yellow-500">
                      {Number(rev.rating).toFixed(1)}
                    </span>
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  </div>
                )}
              </div>
              {rev.comment && (
                <p className="mt-4 font-body-sm text-[12px] text-foreground/70 italic line-clamp-3 leading-relaxed">
                  "{rev.comment}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
