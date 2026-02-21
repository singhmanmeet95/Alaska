import { useState, useRef, useEffect } from "react";
import { Smile, Image as ImageIcon, Send } from "lucide-react";

type MessageInputProps = {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
};

const EMOJI_LIST = [
  "👍",
  "❤️",
  "😂",
  "😮",
  "😢",
  "🙏",
  "🔥",
  "✨",
  "💯",
  "🎉",
  "😊",
  "😎",
  "🤔",
  "🙌",
  "👀",
  "👌",
  "🤌",
  "🚇",
  "🚉",
  "🚂",
];

export default function MessageInput({
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojis(false);
    textareaRef.current?.focus();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a temporary object URL for preview, this will be replaced with real Cloudinary API later
      const temporaryUrl = URL.createObjectURL(file);
      onSendMessage(`[Image: ${temporaryUrl}]`); // Fallback formatting until actual image components exists

      // Optionally trigger backend upload here later when Cloudinary is ready
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 relative">
      {/* Emoji Picker Popover */}
      {showEmojis && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-4 mb-2 bg-zinc-900 border border-zinc-800 p-3 rounded-2xl shadow-xl w-64 max-h-48 overflow-y-auto custom-scrollbar animate-fade-in-up z-50 grid grid-cols-5 gap-2"
        >
          {EMOJI_LIST.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl hover:bg-zinc-800 p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          disabled={disabled}
          className={`p-2 rounded-full transition-colors ${showEmojis ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"}`}
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Image Attachment Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-2 rounded-full hover:bg-zinc-900"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Text Input */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2 flex items-center shadow-inner">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-sm text-zinc-200 focus:outline-none resize-none max-h-32 placeholder-zinc-500 custom-scrollbar mt-1"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`p-3.5 rounded-full transition-all duration-200 flex items-center justify-center ${
            message.trim() && !disabled
              ? "bg-zinc-100 text-zinc-950 hover:bg-white shadow-lg shadow-zinc-900/20"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-800"
          }`}
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
}
