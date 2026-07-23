import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface MatchersListProps {
  hasSearched: boolean;
  matchers: any[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAddFriend: (e: React.MouseEvent, receiverId: string) => void;
}

export function MatchersList({
  hasSearched,
  matchers,
  page,
  totalPages,
  onPageChange,
  onAddFriend,
}: MatchersListProps) {
  const navigate = useNavigate();

  if (!hasSearched) {
    return (
      <div className="border border-dashed border-border rounded-lg h-full flex flex-col items-center justify-center text-foreground/50 text-sm gap-2">
        <p className="font-headline">Analysis Results Area</p>
        <p className="font-body-sm text-[12px] text-foreground/40">
          Submit a path to find matchers
        </p>
      </div>
    );
  }

  if (matchers.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-lg h-full flex items-center justify-center text-foreground/50 text-sm font-body">
        No active matchers found for this route.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {matchers.map((match) => (
        <div
          key={match.id}
          onClick={() => navigate(`/user/${match.user.id}`)}
          className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 cursor-pointer hover:border-primary/50 transition-colors"
          title="View Profile"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {match.user.profile_image ? (
                <img
                  src={match.user.profile_image}
                  alt={match.user.name}
                  className="w-10 h-10 rounded-[var(--radius-pill)] object-cover border border-border"
                />
              ) : (
                <div className="w-10 h-10 rounded-[var(--radius-pill)] bg-background flex items-center justify-center text-foreground font-bold border border-border">
                  {match.user.name.charAt(0)}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-foreground font-headline text-sm w-max">
                  {match.user.name}
                </span>
                <span className="text-foreground/50 font-body-sm text-[10px]">
                  {match.lcsLen} stations match
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-[var(--radius-pill)] border border-border">
                <span className="text-[12px] font-headline text-yellow-500">
                  {Number(match.user.ratings || 0).toFixed(1)}
                </span>
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              </div>

              {/* Friend Request Button */}
              {match.friendshipStatus === "NONE" && (
                <button
                  onClick={(e) => onAddFriend(e, match.user.id)}
                  className="px-3 py-1 bg-primary text-primary-foreground font-button text-[12px] rounded-[var(--radius-pill)] hover:opacity-90 transition-colors"
                >
                  Add
                </button>
              )}
              {match.friendshipStatus === "SENT_REQUEST" && (
                <span className="px-3 py-1 bg-background text-foreground/50 text-[10px] font-eyebrow rounded-[var(--radius-pill)] border border-border">
                  Pending
                </span>
              )}
              {match.friendshipStatus === "RECEIVED_REQUEST" && (
                <span className="px-3 py-1 bg-background text-foreground/50 text-[10px] font-eyebrow rounded-[var(--radius-pill)] border border-border">
                  Respond
                </span>
              )}
              {match.friendshipStatus === "ACCEPTED" && (
                <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-eyebrow rounded-[var(--radius-pill)] border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  Friends
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 bg-card p-2 rounded-xl border border-border">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 text-foreground/50 hover:text-foreground disabled:opacity-30 disabled:hover:text-foreground/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-eyebrow text-[10px] text-foreground/50">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 text-foreground/50 hover:text-foreground disabled:opacity-30 disabled:hover:text-foreground/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
