import { Image as ImageIcon } from "lucide-react";

interface UserGalleryProps {
  images: string[];
}

export default function UserGallery({ images }: UserGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 border border-zinc-700/50 bg-zinc-800/80 rounded-xl shadow-inner">
          <ImageIcon className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white mb-0.5">
            Gallery
          </h2>
          <p className="text-xs text-zinc-400 font-medium">A visual journey</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500 [&::-webkit-scrollbar-track]:bg-transparent relative z-10">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="min-w-[160px] w-[160px] h-[200px] md:min-w-[200px] md:w-[200px] md:h-[260px] shrink-0 snap-center bg-zinc-800 rounded-2xl overflow-hidden group cursor-pointer relative shadow-xl ring-1 ring-white/5 hover:ring-indigo-500/50 transition-all duration-300"
          >
            <img
              src={img}
              alt={`Gallery image ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              loading="lazy"
            />
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* View Image pill */}
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <span className="text-xs font-semibold text-white px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 shadow-lg tracking-wide">
                View Image
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
