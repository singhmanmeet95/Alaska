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
      className="h-28 shrink-0 bg-zinc-800 rounded-2xl overflow-hidden group cursor-pointer relative shadow-md ring-1 ring-white/5 hover:ring-indigo-500/50 transition-all duration-300"
    >
      <img
        src={img}
        alt={`Gallery image ${baseIdx + idx + 1}`}
        className="h-full w-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        loading="lazy"
      />
      {/* Elegant overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* View Image pill */}
      <div className="absolute inset-x-0 bottom-0 p-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-semibold text-zinc-900 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg tracking-wide">
          View
        </span>
      </div>

      {isOwnProfile && (
        <button
          onClick={(e) => handleDelete(e, img)}
          disabled={isUpdating}
          className="absolute top-2 right-2 p-1.5 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  if (!isOwnProfile && (!images || images.length === 0)) return null;

  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg relative overflow-x-auto h-full">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="mb-4 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Gallery
            </h2>
            <span className="text-xs text-zinc-500 font-medium bg-zinc-800/50 px-2 py-1 rounded-md border border-zinc-700/50">
              {images.length} photos
            </span>
          </div>
          {isOwnProfile && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-md"
            >
              <Plus className="w-4 h-4" />
              Add Photo
            </button>
          )}
        </div>

        {isAdding && (
          <div className="mb-6 relative z-10 flex flex-col gap-4 animate-fade-in-up bg-zinc-800/40 p-6 rounded-xl border-2 border-dashed border-zinc-700 hover:border-indigo-500/50 transition-colors">
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
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-3 text-indigo-400">
                <Plus
                  className={`w-6 h-6 ${isUpdating ? "animate-spin" : ""}`}
                />
              </div>
              <p className="text-sm text-zinc-300 font-medium tracking-wide">
                {isUpdating
                  ? "Uploading to Cloudinary..."
                  : "Click or drag and drop an image here"}
              </p>
              <p className="text-xs text-zinc-500 mt-1">JPEG, PNG up to 10MB</p>
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
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {images.length === 0 && !isAdding ? (
          <div className="text-zinc-500 text-sm text-center py-6 border border-dashed border-zinc-700 rounded-xl">
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
