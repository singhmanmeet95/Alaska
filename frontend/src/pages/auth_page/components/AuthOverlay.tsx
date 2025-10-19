type AuthOverlayProps = {
  isSignUp: boolean;
  onToggle: () => void;
};

export default function AuthOverlay({ isSignUp, onToggle }: AuthOverlayProps) {
  return (
    <div
      className="absolute z-10 bottom-0 top-0 w-1/2 text-left flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white transition-all duration-500 tracking-wide"
      style={{ left: isSignUp ? "0" : "50%" }}
    >
      <div className="w-4/5 mx-auto text-left flex flex-col items-center justify-center">
        <h2 className="md:text-5xl lg:text-7xl font-extrabold">
          {isSignUp ? "Hello, Friend!" : "Welcome Back!"}
        </h2>

        <p className="mb-5 text-sm font-medium leading-relaxed">
          {isSignUp ? (
            <>
              Enter your personal details and start your journey with us.
              <br />
              <span className="tracking-wide text-white">
                Already have an account!
              </span>
            </>
          ) : (
            <>
              <span className="w-4/5 text-left text-white font-semibold">
                To stay connected with us <br /> please login with your personal
                info.
              </span>
              <br />
              <span className="tracking-wide text-white mt-10 font-medium">
                Not connected yet!
              </span>
            </>
          )}
        </p>

        {/* Toggle Button on the Overlay */}
        <button
          className="cursor-pointer px-10 py-1 w-2/3 relative overflow-hidden rounded-full bg-white text-red-500 md:text-sm lg:text-lg tracking-wide group transition-all duration-500 font-semibold"
          onClick={onToggle}
        >
          {isSignUp ? "LOGIN" : "SIGN UP"}
        </button>
      </div>
    </div>
  );
}
