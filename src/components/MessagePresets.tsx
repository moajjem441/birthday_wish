import React from "react";
import { Sparkles, MessageSquareHeart } from "lucide-react";
import { MESSAGE_PRESETS } from "../data/messagePresets";
import type { MessagePreset } from "../types/wish";

interface MessagePresetsProps {
  onSelectPreset: (text: string) => void;
}

export const MessagePresets: React.FC<MessagePresetsProps> = ({ onSelectPreset }) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleSelect = (preset: MessagePreset) => {
    setSelectedId(preset.id);
    onSelectPreset(preset.text);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-theme-heading flex items-center gap-1.5">
          <MessageSquareHeart className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Inspiration (Click to populate)</span>
        </span>
        <span className="text-[11px] text-theme-subtext opacity-80">You can edit freely anytime</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
        {MESSAGE_PRESETS.map((preset) => {
          const isCurrent = selectedId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isCurrent
                  ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200 font-semibold shadow-xs"
                  : "bg-white/60 dark:bg-slate-800/60 border-theme-border text-theme-subtext hover:border-amber-300 hover:bg-white/90"
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500 opacity-80" />
              <span>{preset.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
