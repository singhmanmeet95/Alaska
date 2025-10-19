# 👤 Profile Page - Complete Guide

## Overview

A beautiful, responsive, and modularized profile page for the Alaska Metro application. Built with React, TypeScript, and Tailwind CSS, featuring smooth animations and a professional design.

---

## 🎨 Features

✅ **Modular Components** - Clean separation of concerns  
✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **Beautiful Animations** - Smooth transitions and hover effects  
✅ **Type-Safe** - Full TypeScript support  
✅ **Schema-Based** - Follows Prisma schema structure  
✅ **Navigation Buttons** - Quick access to Chat and Map pages  
✅ **Professional UI** - Modern gradient designs and card layouts

---

## 📁 Project Structure

```
profile_page/
├── profile_page.tsx          # Main profile page component
├── types.ts                  # TypeScript interfaces
├── data/
│   └── mockData.ts          # Mock user data
└── components/
    ├── index.ts             # Component exports
    ├── ProfileHeader.tsx    # Header with avatar and actions
    ├── StatsCard.tsx        # Statistics cards
    ├── UserInfoCard.tsx     # Account information
    └── RecentTripsCard.tsx  # Recent metro trips
```

---

## 🧩 Components

### 1. ProfileHeader

**Purpose**: Display user information and primary actions

**Features**:

- Gradient background with animated circles
- Avatar with online indicator
- Chat and Map navigation buttons
- Settings and Logout buttons
- Verified badge
- Responsive layout

**Props**:

```tsx
interface ProfileHeaderProps {
  name: string;
  username: string;
  image: string | null;
  bio: string | null;
}
```

---

### 2. StatsCard

**Purpose**: Display user statistics in a grid layout

**Features**:

- 4 stat cards (Trips, Distance, Favorite Station, Member Since)
- Icon badges with colors
- Hover animations
- Gradient effects
- Responsive grid (1-2-4 columns)

**Props**:

```tsx
interface StatsCardProps {
  stats: UserStats;
}
```

**Stats Include**:

- ⚡ Total Trips
- 📈 Distance Traveled
- 📍 Favorite Station
- 📅 Member Since

---

### 3. UserInfoCard

**Purpose**: Display account information and security status

**Features**:

- Email with verification status
- Two-Factor Authentication status
- About section
- Status badges (Verified/Unverified, Active/Inactive)
- Smooth hover effects

**Props**:

```tsx
interface UserInfoCardProps {
  email: string;
  emailVerified: Date | null | undefined;
  about: string | null;
  mfaEnabled: boolean;
}
```

---

### 4. RecentTripsCard

**Purpose**: Display recent metro trips

**Features**:

- Trip route visualization
- Start/End stations with icons
- Trip details (time, distance, stations)
- Relative time display (Today, Yesterday, etc.)
- Hover effects with gradient borders
- Empty state

**Props**:

```tsx
interface RecentTripsCardProps {
  trips: Trip[];
}
```

---

## 🎯 Usage

### Basic Import

```tsx
import ProfilePage from "./pages/profile_page/profile_page";

// In your router
<Route path="/profile" element={<ProfilePage />} />;
```

### Navigate to Profile

```tsx
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();

  return <button onClick={() => navigate("/profile")}>View Profile</button>;
}
```

---

## 🗺️ Navigation

The profile page includes navigation buttons:

### Chat Button

- **Icon**: MessageCircle (blue)
- **Action**: `navigate("/chat")`
- **Style**: Blue gradient with bounce animation

### Map Button

- **Icon**: Map (green)
- **Action**: `navigate("/map")`
- **Style**: Green gradient with bounce animation

### Settings Button

- **Icon**: Settings (gray)
- **Action**: Opens settings (to be implemented)
- **Style**: Gray with rotate animation

### Logout Button

- **Icon**: LogOut (red)
- **Action**: `navigate("/auth")`
- **Style**: Red with slide animation

---

## 📊 Data Structure

### User Interface

```tsx
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  about?: string | null;
  bio?: string | null;
  mfaEnabled: boolean;
}
```

### Trip Interface

```tsx
interface Trip {
  id: string;
  userId: string;
  startTime: Date;
  stationList: string[];
  length: number;
  startStation: string;
  endStation: string;
}
```

### UserStats Interface

```tsx
interface UserStats {
  totalTrips: number;
  totalDistance: number;
  favoriteStation: string;
  memberSince: string;
}
```

---

## 🎨 Design System

### Color Palette

**Primary Colors**:

- Indigo: `from-indigo-500 to-purple-600`
- Blue: `from-blue-500 to-blue-600`
- Green: `from-green-500 to-emerald-600`
- Purple: `from-purple-500 to-pink-600`

**Status Colors**:

- Success: Green (verified, active)
- Warning: Yellow (unverified)
- Error: Red (inactive, logout)
- Info: Blue (general information)

**Background**:

- Main: `bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50`
- Cards: `bg-white`
- Hover: Gradient overlays

---

### Typography

- **Headings**: Bold, 2xl-3xl
- **Body**: Medium, base-lg
- **Labels**: Medium, sm
- **Badges**: Semibold, xs-sm

---

### Spacing

- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Padding**: `p-4` to `p-6`
- **Gaps**: `gap-2` to `gap-6`
- **Margins**: `mb-4` to `mb-6`

---

## ✨ Animations

### Fade In

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Fade In Up

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Slide In Right

```css
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Usage

- Main container: `animate-fade-in`
- Cards: `animate-fade-in-up` with delays
- Trip items: `animate-slide-in-right` with delays

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md-lg)
- **Desktop**: `> 1024px` (xl)

### Grid Layouts

```tsx
// Stats Cards
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Main Content
grid-cols-1 lg:grid-cols-3
```

---

## 🔧 Customization

### Change User Data

Edit `data/mockData.ts`:

```tsx
export const mockUser: User = {
  name: "Your Name",
  username: "your_username",
  email: "your@email.com",
  // ... other fields
};
```

### Add More Stats

Edit `components/StatsCard.tsx`:

```tsx
const statItems = [
  // ... existing stats
  {
    icon: YourIcon,
    label: "Your Label",
    value: "Your Value",
    color: "from-color to-color",
  },
];
```

### Customize Colors

Change Tailwind classes:

```tsx
// Example: Change primary button color
className = "bg-gradient-to-r from-purple-500 to-pink-600";
```

---

## 🚀 Performance

### Lazy Loading

Profile page is lazy loaded in `App.tsx`:

```tsx
const ProfilePage = lazy(() => import("./pages/profile_page/profile_page"));
```

### Optimizations

- ✅ Component-based architecture
- ✅ Minimal re-renders
- ✅ Efficient animations (CSS-based)
- ✅ Optimized images with avatars
- ✅ Conditional rendering

---

## 🧪 Testing

### Test Navigation

```tsx
// Visit profile page
navigate("/profile");

// Click Chat button -> Should go to /chat
// Click Map button -> Should go to /map
// Click Logout -> Should go to /auth
```

### Test Responsiveness

```bash
# Mobile: 375px
# Tablet: 768px
# Desktop: 1440px
```

---

## 🔮 Future Enhancements

1. **Backend Integration**

   - Connect to Prisma database
   - Real-time data updates
   - User authentication

2. **Edit Profile**

   - Update name, bio, about
   - Upload profile picture
   - Change password

3. **Trip Analytics**

   - Charts and graphs
   - Trip history filters
   - Export trip data

4. **Social Features**

   - Follow other users
   - Share trips
   - Achievements/badges

5. **Settings Page**
   - Notification preferences
   - Privacy settings
   - Theme customization

---

## 📦 Dependencies

- `react` - UI library
- `react-router-dom` - Routing
- `lucide-react` - Icon library
- `tailwindcss` - Styling

---

## 🎓 Learning Resources

- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contributing

Feel free to enhance the profile page with:

- New components
- Better animations
- Improved accessibility
- More features

---

**Built with ❤️ for Alaska Metro**
