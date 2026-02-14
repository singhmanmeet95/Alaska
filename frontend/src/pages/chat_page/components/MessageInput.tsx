import { useState, useRef, useEffect } from "react";

type MessageInputProps = {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
};

export default function MessageInput({
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <button
          type="button"
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-2 rounded-full hover:bg-zinc-900"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        <button
          type="button"
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-2 rounded-full hover:bg-zinc-900"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2 flex items-center shadow-inner">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-sm text-zinc-200 focus:outline-none resize-none max-h-32 placeholder-zinc-500 custom-scrollbar"
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`p-3.5 rounded-full transition-all duration-200 ${
            message.trim() && !disabled
              ? "bg-zinc-100 text-zinc-950 hover:bg-white shadow-lg shadow-zinc-900/20"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-800"
          }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
