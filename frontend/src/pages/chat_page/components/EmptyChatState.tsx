export default function EmptyChatState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur-3xl opacity-20 rounded-full"></div>
          <svg
            className="w-32 h-32 mx-auto text-indigo-500 relative"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-700">
          Welcome to Alaska Chat
        </h2>
        <p className="text-gray-500 max-w-md">
          Select a chat from the sidebar to start messaging your friends and
          colleagues
        </p>
        <div className="flex items-center justify-center space-x-4 pt-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
