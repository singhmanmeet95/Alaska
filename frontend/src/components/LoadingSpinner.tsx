export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-sans">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-border border-t-primary rounded-[var(--radius-pill)] animate-spin mx-auto"></div>
          <div className="mt-6 font-eyebrow text-[10px] text-foreground/50 uppercase tracking-wider">
            Loading Alaska...
          </div>
        </div>
      </div>
    </div>
  );
}
