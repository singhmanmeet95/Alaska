# 🗺️ Simple Routing Guide - Alaska Project

## Route Structure

The application has been simplified to use **3 main routes** without any layout wrapper or nested routing:

```
/           → Redirects to /auth
/auth       → Authentication page (Login/Signup)
/map        → Metro map page
/chat       → Chat page
```

---

## 📁 File Structure

```
frontend/src/
├── App.tsx                          # Main routing configuration
├── main.tsx                         # Entry point with BrowserRouter
└── pages/
    ├── auth_page/
    │   └── auth_index.tsx          # Auth page (login/signup)
    ├── map_page/
    │   └── mapbox.tsx              # Map page
    └── chat_page/
        └── chat_page.tsx           # Chat page
```

---

## 🚀 App.tsx - Routing Configuration

```tsx
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy load pages
const MapMetro = lazy(() => import("./pages/map_page/mapbox"));
const ChatPage = lazy(() => import("./pages/chat_page/chat_page"));
const Credentials = lazy(() => import("./pages/auth_page/auth_index"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Auth Route */}
        <Route path="/auth" element={<Credentials />} />

        {/* Map Route */}
        <Route path="/map" element={<MapMetro />} />

        {/* Chat Route */}
        <Route path="/chat" element={<ChatPage />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 🔄 Navigation Between Pages

### Using React Router's Link Component

```tsx
import { Link } from "react-router-dom";

// Navigate to auth page
<Link to="/auth">Go to Login</Link>

// Navigate to map page
<Link to="/map">Go to Map</Link>

// Navigate to chat page
<Link to="/chat">Go to Chat</Link>
```

### Using useNavigate Hook (Programmatic Navigation)

```tsx
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // After successful login, go to map
    navigate("/map");
  };

  const goToChat = () => {
    navigate("/chat");
  };

  return (
    <>
      <button onClick={handleLogin}>Login</button>
      <button onClick={goToChat}>Chat</button>
    </>
  );
}
```

---

## 📄 Page Details

### 1. Authentication Page (`/auth`)

- **Purpose**: Login and signup functionality
- **Location**: `pages/auth_page/auth_index.tsx`
- **Navigation**: After successful login, uses `navigate("/map")` to redirect

```tsx
import { useNavigate } from "react-router-dom";

export default function Credentials() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Login logic here...
    navigate("/map"); // Redirect after login
  };

  return (
    // Your auth UI
  );
}
```

### 2. Map Page (`/map`)

- **Purpose**: Display metro map
- **Location**: `pages/map_page/mapbox.tsx`
- **No special routing logic needed**

### 3. Chat Page (`/chat`)

- **Purpose**: WhatsApp-like chat interface
- **Location**: `pages/chat_page/chat_page.tsx`
- **State Management**: Uses local state for active chat (no URL parameters)

```tsx
export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    setShowSidebar(false);
  };

  const handleBackClick = () => {
    setShowSidebar(true);
    setActiveChat(null);
  };

  return (
    // Your chat UI
  );
}
```

---

## 🎨 Lazy Loading & Suspense

All pages are lazy loaded for better performance:

```tsx
// Define lazy components
const MapMetro = lazy(() => import("./pages/map_page/mapbox"));
const ChatPage = lazy(() => import("./pages/chat_page/chat_page"));
const Credentials = lazy(() => import("./pages/auth_page/auth_index"));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>{/* Your routes */}</Routes>
</Suspense>;
```

**LoadingSpinner Component:**

```tsx
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="mt-4 text-white text-xl font-semibold">
          Loading Alaska...
        </div>
      </div>
    </div>
  );
}
```

---

## 🚦 Route Flow

```
User visits localhost:5173/
         ↓
Redirects to /auth
         ↓
User logs in
         ↓
navigate("/map")
         ↓
Shows Map Page
         ↓
User clicks chat
         ↓
navigate("/chat")
         ↓
Shows Chat Page
```

---

## 🛠️ Common Patterns

### 1. Add a Back Button

```tsx
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return <button onClick={() => navigate(-1)}>← Back</button>;
}
```

### 2. Conditional Navigation

```tsx
const handleSubmit = () => {
  if (isAuthenticated) {
    navigate("/map");
  } else {
    navigate("/auth");
  }
};
```

### 3. Replace History (No Back Button)

```tsx
// Use replace to prevent going back
navigate("/map", { replace: true });
```

---

## 🎯 Key Features

✅ **Simple 3-Route Structure**: /auth, /map, /chat  
✅ **No Layout Wrapper**: Each page is independent  
✅ **No URL Parameters**: Chat uses local state instead of /chat/:chatId  
✅ **Lazy Loading**: All pages load on-demand  
✅ **Suspense Fallback**: Shows loading spinner while loading  
✅ **404 Page**: Handles unknown routes

---

## 📝 Quick Reference

| Action                    | Code                                   |
| ------------------------- | -------------------------------------- |
| Navigate with Link        | `<Link to="/map">Map</Link>`           |
| Navigate programmatically | `navigate("/chat")`                    |
| Go back                   | `navigate(-1)`                         |
| Replace history           | `navigate("/auth", { replace: true })` |
| Get current location      | `const location = useLocation()`       |

---

## 🚀 Run the Application

```bash
cd frontend
npm run dev
```

Then visit:

- `http://localhost:5173/` → Redirects to `/auth`
- `http://localhost:5173/auth` → Login/Signup page
- `http://localhost:5173/map` → Metro map
- `http://localhost:5173/chat` → Chat interface

---

## 🎉 That's It!

Your routing is now simplified with:

- **3 clear routes** (/auth, /map, /chat)
- **No complex nesting** or layouts
- **Simple state management** in the chat page
- **Easy navigation** using `navigate()` or `Link`

Happy coding! 🚀
