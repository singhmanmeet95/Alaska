import { useState } from "react";
import { Train, Clock, MapPin, ArrowRight, Activity } from "lucide-react";
import type { Trip } from "../types";
import { STATIONS_MAP } from "../../../utils/stationsMap";

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
    <div className="glass-panel rounded-[var(--radius-3xl)] p-8 animate-fade-in-up font-sans relative overflow-hidden bg-background/50 hover:shadow-xl transition-shadow duration-500">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl shadow-inner border border-blue-500/20">
            <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-headline text-foreground tracking-tight">Recent Journeys</h2>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-5 py-2.5 glass-panel border-foreground/10 text-foreground text-sm font-button rounded-[var(--radius-pill)] hover:bg-foreground/5 hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
        >
          {showAll ? "Show Less" : "View All"}
          <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${showAll ? "rotate-90" : ""}`} />
        </button>
      </div>

      <div className="space-y-4 relative z-10">
        {(showAll ? trips : trips.slice(0, 3)).map((trip, index) => (
          <div
            key={trip.id}
            className="group relative p-6 glass-panel bg-card/30 hover:bg-card/80 rounded-[var(--radius-2xl)] border-l-4 border-l-transparent hover:border-l-blue-500 transition-all duration-500 cursor-pointer animate-slide-in-right hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Trip Route */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-5">
               {/* Start Station */}
               <div className="flex-1 flex items-center gap-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-blue-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                   <MapPin className="w-5 h-5 text-blue-500" />
                 </div>
                 <p className="font-headline text-lg text-foreground truncate">{STATIONS_MAP[trip.startStation as any] || trip.startStation}</p>
               </div>

               {/* Arrow / Connection */}
               <div className="hidden sm:flex items-center gap-2 px-5 py-2 glass-panel rounded-full shadow-inner border-foreground/5">
                 <div className="flex gap-1.5">
                   <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                   <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                   <div className="w-2 h-2 bg-blue-500/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                 </div>
                 <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-3 transition-transform duration-500" />
               </div>

               {/* End Station */}
               <div className="flex-1 flex items-center gap-4 sm:justify-end text-left sm:text-right">
                 <div className="sm:hidden w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-purple-500/20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                   <MapPin className="w-5 h-5 text-purple-500" />
                 </div>
                 <p className="font-headline text-lg text-foreground truncate order-2 sm:order-1">{STATIONS_MAP[trip.endStation as any] || trip.endStation}</p>
                 <div className="hidden sm:flex w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl items-center justify-center shrink-0 shadow-inner border border-purple-500/20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 order-1 sm:order-2">
                   <MapPin className="w-5 h-5 text-purple-500" />
                 </div>
               </div>
            </div>

            {/* Trip Details Footer */}
            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-border/50 gap-4">
               <div className="flex items-center gap-6 text-sm font-body text-foreground/70">
                 <div className="flex items-center gap-2">
                   <Clock className="w-4 h-4 text-blue-500/70" /> 
                   <span>{formatTime(trip.startTime)}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Train className="w-4 h-4 text-purple-500/70" /> 
                   <span>{trip.length} km</span>
                 </div>
                 <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full font-button text-xs border border-blue-500/20">
                   {trip.stationList.length} stops
                 </div>
               </div>
               <span className="text-foreground/80 font-button text-sm bg-foreground/5 px-3 py-1 rounded-lg">
                 {formatDate(trip.startTime)}
               </span>
            </div>
          </div>
        ))}
      </div>

      {trips.length === 0 && (
         <div className="text-center py-20 glass-panel rounded-[var(--radius-3xl)] relative overflow-hidden">
            <div className="w-20 h-20 bg-gradient-to-br from-foreground/5 to-foreground/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-border/50 animate-float shadow-inner">
               <Train className="w-10 h-10 text-foreground/40" />
            </div>
            <p className="font-headline text-foreground/70 text-xl">No journeys yet</p>
            <p className="font-body text-foreground/50 text-base mt-2 max-w-sm mx-auto">Your upcoming adventures and travel history will appear here once you start exploring.</p>
         </div>
      )}
    </div>
  );
}
