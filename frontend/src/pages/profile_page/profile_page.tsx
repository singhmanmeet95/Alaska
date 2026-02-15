import { useState } from "react";
import {
  ProfileHeader,
  StatsCard,
  UserInfoCard,
  RecentTripsCard,
} from "./components";
import { mockUser, mockTrips, mockStats } from "./data/mockData";

export default function ProfilePage() {
  const [user] = useState(mockUser);
  const [trips] = useState(mockTrips);
  const [stats] = useState(mockStats);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden animate-fade-in">
          <ProfileHeader
            name={user.name}
            username={user.username}
            image={user.image ?? null}
            bio={user.bio ?? null}
          />
        </div>

        {/* Stats Cards */}
        <StatsCard stats={stats} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 h-[40vh]">
            <UserInfoCard
              about={user.about ?? null}
            />
          </div>

          {/* Right Column - Recent Trips */}
          <div className="lg:col-span-2">
            <RecentTripsCard trips={trips} />
          </div>
        </div>
      </div>
    </div>
  );
}
