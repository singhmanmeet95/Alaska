import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/primary_components/wrong_banner";
import AuthBackground from "./components/AuthBackground";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import AuthOverlay from "./components/AuthOverlay";
import MobileAuthForm from "./components/MobileAuthForm";

type SignupInput = {
  name: string;
  email: string;
  password: string;
  image?: string;
  about?: string;
};

type SigninInput = {
  email: string;
  password: string;
};

export default function Credentials() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [message] = useState<string>("");
  const [isSubmitting] = useState<boolean>(false);
  const [signupData, setSignupData] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
    image: "",
    about: "",
  });
  
  const [loginData, setLoginData] = useState<SigninInput>({
    email: "",
    password: "",
  });
  const uploadImage = async (file: File) => {
    const body = new FormData();
    body.append("file", file);

    const res = await fetch(
      "https://backend.mrityunjay-jha2005.workers.dev/api/v1/image/upload",
      {
        method: "POST",
        body,
      }
    );
    const data = await res.json();
    if (res.ok && data.url) {
      return data.url;
    } else {
      throw new Error("Image upload failed");
    }
  };

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const url = await uploadImage(file);
      setSignupData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      alert("Image upload failed");
    }
  }, []);

  const handleSignupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = () => {
    // Implement signup logic
    console.log("Signup data:", signupData);
    // After successful signup, navigate to map or chat
    // navigate("/map");
  };

  const handleLoginSubmit = () => {
    // Implement login logic
    console.log("Login data:", loginData);
    // After successful login, navigate to map or chat
    navigate("/map");
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image with Blur */}
      <AuthBackground imageUrl="/images/carousel_images/12.jpg" />

      {/* Main Content Container */}
      <div className="relative flex h-screen w-full items-center justify-center">
        {/* Desktop Layout */}
        <div className="hidden md:flex relative flex-row lg:h-2/3 w-5/6 mx-auto rounded-xl overflow-hidden shadow-lg bg-white bg-opacity-90">
          {/* LOGIN Section */}
          <LoginForm
            email={loginData.email}
            password={loginData.password}
            isSubmitting={isSubmitting}
            onEmailChange={handleLoginChange}
            onPasswordChange={handleLoginChange}
            onSubmit={handleLoginSubmit}
            onSignUpClick={() => setIsSignUp(true)}
          />

          {/* SIGN UP Section */}
          <SignupForm
            name={signupData.name}
            email={signupData.email}
            password={signupData.password}
            about={signupData.about}
            imageUrl={signupData.image}
            isSubmitting={isSubmitting}
            onNameChange={handleSignupChange}
            onEmailChange={handleSignupChange}
            onPasswordChange={handleSignupChange}
            onAboutChange={handleSignupChange}
            onImageUpload={handleImageUpload}
            onSubmit={handleSignupSubmit}
            onLoginClick={() => setIsSignUp(false)}
          />

          {/* Overlay Section */}
          <AuthOverlay
            isSignUp={isSignUp}
            onToggle={() => setIsSignUp(!isSignUp)}
          />
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden w-full max-w-md p-4">
          <MobileAuthForm
            isSignUp={isSignUp}
            signupData={signupData}
            loginData={loginData}
            isSubmitting={isSubmitting}
            onSignupChange={handleSignupChange}
            onLoginChange={handleLoginChange}
            onSignupSubmit={handleSignupSubmit}
            onLoginSubmit={handleLoginSubmit}
            onToggleAuth={() => setIsSignUp(!isSignUp)}
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>
      {/* Notification message */}
      {message && <ErrorMessage text="wrong inputs entered" />}
    </div>
  );
}
