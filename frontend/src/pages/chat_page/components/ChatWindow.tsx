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
  onClearChat?: () => void;
  onRemoveFriend?: () => void;
};

export default function ChatWindow({
  user,
  messages,
  currentUserId,
  onSendMessage,
  onBackClick,
  showBack = false,
  onClearChat,
  onRemoveFriend,
}: ChatWindowProps) {
  return (
    <div className="relative flex flex-col h-full bg-background overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20">
        <ChatHeader
          user={user}
          onBackClick={onBackClick}
          showBack={showBack}
          onClearChat={onClearChat}
          onRemoveFriend={onRemoveFriend}
        />
      </div>
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        otherUserAvatar={user?.avatar}
      />
      <div className="z-20 bg-background relative border-t border-border">
        <MessageInput onSendMessage={onSendMessage} disabled={!user} />
      </div>
    </div>
  );
}
