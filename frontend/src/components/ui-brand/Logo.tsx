import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span
        className="inline-flex items-center justify-center rounded-full bg-terracotta text-cream-bg font-display font-semibold shadow-warm transition-transform duration-200 group-hover:scale-105 active:scale-95"
        style={{ width: size, height: size, fontSize: size * 0.52 }}
      >
        P
      </span>
      <span className="font-display font-bold text-forest-dark text-xl tracking-tight">PlantNest</span>
    </Link>
  );
}

export function HeroPot({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="animate-float-pot relative flex flex-col items-center">
        {/* Soft atmospheric halo bloom */}
        <div className="absolute -inset-4 bg-radial from-[#D97746]/15 via-[#5E7A5A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Studio Ghibli Watercolor Botanical Potted Plant */}
        <div className="relative z-10 p-2 md:p-4 rounded-3xl bg-cream-elevated/70 backdrop-blur-sm border border-sage-border/60 shadow-warm-lg">
          <img
            src="/assets/ghibli/hero-potted-monstera.png"
            alt="Hand-painted Studio Ghibli potted monstera"
            className="w-full max-w-[360px] md:max-w-[460px] h-auto object-contain rounded-2xl drop-shadow-[0_20px_35px_rgba(40,54,24,0.18)] transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Tactile watercolor painted ground shadow */}
        <motion.div
          className="w-48 md:w-64 h-6 mt-2 rounded-full bg-[#1A281F]/20 blur-xl"
          animate={{ scaleX: [1, 0.92, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
