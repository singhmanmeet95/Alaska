import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function FeatureCard({ icon, title, description }: { icon: ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
      whileHover={{ y: -5, scale: 1.02 }}
      className="group p-8 flex flex-row gap-10 md:p-4 rounded-3xl bg-background border border-border/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden"
    >
      <div className="my-4 w-20 h-20 rounded-full bg-card border border-border/50 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
        {icon}
      </div>
      <div>
         <h3 className="font-headline text-2xl mb-4 relative z-10">{title}</h3>
      <p className="font-body-sm text-foreground/60 text-lg leading-relaxed relative z-10">
        {description}
      </p>
      </div>
     
    </motion.div>
  );
}
