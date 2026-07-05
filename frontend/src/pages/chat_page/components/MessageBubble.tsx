import type { Message } from "../types";

type MessageBubbleProps = {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  avatar?: string;
};

export default function MessageBubble({
  message,
  isOwn,
  showAvatar = false,
  avatar,
}: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex items-end mb-4 animate-fade-in font-sans ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwn && (
        <div className="w-8 mr-2 flex-shrink-0">
          {showAvatar && (
            <img
              src={avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-[var(--radius-pill)] bg-card object-cover border border-border"
            />
          )}
        </div>
      )}

      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
          isOwn ? "order-1" : "order-2"
        }`}
      >
        <div
          className={`px-4 py-2.5 rounded-3xl shadow-sm ${
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-sm border border-primary"
              : "bg-card text-foreground rounded-bl-sm border border-border"
          } ${message.content.startsWith("[Image: ") ? "p-1.5" : ""}`}
        >
          {message.content.startsWith("[Image: ") &&
          message.content.endsWith("]") ? (
            <img
              src={message.content.replace("[Image: ", "").slice(0, -1)}
              alt="Uploaded content"
              className="max-w-full rounded-2xl max-h-64 object-cover"
            />
          ) : (
            <p className="font-body-sm break-words leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}
        </div>
        <div
          className={`flex items-center mt-1 space-x-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span className="font-eyebrow text-[10px] text-foreground/50 lowercase">
            {formatTime(message.timestamp)}
          </span>
          {isOwn && (
            <span className="flex items-center text-primary/80">
              {message.status === "read" && (
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  <path d="M12.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-1-1a1 1 0 011.414-1.414l.293.293 7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              )}
              {message.status === "delivered" && (
                <svg
                  className="w-3.5 h-3.5 text-foreground/30"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  <path d="M12.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-1-1a1 1 0 011.414-1.414l.293.293 7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              )}
              {message.status === "sent" && (
                <svg
                  className="w-3.5 h-3.5 text-foreground/30"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
