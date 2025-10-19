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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden animate-fade-in">
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
          <div className="lg:col-span-1">
            <UserInfoCard
              email={user.email}
              emailVerified={user.emailVerified}
              about={user.about ?? null}
              mfaEnabled={user.mfaEnabled}
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
