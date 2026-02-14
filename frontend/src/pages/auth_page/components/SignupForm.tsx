import ImageUploader from "./ImageUploader";

type SignupFormProps = {
  name: string;
  email: string;
  password: string;
  about?: string;
  imageUrl?: string;
  isSubmitting: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAboutChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageUpload: (file: File) => Promise<void>;
  onSubmit: () => void;
  onLoginClick: () => void;
};

export default function SignupForm({
  name,
  email,
  password,
  about,
  imageUrl,
  isSubmitting,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onAboutChange,
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
          className="w-full h-10 px-4 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 text-zinc-100 placeholder-zinc-500 transition-colors"
        />

        <div className="flex w-full flex-row items-center gap-2 justify-between">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onEmailChange}
            className="w-1/2 h-10 px-4 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 text-zinc-100 placeholder-zinc-500 transition-colors"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
            className="w-1/2 h-10 px-4 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 text-zinc-100 placeholder-zinc-500 transition-colors"
          />
        </div>

        {/* Profile Image Dropzone */}
        <div className="flex w-full flex-row h-24 items-center gap-2 justify-between">
          <textarea
            name="about"
            placeholder="Tell us about yourself..."
            value={about}
            onChange={onAboutChange}
            className="w-1/2 h-full p-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 text-zinc-100 placeholder-zinc-500 transition-colors resize-none text-xs"
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
          className="w-full h-10 mt-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "CREATE ACCOUNT"
          )}
        </button>

        <p className="text-center text-xs mt-4 text-zinc-500">
          Already have an account?{" "}
          <span
            className="text-zinc-300 hover:text-white cursor-pointer font-medium underline-offset-4 hover:underline transition-all"
            onClick={onLoginClick}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
