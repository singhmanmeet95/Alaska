# Usage Examples

## Basic Implementation

### 1. Import and Use ChatPage

```tsx
// App.tsx
import ChatPage from "./pages/chat_page/chat_page";

function App() {
  return (
    <div className="h-screen">
      <ChatPage />
    </div>
  );
}

export default App;
```

### 2. Using Individual Components

```tsx
import {
  ChatSidebar,
  ChatWindow,
  EmptyChatState,
  MessageBubble,
} from "./pages/chat_page/components";

// Use components separately for custom layouts
```

## Customization Examples

### 1. Change Theme Colors

```tsx
// Update gradient in ChatHeader.tsx
<div className="h-16 bg-gradient-to-r from-blue-500 to-cyan-600">
  {/* Your custom gradient */}
</div>
```

### 2. Custom Message Status Icons

```tsx
// In MessageBubble.tsx
{
  message.status === "read" && (
    <svg className="w-4 h-4 text-green-500">{/* Your custom icon */}</svg>
  );
}
```

### 3. Add Custom Actions

```tsx
// In MessageInput.tsx - Add more action buttons
<button className="text-gray-400 hover:text-indigo-500">
  <svg>{/* Camera icon */}</svg>
</button>
```

## Integration with Backend

### 1. Connect to Real API

```tsx
// Replace mock data with API calls
import { useState, useEffect } from "react";

function ChatPage() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Fetch chats from API
    fetch("/api/chats")
      .then((res) => res.json())
      .then((data) => setChats(data));
  }, []);

  // Rest of your component
}
```

### 2. WebSocket for Real-time Updates

```tsx
useEffect(() => {
  const ws = new WebSocket("ws://your-api.com/chat");

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    setMessages((prev) => [...prev, message]);
  };

  return () => ws.close();
}, []);
```

### 3. Send Message to Backend

```tsx
const handleSendMessage = async (content: string) => {
  const message = {
    chatId: activeChat,
    content,
    timestamp: new Date(),
  };

  // Send to backend
  await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  // Update local state
  setMessages((prev) => [...prev, message]);
};
```

## Advanced Features

### 1. Image Upload

```tsx
// In MessageInput.tsx
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const { url } = await response.json();
  onSendMessage(url, "image");
};
```

### 2. Message Reactions

```tsx
// In MessageBubble.tsx
const [showReactions, setShowReactions] = useState(false);

<div className="relative">
  <button onClick={() => setShowReactions(!showReactions)}>Add Reaction</button>
  {showReactions && (
    <div className="absolute bottom-full mb-2 flex space-x-2">
      {["👍", "❤️", "😂", "😮", "😢"].map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className="text-2xl hover:scale-125 transition-transform"
        >
          {emoji}
        </button>
      ))}
    </div>
  )}
</div>;
```

### 3. Message Search

```tsx
const [searchQuery, setSearchQuery] = useState("");

const filteredMessages = messages.filter((msg) =>
  msg.content.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### 4. Voice Messages

```tsx
const [isRecording, setIsRecording] = useState(false);

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    // Handle audio data
  };

  mediaRecorder.start();
  setIsRecording(true);
};
```

## Testing Examples

### 1. Component Testing

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ChatListItem from "./components/ChatListItem";

test("displays chat item correctly", () => {
  const mockChat = {
    id: "1",
    user: { name: "Test User", avatar: "/test.jpg", status: "online" },
    lastMessage: "Hello",
    timestamp: new Date(),
    unreadCount: 2,
  };

  render(<ChatListItem chat={mockChat} isActive={false} onClick={() => {}} />);

  expect(screen.getByText("Test User")).toBeInTheDocument();
  expect(screen.getByText("Hello")).toBeInTheDocument();
  expect(screen.getByText("2")).toBeInTheDocument();
});
```

### 2. Message Sending Test

```tsx
test("sends message on submit", () => {
  const mockSend = jest.fn();

  render(<MessageInput onSendMessage={mockSend} />);

  const input = screen.getByPlaceholderText("Type a message...");
  const sendBtn = screen.getByRole("button");

  fireEvent.change(input, { target: { value: "Hello" } });
  fireEvent.click(sendBtn);

  expect(mockSend).toHaveBeenCalledWith("Hello");
});
```

## Styling Customization

### 1. Dark Mode

```tsx
// Add dark mode classes
<div className="dark:bg-gray-800 dark:text-white">{/* Your component */}</div>
```

### 2. Custom Fonts

```tsx
// In your component
<p className="font-['Poppins'] text-sm">Message content</p>
```

### 3. Animation Variants

```tsx
// Add custom animations
<div className="animate-slide-in">{/* Sliding animation */}</div>;

// In tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
};
```

## Performance Optimization

### 1. Virtualize Long Lists

```tsx
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={500}
  itemCount={messages.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <MessageBubble message={messages[index]} />
    </div>
  )}
</FixedSizeList>;
```

### 2. Lazy Load Images

```tsx
<img src={avatar} loading="lazy" className="w-12 h-12 rounded-full" />
```

### 3. Memoize Components

```tsx
import { memo } from "react";

const MessageBubble = memo(({ message, isOwn }) => {
  // Component code
});
```

---

These examples should help you customize and extend the chat functionality!
