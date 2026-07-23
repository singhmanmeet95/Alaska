export interface RouteSettingsProps {
  startStation: string;
  endStation: string;
  tripTime: string;
  setTripTime: (time: string) => void;
  isLoading: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}

export function RouteSettings({
  startStation,
  endStation,
  tripTime,
  setTripTime,
  isLoading,
  canSubmit,
  onSubmit,
}: RouteSettingsProps) {
  return (
    <div className="flex flex-col p-4 gap-4 shrink-0 border-b border-border">
      <h2 className="text-foreground font-headline text-lg">Route Settings</h2>

      {/* Stations Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-eyebrow text-[10px] text-foreground/50 uppercase tracking-wider">
            Start
          </span>
          <div
            className="bg-card border border-border p-3 rounded-[var(--radius-pill)] text-sm text-foreground font-mono truncate"
            title={startStation}
          >
            {startStation || "None"}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-eyebrow text-[10px] text-foreground/50 uppercase tracking-wider">
            End
          </span>
          <div
            className="bg-card border border-border p-3 rounded-[var(--radius-pill)] text-sm text-foreground font-mono truncate"
            title={endStation}
          >
            {endStation || "None"}
          </div>
        </div>
      </div>

      {/* Time Selector */}
      <div className="flex flex-col gap-1 mt-1">
        <span className="font-eyebrow text-[10px] text-foreground/50 uppercase tracking-wider">
          Departure Time
        </span>
        <input
          type="datetime-local"
          value={tripTime}
          onChange={(e) => setTripTime(e.target.value)}
          className="w-full bg-card border border-border p-3 rounded-[var(--radius-pill)] text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
        />
      </div>

      {/* Action Button */}
      <button
        onClick={onSubmit}
        disabled={!canSubmit || isLoading}
        className={`w-full py-2.5 rounded-[var(--radius-pill)] font-button text-sm transition-colors border ${
          canSubmit
            ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
            : "bg-background text-foreground/30 border-border cursor-not-allowed"
        }`}
      >
        {isLoading ? "LOADING..." : !canSubmit ? "SELECT" : "SUBMIT"}
      </button>
    </div>
  );
}
