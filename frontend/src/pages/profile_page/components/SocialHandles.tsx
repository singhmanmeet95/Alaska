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
        return <Github className="w-5 h-5 text-foreground" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5 text-blue-400" />;
      case "website":
        return <Globe className="w-5 h-5 text-emerald-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-foreground/50" />;
    }
  };

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-2 font-sans">
        {Object.entries(socials).map(([key, value]) => (
          <a
            key={key}
            href={
              value.startsWith("http") ? value : `https://${key}.com/${value}`
            }
            target="_blank"
            rel="noreferrer"
            title={key}
            className="flex items-center justify-center p-2.5 bg-background text-foreground/80 hover:bg-card hover:text-foreground rounded-[var(--radius-pill)] border border-border transition-colors"
          >
            {getIcon(key)}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-[var(--radius-card)] p-6 font-sans">
      <h2 className="text-lg font-headline tracking-tight text-foreground mb-4">
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
            className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-card rounded-[var(--radius-pill)] font-button text-[12px] text-foreground/80 hover:text-foreground transition-all border border-border hover:border-primary/50"
          >
            {getIcon(key)}
            <span className="font-headline capitalize">{key}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
