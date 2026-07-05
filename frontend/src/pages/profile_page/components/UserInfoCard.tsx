import { useState } from "react";
import { Info } from "lucide-react";

interface UserInfoCardProps {
  about: string | null;
}

export default function UserInfoCard({ about }: UserInfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!about) return null;

  const MAX_LENGTH = 200;
  const shouldTruncate = about.length > MAX_LENGTH;
  const displayText =
    shouldTruncate && !isExpanded ? about.slice(0, MAX_LENGTH) + "..." : about;

  return (
    <div className="glass-panel p-8 rounded-[var(--radius-3xl)] font-sans relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 bg-background/50">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none transform group-hover:scale-110 group-hover:rotate-12">
        <Info className="w-32 h-32" />
      </div>
      
      <div className="absolute -left-20 -top-20 w-48 h-48 bg-primary/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl shadow-inner group-hover:bg-primary/20 transition-colors">
             <Info className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-headline text-foreground tracking-tight">About Me</h2>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
          <p className="pl-6 font-body text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap transition-all">
            {displayText}
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80 font-button ml-3 font-semibold hover:underline underline-offset-4 transition-all"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
