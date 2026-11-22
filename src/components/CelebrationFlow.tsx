import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BirthdayWish, CelebrationStage } from "../types/wish";
import { GiftBoxScene } from "./GiftBoxScene";
import { CakeScene } from "./CakeScene";
import { LetterScene } from "./LetterScene";
import { Gift, Cake, MessageSquare } from "lucide-react";

interface CelebrationFlowProps {
  wish: BirthdayWish;
  onCreateAnother: () => void;
  onOpenShareModal: () => void;
  isMuted?: boolean;
}

export const CelebrationFlow: React.FC<CelebrationFlowProps> = ({
  wish,
  onCreateAnother,
  onOpenShareModal,
  isMuted = false,
}) => {
  const [stage, setStage] = React.useState<CelebrationStage>("gift");

  const handleReplay = () => {
    setStage("gift");
  };

  const steps = [
    { id: "gift", label: "The Surprise", icon: Gift },
    { id: "cake", label: "Make a Wish", icon: Cake },
    { id: "letter", label: "Greeting Letter", icon: MessageSquare },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center">
      {/* Subtle Step Progress Indicator */}
      <nav aria-label="Celebration Journey" className="mb-4">
        <div className="flex items-center gap-2 sm:gap-4 glass-pill px-4 py-2 rounded-full shadow-xs">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = stage === step.id;
            const isPassed =
              (stage === "cake" && step.id === "gift") ||
              (stage === "letter" && (step.id === "gift" || step.id === "cake"));

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <div
                    className={`w-4 sm:w-8 h-[2px] rounded-full transition-colors ${
                      isPassed ? "bg-amber-400" : "bg-neutral-300 dark:bg-neutral-700"
                    }`}
                  />
                )}
                <div
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "text-theme-heading font-semibold"
                      : isPassed
                      ? "text-theme-subtext"
                      : "text-neutral-400 dark:text-neutral-600"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                      isActive
                        ? "bg-theme-primary text-theme-primary-text scale-110 shadow-xs"
                        : isPassed
                        ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* Main Scene Transitions */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {stage === "gift" && (
            <motion.div
              key="gift-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <GiftBoxScene
                recipient={wish.recipient}
                onOpenComplete={() => setStage("cake")}
              />
            </motion.div>
          )}

          {stage === "cake" && (
            <motion.div
              key="cake-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <CakeScene
                recipient={wish.recipient}
                age={wish.age}
                onCandlesBlown={() => setStage("letter")}
              />
            </motion.div>
          )}

          {stage === "letter" && (
            <motion.div
              key="letter-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <LetterScene
                wish={wish}
                recipient={wish?.recipient}
                onReplay={handleReplay}
                onCreateAnother={onCreateAnother}
                onOpenShareModal={onOpenShareModal}
                isMuted={isMuted}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
