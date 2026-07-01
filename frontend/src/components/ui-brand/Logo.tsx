import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <span
        className="inline-flex items-center justify-center rounded-full bg-rust text-[#fffaf2] font-display font-semibold shadow-warm transition-transform group-hover:scale-105"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        P
      </span>
      <span className="font-medium text-ink text-lg tracking-tight">PlantNest</span>
    </Link>
  );
}

export function HeroPot({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="animate-float-pot relative">
        <svg viewBox="0 0 400 480" className="w-full h-auto drop-shadow-[0_30px_40px_rgba(193,83,43,0.25)]">
          {/* Leaves */}
          <g>
            {/* large back leaf */}
            <path d="M200 80 C160 40, 100 50, 90 130 C85 180, 130 200, 180 180 C200 170, 210 130, 200 80 Z" fill="#6f8f6a" />
            <path d="M180 170 C160 130, 130 110, 120 130" stroke="#4f6a4b" strokeWidth="2" fill="none" />
            {/* right tall leaf */}
            <path d="M210 60 C250 30, 320 60, 320 140 C320 200, 270 220, 230 200 C210 190, 200 130, 210 60 Z" fill="#7fa178" />
            <path d="M230 195 C260 160, 290 130, 305 110" stroke="#4f6a4b" strokeWidth="2" fill="none" />
            {/* center leaf */}
            <path d="M205 100 C200 60, 220 30, 250 50 C275 70, 270 130, 240 160 C220 175, 205 150, 205 100 Z" fill="#8fb287" />
            {/* small front leaf */}
            <path d="M180 200 C150 200, 130 230, 150 260 C170 280, 200 270, 205 240 C208 225, 200 205, 180 200 Z" fill="#9bbf94" />
          </g>
          {/* Pot rim */}
          <ellipse cx="200" cy="280" rx="130" ry="22" fill="#9a4221" />
          <ellipse cx="200" cy="278" rx="120" ry="16" fill="#2a1c12" opacity="0.4" />
          {/* Pot body */}
          <path d="M90 285 L120 460 L280 460 L310 285 Z" fill="url(#potGrad)" />
          <path d="M90 285 L120 460 L280 460 L310 285 Z" fill="url(#potShadow)" opacity="0.6" />
          {/* Texture lines */}
          <path d="M100 320 L300 320" stroke="#8d3d1f" strokeWidth="1" opacity="0.3" />
          <path d="M110 380 L290 380" stroke="#8d3d1f" strokeWidth="1" opacity="0.2" />
          <defs>
            <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c1532b" />
              <stop offset="100%" stopColor="#8d3d1f" />
            </linearGradient>
            <linearGradient id="potShadow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="70%" stopColor="transparent" />
              <stop offset="100%" stopColor="#2a1c12" />
            </linearGradient>
          </defs>
        </svg>
        {/* pulsing shadow */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-rust/30 blur-2xl"
          style={{ width: "60%", height: 20 }}
          animate={{ scaleX: [1, 0.9, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
