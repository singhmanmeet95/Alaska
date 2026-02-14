import { Zap, TrendingUp, MapPin, Calendar } from "lucide-react";
import type { UserStats } from "../types";

interface StatsCardProps {
  stats: UserStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    {
      icon: Zap,
      label: "Total Trips",
      value: stats.totalTrips.toLocaleString(),
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
    },
    {
      icon: TrendingUp,
      label: "Distance Traveled",
      value: `${stats.totalDistance.toLocaleString()} km`,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      icon: MapPin,
      label: "Favorite Station",
      value: stats.favoriteStation,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: stats.memberSince,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="group relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center border ${item.borderColor}`}
              >
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>

            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium mb-1">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-zinc-100 truncate">
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
