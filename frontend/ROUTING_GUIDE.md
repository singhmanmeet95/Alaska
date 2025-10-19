# 🛣️ React Router Implementation Guide

## Overview

The Alaska project now uses **React Router v7** with lazy loading and Suspense for optimal performance and code splitting.

## 📁 File Structure

```
frontend/src/
├── App.tsx                      # Main router configuration
├── main.tsx                     # BrowserRouter wrapper
│
├── components/
│   ├── Layout.tsx               # Layout wrapper with navigation
│   └── Navigation.tsx           # Navigation component
│
└── pages/
    ├── auth_page/
    │   └── auth_index.tsx       # Auth page (uses navigate)
    ├── map_page/
    │   └── mapbox.tsx           # Map page
    └── chat_page/
        └── chat_page.tsx        # Chat page (uses params & navigate)
```

## 🚀 Routes

### Public Routes (No Navigation Bar)

```
/                    → Redirect to /auth
/auth                → Authentication page
/login               → Authentication page
/signup              → Authentication page
```

### Protected Routes (With Navigation Bar)

```
/map                 → Metro map page
/chat                → Chat page (list view)
/chat/:chatId        → Chat page (specific conversation)
```

### Special Routes

```
/*                   → 404 Not Found page
```

## 🎨 Features

### 1. Lazy Loading

All pages are lazy-loaded for better performance:

```tsx
const MapMetro = lazy(() => import("./pages/map_page/mapbox"));
const ChatPage = lazy(() => import("./pages/chat_page/chat_page"));
const Credentials = lazy(() => import("./pages/auth_page/auth_index"));
```

### 2. Suspense with Loading Spinner

Beautiful gradient loading spinner while pages load:

```tsx
<Suspense fallback={<LoadingSpinner />}>
  <Routes>{/* ... routes */}</Routes>
</Suspense>
```

### 3. URL Parameters

Chat page uses URL parameters for chat selection:

```tsx
// In chat_page.tsx
const { chatId } = useParams<{ chatId: string }>();
```

### 4. Programmatic Navigation

Pages use `useNavigate` for redirects:

```tsx
// After login
const navigate = useNavigate();
navigate("/map");

// Select chat
navigate(`/chat/${chatId}`);

// Go back
navigate("/chat");
```

### 5. Navigation Component

Floating navigation bar with active state:

- 🔐 Auth
- 🗺️ Map
- 💬 Chat

## 💻 Usage Examples

### Navigating Between Pages

#### From Auth to Map (After Login)

```tsx
// In auth_index.tsx
const navigate = useNavigate();

const handleLoginSubmit = () => {
  // Login logic...
  navigate("/map");
};
```

#### Opening a Chat

```tsx
// In chat_page.tsx
const handleChatSelect = (chatId: string) => {
  navigate(`/chat/${chatId}`);
};
```

#### Going Back to Chat List

```tsx
const handleBackClick = () => {
  navigate("/chat");
};
```

### Using URL Parameters

```tsx
// Access chat ID from URL
const { chatId } = useParams<{ chatId: string }>();

// React to URL changes
useEffect(() => {
  if (chatId) {
    setActiveChat(chatId);
  }
}, [chatId]);
```

### Creating Links

```tsx
import { Link } from "react-router-dom";

// Simple link
<Link to="/map">Go to Map</Link>

// Link with state
<Link to="/chat/1" state={{ from: "notification" }}>
  Open Chat
</Link>

// Active link styling
<Link
  to="/chat"
  className={location.pathname === "/chat" ? "active" : ""}
>
  Chat
</Link>
```

## 🎯 Component Examples

### Layout Component

Wraps routes that need navigation:

```tsx
// In App.tsx
<Route element={<Layout />}>
  <Route path="/map" element={<MapMetro />} />
  <Route path="/chat" element={<ChatPage />} />
</Route>
```

### Navigation Component

Shows current active route:

```tsx
const isActive = (path: string) => location.pathname.startsWith(path);
```

## 🔧 Advanced Features

### 1. Nested Routes

```tsx
<Route path="/chat" element={<ChatLayout />}>
  <Route index element={<ChatList />} />
  <Route path=":chatId" element={<ChatWindow />} />
</Route>
```

### 2. Protected Routes

```tsx
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

// Usage
<Route
  path="/map"
  element={
    <ProtectedRoute>
      <MapMetro />
    </ProtectedRoute>
  }
/>;
```

### 3. Route Guards

```tsx
// Check authentication before rendering
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/auth" replace />;
}
```

### 4. Query Parameters

```tsx
import { useSearchParams } from "react-router-dom";

const [searchParams, setSearchParams] = useSearchParams();

// Read query
const filter = searchParams.get("filter");

// Set query
setSearchParams({ filter: "unread" });

// URL: /chat?filter=unread
```

## 📱 Mobile Considerations

### Back Button Behavior

```tsx
// Use navigate with -1 to go back
navigate(-1);

// Or go to specific route
navigate("/chat");
```

### Deep Linking

```tsx
// Direct URL access works
// https://yourapp.com/chat/123
// Will load chat with ID 123
```

## 🎨 Loading States

### Custom Loading Component

```tsx
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <div className="mt-4 text-white text-xl font-semibold">
        Loading Alaska...
      </div>
    </div>
  );
}
```

### Page-Level Loading

```tsx
// Each lazy-loaded component shows spinner while loading
<Suspense fallback={<LoadingSpinner />}>
  <MapMetro />
</Suspense>
```

## 🔄 Route Transitions

### Adding Transitions

```tsx
// In Layout.tsx
<div className="transition-all duration-300 ease-in-out">
  <Outlet />
</div>
```

### Animated Route Changes

```tsx
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
```

## 📊 Route Configuration Summary

| Route       | Component   | Lazy | Navigation | Auth Required |
| ----------- | ----------- | ---- | ---------- | ------------- |
| `/`         | Redirect    | -    | No         | No            |
| `/auth`     | Credentials | ✅   | No         | No            |
| `/login`    | Credentials | ✅   | No         | No            |
| `/signup`   | Credentials | ✅   | No         | No            |
| `/map`      | MapMetro    | ✅   | Yes        | Future        |
| `/chat`     | ChatPage    | ✅   | Yes        | Future        |
| `/chat/:id` | ChatPage    | ✅   | Yes        | Future        |
| `/*`        | NotFound    | -    | No         | No            |

## 🛠️ Development Tips

### 1. Route Testing

```tsx
// Navigate in tests
import { MemoryRouter } from "react-router-dom";

render(
  <MemoryRouter initialEntries={["/chat/1"]}>
    <App />
  </MemoryRouter>
);
```

### 2. Debugging Routes

```tsx
// Log current location
const location = useLocation();
console.log("Current route:", location.pathname);
```

### 3. Checking Active Route

```tsx
const location = useLocation();
const isActive = location.pathname === "/chat";
```

## 🎯 Best Practices

1. **Always use lazy loading** for route-level components
2. **Provide meaningful loading states** with Suspense
3. **Use URL parameters** for dynamic content
4. **Navigate programmatically** after actions (login, submit)
5. **Keep navigation consistent** across the app
6. **Handle 404s gracefully** with a custom page
7. **Use nested routes** for complex layouts
8. **Implement route guards** for protected pages

## 🚦 Future Enhancements

- [ ] Add authentication guards
- [ ] Implement route-based breadcrumbs
- [ ] Add scroll restoration
- [ ] Create route transitions
- [ ] Add meta tags per route
- [ ] Implement route-based analytics
- [ ] Add route prefetching
- [ ] Create dynamic route generation

---

**Your app is now fully router-enabled! 🎉**

Navigate with confidence using:

- `useNavigate()` for programmatic navigation
- `<Link>` for declarative navigation
- `useParams()` for URL parameters
- `useLocation()` for route information
