import { User, AtSign, FileText, Info } from "lucide-react";

interface ProfileFormFieldsProps {
  formData: {
    name: string;
    username: string;
    bio: string;
    about: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ProfileFormFields({ formData, onChange }: ProfileFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Name */}
      <div className="group">
        <label className="flex items-center gap-2 font-headline text-sm text-foreground mb-2">
          <User className="w-4 h-4 text-primary" />
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Enter your full name"
          className="w-full bg-card border border-border rounded-[var(--radius-pill)] px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      {/* Username */}
      <div className="group">
        <label className="flex items-center gap-2 font-headline text-sm text-foreground mb-2">
          <AtSign className="w-4 h-4 text-primary" />
          Username
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 font-body-sm text-[12px]">
            @
          </span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={onChange}
            placeholder="your_username"
            className="w-full bg-card border border-border rounded-[var(--radius-pill)] pl-8 pr-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="group">
        <label className="flex items-center gap-2 font-headline text-sm text-foreground mb-2">
          <FileText className="w-4 h-4 text-primary" />
          Bio
          <span className="text-foreground/40 font-eyebrow text-[10px] ml-auto">
            {formData.bio?.length || 0}/160
          </span>
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={onChange}
          maxLength={160}
          placeholder="A short bio about yourself..."
          rows={3}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
        />
      </div>

      {/* About */}
      <div className="group">
        <label className="flex items-center gap-2 font-headline text-sm text-foreground mb-2">
          <Info className="w-4 h-4 text-primary" />
          About
        </label>
        <textarea
          name="about"
          value={formData.about}
          onChange={onChange}
          placeholder="Tell the community more about yourself, your travel interests, favourite routes..."
          rows={5}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground font-body-sm text-[12px] placeholder-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
        />
      </div>
    </div>
  );
}
