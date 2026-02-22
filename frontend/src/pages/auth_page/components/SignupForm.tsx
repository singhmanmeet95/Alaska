import ImageUploader from "./ImageUploader";

type SignupFormProps = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  imageUrl?: string;
  isSubmitting: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBioChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageUpload: (file: File) => Promise<void>;
  onSubmit: () => void;
  onLoginClick: () => void;
};

export default function SignupForm({
  name,
  email,
  password,
  bio,
  imageUrl,
  isSubmitting,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onBioChange,
  onImageUpload,
  onSubmit,
  onLoginClick,
}: SignupFormProps) {
  return (
    <div className="w-1/2 text-xs xl:text-sm font-medium h-full flex flex-col items-center justify-center py-4 text-zinc-300">
      <h2 className="font-bold mb-6 text-2xl md:text-3xl tracking-tight text-white">
        SIGN UP
      </h2>

      <div className="w-full max-w-xs space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={onNameChange}
          className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
        />

        <div className="flex w-full flex-row items-center gap-2 justify-between">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onEmailChange}
            className="w-1/2 h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
            className="w-1/2 h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex w-full flex-row h-24 items-center gap-2 justify-between">
          <textarea
            name="bio"
            placeholder="Tell us about yourself (bio)..."
            value={bio}
            onChange={onBioChange}
            className="w-1/2 h-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all resize-none text-xs shadow-sm"
          />
          <div className="w-1/2 h-full">
            <ImageUploader
              imageUrl={imageUrl}
              onImageUpload={onImageUpload}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* SIGN UP Button */}
        <button
          onClick={onSubmit}
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 mt-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "CREATE ACCOUNT"
          )}
        </button>

        <p className="text-center text-xs mt-4 text-zinc-500">
          Already have an account?{" "}
          <span
            className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer transition-colors"
            onClick={onLoginClick}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
