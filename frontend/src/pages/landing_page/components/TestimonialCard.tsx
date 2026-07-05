import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export function TestimonialCard({ quote, author, role, color }: { quote: string; author: string; role: string; color: string }) {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -10 }}
      className="p-10 rounded-3xl bg-card border border-border/50 flex flex-col justify-between h-full shadow-sm hover:shadow-xl transition-all relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-48 h-48 ${color} rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-60`} />
      <div className="relative z-10">
        <div className="mb-8 text-primary">
          <MessageSquare size={40} className="opacity-40" />
        </div>
        <p className="font-body text-xl text-foreground mb-12 leading-relaxed font-light italic">
          "{quote}"
        </p>
      </div>
      <div className="flex items-center gap-5 relative z-10">
        <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-md">
          {author.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold font-sans text-lg">{author}</h4>
          <p className="font-body-sm text-foreground/60">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
