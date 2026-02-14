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
    <div className="w-1/2 text-xs xl:text-sm font-medium flex flex-col items-center justify-center p-8 text-zinc-300">
      <h2 className="font-bold mb-6 text-2xl md:text-3xl tracking-tight text-white">
        LOGIN
      </h2>

      <div className="w-full max-w-xs space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={onEmailChange}
          className="w-full h-10 px-4 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 text-zinc-100 placeholder-zinc-500 transition-colors"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          className="w-full h-10 px-4 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 text-zinc-100 placeholder-zinc-500 transition-colors"
        />

        {/* LOGIN Button */}
        <button
          onClick={onSubmit}
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 mt-4 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "SIGN IN"
          )}
        </button>

        <p className="text-center text-xs mt-6 text-zinc-500">
          Don't have an account?{" "}
          <span
            className="text-zinc-300 hover:text-white cursor-pointer font-medium underline-offset-4 hover:underline transition-all"
            onClick={onSignUpClick}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
