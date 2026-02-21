import { Star, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    profile_image: string | null;
  };
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6 text-zinc-100">
        <MessageSquare className="w-5 h-5" />
        <h2 className="text-lg font-semibold tracking-tight">Recent Ratings</h2>
        <span className="text-sm text-zinc-500 ml-2">({reviews.length})</span>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="min-w-[250px] w-[250px] snap-center bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 flex flex-col justify-center shrink-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {rev.reviewer.profile_image ? (
                  <img
                    src={rev.reviewer.profile_image}
                    alt={rev.reviewer.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-bold">
                    {rev.reviewer.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    {rev.reviewer.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-zinc-900/50 px-2 py-1 rounded">
                <span className="text-sm font-bold text-amber-400">
                  {Number(rev.rating).toFixed(1)}
                </span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
            </div>
            {rev.comment && (
              <p className="mt-4 text-sm text-zinc-300 italic line-clamp-3 leading-relaxed">
                "{rev.comment}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
