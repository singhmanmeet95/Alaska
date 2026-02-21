export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-zinc-800 border-t-zinc-100 rounded-full animate-spin mx-auto"></div>
          <div className="mt-6 text-zinc-400 text-sm font-medium tracking-wide uppercase">
            Loading Alaska...
          </div>
        </div>
      </div>
    </div>
  );
}
