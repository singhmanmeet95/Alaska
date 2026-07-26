import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../../../store/useAuthStore";
import type { Message, User as ChatUser } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const SOCKET_URL = import.meta.env.VITE_CHAT_GATEWAY_URL || "http://localhost:4001";
const CHAT_WORKER_URL = import.meta.env.VITE_CHAT_WORKER_URL || "http://localhost:4002/api";

export interface BackendChat {
  id?: string;
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  clientTimestamp?: number;
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

export function useChatLogic(chatId: string | undefined, navigate: any) {
  const { user, token } = useAuthStore();
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [backendChats, setBackendChats] = useState<BackendChat[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(chatId || null);
  const [showSidebar, setShowSidebar] = useState(!chatId);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [externalActiveUser, setExternalActiveUser] = useState<ChatUser | null>(null);

  // Connect socket
  useEffect(() => {
    if (!user) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"]
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
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

    const addMessageToState = (data: BackendChat, contactId: string) => {
      const newMsg: Message = {
        id: data._id || data.id || `temp-add-${Date.now()}`,
        senderId: data.senderId,
        content: data.message,
        timestamp: new Date(data.createdAt || data.clientTimestamp),
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

    newSocket.on("receive_message", (data: BackendChat) => {
      const otherUserId = data.senderId;
      addMessageToState(data, otherUserId);
      setBackendChats((prev) => [data, ...prev]);
    });

    newSocket.on("message_sent", (data: BackendChat) => {
      const otherUserId = data.receiverId;
      addMessageToState(data, otherUserId);
      setBackendChats((prev) => [data, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Fetch initial chats
  useEffect(() => {
    if (!user || !token) {
      navigate("/auth");
      return;
    }

    const fetchChats = async () => {
      let fetchedFriends: any[] = [];
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

        const msgsData: Record<string, Message[]> = {};
        allRawChats.forEach((c) => {
          const isSender = c.senderId === user.id;
          const contactId = isSender ? c.receiverId : c.senderId;

          if (!msgsData[contactId]) msgsData[contactId] = [];

          msgsData[contactId].push({
            id: c._id || c.id || `temp-init-${Date.now()}-${Math.random()}`,
            senderId: c.senderId,
            content: c.message,
            timestamp: new Date(c.createdAt || c.clientTimestamp),
            status: "read",
            type: "text",
          });
        });

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
          timestamp: new Date(c.createdAt || c.clientTimestamp),
          unreadCount: 0, 
        };
      })
      .filter((c) => friendIds.has(c.id));

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
            timestamp: new Date(0), 
            unreadCount: 0,
          });
          chatContactIds.add(friend.id); 
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

  const activeUser = useMemo(() => {
    const userObj = activeChatsList.find((chat) => chat.id === activeChat)?.user || externalActiveUser;
    if (userObj) {
      return { ...userObj, status: onlineUsers.has(userObj.id) ? "online" : "offline" } as ChatUser;
    }
    return null;
  }, [activeChatsList, externalActiveUser, activeChat, onlineUsers]);

  const handleSendMessage = (content: string) => {
    if (!activeChat || !user || !socket) return;

    const clientTimestamp = Date.now();

    const payload = {
      senderId: user.id,
      receiverId: activeChat,
      message: content,
      clientTimestamp,
    };

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMsg: Message = {
      id: tempId,
      senderId: user.id,
      content: content,
      timestamp: new Date(clientTimestamp),
      status: "delivered",
      type: "text",
    };
    
    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), optimisticMsg].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    }));

    socket.emit("send_message", payload);
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

  return {
    messages,
    activeChat,
    showSidebar,
    activeChatsList,
    activeUser,
    handleSendMessage,
    handleClearChat,
    handleRemoveFriend,
  };
}
