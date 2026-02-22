type AuthOverlayProps = {
  isSignUp: boolean;
  onToggle: () => void;
};

export default function AuthOverlay({ isSignUp, onToggle }: AuthOverlayProps) {
  return (
    <div
      className="absolute z-10 bottom-0 top-0 w-1/2 text-left flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 transition-all duration-500 tracking-wide border-l border-zinc-800"
      style={{ left: isSignUp ? "0" : "50%" }}
    >
      {/* Dark overlay to soften the background */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent"></div>
      <div className="w-4/5 mx-auto text-left flex flex-col items-center justify-center text-center space-y-6 relative z-10">
        <h2 className="md:text-5xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-md">
          {isSignUp ? "Hello!" : "Welcome!"}
        </h2>

        <div className="text-sm font-medium text-zinc-400 space-y-4">
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
          className="cursor-pointer px-10 py-3 w-2/3 rounded-xl border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white md:text-sm lg:text-base tracking-wide transition-all duration-300 font-bold shadow-sm"
          onClick={onToggle}
        >
          {isSignUp ? "LOGIN" : "SIGN UP"}
        </button>
      </div>
    </div>
  );
}
