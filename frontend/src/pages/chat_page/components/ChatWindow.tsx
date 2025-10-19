import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { User, Message } from "../types";

type ChatWindowProps = {
  user: User | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBackClick?: () => void;
  showBack?: boolean;
};

export default function ChatWindow({
  user,
  messages,
  currentUserId,
  onSendMessage,
  onBackClick,
  showBack = false,
}: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader user={user} onBackClick={onBackClick} showBack={showBack} />
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        otherUserAvatar={user?.avatar}
      />
      <MessageInput onSendMessage={onSendMessage} disabled={!user} />
    </div>
  );
}
