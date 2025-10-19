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
    <div className="w-1/2 text-xs xl:text-sm font-medium h-full flex flex-col items-center justify-center py-4">
      <h2 className="font-bold mb-3 text-2xl md:text-3xl tracking-wide">
        SIGN UP
      </h2>
      <hr className="border-red-600 border-2 mb-3 w-2/3 xl:w-3/5" />
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={onNameChange}
        className="w-3/5 h-8 p-3 mb-3 text-xs xl:text-sm font-medium bg-gray-200 rounded-lg tracking-wide"
      />
      <div className="flex w-3/5 flex-row items-center gap-2 justify-between mb-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
          className="w-1/2 text-xs xl:text-sm font-medium h-8 p-3 mb-3 bg-gray-200 rounded-lg tracking-wide"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          className="w-1/2 text-xs xl:text-sm font-medium h-8 p-3 mb-3 bg-gray-200 rounded-lg tracking-wide"
        />
      </div>

      {/* Profile Image Dropzone with fixed height */}
      <div className="flex w-3/5 flex-row h-30 items-center gap-2 justify-between mb-3">
        <textarea
          name="about"
          placeholder="About"
          value={about}
          onChange={onAboutChange}
          className="w-1/2 text-xs font-medium h-full p-3 mb-3 bg-gray-200 rounded-lg tracking-wide"
        />
        <ImageUploader
          imageUrl={imageUrl}
          onImageUpload={onImageUpload}
          className="h-full w-1/2 mb-3"
        />
      </div>

      {/* SIGN UP Button */}
      <button
        onClick={onSubmit}
        type="submit"
        disabled={isSubmitting}
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
              SIGN UP
            </span>
          </>
        )}
      </button>
      <p className="mt-3 tracking-wide">
        Already have an account?{" "}
        <span
          className="cursor-pointer hover:text-blue-500"
          onClick={onLoginClick}
        >
          LOGIN
        </span>
      </p>
    </div>
  );
}
