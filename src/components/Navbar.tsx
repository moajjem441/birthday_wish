import React from "react";
import { Sparkles, Volume2, VolumeX, PlusCircle, Palette } from "lucide-react";
import type { ThemeName } from "../types/wish";
import { THEMES } from "../data/themes";

interface NavbarProps {
  mode: "creator" | "celebration";
  currentTheme: ThemeName;
  onThemeChange?: (theme: ThemeName) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onCreateNew?: () => void;
  showCreateButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  currentTheme,
  onThemeChange,
  isMuted,
  onToggleMute,
  onCreateNew,
  showCreateButton = true,
}) => {
  const [showThemeDropdown, setShowThemeDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowThemeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isCelebrationMode = mode === "celebration";

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between glass-pill px-4 sm:px-6 py-2.5 rounded-full shadow-sm">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          {isCelebrationMode ? (
            // In Celebration Mode: non-intrusive brand emblem (does not eject recipient into creator mode)
            <div className="flex items-center gap-2 select-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-950" />
              </div>
              <div>
                <span className="font-playfair font-bold text-base sm:text-lg text-theme-heading leading-tight tracking-tight">
                  Birthday Magic
                </span>
              </div>
            </div>
          ) : (
            // In Creator Mode: clickable logo to return to landing
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
              aria-label="Birthday Magic Home"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-amber-950" />
              </div>
              <div>
                <span className="font-playfair font-bold text-base sm:text-lg text-theme-heading leading-tight tracking-tight">
                  Birthday Magic
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-outfit uppercase tracking-widest text-theme-subtext opacity-70">
                  Wish Creator
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Sound Toggle (Always accessible in both Creator & Celebration Mode) */}
          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-theme-heading hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
            title={isMuted ? "Sound Off (Click to enable)" : "Sound On (Click to mute)"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-500 opacity-80" />
                <span className="hidden md:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-theme-primary" />
                <span className="hidden md:inline">Sound On</span>
              </>
            )}
          </button>

          {/* CREATOR MODE ONLY CONTROLS (Theme Switcher & Create Wish Button) */}
          {!isCelebrationMode && (
            <>
              {/* Theme Switcher Dropdown */}
              {onThemeChange && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-theme-heading hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    aria-label="Change theme"
                    aria-expanded={showThemeDropdown}
                  >
                    <Palette className="w-4 h-4 text-theme-primary" />
                    <span className="hidden sm:inline">Theme</span>
                  </button>

                  {showThemeDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="text-[11px] font-semibold text-theme-subtext uppercase tracking-wider px-3 py-1">
                        Select Theme
                      </div>
                      <div className="space-y-1 mt-1">
                        {THEMES.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              onThemeChange(t.id);
                              setShowThemeDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                              currentTheme === t.id
                                ? "bg-amber-100/70 dark:bg-amber-950/50 font-semibold text-theme-heading"
                                : "text-theme-subtext hover:bg-black/5 dark:hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full shadow-inner border border-black/10"
                                style={{ backgroundColor: t.accentColor }}
                              />
                              <span>{t.name}</span>
                            </div>
                            {currentTheme === t.id && (
                              <span className="text-[10px] bg-amber-200/80 dark:bg-amber-900/60 px-1.5 py-0.5 rounded-full text-amber-900 dark:text-amber-200 font-bold">
                                Active
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Create Wish CTA */}
              {showCreateButton && onCreateNew && (
                <button
                  onClick={onCreateNew}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-theme-primary text-theme-primary-text hover:opacity-90 shadow-sm hover:shadow transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Wish</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
