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
    <div className="w-1/2 flex flex-col items-center justify-center py-4 bg-background text-foreground">
      <h2 className="font-headline mb-6">SIGN UP</h2>

      <form 
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="w-full max-w-sm space-y-3 font-body-sm"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={onNameChange}
          className="w-full h-11 px-4 bg-background border border-border rounded-[8px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-foreground/50 transition-all shadow-sm"
        />

        <div className="flex w-full flex-row items-center gap-2 justify-between">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={onEmailChange}
            className="w-1/2 h-11 px-4 bg-background border border-border rounded-[8px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-foreground/50 transition-all shadow-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
            className="w-1/2 h-11 px-4 bg-background border border-border rounded-[8px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-foreground/50 transition-all shadow-sm"
          />
        </div>

        <div className="flex w-full flex-row h-24 items-center gap-2 justify-between">
          <textarea
            name="bio"
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={onBioChange}
            className="w-1/2 h-full p-3 bg-background border border-border rounded-[8px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-foreground/50 transition-all resize-none shadow-sm"
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
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 mt-4 bg-primary text-primary-foreground font-button rounded-[var(--radius-pill)] hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "CREATE ACCOUNT"
          )}
        </button>

        <p className="text-center font-body-sm mt-4 text-foreground/70">
          Already have an account?{" "}
          <span
            className="text-primary font-bold cursor-pointer hover:underline transition-colors"
            onClick={onLoginClick}
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}
