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
    <div className="p-4 bg-card rounded-[var(--radius-card)] border border-border font-sans">
      <p className="font-eyebrow text-[10px] text-foreground/50 uppercase tracking-wider mb-2">
        About
      </p>
      <p className="font-body-sm text-[12px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
        {displayText}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:opacity-80 font-headline ml-2 transition-colors select-none"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </p>
    </div>
  );
}
