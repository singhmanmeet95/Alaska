type AuthOverlayProps = {
  isSignUp: boolean;
  onToggle: () => void;
};

export default function AuthOverlay({ isSignUp, onToggle }: AuthOverlayProps) {
  return (
    <div
      className="absolute z-10 bottom-0 top-0 w-1/2 text-left flex flex-col items-center justify-center bg-primary text-primary-foreground transition-all duration-500 tracking-wide border-l border-border"
      style={{ left: isSignUp ? "0" : "50%" }}
    >
      <div className="w-4/5 mx-auto text-left flex flex-col items-center justify-center text-center space-y-6 relative z-10">
        <h2 className="font-display-lg drop-shadow-md">
          {isSignUp ? "Hello!" : "Welcome!"}
        </h2>

        <div className="font-body-sm text-primary-foreground/80 space-y-4">
          {isSignUp ? (
            <p>
              Enter your personal details to create an account.
              <br />
              Already have one?
            </p>
          ) : (
            <p>
              To stay connected, please login with your personal info.
              <br />
              New here?
            </p>
          )}
        </div>

        {/* Toggle Button on the Overlay */}
        <button
          className="cursor-pointer px-10 py-3 w-2/3 rounded-[var(--radius-pill)] border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-button tracking-wide transition-all duration-300 shadow-sm"
          onClick={onToggle}
        >
          {isSignUp ? "LOGIN" : "SIGN UP"}
        </button>
      </div>
    </div>
  );
}
