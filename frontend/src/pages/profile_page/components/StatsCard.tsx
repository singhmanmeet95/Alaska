import type { UserStats } from "../types";

interface StatsCardProps {
  stats: UserStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    {
      label: "Total Trips",
      value: stats.totalTrips.toLocaleString(),
      color: "from-amber-400 to-orange-500",
      glow: "group-hover:shadow-orange-500/20 border-amber-500/20 group-hover:border-amber-500/50",
    },
    {
      label: "Distance",
      value: `${stats.totalDistance.toLocaleString()} km`,
      color: "from-emerald-400 to-teal-500",
      glow: "group-hover:shadow-emerald-500/20 border-emerald-500/20 group-hover:border-emerald-500/50",
    },
    {
      label: "User Rating",
      value: stats.ratings !== undefined && stats.ratingCount ? `${Number(stats.ratings).toFixed(1)} ★` : "No ratings",
      color: "from-blue-400 to-indigo-500",
      glow: "group-hover:shadow-blue-500/20 border-blue-500/20 group-hover:border-blue-500/50",
    },
    {
      label: "Member Since",
      value: stats.memberSince,
      color: "from-purple-400 to-pink-500",
      glow: "group-hover:shadow-purple-500/20 border-purple-500/20 group-hover:border-purple-500/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans mb-8">
      {statItems.map((item, index) => (
        <div
          key={item.label}
          className={`relative group glass-panel rounded-[var(--radius-2xl)] p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${item.glow} animate-fade-in-up bg-background/40`}
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* Animated background glow */}
          <div className={`absolute -right-16 -top-16 w-40 h-40 bg-gradient-to-br ${item.color} rounded-full blur-[50px] opacity-20 group-hover:opacity-50 group-hover:scale-150 transition-all duration-700 pointer-events-none`} />
          <div className={`absolute -left-16 -bottom-16 w-32 h-32 bg-gradient-to-tr ${item.color} rounded-full blur-[40px] opacity-10 group-hover:opacity-30 group-hover:scale-125 transition-all duration-700 pointer-events-none`} />
          
          <div className="relative z-10 flex flex-col gap-2">
            <p className="font-eyebrow text-sm text-foreground/60 uppercase tracking-[0.2em] font-semibold">{item.label}</p>
            <p className={`text-4xl lg:text-5xl font-display-lg bg-gradient-to-br ${item.color} bg-clip-text text-transparent drop-shadow-sm truncate py-1`}>
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
