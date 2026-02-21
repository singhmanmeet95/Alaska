import { useState } from "react";
import { X } from "lucide-react";

interface UserGalleryProps {
  images: string[];
}

export default function UserGallery({ images }: UserGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg relative overflow-hidden h-full">
        {/* Decorative gradient blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="mb-4 relative z-10 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Gallery
          </h2>
          <span className="text-xs text-zinc-500 font-medium bg-zinc-800/50 px-2 py-1 rounded-md border border-zinc-700/50">
            {images.length} photos
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(img)}
              className="aspect-square bg-zinc-800 rounded-2xl overflow-hidden group cursor-pointer relative shadow-md ring-1 ring-white/5 hover:ring-indigo-500/50 transition-all duration-300"
            >
              <img
                src={img}
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
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
            </div>
          ))}
        </div>
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
