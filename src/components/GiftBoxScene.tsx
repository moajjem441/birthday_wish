import React from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Gift } from "lucide-react";
import { sound } from "../utils/sound";

interface GiftBoxSceneProps {
  recipient: string;
  onOpenComplete: () => void;
}

export const GiftBoxScene: React.FC<GiftBoxSceneProps> = ({
  recipient,
  onOpenComplete,
}) => {
  const [isOpening, setIsOpening] = React.useState(false);
  const [hasTriggered, setHasTriggered] = React.useState(false);

  const handleOpen = () => {
    if (hasTriggered) return;
    setHasTriggered(true);
    setIsOpening(true);

    // Play sounds
    sound.playPop();
    setTimeout(() => {
      sound.playChime();
    }, 200);

    // Burst confetti around the gift
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fb7185", "#38bdf8", "#34d399", "#fbbf24"],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti fail safety
    }

    // Advance to cake stage after animation unfolds
    setTimeout(() => {
      onOpenComplete();
    }, 1400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center select-none">
      {/* Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 space-y-2"
      >
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          <span>Special Delivery Just For You</span>
        </span>

        <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-theme-heading">
          A Birthday Surprise for{" "}
          <span className="text-theme-primary">{recipient}</span>
        </h2>
        <p className="text-sm sm:text-base text-theme-subtext font-light max-w-md mx-auto">
          Someone who cares about you has wrapped a little magic. Tap the gift to unwrap what's inside!
        </p>
      </motion.div>

      {/* Interactive Gift Box */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        aria-label="Open Birthday Gift Box"
        aria-disabled={hasTriggered}
        className={`relative group cursor-pointer p-6 rounded-3xl transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 ${
          hasTriggered ? "pointer-events-none" : "hover:scale-105 active:scale-95"
        }`}
      >
        {/* Ambient Glow */}
        <motion.div
          animate={{
            scale: isOpening ? [1, 1.8, 2.2] : [1, 1.15, 1],
            opacity: isOpening ? [0.4, 0.9, 0] : [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: isOpening ? 1.2 : 3,
            repeat: isOpening ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 m-auto w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-tr from-amber-400 to-rose-400 rounded-full blur-3xl pointer-events-none -z-10"
        />

        {/* 3D SVG Gift Box with Lid Lifting Animation */}
        <div className="w-48 h-48 sm:w-60 sm:h-60 relative flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="giftBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="60%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="giftLidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="ribbonRuby" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
              <filter id="boxDropShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.28" />
              </filter>
            </defs>

            {/* Inner glowing light burst when lid opens */}
            {isOpening && (
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                transition={{ duration: 0.6 }}
              >
                <circle cx="100" cy="110" r="45" fill="#fef08a" opacity="0.8" filter="url(#boxDropShadow)" />
                <text x="100" y="115" fontSize="24" textAnchor="middle" dominantBaseline="middle">
                  ✨
                </text>
              </motion.g>
            )}

            {/* Box Body */}
            <rect
              x="45"
              y="90"
              width="110"
              height="85"
              rx="10"
              fill="url(#giftBodyGrad)"
              filter="url(#boxDropShadow)"
            />

            {/* Vertical Ribbon on Body */}
            <rect x="90" y="90" width="20" height="85" fill="url(#ribbonRuby)" />

            {/* Horizontal Ribbon on Body */}
            <rect x="45" y="125" width="110" height="18" fill="url(#ribbonRuby)" opacity="0.95" />

            {/* Lid & Bow (Animated lifting upwards and tilting) */}
            <motion.g
              animate={
                isOpening
                  ? { y: -80, rotate: -18, opacity: [1, 1, 0] }
                  : { y: [0, -4, 0] }
              }
              transition={
                isOpening
                  ? { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
              style={{ transformOrigin: "100px 90px" }}
            >
              {/* Lid */}
              <rect
                x="35"
                y="70"
                width="130"
                height="24"
                rx="8"
                fill="url(#giftLidGrad)"
                filter="url(#boxDropShadow)"
              />
              {/* Lid Ribbon */}
              <rect x="90" y="70" width="20" height="24" fill="url(#ribbonRuby)" />

              {/* Bow Loops */}
              <path
                d="M100 70 C80 40 50 50 75 70 Z"
                fill="url(#ribbonRuby)"
              />
              <path
                d="M100 70 C120 40 150 50 125 70 Z"
                fill="url(#ribbonRuby)"
              />
              {/* Center Bow Knot */}
              <circle cx="100" cy="70" r="8" fill="#fda4af" />
            </motion.g>
          </svg>
        </div>

        {/* Pulsing Hint Tag */}
        {!isOpening && (
          <div className="mt-4 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm bg-theme-primary text-theme-primary-text shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-all">
              <Gift className="w-4 h-4" />
              <span>Click or Tap to Open</span>
            </span>
          </div>
        )}

        {isOpening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm font-semibold text-theme-heading flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Unwrapping your surprise...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
