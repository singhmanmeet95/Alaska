import { useDropzone } from "react-dropzone";
import InputBox from "../../../components/primary_components/input_box";
import Button from "../../../components/primary_components/button";

type MobileAuthFormProps = {
  isSignUp: boolean;
  signupData: {
    name: string;
    email: string;
    password: string;
    about?: string;
    image?: string;
  };
  loginData: {
    email: string;
    password: string;
  };
  isSubmitting: boolean;
  onSignupChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-lg bg-opacity-90 tracking-wide">
        <h2 className="font-bold text-2xl sm:text-3xl mb-3 tracking-widest">
          SIGN UP
        </h2>
        <hr className="border-red-600 border-2 mb-5 w-2/3" />
        <InputBox
          type="text"
          name="name"
          placeholder="Name"
          value={signupData.name}
          onChange={onSignupChange}
        />
        <InputBox
          type="email"
          name="email"
          placeholder="Email"
          value={signupData.email}
          onChange={onSignupChange}
        />
        <InputBox
          type="password"
          name="password"
          placeholder="Password"
          value={signupData.password}
          onChange={onSignupChange}
        />
        <InputBox
          type="text"
          name="about"
          placeholder="About you"
          value={signupData.about}
          onChange={onSignupChange}
        />

        {/* Profile Image Dropzone for Mobile */}
        <div
          className="border-2 w-11/12 border-dashed border-green-400 p-4 rounded-xl text-center mb-4"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {signupData.image ? (
            <img
              src={signupData.image}
              alt="Profile"
              className="mt-2 w-32 h-32 object-cover rounded-lg mx-auto"
            />
          ) : (
            <p className="text-sm">
              Drag & drop profile image here or click to select
            </p>
          )}
        </div>
        {/* Mobile SIGN UP Button */}
        <Button
          buttonText="SIGN UP"
          onClick={onSignupSubmit}
          isSubmitting={isSubmitting}
        />

        <p className="text-sm sm:text-base mt-3 tracking-wide">
          Already have an account?{" "}
          <span className="cursor-pointer text-blue-500" onClick={onToggleAuth}>
            LOGIN
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-5/6 h-full mx-auto flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-xl bg-opacity-90 tracking-wide">
      <h2 className="font-bold text-2xl sm:text-3xl tracking-widest">LOGIN</h2>
      <hr className="border-red-600 border-2 mt-2 mb-7 w-5/6" />
      <InputBox
        type="email"
        name="email"
        placeholder="Email"
        value={loginData.email}
        onChange={onLoginChange}
      />
      <InputBox
        type="password"
        name="password"
        placeholder="Password"
        value={loginData.password}
        onChange={onLoginChange}
      />
      {/* Mobile LOGIN Button */}
      <Button
        buttonText="LOGIN"
        onClick={onLoginSubmit}
        isSubmitting={isSubmitting}
      />

      <p className="ml-4 text-sm sm:text-base mt-3 tracking-wide">
        Don't have an account?{" "}
        <span className="text-blue-500 cursor-pointer" onClick={onToggleAuth}>
          Sign Up
        </span>
      </p>
    </div>
  );
}
