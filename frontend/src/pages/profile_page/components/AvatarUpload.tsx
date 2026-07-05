import { Camera } from "lucide-react";

interface AvatarUploadProps {
  imagePreview: string | null;
  name: string;
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AvatarUpload({
  imagePreview,
  name,
  uploading,
  onFileChange,
}: AvatarUploadProps) {
  return (
    <section className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-[var(--radius-pill)] border-4 border-background bg-card overflow-hidden shadow-sm transition-all group-hover:border-primary/50">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/50 text-5xl font-headline bg-card">
              {name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          {/* Overlay */}
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-7 h-7 text-white" />
            )}
            <input
              type="file"
              onChange={onFileChange}
              accept="image/*"
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>
      <p className="font-eyebrow text-[10px] text-foreground/50 lowercase">
        Click the avatar to change your photo
      </p>
    </section>
  );
}
