import { motion } from "framer-motion";

export function StepCard({ number, title, description }: { number: string; title: string; description: string; color: string }) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} 
      whileHover={{ y: -10 }}
      className="relative group p-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all overflow-hidden"
    >
      <div className={`absolute top-1 left-3 w-16 h-16 text-gray-400/90  flex items-center justify-center font-bold text-5xl mb-8 group-hover:scale-110 transition-transform`}>
        {number}
      </div>
      <h3  className="font-headline text-2xl relative z-10">{title}</h3>
      <p className="font-body-sm text-foreground/60 text-lg leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
}
