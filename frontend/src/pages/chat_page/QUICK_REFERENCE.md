# 🚀 Quick Reference Card

## 📦 Import Statements

```tsx
// Import the main page
import ChatPage from "./pages/chat_page/chat_page";

// Import individual components
import {
  ChatSidebar,
  ChatWindow,
  ChatHeader,
  MessageList,
  MessageBubble,
  MessageInput,
  EmptyChatState,
  TypingIndicator,
  ChatListItem,
} from "./pages/chat_page/components";

// Import types
import type { User, Message, Chat } from "./pages/chat_page/types";

// Import mock data
import { mockChats, mockUsers } from "./pages/chat_page/data/mockData";
```

## 🎨 Component Props Quick Reference

### ChatPage

```tsx
<ChatPage /> // No props needed - self-contained
```

### ChatSidebar

```tsx
<ChatSidebar
  chats={Chat[]}           // Array of chat objects
  activeChat={string | null}  // Currently selected chat ID
  onChatSelect={(id) => {}}   // Callback when chat is clicked
/>
```

### ChatWindow

```tsx
<ChatWindow
  user={User | null}          // User info or null
  messages={Message[]}        // Array of messages
  currentUserId={string}      // Current user's ID
  onSendMessage={(text) => {}} // Message send handler
  onBackClick={() => {}}      // Back button handler (mobile)
  showBack={boolean}          // Show back button?
/>
```

### MessageBubble

```tsx
<MessageBubble
  message={Message} // Message object
  isOwn={boolean} // Is this message from current user?
  showAvatar={boolean} // Show avatar?
  avatar={string} // Avatar URL
/>
```

### MessageInput

```tsx
<MessageInput
  onSendMessage={(text) => {}} // Callback when message sent
  disabled={boolean} // Disable input?
/>
```

## 🎯 Key Functions

### Format Time

```tsx
const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) return `${minutes}m`;
  // ... more logic
};
```

### Send Message

```tsx
const handleSendMessage = (content: string) => {
  const newMessage: Message = {
    id: Date.now().toString(),
    senderId: currentUserId,
    content,
    timestamp: new Date(),
    status: "sent",
    type: "text",
  };

  setMessages([...messages, newMessage]);
};
```

## 🎨 Common Tailwind Classes

### Gradients

```tsx
className = "bg-gradient-to-r from-indigo-500 to-purple-600";
```

### Hover Effects

```tsx
className = "hover:bg-gray-100 transition-colors";
```

### Message Bubbles

```tsx
// Sent
className =
  "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl rounded-br-none";

// Received
className =
  "bg-white text-gray-800 rounded-2xl rounded-bl-none border border-gray-200";
```

### Status Indicators

```tsx
// Online
className = "w-3 h-3 bg-green-500 rounded-full";

// Unread badge
className = "bg-indigo-500 text-white text-xs rounded-full px-2 py-0.5";
```

## 📱 Responsive Classes

```tsx
// Show on mobile, hide on desktop
className = "block md:hidden";

// Hide on mobile, show on desktop
className = "hidden md:block";

// Sidebar width
className = "w-full md:w-96";
```

## 🎭 Status Icons

### Sent (✓)

```tsx
<svg className="w-4 h-4 text-gray-400" fill="currentColor">
  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8..." />
</svg>
```

### Delivered (✓✓)

```tsx
// Two checkmarks (gray)
```

### Read (✓✓)

```tsx
// Two checkmarks (blue)
className = "text-blue-500";
```

## 🔧 Customization Quick Tips

### Change Theme Color

```tsx
// Find and replace:
from-indigo-500 to-purple-600
// With:
from-blue-500 to-cyan-600
```

### Add Avatar Border

```tsx
className = "border-2 border-white shadow-lg";
```

### Modify Message Radius

```tsx
// More rounded
className = "rounded-3xl";

// Less rounded
className = "rounded-lg";
```

## 📊 Type Definitions

```tsx
type User = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
};

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "file";
};

type Chat = {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isTyping?: boolean;
};
```

## 🎯 Common Patterns

### Add New Message

```tsx
setMessages((prev) => [...prev, newMessage]);
```

### Update Message Status

```tsx
setMessages((prev) =>
  prev.map((msg) => (msg.id === messageId ? { ...msg, status: "read" } : msg))
);
```

### Filter Chats

```tsx
const filtered = chats.filter((chat) =>
  chat.user.name.toLowerCase().includes(query.toLowerCase())
);
```

### Group Messages by Date

```tsx
const grouped = messages.reduce((groups, message) => {
  const date = message.timestamp.toDateString();
  if (!groups[date]) groups[date] = [];
  groups[date].push(message);
  return groups;
}, {});
```

## 🚦 Status Values

```tsx
// User Status
status: "online" | "offline" | "away";

// Message Status
status: "sent" | "delivered" | "read";

// Message Type
type: "text" | "image" | "file";
```

## 💡 Pro Tips

1. **Performance**: Memoize list items with `React.memo`
2. **Scroll**: Use `useEffect` to scroll on new messages
3. **Search**: Debounce search input for better performance
4. **Images**: Use lazy loading for avatars
5. **Backend**: Replace mock data with API calls

## 📞 Need Help?

Check these files:

- `README.md` - Complete documentation
- `VISUAL_GUIDE.md` - UI design reference
- `EXAMPLES.md` - Usage examples
- `SUMMARY.md` - Project overview

---

**Happy Coding! 🎉**
