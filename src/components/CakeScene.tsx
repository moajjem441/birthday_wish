import React from "react";
import { motion } from "framer-motion";
import confetti from "../utils/confetti";
import { Sparkles, Wind } from "lucide-react";
import { sound } from "../utils/sound";
import { birthdayAudio } from "../utils/birthdayAudio";

interface CakeSceneProps {
  recipient: string;
  age?: number;
  onCandlesBlown: () => void;
}

interface CandleState {
  id: number;
  isLit: boolean;
  hasPuffed: boolean;
}

export const CakeScene: React.FC<CakeSceneProps> = ({
  recipient,
  age,
  onCandlesBlown,
}) => {
  // 5 candles on the cake
  const candleCount = 5;
  const [candles, setCandles] = React.useState<CandleState[]>(
    Array.from({ length: candleCount }, (_, i) => ({
      id: i,
      isLit: true,
      hasPuffed: false,
    }))
  );

  const [hasCelebrated, setHasCelebrated] = React.useState(false);
  const [isBlowingAll, setIsBlowingAll] = React.useState(false);
  const hasCelebratedRef = React.useRef(false);

  const litCount = candles.filter((c) => c.isLit).length;

  const triggerCelebration = React.useCallback(() => {
    if (hasCelebratedRef.current) return;
    hasCelebratedRef.current = true;
    setHasCelebrated(true);

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#f43f5e", "#38bdf8", "#34d399", "#a855f7"],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti fail safety
    }

    // Advance to Happy Birthday song and dancing name right after blow sound & smoke effect
    setTimeout(() => {
      onCandlesBlown();
    }, 600);
  }, [onCandlesBlown]);

  const extinguishCandle = (id: number) => {
    birthdayAudio.prepareAudio();
    setCandles((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, isLit: false, hasPuffed: true } : c));
      const remainingLit = next.filter((c) => c.isLit).length;
      if (remainingLit === 0) {
        triggerCelebration();
      }
      return next;
    });
    sound.playPuff();
  };

  const handleBlowAll = () => {
    if (hasCelebrated || isBlowingAll) return;
    setIsBlowingAll(true);
    birthdayAudio.prepareAudio();

    // Stagger extinguish remaining lit candles
    candles.forEach((candle, idx) => {
      if (candle.isLit) {
        setTimeout(() => {
          extinguishCandle(candle.id);
        }, idx * 120);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[68vh] py-2 px-4 text-center select-none">
      {/* Header instructions */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3 sm:mb-4 space-y-1.5"
      >
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          <span>Candle Wish Ceremony</span>
        </span>

        <h2 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-bold text-theme-heading">
          Make a Wish, <span className="text-theme-primary">{recipient}</span>!
        </h2>

        <p className="text-xs sm:text-base text-theme-subtext font-light max-w-md mx-auto">
          {litCount > 0
            ? "Tap each candle flame to extinguish it, or blow them all at once."
            : "✨ Your wish is now floating to the stars! ✨"}
        </p>
      </motion.div>

      {/* Cake Container */}
      <div className="relative w-64 sm:w-88 md:w-96 flex flex-col items-center my-1 sm:my-2">
        {/* Soft radial glow behind cake */}
        <div
          className="absolute top-1/4 w-64 h-64 rounded-full pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0) 70%)",
          }}
        />

        {/* The Candle Row Above the Cake - Seated directly on the top cake tier */}
        <div className="relative z-20 flex justify-center items-end gap-5 sm:gap-7 h-28 sm:h-32 mb-[-38px] sm:mb-[-44px]">
          {candles.map((candle) => (
            <div
              key={candle.id}
              onClick={() => candle.isLit && extinguishCandle(candle.id)}
              className={`flex flex-col items-center cursor-pointer group transition-transform ${
                candle.isLit ? "hover:scale-110 active:scale-95" : ""
              }`}
              title={candle.isLit ? "Click to blow out candle" : "Candle extinguished"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && candle.isLit) {
                  e.preventDefault();
                  extinguishCandle(candle.id);
                }
              }}
              aria-label={`Candle ${candle.id + 1} (${candle.isLit ? "Lit" : "Extinguished"})`}
            >
              {/* Flame or Smoke */}
              <div className="h-10 sm:h-12 flex items-end justify-center relative">
                {candle.isLit ? (
                  <div
                    className="relative flex items-center justify-center animate-flicker"
                    style={{
                      animationDuration: `${1.4 + (candle.id % 3) * 0.3}s`,
                      transformOrigin: "bottom center",
                    }}
                  >
                    {/* Outer Flame Glow */}
                    <div className="w-5 h-8 sm:w-6 sm:h-9 bg-gradient-to-t from-amber-500 via-yellow-400 to-yellow-100 rounded-[50%_50%_35%_35%] shadow-[0_0_14px_#fbbf24] filter drop-shadow-md" />
                    {/* Inner Core Flame */}
                    <div className="absolute bottom-1 w-2 h-4 sm:w-2.5 sm:h-5 bg-white/95 rounded-[50%_50%_40%_40%]" />
                  </div>
                ) : candle.hasPuffed ? (
                  <motion.div
                    key="smoke"
                    initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: -22, scale: 1.6 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-neutral-400 dark:text-neutral-300 font-bold text-xs"
                  >
                    ~
                  </motion.div>
                ) : null}
              </div>

              {/* Candle Wick */}
              <div className="w-0.5 h-2 bg-neutral-800 dark:bg-neutral-600" />

              {/* Candle Body */}
              <div
                className={`w-3.5 sm:w-4 h-12 sm:h-14 rounded-t-sm shadow-sm transition-colors ${
                  candle.id % 2 === 0
                    ? "bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400"
                    : "bg-gradient-to-b from-rose-200 via-rose-300 to-rose-400"
                } border-x border-t border-black/10`}
              >
                {/* Diagonal stripes on candle */}
                <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#ffffff_4px,#ffffff_8px)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Sculpted 3D Multi-Tier Cake (SVG) */}
        <div className="w-full relative z-10 filter drop-shadow-xl">
          <svg viewBox="0 0 320 200" className="w-full h-auto overflow-visible">
            <defs>
              {/* Frosting gradients */}
              <linearGradient id="frostingCream" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fffbf5" />
                <stop offset="100%" stopColor="#faecd6" />
              </linearGradient>
              <linearGradient id="tierTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
              <linearGradient id="tierBottomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fdba74" />
              </linearGradient>
              <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>

            {/* Serving Plate */}
            <ellipse cx="160" cy="188" rx="155" ry="14" fill="url(#plateGrad)" stroke="#94a3b8" strokeWidth="1" />
            <ellipse cx="160" cy="186" rx="142" ry="10" fill="#f8fafc" opacity="0.6" />

            {/* Bottom Cake Tier */}
            <path
              d="M40 120 L40 170 Q160 195 280 170 L280 120 Z"
              fill="url(#tierBottomGrad)"
              stroke="#fb923c"
              strokeWidth="0.75"
            />
            <ellipse cx="160" cy="120" rx="120" ry="22" fill="url(#frostingCream)" />

            {/* Bottom Tier Frosting Drips */}
            <path
              d="M40 120 Q60 142 80 125 Q100 144 120 123 Q140 145 160 125 Q180 146 200 124 Q220 145 240 125 Q260 143 280 120"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Top Cake Tier */}
            <path
              d="M75 55 L75 110 Q160 135 245 110 L245 55 Z"
              fill="url(#tierTopGrad)"
              stroke="#f59e0b"
              strokeWidth="0.75"
            />
            <ellipse cx="160" cy="55" rx="85" ry="16" fill="url(#frostingCream)" />

            {/* Top Tier Frosting Drips */}
            <path
              d="M75 55 Q95 72 115 58 Q135 74 155 58 Q175 75 195 58 Q215 72 245 55"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Frosting Rosettes / Cherries / Sprinkles on Top */}
            {[...Array(7)].map((_, i) => (
              <circle
                key={i}
                cx={90 + i * 23}
                cy={55 + Math.sin(i * 0.8) * 4}
                r="3.5"
                fill="#f43f5e"
              />
            ))}

            {/* Optional Age Medallion on Front of Cake */}
            {age ? (
              <g>
                <circle cx="160" cy="148" r="22" fill="#fff" stroke="#f59e0b" strokeWidth="2.5" />
                <circle cx="160" cy="148" r="18" fill="#fef3c7" />
                <text
                  x="160"
                  y="154"
                  fontFamily="'Outfit', sans-serif"
                  fontWeight="bold"
                  fontSize="16"
                  fill="#92400e"
                  textAnchor="middle"
                >
                  {age}
                </text>
              </g>
            ) : (
              <g>
                <circle cx="160" cy="148" r="14" fill="#fff" stroke="#f59e0b" strokeWidth="2" />
                <text
                  x="160"
                  y="152"
                  fontSize="12"
                  textAnchor="middle"
                >
                  ✨
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Action Button: Blow All Candles */}
      <div className="mt-4 flex flex-col items-center gap-2">
        {litCount > 0 ? (
          <button
            onClick={handleBlowAll}
            disabled={isBlowingAll}
            className="px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base bg-theme-primary text-theme-primary-text hover:opacity-95 shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/40"
          >
            <Wind className="w-4 h-4 animate-bounce" />
            <span>Make a Wish & Blow ✨</span>
          </button>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-6 py-2.5 rounded-full font-semibold text-sm bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300"
          >
            🎉 Wish made! Revealing your birthday message...
          </motion.div>
        )}

        {litCount > 0 && (
          <span className="text-xs text-theme-subtext opacity-75">
            {litCount} of {candleCount} candles still glowing
          </span>
        )}
      </div>
    </div>
  );
};
