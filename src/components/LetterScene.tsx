import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { RotateCcw, Copy, Check,  Sparkles, FastForward, Heart } from "lucide-react";
import type { BirthdayWish } from "../types/wish";
import { copyToClipboard, generateWishUrl } from "../utils/share";

import { birthdayAudio } from "../utils/birthdayAudio";

interface LetterSceneProps {
  wish: BirthdayWish;
  recipient?: string;
  onReplay: () => void;
  onCreateAnother: () => void;
  onOpenShareModal: () => void;
  isMuted?: boolean;
}

export const LetterScene: React.FC<LetterSceneProps> = ({
  wish,
  recipient,
  onReplay,
  // onCreateAnother,
  // onOpenShareModal,
  isMuted = false,
}) => {
  const [isDancing, setIsDancing] = React.useState(true);
  const [showMessage, setShowMessage] = React.useState(false);
  const [displayedText, setDisplayedText] = React.useState("");
  const [isTypingComplete, setIsTypingComplete] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const isFinishedRef = React.useRef(false);
  const fallbackTimerRef = React.useRef<number | null>(null);

  const fullMessage = wish.message.trim();

  // Finishes the audio celebration and reveals the wishing message
  const handleAudioFinished = React.useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    setIsDancing(false);
    setShowMessage(true);

    // Celebratory confetti pop as message is revealed
    try {
      confetti({
        particleCount: 60,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#f43f5e", "#38bdf8", "#34d399", "#a855f7"],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti fail safety
    }
  }, []);

  // Initialize and play happy-birthday.mp3
  React.useEffect(() => {
    isFinishedRef.current = false;

    const onEnded = () => {
      handleAudioFinished();
    };

    const onError = () => {
      // Fallback: If happy-birthday.mp3 is missing or fails to play,
      // run the dancing name animation for a joyful 7-second period, then reveal message normally.
      if (!isFinishedRef.current && !fallbackTimerRef.current) {
        fallbackTimerRef.current = window.setTimeout(() => {
          handleAudioFinished();
        }, 7000);
      }
    };

    // Play via birthdayAudio manager (primed during the click gesture!)
    birthdayAudio.play(isMuted, onEnded, onError);

    // Safety ceiling: 90 seconds maximum
    const safetyCeiling = window.setTimeout(() => {
      if (!isFinishedRef.current) {
        handleAudioFinished();
      }
    }, 90000);

    return () => {
      window.clearTimeout(safetyCeiling);
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      birthdayAudio.stop();
    };
  }, [handleAudioFinished, isMuted]);

  // Sync mute setting dynamically if toggled during playback
  React.useEffect(() => {
    birthdayAudio.setMuted(isMuted);
  }, [isMuted]);

  // Typewriter effect (triggers ONLY after showMessage is true!)
  React.useEffect(() => {
    if (!showMessage) return;

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(fullMessage.slice(0, index));
      if (index >= fullMessage.length) {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [showMessage, fullMessage]);

  const handleSkipTypewriter = () => {
    setDisplayedText(fullMessage);
    setIsTypingComplete(true);
  };

  const handleSkipAudio = () => {
    birthdayAudio.stop();
    handleAudioFinished();
  };

  const handleCopy = async () => {
    const url = generateWishUrl(wish);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const todayStr = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col items-center">
      {/* The Greeting Letter Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative glass-card rounded-3xl p-6 sm:p-10 shadow-2xl border border-amber-300/50 overflow-hidden"
      >
        {/* Soft background ambient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Card Top Border Header */}
          <div className="flex items-center justify-between border-b border-theme-border/60 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎂</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-theme-subtext opacity-80">
                Birthday Celebration
              </span>
            </div>

            <span className="text-xs text-theme-subtext opacity-60 hidden sm:inline">
              {todayStr}
            </span>
          </div>

          {/* Prominent Recipient Name with Dancing Animation during audio */}
          <div className="text-center my-4 relative py-2 flex flex-col items-center">
            {/* Glowing aura during audio */}
            <div
              className={`absolute inset-0 m-auto w-72 h-36 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
                isDancing
                  ? "bg-gradient-to-tr from-amber-400/30 to-rose-400/25 opacity-100 animate-pulse-subtle"
                  : "opacity-0"
              }`}
            />

            <h2 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-bold text-theme-heading leading-tight">
              Happy Birthday,{" "}
              {/* Dancing Recipient Name */}
              <motion.span
                animate={
                  isDancing
                    ? {
                        y: [0, -10, 0, -7, 0, -11, 0],
                        rotate: [0, 2.2, -1.8, 1.4, -1.8, 0],
                        scale: [1, 1.06, 0.98, 1.05, 1],
                      }
                    : { y: 0, rotate: 0, scale: 1 }
                }
                transition={
                  isDancing
                    ? {
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { duration: 0.5, ease: "easeOut" }
                }
                className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 tracking-tight filter drop-shadow-md py-1"
              >
                {wish?.recipient || recipient || (wish as unknown as { name?: string })?.name || "Friend"}!

                {/* Floating festive particles and musical notes dancing with the name */}
                {isDancing && (
                  <>
                    <motion.span
                      animate={{ y: [-4, -18, -4], opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-4 -left-6 text-xl pointer-events-none"
                    >
                      ✨
                    </motion.span>
                    <motion.span
                      animate={{ y: [-2, -16, -2], opacity: [0.4, 1, 0.4], scale: [0.9, 1.3, 0.9] }}
                      transition={{ duration: 2.1, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
                      className="absolute -top-6 -right-6 text-xl pointer-events-none"
                    >
                      🎉
                    </motion.span>
                    <motion.span
                      animate={{ y: [0, -14, 0], opacity: [0.3, 0.9, 0.3] }}
                      transition={{ duration: 2.3, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
                      className="absolute -bottom-2 -left-8 text-lg pointer-events-none"
                    >
                      🎵
                    </motion.span>
                    <motion.span
                      animate={{ y: [0, -15, 0], opacity: [0.3, 0.9, 0.3] }}
                      transition={{ duration: 1.9, repeat: Infinity, delay: 0.2, ease: "easeInOut" }}
                      className="absolute -bottom-2 -right-8 text-lg pointer-events-none"
                    >
                      🎶
                    </motion.span>
                  </>
                )}
              </motion.span>
            </h2>

            {wish.age && (
              <p className="font-outfit text-sm sm:text-base font-medium text-theme-subtext mt-2 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Celebrating {wish.age} wonderful years of life and joy</span>
              </p>
            )}

            {/* Song playing indicator & optional skip button */}
            {isDancing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex flex-col items-center gap-2"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300/60 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                  <span>Playing Happy Birthday 🎵</span>
                </div>

                {/* Animated sound waves */}
                <div className="flex items-center gap-1 h-5 mt-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ height: ["6px", "20px", "8px", "18px", "6px"] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.14, ease: "easeInOut" }}
                      className="w-1 rounded-full bg-amber-500"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSkipAudio}
                  className="text-[11px] text-theme-subtext opacity-75 hover:opacity-100 hover:underline transition-opacity mt-2 focus:outline-none"
                >
                  Skip to message →
                </button>
              </motion.div>
            )}
          </div>

          {/*
            ====================================================================
            WISHING MESSAGE & SIGNATURE
            Revealed ONLY after happy-birthday.mp3 finishes playing!
            ====================================================================
          */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 pt-2"
              >
                {/* Letter Body / Typewriter Message */}
                <div className="relative min-h-[140px] p-5 sm:p-6 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-theme-border/50 text-base sm:text-lg text-theme-heading leading-relaxed font-light shadow-inner">
                  {/* Screen reader accessible full message */}
                  <span className="sr-only">{fullMessage}</span>

                  {/* Visual Typewriter Output */}
                  <p aria-hidden="true" className="whitespace-pre-wrap">
                    {displayedText}
                    {!isTypingComplete && (
                      <span className="inline-block w-2 h-5 ml-1 bg-amber-500 animate-pulse align-middle" />
                    )}
                  </p>

                  {/* Skip typewriter button for convenience & accessibility */}
                  {!isTypingComplete && (
                    <button
                      onClick={handleSkipTypewriter}
                      className="mt-4 flex items-center gap-1 text-xs text-theme-subtext hover:text-theme-heading underline underline-offset-4 focus:outline-none"
                    >
                      <FastForward className="w-3 h-3" />
                      <span>Read entire message immediately</span>
                    </button>
                  )}
                </div>

                {/* Signature & Wax Seal */}
                <div className="pt-4 flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm text-theme-subtext font-normal">
                      With warmest wishes and love,
                    </span>
                    <div className="font-caveat text-3xl sm:text-4xl font-bold text-theme-heading tracking-wide">
                      {wish.sender}
                    </div>
                  </div>

                  {/* Golden Wax Seal */}
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 text-amber-950 flex flex-col items-center justify-center shadow-lg border-2 border-white/60 select-none"
                    title="Birthday Seal of Joy"
                  >
                    <Heart className="w-5 h-5 fill-amber-950/20 text-amber-950" />
                    <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Wishes</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Action Buttons (Revealed after message appears) */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full"
          >
            {/* Replay */}
            <button
              onClick={onReplay}
              className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold glass-pill hover:bg-white/90 dark:hover:bg-slate-800 text-theme-heading shadow-sm active:scale-95 transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <span>Replay Celebration</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold glass-pill hover:bg-white/90 dark:hover:bg-slate-800 text-theme-heading shadow-sm active:scale-95 transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Link Copied! ✨</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-500" />
                  <span>Copy Magic Link</span>
                </>
              )}
            </button>

            {/* Share Modal Trigger */}
            {/* <button
              onClick={onOpenShareModal}
              className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold bg-theme-primary text-theme-primary-text hover:opacity-95 shadow-md active:scale-95 transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Sparkles className="w-4 h-4" />
              <span>Share This Wish</span>
            </button> */}

            {/* Create Another */}
            {/* <button
              onClick={onCreateAnother}
              className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold glass-pill hover:bg-white/90 dark:hover:bg-slate-800 text-theme-subtext shadow-sm active:scale-95 transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Another Wish</span>
            </button> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
