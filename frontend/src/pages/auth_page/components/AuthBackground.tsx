interface AuthBackgroundProps {
  imageUrl: string;
}

export default function AuthBackground({ imageUrl }: AuthBackgroundProps) {
  return (
    <>
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      ></div>
      {/* Dark overlay to soften the background */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
    </>
  );
}
