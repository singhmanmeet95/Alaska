import type { UserStats } from "../types";

interface StatsCardProps {
  stats: UserStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    {
      label: "Total Trips",
      value: stats.totalTrips.toLocaleString(),
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
    },
    {
      label: "Distance Traveled",
      value: `${stats.totalDistance.toLocaleString()} km`,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      label: "User Rating",
      value:
        stats.ratings !== undefined && stats.ratingCount
          ? `${Number(stats.ratings).toFixed(1)} ★ (${stats.ratingCount})`
          : "No ratings",
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
    },
    {
      label: "Member Since",
      value: stats.memberSince,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 font-sans">
      {statItems.map((item, index) => {
        return (
          <div
            key={item.label}
            className="group relative bg-card border border-border rounded-[var(--radius-card)] p-5 hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div>
              <p className="font-eyebrow text-[10px] text-foreground/50 uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-2xl font-headline text-foreground truncate">
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
