interface UserInfoCardProps {
  about: string | null;
}

import { useState } from "react";

export default function UserInfoCard({ about }: UserInfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!about) return null;

  const MAX_LENGTH = 150;
  const shouldTruncate = about.length > MAX_LENGTH;
  const displayText =
    shouldTruncate && !isExpanded ? about.slice(0, MAX_LENGTH) + "..." : about;

  return (
    <div className="p-4 bg-zinc-950/30 rounded-xl border border-zinc-800">
      <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">
        About
      </p>
      <p className="text-zinc-300 leading-relaxed text-sm whitespace-pre-wrap">
        {displayText}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-orange-500 hover:text-orange-400 font-medium ml-2 transition-colors select-none"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </p>
    </div>
  );
}
