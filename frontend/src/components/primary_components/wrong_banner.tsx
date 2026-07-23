import { useEffect, useState } from "react";

interface ErrorMessageProps {
  text?: string;
  duration?: number; // in milliseconds
}

export default function ErrorMessage({
  text = "Wrong inputs entered",
  duration = 5000,
}: ErrorMessageProps) {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), duration - 1000);
    const hideTimer = setTimeout(() => setVisible(false), duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 text-center font-button text-[12px] font-sans py-3 px-10 rounded-[var(--radius-pill)] transition-opacity duration-1000 shadow-xl backdrop-blur-sm z-50 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      {text}
    </div>
  );
}
