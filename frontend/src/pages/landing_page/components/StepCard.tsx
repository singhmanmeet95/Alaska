import { motion } from "framer-motion";

export function StepCard({ number, title, description, color }: { number: string; title: string; description: string; color: string }) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} 
      whileHover={{ y: -10 }}
      className="relative group p-10 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 opacity-20 ${color.split(' ')[0]}`} />
      <div className={`w-16 h-16 rounded-2xl border ${color} flex items-center justify-center font-bold text-2xl mb-8 group-hover:scale-110 transition-transform`}>
        {number}
      </div>
      <h3 className="font-headline text-2xl mb-4 relative z-10">{title}</h3>
      <p className="font-body-sm text-foreground/60 text-lg leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
}
