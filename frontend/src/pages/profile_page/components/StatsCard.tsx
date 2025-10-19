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
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      icon: TrendingUp,
      label: "Distance Traveled",
      value: `${stats.totalDistance.toLocaleString()} km`,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: MapPin,
      label: "Favorite Station",
      value: stats.favoriteStation,
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: stats.memberSince,
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden animate-fade-in-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            ></div>

            {/* Icon */}
            <div
              className={`relative w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className={`w-7 h-7 ${item.textColor}`} />
            </div>

            {/* Content */}
            <div className="relative">
              <p className="text-gray-500 text-sm font-medium mb-1">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-gray-800 group-hover:scale-105 transition-transform duration-300">
                {item.value}
              </p>
            </div>

            {/* Decorative element */}
            <div
              className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br ${item.color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500`}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
