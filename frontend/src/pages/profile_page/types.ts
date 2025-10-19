export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified?: Date | null;
  password?: string | null;
  image?: string | null;
  about?: string | null;
  bio?: string | null;
  mfaEnabled: boolean;
  mfaTotpSecret?: string | null;
  mfaBackupCodes: string[];
}

export interface Trip {
  id: string;
  userId: string;
  startTime: Date;
  stationList: string[];
  length: number;
  startStation: string;
  endStation: string;
}

export interface UserStats {
  totalTrips: number;
  totalDistance: number;
  favoriteStation: string;
  memberSince: string;
}
