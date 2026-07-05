import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import type { Message } from "../types";

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
  otherUserAvatar?: string;
};

export default function MessageList({
  messages,
  currentUserId,
  otherUserAvatar,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatDateDivider = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const groupedMessages = messages.reduce(
    (groups, message, index) => {
      const messageDate = new Date(message.timestamp);
      const dateKey = messageDate.toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push({ message, index });
      return groups;
    },
    {} as Record<string, Array<{ message: Message; index: number }>>,
  );

  return (
    <div className="flex-1 overflow-y-auto bg-background px-4 py-6 custom-scrollbar font-sans">
      {Object.entries(groupedMessages).map(([dateKey, messagesGroup]) => (
        <div key={dateKey}>
          {/* Date Divider */}
          <div className="flex justify-center mb-6">
            <span className="bg-card px-4 py-1.5 rounded-[var(--radius-pill)] font-eyebrow text-foreground/50 border border-border">
              {formatDateDivider(new Date(dateKey))}
            </span>
          </div>

          {/* Messages */}
          {messagesGroup.map(({ message, index }) => {
            const isOwn = message.senderId === currentUserId;
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const showAvatar =
              !prevMessage || prevMessage.senderId !== message.senderId;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                avatar={otherUserAvatar}
              />
            );
          })}
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}
