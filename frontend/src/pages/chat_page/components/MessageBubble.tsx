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
      className={`flex items-end mb-4 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwn && showAvatar && (
        <img
          src={avatar}
          alt="Avatar"
          className="w-8 h-8 rounded-full mr-2 mb-1"
        />
      )}
      {!isOwn && !showAvatar && <div className="w-8 mr-2"></div>}

      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
          isOwn ? "order-1" : "order-2"
        }`}
      >
        <div
          className={`px-4 py-2 rounded-2xl shadow-md ${
            isOwn
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none"
              : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
          }`}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>
        <div
          className={`flex items-center mt-1 space-x-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-xs text-gray-400">
            {formatTime(message.timestamp)}
          </span>
          {isOwn && (
            <span className="text-xs">
              {message.status === "read" && (
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  <path d="M12.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-1-1a1 1 0 011.414-1.414l.293.293 7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              )}
              {message.status === "delivered" && (
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  <path d="M12.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-1-1a1 1 0 011.414-1.414l.293.293 7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              )}
              {message.status === "sent" && (
                <svg
                  className="w-4 h-4 text-gray-400"
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
