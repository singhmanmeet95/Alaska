import type { User, Trip, UserStats } from "../types";

// Mock user data
export const mockUser: User = {
  id: "1",
  name: "Rajkumar Singh",
  username: "rajku_alaska",
  email: "rajku@alaska.com",
  emailVerified: new Date("2024-01-15"),
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajkumar",
  about: "Passionate traveler exploring Delhi Metro 🚇",
  bio: "Tech enthusiast | Metro explorer | Building Alaska - The future of metro travel",
  mfaEnabled: true,
  mfaTotpSecret: null,
  mfaBackupCodes: [],
};

// Mock trips data
export const mockTrips: Trip[] = [
  {
    id: "1",
    userId: "1",
    startTime: new Date("2025-10-15T09:30:00"),
    stationList: ["Rajiv Chowk", "Kashmere Gate", "Civil Lines"],
    length: 12,
    startStation: "Rajiv Chowk",
    endStation: "Civil Lines",
  },
  {
    id: "2",
    userId: "1",
    startTime: new Date("2025-10-14T14:20:00"),
    stationList: ["Connaught Place", "Rajiv Chowk", "Barakhamba Road"],
    length: 8,
    startStation: "Connaught Place",
    endStation: "Barakhamba Road",
  },
  {
    id: "3",
    userId: "1",
    startTime: new Date("2025-10-13T08:15:00"),
    stationList: ["Hauz Khas", "Green Park", "AIIMS", "INA"],
    length: 15,
    startStation: "Hauz Khas",
    endStation: "INA",
  },
];

// Mock user statistics
export const mockStats: UserStats = {
  totalTrips: 127,
  totalDistance: 2450, // in km
  favoriteStation: "Rajiv Chowk",
  memberSince: "January 2024",
};
