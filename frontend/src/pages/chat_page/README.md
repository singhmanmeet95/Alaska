# Chat Page - WhatsApp-like UI

A beautiful, modularized chat interface built with React and TypeScript, featuring a modern WhatsApp-like design.

## 📁 Project Structure

```
chat_page/
├── chat_page.tsx           # Main chat page component
├── types.ts                # TypeScript type definitions
├── components/             # Reusable UI components
│   ├── index.ts           # Component exports
│   ├── ChatSidebar.tsx    # Left sidebar with chat list
│   ├── ChatListItem.tsx   # Individual chat item
│   ├── ChatWindow.tsx     # Main chat window container
│   ├── ChatHeader.tsx     # Chat header with user info
│   ├── MessageList.tsx    # Messages container
│   ├── MessageBubble.tsx  # Individual message bubble
│   ├── MessageInput.tsx   # Message input field
│   └── EmptyChatState.tsx # Empty state when no chat selected
└── data/
    └── mockData.ts        # Mock data for demonstration
```

## 🎨 Components

### 1. **ChatSidebar**

Left sidebar displaying all available chats.

**Features:**

- Search functionality to filter chats
- Active chat highlighting
- Unread message counters
- Online status indicators
- Responsive design

**Props:**

- `chats`: Array of chat objects
- `activeChat`: Currently selected chat ID
- `onChatSelect`: Callback when a chat is selected

### 2. **ChatListItem**

Individual chat item in the sidebar.

**Features:**

- User avatar with online status
- Last message preview
- Timestamp formatting (minutes, hours, days)
- Unread message badge
- Typing indicator
- Active state styling

**Props:**

- `chat`: Chat object
- `isActive`: Whether this chat is currently active
- `onClick`: Click handler

### 3. **ChatWindow**

Main chat window container.

**Features:**

- Combines header, message list, and input
- Responsive layout
- Back button for mobile view

**Props:**

- `user`: User information
- `messages`: Array of messages
- `currentUserId`: Current user's ID
- `onSendMessage`: Message send handler
- `onBackClick`: Back button handler (mobile)
- `showBack`: Whether to show back button

### 4. **ChatHeader**

Header section displaying chat information.

**Features:**

- User avatar and name
- Online/offline status
- Last seen information
- Action buttons (call, menu)
- Gradient background

**Props:**

- `user`: User information
- `onBackClick`: Back button handler
- `showBack`: Whether to show back button

### 5. **MessageList**

Container for displaying messages.

**Features:**

- Auto-scroll to latest message
- Date dividers (Today, Yesterday, dates)
- Grouped messages by date
- Smart avatar display
- Gradient background

**Props:**

- `messages`: Array of messages
- `currentUserId`: Current user's ID
- `otherUserAvatar`: Other user's avatar URL

### 6. **MessageBubble**

Individual message bubble.

**Features:**

- Different styling for sent/received messages
- Timestamp display
- Message status indicators (sent, delivered, read)
- Avatar display for received messages
- Gradient background for sent messages

**Props:**

- `message`: Message object
- `isOwn`: Whether message is from current user
- `showAvatar`: Whether to show avatar
- `avatar`: Avatar URL

### 7. **MessageInput**

Message input field with actions.

**Features:**

- Auto-expanding textarea
- Emoji button
- Attachment button
- Send button with gradient
- Enter to send (Shift+Enter for new line)
- Disabled state

**Props:**

- `onSendMessage`: Callback when message is sent
- `disabled`: Whether input is disabled

### 8. **EmptyChatState**

Displayed when no chat is selected.

**Features:**

- Beautiful gradient background
- Animated icon
- Welcome message
- Feature highlights

## 🎯 Features

### UI/UX Features:

- ✨ **Beautiful Gradient Design** - Modern indigo/purple gradient theme
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🔍 **Search Functionality** - Filter chats by name
- 🟢 **Online Status** - Real-time status indicators
- 💬 **Message Status** - Sent, delivered, and read indicators
- ⏰ **Smart Timestamps** - Minutes, hours, days formatting
- 📅 **Date Dividers** - Organized by Today, Yesterday, dates
- 🎨 **WhatsApp-like Design** - Familiar and intuitive interface
- ✏️ **Typing Indicator** - Shows when user is typing
- 🔔 **Unread Counters** - Badge showing unread messages
- 📸 **Avatar Display** - User profile pictures
- 🎯 **Active Chat Highlight** - Visual feedback for selected chat

### Technical Features:

- 🔧 **Fully Typed** - Complete TypeScript support
- 📦 **Modular Components** - Reusable and maintainable
- 🎭 **Mock Data** - Demo data for testing
- 🔄 **State Management** - React hooks for state
- 🎨 **Tailwind CSS** - Utility-first styling
- 📱 **Mobile-First** - Responsive breakpoints

## 🚀 Usage

```tsx
import ChatPage from "./pages/chat_page/chat_page";

function App() {
  return <ChatPage />;
}
```

## 📝 Type Definitions

### User

```typescript
type User = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
};
```

### Message

```typescript
type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "file";
};
```

### Chat

```typescript
type Chat = {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isTyping?: boolean;
};
```

## 🎨 Color Scheme

- **Primary Gradient**: Indigo (500) to Purple (600)
- **Background**: Gray (50-100)
- **Text**: Gray (700-900)
- **Borders**: Gray (200)
- **Status Colors**:
  - Online: Green (500)
  - Unread: Indigo (500)
  - Read: Blue (500)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Single column, toggleable sidebar)
- **Tablet**: 768px - 1024px (Split view)
- **Desktop**: > 1024px (Full split view)

## 🔄 State Management

The main chat page manages:

- Active chat selection
- Message history (per chat)
- Message status updates
- Sidebar visibility (mobile)

## 🎯 Future Enhancements

- [ ] Real-time message updates (WebSocket)
- [ ] Image/file attachments
- [ ] Voice messages
- [ ] Message reactions
- [ ] Group chats
- [ ] Message search
- [ ] Message editing/deletion
- [ ] Read receipts
- [ ] Typing indicators (real-time)
- [ ] Push notifications
- [ ] Message encryption indicators

## 🛠️ Customization

### Changing Colors

Update Tailwind classes in components:

- Gradient: `from-indigo-500 to-purple-600`
- Accent: `bg-indigo-500`, `text-indigo-500`

### Adding New Message Types

1. Update `Message` type in `types.ts`
2. Add rendering logic in `MessageBubble.tsx`
3. Add input UI in `MessageInput.tsx`

### Custom Avatars

Replace avatar URLs in `mockData.ts` or connect to your user API.

## 📚 Dependencies

- React 18+
- TypeScript
- Tailwind CSS

## 💡 Tips

1. **Performance**: Use `React.memo` for list items if dealing with large chat lists
2. **Accessibility**: Add ARIA labels for better screen reader support
3. **Testing**: Write tests for message sending/receiving logic
4. **Backend**: Connect to real backend by replacing mock data with API calls

---

Built with ❤️ for Alaska Project
