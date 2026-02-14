interface ButtonProps {
  onClick?: () => void;
  isSubmitting?: boolean;
  buttonText?: string;
  className?: string;
}

export default function Button({
  onClick,
  isSubmitting,
  buttonText,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type="submit"
      disabled={isSubmitting}
      className={`w-3/4 flex justify-center group items-center text-sm font-medium p-2 rounded-full bg-zinc-100 text-zinc-950 h-10 transition-all duration-300 relative overflow-hidden active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/20 hover:bg-zinc-200 ${className || ""}`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center space-x-2">
          <span className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
        </span>
      ) : (
        <>
          <span className="relative z-10">{buttonText}</span>
        </>
      )}
    </button>
  );
}
