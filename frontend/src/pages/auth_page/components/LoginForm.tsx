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
    <div className="w-1/2 text-xs xl:text-sm font-medium flex flex-col items-center justify-center p-8">
      <h2 className="font-bold mb-3 text-2xl md:text-3xl tracking-wide">
        LOGIN
      </h2>
      <hr className="border-red-600 border-2 mb-3 w-2/3 xl:w-3/5" />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={onEmailChange}
        className="w-3/5 h-8 p-3 mb-3 text-xs xl:text-sm font-medium bg-gray-200 rounded-lg tracking-wide"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={onPasswordChange}
        className="w-3/5 h-8 p-3 mb-3 text-xs xl:text-sm font-medium bg-gray-200 rounded-lg tracking-wide"
      />
      {/* LOGIN Button */}
      <button
        onClick={onSubmit}
        type="submit"
        className="cursor-pointer h-8 lg:h-9 w-3/5 xl:h-10 relative overflow-hidden border-2 border-red-500 rounded-full bg-red-500 text-white tracking-wide group transition-all duration-500 hover:border-red-500"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center space-x-2">
            <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
          </span>
        ) : (
          <>
            <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
            <span className="relative group-hover:text-red-500 transition-colors duration-500">
              LOGIN
            </span>
          </>
        )}
      </button>
      <p className="text-base md:text-xs :text-sm mt-3 tracking-wide">
        Don't have an account?{" "}
        <span
          className="hover:text-blue-500 cursor-pointer"
          onClick={onSignUpClick}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}
