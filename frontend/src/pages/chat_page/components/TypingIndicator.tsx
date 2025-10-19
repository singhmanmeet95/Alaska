export default function TypingIndicator() {
  return (
    <div className="flex items-end mb-4">
      <div className="w-8 mr-2"></div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
