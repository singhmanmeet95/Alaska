import {
  Instagram,
  Facebook,
  Github,
  Linkedin,
  Globe,
  HelpCircle,
} from "lucide-react";

interface SocialHandlesProps {
  socials: Record<string, string>;
  variant?: "card" | "inline";
}

export default function SocialHandles({
  socials,
  variant = "card",
}: SocialHandlesProps) {
  if (!socials || Object.keys(socials).length === 0) return null;

  const getIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case "insta":
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case "facebook":
        return <Facebook className="w-5 h-5 text-blue-500" />;
      case "github":
        return <Github className="w-5 h-5 text-zinc-100" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5 text-blue-400" />;
      case "website":
        return <Globe className="w-5 h-5 text-emerald-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-zinc-400" />;
    }
  };

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(socials).map(([key, value]) => (
          <a
            key={key}
            href={
              value.startsWith("http") ? value : `https://${key}.com/${value}`
            }
            target="_blank"
            rel="noreferrer"
            title={key}
            className="flex items-center justify-center p-2.5 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded border border-zinc-800 transition-colors"
          >
            {getIcon(key)}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-100 mb-4">
        Connect
      </h2>
      <div className="flex flex-wrap gap-3">
        {Object.entries(socials).map(([key, value]) => (
          <a
            key={key}
            href={
              value.startsWith("http") ? value : `https://${key}.com/${value}`
            }
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 hover:text-white transition-all border border-zinc-700 hover:border-zinc-600"
          >
            {getIcon(key)}
            <span className="font-medium capitalize">{key}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
