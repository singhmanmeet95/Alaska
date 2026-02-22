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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-zinc-100">
          <MessageSquare className="w-5 h-5" />
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <span className="text-sm text-zinc-500 ml-2">({reviews.length})</span>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x relative z-10">
        {reviews.map((rev) => {
          const otherUser = rev.reviewer || rev.reviewee;
          if (!otherUser) return null;

          return (
            <div
              key={rev.id}
              className="min-w-[250px] w-[250px] snap-center bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 flex flex-col justify-center shrink-0 relative group"
            >
              {onEditClick && (
                <button
                  onClick={() => onEditClick(rev)}
                  className="absolute top-2 right-2 p-1.5 bg-zinc-700/50 text-zinc-300 rounded hover:bg-zinc-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Edit Review"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  {isAnonymous ? (
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400">
                      <User className="w-5 h-5" />
                    </div>
                  ) : otherUser.profile_image ? (
                    <img
                      src={otherUser.profile_image}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-bold">
                      {otherUser.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">
                      {isAnonymous ? "Anonymous User" : otherUser.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {!onEditClick && (
                  <div className="flex items-center gap-1 bg-zinc-900/50 px-2 py-1 rounded">
                    <span className="text-sm font-bold text-amber-400">
                      {Number(rev.rating).toFixed(1)}
                    </span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                )}
                {onEditClick && (
                  <div className="flex items-center gap-1 bg-zinc-900/50 px-2 py-1 rounded">
                    <span className="text-sm font-bold text-amber-400">
                      {Number(rev.rating).toFixed(1)}
                    </span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                )}
              </div>
              {rev.comment && (
                <p className="mt-4 text-sm text-zinc-300 italic line-clamp-3 leading-relaxed">
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
