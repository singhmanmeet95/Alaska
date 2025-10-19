import { Train, Clock, MapPin, ArrowRight } from "lucide-react";
import type { Trip } from "../types";

interface RecentTripsCardProps {
  trips: Trip[];
}

export default function RecentTripsCard({ trips }: RecentTripsCardProps) {
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
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Train className="w-5 h-5 text-white" />
          </div>
          Recent Trips
        </h2>
        <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all duration-200">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {trips.map((trip, index) => (
          <div
            key={trip.id}
            className="group relative p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 cursor-pointer animate-slide-in-right"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Trip Route */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {trip.startStation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full"></div>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              <div className="flex-1 flex items-center gap-2 justify-end">
                <div className="flex-1 text-right">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {trip.endStation}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(trip.startTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Train className="w-4 h-4" />
                  <span>{trip.length} km</span>
                </div>
                <div className="px-2 py-1 bg-white rounded-full text-xs font-medium">
                  {trip.stationList.length} stations
                </div>
              </div>
              <span className="text-gray-500 font-medium">
                {formatDate(trip.startTime)}
              </span>
            </div>

            {/* Hover indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {trips.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Train className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No trips yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Start exploring the metro!
          </p>
        </div>
      )}
    </div>
  );
}
