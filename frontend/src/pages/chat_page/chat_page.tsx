import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatSidebar, ChatWindow, EmptyChatState } from "./components";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import type { Message, User as ChatUser } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const SOCKET_URL = import.meta.env.VITE_CHAT_GATEWAY_URL || "http://localhost:4001";
const CHAT_WORKER_URL = import.meta.env.VITE_CHAT_WORKER_URL || "http://localhost:4002/api";

interface BackendChat {
  id?: string;
  _id?: string;
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
  const [friends, setFriends] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(chatId || null);
  const [showSidebar, setShowSidebar] = useState(!chatId);
  const [sidebarWidth, setSidebarWidth] = useState(384);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [externalActiveUser, setExternalActiveUser] = useState<ChatUser | null>(
    null,
  );

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

      newSocket.emit("join_user", user.id);
      
      newSocket.emit("get_online_users", (users: string[]) => {
        setOnlineUsers(new Set(users));
      });
    });

    newSocket.on("user_status", ({ userId, status }: { userId: string, status: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (status === "online") next.add(userId);
        else next.delete(userId);
        return next;
      });
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
      id: data._id || data.id || `temp-add-${Date.now()}`,
      senderId: data.senderId,
      content: data.message,
      timestamp: new Date(data.createdAt),
      status: "delivered",
      type: "text",
    };
    setMessages((prev) => ({
      ...prev,
      [contactId]: [
        ...(prev[contactId] || []).filter((m) => m.id !== data.id && !(String(m.id).startsWith("temp-") && m.content === data.message)),
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
      let fetchedFriends: any[] = [];
      // 1. Fetch Friends
      try {
        const friendRes = await axios.get(`${API_URL}/friendships/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (friendRes.data && friendRes.data.data) {
          fetchedFriends = friendRes.data.data;
          setFriends(fetchedFriends);
        }
      } catch (friendErr) {
        console.error("Failed to fetch friends", friendErr);
      }

      // 2. Fetch Chats for each friend and activeChat
      try {
        const chatTargets = new Set(fetchedFriends.map((f) => f.id));
        if (chatId) chatTargets.add(chatId);

        let allRawChats: BackendChat[] = [];

        for (const targetId of chatTargets) {
          const res = await axios.get(
            `${CHAT_WORKER_URL}/chats/between/${user.id}/${targetId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data && res.data.data) {
            allRawChats = [...allRawChats, ...res.data.data];
          }
        }

        setBackendChats(allRawChats);

        // Group into messages
        const msgsData: Record<string, Message[]> = {};
        allRawChats.forEach((c) => {
          const isSender = c.senderId === user.id;
          const contactId = isSender ? c.receiverId : c.senderId;

          if (!msgsData[contactId]) msgsData[contactId] = [];

          msgsData[contactId].push({
            id: c._id || c.id || `temp-init-${Date.now()}-${Math.random()}`,
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
  }, [user, token, navigate, chatId]);

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

    const friendIds = new Set(
      Array.isArray(friends) ? friends.map((f: any) => f.id) : [],
    );

    // Map to frontend Chat format
    const frontendChats = Array.from(latestChatsMap.values())
      .map((c) => {
        const isSender = c.senderId === user.id;
        const contactId = isSender ? c.receiverId : c.senderId;
        const contactUser = (isSender ? c.receiver : c.sender) || friends.find((f: any) => f.id === contactId) || { name: "Unknown User", username: "Unknown" };

        const chatUser: ChatUser = {
          id: contactId,
          name: contactUser.name || contactUser.username,
          avatar:
            contactUser.profile_image ||
            contactUser.image ||
            `https://ui-avatars.com/api/?name=${contactUser.name || "User"}&background=random&color=fff`,
          status: onlineUsers.has(contactId) ? "online" : "offline",
        };

        return {
          id: contactId,
          user: chatUser,
          lastMessage: c.message,
          timestamp: new Date(c.createdAt),
          unreadCount: 0, // Unread count logic not maintained in DB schema currently
        };
      })
      .filter((c) => friendIds.has(c.id));

    // Merge friends who don't have chat history yet
    const chatContactIds = new Set(frontendChats.map((c: any) => c.id));

    if (Array.isArray(friends)) {
      friends.forEach((friend) => {
        if (!chatContactIds.has(friend.id)) {
          frontendChats.push({
            id: friend.id,
            user: {
              id: friend.id,
              name: friend.name || friend.username || "Unknown Friend",
              avatar:
                friend.profile_image ||
                friend.image ||
                `https://ui-avatars.com/api/?name=${friend.name || friend.username || "User"}&background=random&color=fff`,
              status: onlineUsers.has(friend.id) ? "online" : "offline",
            },
            lastMessage: "Say hello!",
            timestamp: new Date(0), // Push to bottom of list
            unreadCount: 0,
          });
          chatContactIds.add(friend.id); // Prevent dupes if friends list has dupes
        }
      });
    }

    return frontendChats.sort((a: any, b: any) => {
      const timeA =
        a.timestamp instanceof Date && !isNaN(a.timestamp.getTime())
          ? a.timestamp.getTime()
          : 0;
      const timeB =
        b.timestamp instanceof Date && !isNaN(b.timestamp.getTime())
          ? b.timestamp.getTime()
          : 0;
      return timeB - timeA;
    });
  }, [backendChats, friends, user, onlineUsers]);

  useEffect(() => {
    if (chatId) {
      setActiveChat(chatId);
      setShowSidebar(false);
    } else {
      setActiveChat(null);
      setShowSidebar(true);
      setExternalActiveUser(null);
    }
  }, [chatId, user, onlineUsers, token]);

  useEffect(() => {
    if (activeChat && !activeChatsList.find((c) => c.id === activeChat)) {
      // User is not in chats/friends list locally yet, fetch their details so the header isn't blank
      axios
        .get(`${API_URL}/users/${activeChat}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then((res) => {
          if (res.data && res.data.data) {
            const u = res.data.data;
            setExternalActiveUser({
              id: u.id,
              name: u.name || u.username || "Unknown User",
              avatar:
                u.profile_image ||
                u.image ||
                `https://ui-avatars.com/api/?name=${u.name || u.username || "User"}&background=random&color=fff`,
              status: onlineUsers.has(u.id) ? "online" : "offline",
            });
          }
        })
        .catch((err) =>
          console.error("Could not fetch active user details", err),
        );
    }
  }, [activeChat, activeChatsList, onlineUsers, token]);

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

    // Optimistic update
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMsg: Message = {
      id: tempId,
      senderId: user.id,
      content: content,
      timestamp: new Date(),
      status: "delivered",
      type: "text",
    };
    
    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), optimisticMsg],
    }));

    // Emit via socket handling full lifecycle
    socket.emit("send_message", payload);
  };

  const handleBackClick = () => {
    navigate("/chat");
  };

  const handleClearChat = async () => {
    if (!activeChat || !user || !token) return;
    if (!confirm("Are you sure you want to clear this entire chat history?"))
      return;

    try {
      await axios.delete(`${CHAT_WORKER_URL}/chats/between/${user.id}/${activeChat}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => ({ ...prev, [activeChat]: [] }));
      setBackendChats((prev) => {
        const remaining = prev.filter(
          (c) => !(c.senderId === activeChat || c.receiverId === activeChat),
        );
        const lastChat = prev.find(
          (c) => c.senderId === activeChat || c.receiverId === activeChat,
        );

        if (lastChat) {
          // Keep a stub so the user doesn't disappear from the sidebar immediately
          return [
            {
              ...lastChat,
              message: "Chat history cleared",
              createdAt: new Date().toISOString(),
            },
            ...remaining,
          ];
        }
        return remaining;
      });
    } catch (err) {
      console.error("Failed to clear chat", err);
      alert("Failed to clear chat");
    }
  };

  const handleRemoveFriend = async () => {
    if (!activeChat || !user || !token) return;
    if (
      !confirm(
        "Are you sure you want to remove this person as a friend? This chat will also be cleared.",
      )
    )
      return;

    try {
      await axios.delete(`${API_URL}/friendships/user/${activeChat}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optional: clear chats locally / on backend too
      await axios
        .delete(`${CHAT_WORKER_URL}/chats/between/${user.id}/${activeChat}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((e) =>
          console.error("Failed clearing chats when removing friend", e),
        );

      setFriends((prev) => prev.filter((f) => f.id !== activeChat));
      setMessages((prev) => {
        const next = { ...prev };
        delete next[activeChat];
        return next;
      });
      setBackendChats((prev) =>
        prev.filter(
          (c) => !(c.senderId === activeChat || c.receiverId === activeChat),
        ),
      );
      setActiveChat(null);
      setShowSidebar(true);
      navigate("/chat");
    } catch (err) {
      console.error("Failed to remove friend", err);
      alert("Failed to remove friend");
    }
  };

  const activeUser = useMemo(() => {
    const userObj = activeChatsList.find((chat) => chat.id === activeChat)?.user || externalActiveUser;
    if (userObj) {
      return { ...userObj, status: onlineUsers.has(userObj.id) ? "online" : "offline" } as ChatUser;
    }
    return null;
  }, [activeChatsList, externalActiveUser, activeChat, onlineUsers]);

  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  if (!user) return null; // Handle unauthenticated edge visually smoothly

  return (
    <div
      className="h-full flex overflow-hidden bg-background font-sans"
      style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
    >
      {/* Sidebar */}
      <div
        className={`${
          showSidebar
            ? "w-full md:w-[var(--sidebar-width)]"
            : "hidden md:flex md:w-[var(--sidebar-width)] flex-col"
        } relative flex-shrink-0 border-r border-border transition-none h-full`}
      >
        <ChatSidebar
          chats={activeChatsList}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
        />
        {/* Resize Handle */}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-border active:bg-border/80 z-50 hidden md:block transition-colors"
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
            onClearChat={handleClearChat}
            onRemoveFriend={handleRemoveFriend}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}
