import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={false}
      className="border border-border/50 rounded-3xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="font-headline text-foreground text-xl group-hover:text-primary transition-colors pr-8">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border/50 group-hover:border-primary/50 transition-colors">
          {isOpen ? <Minus size={20} className="text-foreground/70" /> : <Plus size={20} className="text-foreground/70" />}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-8 pb-8 text-foreground/60 font-body text-lg leading-relaxed border-t border-border/50 pt-6 mt-2">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
