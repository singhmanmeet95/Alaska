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
          className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
        />

        {/* LOGIN Button */}
        <button
          onClick={onSubmit}
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 mt-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "SIGN IN"
          )}
        </button>

        <p className="text-center text-xs mt-6 text-zinc-500">
          Don't have an account?{" "}
          <span
            className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer transition-colors"
            onClick={onSignUpClick}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
