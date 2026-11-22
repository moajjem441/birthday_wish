import React from "react";
import type { BirthdayWish, ThemeName } from "./types/wish";
import { THEMES } from "./data/themes";
import { MESSAGE_PRESETS } from "./data/messagePresets";
import { getWishFromUrl, hasWishParam } from "./utils/share";
import { sound } from "./utils/sound";
import { Navbar } from "./components/Navbar";
import { HeroLanding } from "./components/HeroLanding";
import { PersonalizationForm } from "./components/PersonalizationForm";
import { CelebrationFlow } from "./components/CelebrationFlow";
import { ShareModal } from "./components/ShareModal";
import { ErrorFallback, ErrorBoundary } from "./components/ErrorFallback";
import { ArrowLeft, Sparkles } from "lucide-react";

type AppMode = "creator" | "celebration" | "invalid-link";
type CreatorStep = "landing" | "form" | "preview";

export const App: React.FC = () => {
  // Helper to determine initial mode, wish, and theme strictly from URL parameters
  const [initialState] = React.useState(() => {
    if (hasWishParam()) {
      const parsed = getWishFromUrl();
      if (parsed) {
        return {
          mode: "celebration" as AppMode,
          creatorStep: "landing" as CreatorStep,
          wish: parsed,
          theme: parsed.theme,
        };
      } else {
        return {
          mode: "invalid-link" as AppMode,
          creatorStep: "landing" as CreatorStep,
          wish: {
            recipient: "",
            sender: "",
            age: undefined,
            message: MESSAGE_PRESETS[0].text,
            theme: "golden-champagne" as ThemeName,
          },
          theme: "golden-champagne" as ThemeName,
        };
      }
    }

    // Default: Pure Creator Mode
    let savedTheme: ThemeName = "golden-champagne";
    try {
      const local = localStorage.getItem("birthday_magic_theme");
      if (local && THEMES.some((t) => t.id === local)) {
        savedTheme = local as ThemeName;
      }
    } catch {
      // ignore
    }

    return {
      mode: "creator" as AppMode,
      creatorStep: "landing" as CreatorStep,
      wish: {
        recipient: "",
        sender: "",
        age: undefined,
        message: MESSAGE_PRESETS[0].text,
        theme: savedTheme,
      },
      theme: savedTheme,
    };
  });

  const [mode, setMode] = React.useState<AppMode>(initialState.mode);
  const [creatorStep, setCreatorStep] = React.useState<CreatorStep>(initialState.creatorStep);
  const [currentTheme, setCurrentTheme] = React.useState<ThemeName>(initialState.theme);
  const [isMuted, setIsMuted] = React.useState<boolean>(() => sound.getMuted());
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [wish, setWish] = React.useState<BirthdayWish>(initialState.wish);

  // Sync theme changes with DOM attribute
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (theme: ThemeName) => {
    setCurrentTheme(theme);
    setWish((prev) => ({ ...prev, theme }));
    try {
      localStorage.setItem("birthday_magic_theme", theme);
    } catch {
      // ignore
    }
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleStartCreating = () => {
    setCreatorStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExploreSample = () => {
    const sampleWish: BirthdayWish = {
      recipient: "Sarah",
      sender: "Naky",
      age: 28,
      message:
        "Wishing you a birthday as luminous, kind, and joyful as you are. May this year bring you steady peace, roaring laughter, and dreams taking flight!",
      theme: currentTheme,
    };
    setWish(sampleWish);
    setCreatorStep("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Called when creator wants to reset or recipient clicks "Create Another Wish"
  const handleCreateNew = () => {
    // If in celebration mode via URL, navigate cleanly to root URL
    if (window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    setMode("creator");
    setCreatorStep("form");
    setWish({
      recipient: "",
      sender: "",
      age: undefined,
      message: MESSAGE_PRESETS[0].text,
      theme: currentTheme,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReturnHome = () => {
    if (window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    setMode("creator");
    setCreatorStep("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen flex flex-col transition-colors duration-500 relative"
        style={{
          background: "var(--color-bg-gradient)",
          color: "var(--color-heading)",
        }}
      >
        {/*
          ========================================================================
          NAVBAR: Strict Mode Separation
          - Celebration Mode: Minimal navbar (Logo/Brand + Sound toggle ONLY).
          - Creator Mode: Full navbar (Logo, Sound, Theme picker, Create Wish CTA).
          ========================================================================
        */}
        <Navbar
          mode={mode === "celebration" ? "celebration" : "creator"}
          currentTheme={currentTheme}
          onThemeChange={mode === "creator" ? handleThemeChange : undefined}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onCreateNew={mode === "creator" ? handleReturnHome : undefined}
          showCreateButton={mode === "creator" && creatorStep !== "form"}
        />

        {/* Creator Preview Top Notice (Shown ONLY when creator tests their wish from the editor) */}
        {mode === "creator" && creatorStep === "preview" && (
          <aside aria-label="Preview notice" className="w-full bg-amber-500/15 border-y border-amber-500/30 py-2 px-4 text-center text-xs font-medium text-theme-heading flex items-center justify-center gap-3">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
              <span>Creator Preview Mode — This is how your recipient will experience the magic</span>
            </span>
            <button
              onClick={() => {
                setCreatorStep("form");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-theme-primary text-theme-primary-text font-semibold text-xs hover:opacity-90 active:scale-95 shadow-xs transition-all"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Editor</span>
            </button>
          </aside>
        )}

        {/*
          ========================================================================
          MAIN EXPERIENCE: Strict Mode Separation
          ========================================================================
        */}
        <main className="flex-1 flex flex-col justify-center">
          {/*
            1. PURE CELEBRATION MODE (Triggered strictly by valid ?wish=)
            Direct immersion: Gift Box → Cake & Candles → Greeting Letter.
            Zero creator controls or form elements shown.
          */}
          {mode === "celebration" && (
            <CelebrationFlow
              wish={wish}
              onCreateAnother={handleCreateNew}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              isMuted={isMuted}
            />
          )}

          {/*
            2. CREATOR MODE (Triggered when no ?wish= parameter is in URL)
          */}
          {mode === "creator" && (
            <>
              {creatorStep === "landing" && (
                <HeroLanding
                  onStartCreating={handleStartCreating}
                  onExploreSample={handleExploreSample}
                />
              )}

              {creatorStep === "form" && (
                <PersonalizationForm
                  wish={wish}
                  onChange={(updated) => {
                    setWish((prev) => ({ ...prev, ...updated }));
                    if (updated.theme) {
                      setCurrentTheme(updated.theme);
                    }
                  }}
                  onPreview={() => {
                    setCreatorStep("preview");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onGenerateLink={() => {
                    setIsShareModalOpen(true);
                  }}
                />
              )}

              {creatorStep === "preview" && (
                <CelebrationFlow
                  wish={wish}
                  onCreateAnother={handleCreateNew}
                  onOpenShareModal={() => setIsShareModalOpen(true)}
                  isMuted={isMuted}
                />
              )}
            </>
          )}

          {/*
            3. INVALID SHARED LINK FALLBACK
          */}
          {mode === "invalid-link" && (
            <ErrorFallback
              onReset={handleReturnHome}
              actionText="Create a Fresh Birthday Wish"
            />
          )}
        </main>

        {/* Clean Footer */}
        <footer className="py-6 px-4 text-center border-t border-theme-border/40 text-xs text-theme-subtext/80 space-y-1">
          {mode === "celebration" ? (
            <p>
              ✨ A heartfelt birthday wish for <strong>{wish.recipient}</strong>
            </p>
          ) : (
            <>
              <p>
                ✨ <strong>A Little Birthday Magic</strong> — Crafted with warmth to celebrate anyone, anywhere.
              </p>
              <p className="text-[11px] opacity-70">
                Self-contained & private • No account required
              </p>
            </>
          )}
        </footer>

        {/* Share Modal Dialog */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          wish={wish}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
