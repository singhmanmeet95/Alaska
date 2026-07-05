type LoginFormProps = {
  email: string;
  password: string;
  isSubmitting: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onSignUpClick: () => void;
};

export default function LoginForm({
  email,
  password,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSignUpClick,
}: LoginFormProps) {
  return (
    <div className="w-3/4 flex flex-col items-center justify-center p-8 bg-background text-foreground">
      <h2 className="font-headline mb-8">LOGIN</h2>

      <form 
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="w-full max-w-lg space-y-4 font-body-sm"
      >
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={onEmailChange}
          className="w-full h-11 px-4 bg-background border border-border rounded-[8px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-foreground/50 transition-all shadow-sm"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          className="w-full h-11 px-4 bg-background border border-border rounded-[8px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-foreground/50 transition-all shadow-sm"
        />

        {/* LOGIN Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 mt-6 bg-primary text-primary-foreground font-button rounded-[var(--radius-pill)] hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "SIGN IN"
          )}
        </button>

        <p className="text-center font-body-sm mt-6 text-foreground/70">
          Don't have an account?{" "}
          <span
            className="text-primary font-bold cursor-pointer hover:underline transition-colors"
            onClick={onSignUpClick}
          >
            Create one
          </span>
        </p>
      </form>
    </div>
  );
}
