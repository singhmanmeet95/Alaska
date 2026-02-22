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
    <div className="flex flex-col h-full bg-zinc-950">
      <ChatHeader
        user={user}
        onBackClick={onBackClick}
        showBack={showBack}
        onClearChat={onClearChat}
        onRemoveFriend={onRemoveFriend}
      />
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        otherUserAvatar={user?.avatar}
      />
      <MessageInput onSendMessage={onSendMessage} disabled={!user} />
    </div>
  );
}
