import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface UserGalleryProps {
  images: string[];
  isOwnProfile?: boolean;
  onUpdateImages?: (newImages: string[]) => Promise<void>;
  onUploadImage?: (file: File) => Promise<void>;
}

export default function UserGallery({
  images,
  isOwnProfile,
  onUpdateImages,
  onUploadImage,
}: UserGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async (e: React.MouseEvent, imgToRemove: string) => {
    e.stopPropagation();
    if (!onUpdateImages) return;
    if (!confirm("Are you sure you want to remove this image?")) return;

    setIsUpdating(true);
    try {
      const newImages = images.filter((img) => img !== imgToRemove);
      await onUpdateImages(newImages);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!onUploadImage) return;
    setIsUpdating(true);
    try {
      await onUploadImage(file);
      setIsAdding(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const midpoint = Math.ceil(images.length / 2);
  const firstHalf = images.slice(0, midpoint);
  const secondHalf = images.slice(midpoint);

  const renderImage = (img: string, idx: number, baseIdx: number) => (
    <div
      key={baseIdx + idx}
      onClick={() => setSelectedImage(img)}
      className="h-28 shrink-0 bg-background rounded-2xl overflow-hidden group cursor-pointer relative shadow-sm ring-1 ring-border hover:ring-primary/50 transition-all duration-300 font-sans"
    >
      <img
        src={img}
        alt={`Gallery image ${baseIdx + idx + 1}`}
        className="h-full w-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        loading="lazy"
      />
      {/* Elegant overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* View Image pill */}
      <div className="absolute inset-x-0 bottom-0 p-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
        <span className="font-button text-[10px] text-background px-3 py-1.5 bg-foreground backdrop-blur-md rounded-[var(--radius-pill)] shadow-sm tracking-wide">
          View
        </span>
      </div>

      {isOwnProfile && (
        <button
          onClick={(e) => handleDelete(e, img)}
          disabled={isUpdating}
          className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-600 rounded-[var(--radius-pill)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 border border-red-200 disabled:opacity-50 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  if (!isOwnProfile && (!images || images.length === 0)) return null;

  return (
    <>
      <div className="bg-card border border-border rounded-[var(--radius-card)] p-6 shadow-sm relative overflow-x-auto h-full font-sans">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-[var(--radius-pill)] pointer-events-none" />

        <div className="mb-4 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-headline tracking-tight text-foreground">
              Gallery
            </h2>
            <span className="font-eyebrow text-[10px] text-foreground/50 bg-background px-2 py-1 rounded-[var(--radius-pill)] border border-border">
              {images.length} photos
            </span>
          </div>
          {isOwnProfile && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 font-button text-[12px] text-primary hover:opacity-80 transition-colors bg-primary/10 px-3 py-1.5 rounded-[var(--radius-pill)]"
            >
              <Plus className="w-4 h-4" />
              Add Photo
            </button>
          )}
        </div>

        {isAdding && (
          <div className="mb-6 relative z-10 flex flex-col gap-4 animate-fade-in-up bg-background p-6 rounded-[var(--radius-card)] border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <div
              className="flex flex-col items-center justify-center py-6 px-4 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (
                  !isUpdating &&
                  e.dataTransfer.files &&
                  e.dataTransfer.files[0]
                ) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => {
                if (!isUpdating)
                  document.getElementById("gallery-upload")?.click();
              }}
            >
              <div className="w-12 h-12 bg-card rounded-[var(--radius-pill)] flex items-center justify-center mb-3 text-primary border border-border">
                <Plus
                  className={`w-6 h-6 ${isUpdating ? "animate-spin" : ""}`}
                />
              </div>
              <p className="font-headline text-[12px] text-foreground tracking-wide">
                {isUpdating
                  ? "Uploading..."
                  : "Click or drag and drop an image here"}
              </p>
              <p className="font-body-sm text-[10px] text-foreground/50 mt-1">JPEG, PNG up to 10MB</p>
              <input
                id="gallery-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="flex justify-end mt-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-card hover:bg-background text-foreground border border-border font-button text-[12px] rounded-[var(--radius-pill)] transition-colors disabled:opacity-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {images.length === 0 && !isAdding ? (
          <div className="text-foreground/50 font-body-sm text-[12px] text-center py-6 border border-dashed border-border rounded-[var(--radius-card)]">
            No photos in gallery.
          </div>
        ) : (
          <div className="flex flex-col gap-4 relative z-10 w-max min-w-full pb-2">
            <div className="flex gap-4">
              {firstHalf.map((img, idx) => renderImage(img, idx, 0))}
            </div>
            {secondHalf.length > 0 && (
              <div className="flex gap-4">
                {secondHalf.map((img, idx) => renderImage(img, idx, midpoint))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-md z-[101]"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={selectedImage}
            alt="Zoomed gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
