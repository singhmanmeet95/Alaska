# 🚀 Profile Page - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Navigate to Profile Page

```bash
# Your app is already set up!
# Just navigate to the profile route
```

In your browser:

```
http://localhost:5173/profile
```

Or use navigation:

```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/profile");
```

---

## 🎯 What You Get

✅ **Beautiful Profile Header** with avatar and gradient background  
✅ **4 Stat Cards** showing user metrics  
✅ **Account Info Card** with email and 2FA status  
✅ **Recent Trips Card** with metro journey history  
✅ **Navigation Buttons** to Chat and Map pages  
✅ **Smooth Animations** throughout the page  
✅ **Fully Responsive** design

---

## 📦 Components Included

```
ProfilePage (Main)
├── ProfileHeader
│   ├── Avatar with online indicator
│   ├── Name, username, bio
│   └── Action buttons (Chat, Map, Settings, Logout)
│
├── StatsCard
│   ├── Total Trips (⚡)
│   ├── Distance Traveled (📈)
│   ├── Favorite Station (📍)
│   └── Member Since (📅)
│
├── UserInfoCard
│   ├── Email (verified status)
│   ├── 2FA Status
│   └── About section
│
└── RecentTripsCard
    └── List of recent metro trips
```

---

## 🎨 Key Features

### 1. Navigation Buttons

**Chat Button** (Blue)

```tsx
onClick={() => navigate("/chat")}
```

- Takes you to the chat page
- Blue gradient with bounce animation
- MessageCircle icon

**Map Button** (Green)

```tsx
onClick={() => navigate("/map")}
```

- Takes you to the metro map
- Green gradient with bounce animation
- Map icon

**Settings Button** (Gray)

- Opens settings (to be implemented)
- Rotates on hover

**Logout Button** (Red)

```tsx
onClick={() => navigate("/auth")}
```

- Redirects to authentication page
- Slides on hover

---

### 2. Stats Display

Four beautiful stat cards showing:

| Stat             | Icon | Color  | Description                 |
| ---------------- | ---- | ------ | --------------------------- |
| **Total Trips**  | ⚡   | Yellow | Number of metro trips taken |
| **Distance**     | 📈   | Green  | Total kilometers traveled   |
| **Favorite**     | 📍   | Blue   | Most visited station        |
| **Member Since** | 📅   | Purple | Account creation date       |

---

### 3. Recent Trips

Each trip shows:

- **Route**: Start station → End station
- **Time**: When the trip occurred
- **Distance**: Trip length in km
- **Stations**: Number of stops
- **Date**: Relative time (Today, Yesterday, etc.)

---

## 🎭 Animations

### Page Load

1. Header fades in (0.6s)
2. Stats cards appear one by one (staggered)
3. Info card slides up
4. Trip items slide in from right

### Hover Effects

- **Cards**: Lift up with shadow
- **Buttons**: Scale and bounce
- **Icons**: Rotate or slide
- **Stats**: Gradient overlay

---

## 🎨 Customization

### Change User Info

Edit `data/mockData.ts`:

```tsx
export const mockUser: User = {
  name: "Your Name Here",
  username: "your_handle",
  email: "you@example.com",
  image: "your-avatar-url",
  bio: "Your awesome bio",
  // ...
};
```

### Change Stats

```tsx
export const mockStats: UserStats = {
  totalTrips: 200,
  totalDistance: 3500,
  favoriteStation: "Your Station",
  memberSince: "Your Date",
};
```

### Add More Trips

```tsx
export const mockTrips: Trip[] = [
  {
    id: "4",
    startStation: "Station A",
    endStation: "Station B",
    length: 10,
    // ...
  },
  // Add more trips
];
```

---

## 📱 Responsive Design

### Mobile View

- Single column layout
- Stacked stat cards
- Compact trip cards
- Hamburger-friendly

### Tablet View

- 2-column stat cards
- Side-by-side info and trips
- Medium spacing

### Desktop View

- 4-column stat cards
- 1:2 ratio for info and trips
- Maximum spacing and comfort

---

## 🎯 Quick Actions

### Navigate from Other Pages

```tsx
// From Chat Page
<button onClick={() => navigate("/profile")}>
  View Profile
</button>

// From Map Page
<button onClick={() => navigate("/profile")}>
  My Profile
</button>

// From Auth Page (after login)
navigate("/profile");
```

---

## 🔧 Integration with Backend

When ready to connect to your Prisma backend:

### 1. Fetch User Data

```tsx
import { useState, useEffect } from "react";

const [user, setUser] = useState(null);

useEffect(() => {
  fetch("/api/user/me")
    .then((res) => res.json())
    .then((data) => setUser(data));
}, []);
```

### 2. Fetch Stats

```tsx
const [stats, setStats] = useState(null);

useEffect(() => {
  fetch("/api/user/stats")
    .then((res) => res.json())
    .then((data) => setStats(data));
}, []);
```

### 3. Fetch Trips

```tsx
const [trips, setTrips] = useState([]);

useEffect(() => {
  fetch("/api/trips/recent")
    .then((res) => res.json())
    .then((data) => setTrips(data));
}, []);
```

---

## 🎨 Color Customization

### Primary Colors

```tsx
// Header background
className = "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500";

// Chat button
className = "bg-gradient-to-r from-blue-500 to-blue-600";

// Map button
className = "bg-gradient-to-r from-green-500 to-emerald-600";
```

### Change Theme

Simply update the Tailwind classes:

```tsx
// Example: Change to orange theme
from-indigo-600 → from-orange-600
to-purple-600 → to-red-600
```

---

## 🐛 Troubleshooting

### Icons Not Showing

```bash
# Make sure lucide-react is installed
npm install lucide-react
```

### Animations Not Working

Check that `index.css` has the animation keyframes:

```css
@keyframes fade-in {
  ...;
}
@keyframes fade-in-up {
  ...;
}
```

### Route Not Working

Make sure route is added in `App.tsx`:

```tsx
<Route path="/profile" element={<ProfilePage />} />
```

---

## 📚 File Locations

```
frontend/src/
├── App.tsx                    # Add profile route here
├── index.css                  # Custom animations
└── pages/
    └── profile_page/
        ├── profile_page.tsx   # Main component
        ├── types.ts           # TypeScript types
        ├── data/
        │   └── mockData.ts    # Sample data
        └── components/
            ├── ProfileHeader.tsx
            ├── StatsCard.tsx
            ├── UserInfoCard.tsx
            └── RecentTripsCard.tsx
```

---

## 🎓 Next Steps

1. **Test the Page**

   ```bash
   npm run dev
   # Visit http://localhost:5173/profile
   ```

2. **Customize Data**

   - Edit `mockData.ts`
   - Update user info, stats, trips

3. **Add Navigation**

   - Link from other pages
   - Add to navigation menu

4. **Connect Backend**

   - Replace mock data with API calls
   - Add real-time updates

5. **Enhance Features**
   - Add edit profile
   - Implement settings
   - Add more stats

---

## ✨ Pro Tips

💡 **Tip 1**: Use the Chat and Map buttons to quickly navigate  
💡 **Tip 2**: Hover over cards to see beautiful animations  
💡 **Tip 3**: Try different screen sizes for responsive design  
💡 **Tip 4**: Check console for any errors  
💡 **Tip 5**: Customize colors to match your brand

---

## 🎉 You're All Set!

Your profile page is ready to use with:

- ✅ Beautiful design
- ✅ Smooth animations
- ✅ Navigation to Chat & Map
- ✅ Responsive layout
- ✅ Professional appearance

**Start exploring and customizing!** 🚀

---

## 📞 Need Help?

Check the documentation:

- `README.md` - Complete guide
- `VISUAL_GUIDE.md` - Visual reference
- `types.ts` - Type definitions

---

**Built with ❤️ for Alaska Metro**
