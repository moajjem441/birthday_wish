import React from "react";
import { Check } from "lucide-react";
import type { ThemeName } from "../types/wish";
import { THEMES } from "../data/themes";

interface ThemeSelectorProps {
  selectedTheme: ThemeName;
  onSelectTheme: (theme: ThemeName) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onSelectTheme,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-theme-heading flex items-center gap-1.5">
          <span>Atmosphere & Palette</span>
        </label>
        <span className="text-xs text-theme-subtext">Choose the celebration vibe</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3" role="radiogroup" aria-label="Theme selection">
        {THEMES.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectTheme(theme.id)}
              className={`group relative p-3 rounded-2xl text-left transition-all duration-200 border text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isSelected
                  ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md bg-white/95 dark:bg-slate-800/90 scale-[1.02]"
                  : "border-theme-border bg-white/60 dark:bg-slate-900/60 hover:border-amber-300/80 hover:bg-white/80"
              }`}
            >
              {/* Color Swatch Orb */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-7 h-7 rounded-xl shadow-sm border border-black/10 flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ background: theme.previewBg }}
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Theme Name & Feeling */}
              <div className="font-semibold text-theme-heading truncate">
                {theme.name}
              </div>
              <div className="text-[10px] text-theme-subtext opacity-80 truncate mt-0.5">
                {theme.feeling}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
