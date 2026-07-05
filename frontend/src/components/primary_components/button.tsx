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
      className={`w-3/4 flex justify-center group items-center font-button text-[12px] p-2 rounded-[var(--radius-pill)] bg-primary text-primary-foreground h-10 transition-all duration-300 relative overflow-hidden active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:opacity-90 font-sans ${className || ""}`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center space-x-2">
          <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-[var(--radius-pill)] animate-spin"></span>
        </span>
      ) : (
        <>
          <span className="relative z-10">{buttonText}</span>
        </>
      )}
    </button>
  );
}
