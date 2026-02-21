import { useState } from "react";
import { Train, Clock, MapPin, ArrowRight } from "lucide-react";
import type { Trip } from "../types";

interface RecentTripsCardProps {
  trips: Trip[];
}

export default function RecentTripsCard({ trips }: RecentTripsCardProps) {
  const [showAll, setShowAll] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-3">
          Recent Trips
        </h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-zinc-500 hover:text-zinc-300 font-medium text-xs uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all duration-200"
        >
          {showAll ? "View Less" : "View All"}
          <ArrowRight
            className={`w-3 h-3 transition-transform ${showAll ? "rotate-90" : ""}`}
          />
        </button>
      </div>

      <div className="space-y-3">
        {(showAll ? trips : trips.slice(0, 3)).map((trip, index) => (
          <div
            key={trip.id}
            className="group relative p-4 bg-zinc-950/50 hover:bg-zinc-800 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 cursor-pointer animate-slide-in-right"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Trip Route */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {trip.startStation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                <div className="flex gap-1.5">
                  <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                  <div className="w-1 h-1 bg-zinc-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-zinc-400 rounded-full"></div>
                </div>
                <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              <div className="flex-1 flex items-center gap-3 justify-end">
                <div className="flex-1 text-right overflow-hidden">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {trip.endStation}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-900">
              <div className="flex items-center gap-4 text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(trip.startTime)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5" />
                  <span>{trip.length} km</span>
                </div>
                <div className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-400">
                  {trip.stationList.length} stops
                </div>
              </div>
              <span className="text-zinc-600 font-medium">
                {formatDate(trip.startTime)}
              </span>
            </div>

            {/* Active Indicator on left */}
            <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-blue-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      {trips.length === 0 && (
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/30">
          <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3 border border-zinc-800">
            <Train className="w-6 h-6 text-zinc-600" />
          </div>
          <p className="text-zinc-500 font-medium text-sm">No trips recorded</p>
          <p className="text-zinc-600 text-xs mt-1">
            Start exploring the metro network
          </p>
        </div>
      )}
    </div>
  );
}
