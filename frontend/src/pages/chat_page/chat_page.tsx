import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatSidebar, ChatWindow, EmptyChatState } from "./components";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import type { Message, User as ChatUser } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:3000";

interface BackendChat {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    username: string;
    email: string;
    image?: string;
    profile_image?: string;
  };
  receiver: {
    id: string;
    name: string;
    username: string;
    email: string;
    image?: string;
    profile_image?: string;
  };
}

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [backendChats, setBackendChats] = useState<BackendChat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(chatId || null);
  const [showSidebar, setShowSidebar] = useState(!chatId);
  const [sidebarWidth, setSidebarWidth] = useState(384);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Resize handler
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setSidebarWidth(Math.max(280, Math.min(newWidth, 600)));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
  };

  // Connect socket
  useEffect(() => {
    if (!user) return;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Chat Server");
      newSocket.emit("join_user", user.id);
    });

    newSocket.on("receive_message", (data: BackendChat) => {
      // Incoming message from someone
      const otherUserId = data.senderId;
      addMessageToState(data, otherUserId);
      setBackendChats((prev) => [data, ...prev]);
    });

    newSocket.on("message_sent", (data: BackendChat) => {
      // Confirmed our sent message
      const otherUserId = data.receiverId;
      addMessageToState(data, otherUserId);
      setBackendChats((prev) => [data, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const addMessageToState = (data: BackendChat, contactId: string) => {
    const newMsg: Message = {
      id: data.id,
      senderId: data.senderId,
      content: data.message,
      timestamp: new Date(data.createdAt),
      status: "delivered",
      type: "text",
    };
    setMessages((prev) => ({
      ...prev,
      [contactId]: [
        ...(prev[contactId] || []).filter((m) => m.id !== data.id),
        newMsg,
      ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    }));
  };

  // Fetch initial chats
  useEffect(() => {
    if (!user || !token) {
      navigate("/auth");
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await axios.get(`${API_URL}/chats/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawChats: BackendChat[] = res.data.data;
        setBackendChats(rawChats);

        // Group into messages
        const msgsData: Record<string, Message[]> = {};
        rawChats.forEach((c) => {
          const isSender = c.senderId === user.id;
          const contactId = isSender ? c.receiverId : c.senderId;

          if (!msgsData[contactId]) msgsData[contactId] = [];

          msgsData[contactId].push({
            id: c.id,
            senderId: c.senderId,
            content: c.message,
            timestamp: new Date(c.createdAt),
            status: "read",
            type: "text",
          });
        });

        // Ensure chronological order for all lists
        Object.keys(msgsData).forEach((key) => {
          msgsData[key].sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
          );
        });

        setMessages(msgsData);
      } catch (error) {
        console.error("Failed to fetch chats", error);
      }
    };
    fetchChats();
  }, [user, token, navigate]);

  // Transform backend contacts into ChatSidebar prop
  const activeChatsList = useMemo(() => {
    if (!user) return [];

    // Track most recent chat per unique user
    const latestChatsMap = new Map<string, BackendChat>();

    backendChats.forEach((c) => {
      const contactId = c.senderId === user.id ? c.receiverId : c.senderId;
      const existing = latestChatsMap.get(contactId);

      if (!existing || new Date(c.createdAt) > new Date(existing.createdAt)) {
        latestChatsMap.set(contactId, c);
      }
    });

    // Map to frontend Chat format
    return Array.from(latestChatsMap.values())
      .map((c) => {
        const isSender = c.senderId === user.id;
        const contactId = isSender ? c.receiverId : c.senderId;
        const contactUser = isSender ? c.receiver : c.sender;

        const chatUser: ChatUser = {
          id: contactId,
          name: contactUser.name || contactUser.username,
          avatar:
            contactUser.profile_image ||
            contactUser.image ||
            `https://ui-avatars.com/api/?name=${contactUser.name || "User"}&background=random&color=fff`,
          status: "online", // Fallback since we lack presence tracking at scale
        };

        return {
          id: contactId,
          user: chatUser,
          lastMessage: c.message,
          timestamp: new Date(c.createdAt),
          unreadCount: 0, // Unread count logic not maintained in DB schema currently
        };
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [backendChats, user]);

  useEffect(() => {
    if (chatId) {
      setActiveChat(chatId);
      setShowSidebar(false);
    } else {
      setActiveChat(null);
      setShowSidebar(true);
    }
  }, [chatId]);

  const handleChatSelect = (newChatId: string) => {
    navigate(`/chat/${newChatId}`);
  };

  const handleSendMessage = (content: string) => {
    if (!activeChat || !user || !socket) return;

    const payload = {
      senderId: user.id,
      receiverId: activeChat,
      message: content,
    };

    // Emit via socket handling full lifecycle
    socket.emit("send_message", payload);
  };

  const handleBackClick = () => {
    navigate("/chat");
  };

  if (!user) return null; // Handle unauthenticated edge visually smoothly

  const activeUser =
    activeChatsList.find((chat) => chat.id === activeChat)?.user || null;
  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  return (
    <div
      className="h-screen flex overflow-hidden bg-zinc-950"
      style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
    >
      {/* Sidebar */}
      <div
        className={`${
          showSidebar
            ? "w-full md:w-[var(--sidebar-width)]"
            : "hidden md:flex md:w-[var(--sidebar-width)] flex-col"
        } relative flex-shrink-0 border-r border-zinc-800 transition-none h-full`}
      >
        <ChatSidebar
          chats={activeChatsList}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
        />
        {/* Resize Handle */}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-zinc-600 active:bg-zinc-500 z-50 hidden md:block transition-colors"
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`${showSidebar ? "hidden md:flex" : "flex"} flex-1 flex-col h-full overflow-hidden`}
      >
        {activeChat ? (
          <ChatWindow
            user={activeUser}
            messages={currentMessages}
            currentUserId={user.id}
            onSendMessage={handleSendMessage}
            onBackClick={handleBackClick}
            showBack={!showSidebar}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}
