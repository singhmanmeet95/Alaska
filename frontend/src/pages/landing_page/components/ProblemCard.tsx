import { motion } from "framer-motion";
import { X } from "lucide-react";

export function ProblemCard({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex gap-6 items-start group">
      <div className="mt-1 w-14 h-14 rounded-2xl bg-card border border-border/50 text-foreground/50 flex items-center justify-center shrink-0 font-bold group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all shadow-sm">
        <X size={24} />
      </div>
      <div>
        <h3 className="font-headline text-2xl mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-foreground/60 text-lg leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
