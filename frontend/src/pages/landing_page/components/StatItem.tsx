import { motion } from "framer-motion";

export function StatItem({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="text-center md:text-left px-4"
    >
      <h3 className="font-display-xl text-black mb-4 leading-none text-5xl md:text-7xl font-bold tracking-tighter">{value}</h3>
      <p className="font-eyebrow text-black/70 text-sm md:text-base font-bold uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}
