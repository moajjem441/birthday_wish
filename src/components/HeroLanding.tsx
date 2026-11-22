import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Gift, Cake, Send } from "lucide-react";

interface HeroLandingProps {
  onStartCreating: () => void;
  onExploreSample: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartCreating,
  onExploreSample,
}) => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 px-4 sm:px-6 flex flex-col items-center justify-center text-center min-h-[85vh]">
      {/* Ambient background particles & glows */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-amber-400/15 dark:bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-rose-400/15 dark:bg-rose-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-teal-400/15 dark:bg-teal-400/10 rounded-full blur-3xl" />

        {/* Floating subtle sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-400/60 dark:text-amber-300/40"
            style={{
              top: `${15 + (i * 14)}%`,
              left: `${10 + (i * 15)}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.85, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3.5 + i * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Soft pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300/60 mb-6 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
          <span>Universal Birthday Celebration Experience</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-theme-heading tracking-tight leading-[1.12]"
        >
          A Little{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-500 to-amber-600">
            Birthday Magic
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-amber-400/40 -z-10"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span>
        </motion.h1>

        {/* Emotional Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-theme-subtext max-w-2xl font-light leading-relaxed"
        >
          Create an enchanting moment of joy, wrapped just for someone you cherish.
          An interactive celebration featuring gift unwrapping, candle-blowing wishes, and a heartfelt letter.
        </motion.p>

        {/* Interactive Hero Visual: Floating 3D Gift Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="my-10 relative flex items-center justify-center cursor-pointer group"
          onClick={onStartCreating}
          title="Click to start creating magic!"
        >
          {/* Glowing pedestal */}
          <div className="absolute w-44 h-16 bg-amber-400/25 dark:bg-amber-400/15 rounded-[100%] blur-xl group-hover:blur-2xl transition-all" />

          {/* Floating animated gift box */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 1.5, -1.5, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center filter drop-shadow-2xl"
          >
            {/* SVG sculpted gift box */}
            <svg viewBox="0 0 160 160" className="w-full h-full">
              <defs>
                <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
                <filter id="giftShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Box Base */}
              <rect x="30" y="65" width="100" height="75" rx="8" fill="url(#boxGrad)" filter="url(#giftShadow)" />
              {/* Vertical Ribbon */}
              <rect x="71" y="65" width="18" height="75" fill="url(#ribbonGrad)" />
              {/* Horizontal Ribbon */}
              <rect x="30" y="98" width="100" height="15" fill="url(#ribbonGrad)" opacity="0.9" />

              {/* Box Lid */}
              <rect x="22" y="48" width="116" height="22" rx="6" fill="url(#lidGrad)" filter="url(#giftShadow)" />
              {/* Lid Ribbon */}
              <rect x="71" y="48" width="18" height="22" fill="url(#ribbonGrad)" />

              {/* Ribbon Bow */}
              <path
                d="M80 48 C65 25 45 32 60 48 Z"
                fill="url(#ribbonGrad)"
              />
              <path
                d="M80 48 C95 25 115 32 100 48 Z"
                fill="url(#ribbonGrad)"
              />
              <circle cx="80" cy="48" r="7" fill="#fb7185" />
            </svg>

            {/* Micro sparkles hovering */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-3 -right-3 text-amber-300 text-xl pointer-events-none"
            >
              ✨
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onStartCreating}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-medium text-base sm:text-lg bg-theme-primary text-theme-primary-text hover:opacity-95 shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/40"
          >
            <span>Create a Birthday Wish</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreSample}
            className="w-full sm:w-auto px-6 py-4 rounded-full font-medium text-base text-theme-heading glass-card hover:bg-white/90 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Experience Sample Wish</span>
          </button>
        </motion.div>

        {/* How It Works 3-Step Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl"
        >
          <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3 shadow-inner">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-theme-heading">1. The Mystery Gift</h3>
            <p className="text-xs text-theme-subtext mt-1 opacity-85 leading-relaxed">
              Recipient taps the bouncing gift box to unwrap the surprise with a festive burst.
            </p>
          </div>

          <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-3 shadow-inner">
              <Cake className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-theme-heading">2. Make a Wish</h3>
            <p className="text-xs text-theme-subtext mt-1 opacity-85 leading-relaxed">
              They blow out flickering candles with real smoke physics and confetti fanfare.
            </p>
          </div>

          <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3 shadow-inner">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-theme-heading">3. Heartfelt Message</h3>
            <p className="text-xs text-theme-subtext mt-1 opacity-85 leading-relaxed">
              Your words reveal themselves like a vintage typewriter greeting letter with your signature.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
