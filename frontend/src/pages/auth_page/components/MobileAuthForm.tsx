import { useDropzone } from "react-dropzone";

type MobileAuthFormProps = {
  isSignUp: boolean;
  signupData: {
    name: string;
    email: string;
    password: string;
    bio?: string;
    image?: string;
  };
  loginData: {
    email: string;
    password: string;
  };
  isSubmitting: boolean;
  onSignupChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignupSubmit: () => void;
  onLoginSubmit: () => void;
  onToggleAuth: () => void;
  onImageUpload: (file: File) => Promise<void>;
};

export default function MobileAuthForm({
  isSignUp,
  signupData,
  loginData,
  isSubmitting,
  onSignupChange,
  onLoginChange,
  onSignupSubmit,
  onLoginSubmit,
  onToggleAuth,
  onImageUpload,
}: MobileAuthFormProps) {
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await onImageUpload(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  if (isSignUp) {
    return (
      <div className="flex flex-col items-center justify-center bg-zinc-950/90 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        <h2 className="font-bold text-2xl sm:text-3xl mb-6 tracking-tight text-white drop-shadow-md">
          SIGN UP
        </h2>

        <div className="w-full space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={signupData.name}
            onChange={onSignupChange}
            className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signupData.email}
            onChange={onSignupChange}
            className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signupData.password}
            onChange={onSignupChange}
            className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
          />
          <input
            type="text"
            name="bio"
            placeholder="About you (bio)"
            value={signupData.bio}
            onChange={onSignupChange}
            className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
          />

          {/* Profile Image Dropzone for Mobile */}
          <div
            className="border-2 border-dashed border-zinc-700 bg-zinc-900/50 p-4 rounded-xl text-center mb-4 transition-colors hover:border-orange-500/50 cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {signupData.image ? (
              <img
                src={signupData.image}
                alt="Profile"
                className="mt-2 w-24 h-24 object-cover rounded-full mx-auto border-2 border-zinc-700"
              />
            ) : (
              <div className="flex flex-col items-center text-zinc-500">
                <svg
                  className="w-8 h-8 mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs">Upload profile image</p>
              </div>
            )}
          </div>

          {/* Mobile SIGN UP Button */}
          <button
            onClick={onSignupSubmit}
            disabled={isSubmitting}
            className="w-full h-11 mt-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "CREATE ACCOUNT"
            )}
          </button>

          <p className="text-center text-xs mt-6 text-zinc-500">
            Already have an account?{" "}
            <span
              className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer transition-colors"
              onClick={onToggleAuth}
            >
              SIGN IN
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-5/6 h-full mx-auto flex flex-col items-center justify-center bg-zinc-950/90 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md tracking-wide">
      <h2 className="font-bold text-2xl sm:text-3xl tracking-tight mb-6 text-white drop-shadow-md">
        LOGIN
      </h2>
      <div className="w-full space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={onLoginChange}
          className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={onLoginChange}
          className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-zinc-100 placeholder-zinc-500 transition-all shadow-sm"
        />
        {/* Mobile LOGIN Button */}
        <button
          onClick={onLoginSubmit}
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
            onClick={onToggleAuth}
          >
            SIGN UP
          </span>
        </p>
      </div>
    </div>
  );
}
