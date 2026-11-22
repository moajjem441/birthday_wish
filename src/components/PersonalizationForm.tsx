import React from "react";
import { Sparkles, Eye, Share2, AlertCircle, HeartHandshake, User, Users, Calendar } from "lucide-react";
import type { BirthdayWish, ThemeName } from "../types/wish";
import { ThemeSelector } from "./ThemeSelector";
import { MessagePresets } from "./MessagePresets";
import { validateWish } from "../utils/validation";

interface PersonalizationFormProps {
  wish: BirthdayWish;
  onChange: (updated: Partial<BirthdayWish>) => void;
  onPreview: () => void;
  onGenerateLink: () => void;
}

export const PersonalizationForm: React.FC<PersonalizationFormProps> = ({
  wish,
  onChange,
  onPreview,
  onGenerateLink,
}) => {
  const [errors, setErrors] = React.useState<{
    recipient?: string;
    sender?: string;
    message?: string;
    age?: string;
  }>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = React.useState(false);

  const handleValidateAndProceed = (action: "preview" | "generate") => {
    setHasAttemptedSubmit(true);
    const result = validateWish(wish);
    setErrors(result.errors);

    if (result.isValid) {
      if (action === "preview") {
        onPreview();
      } else {
        onGenerateLink();
      }
    }
  };

  const handleFieldChange = (field: keyof BirthdayWish, val: unknown) => {
    onChange({ [field]: val });
    if (hasAttemptedSubmit) {
      const updatedWish = { ...wish, [field]: val };
      const result = validateWish(updatedWish);
      setErrors(result.errors);
    }
  };

  const charCount = wish.message?.length || 0;
  const maxChar = 800;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="text-center mb-8">
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-theme-heading">
          Personalize the Magic
        </h2>
        <p className="text-sm sm:text-base text-theme-subtext mt-2 font-light">
          Craft a warm celebration tailored to your relationship—joyful, heartfelt, and memorable.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: The Form */}
        <div className="lg:col-span-7 space-y-6 glass-card p-6 sm:p-8 rounded-3xl">
          {/* Recipient Name */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-theme-heading flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>Who is this wish for? <span className="text-rose-500">*</span></span>
              </span>
              <span className="text-[11px] text-theme-subtext font-normal">Recipient's name or title</span>
            </label>
            <input
              type="text"
              value={wish.recipient}
              onChange={(e) => handleFieldChange("recipient", e.target.value)}
              placeholder="e.g. Maya, Dad, Alex, Professor Davis"
              className={`w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border text-sm text-theme-heading placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                errors.recipient
                  ? "border-rose-400 focus:ring-rose-300"
                  : "border-theme-border focus:ring-amber-400 focus:border-amber-400"
              }`}
              maxLength={60}
            />
            {errors.recipient && (
              <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.recipient}</span>
              </p>
            )}
          </div>

          {/* Sender Name & Optional Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender Name */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-theme-heading flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span>From whom? <span className="text-rose-500">*</span></span>
                </span>
              </label>
              <input
                type="text"
                value={wish.sender}
                onChange={(e) => handleFieldChange("sender", e.target.value)}
                placeholder="e.g. David, Mom & Dad, The Team"
                className={`w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border text-sm text-theme-heading placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.sender
                    ? "border-rose-400 focus:ring-rose-300"
                    : "border-theme-border focus:ring-amber-400 focus:border-amber-400"
                }`}
                maxLength={60}
              />
              {errors.sender && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.sender}</span>
                </p>
              )}
            </div>

            {/* Optional Age */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-theme-heading flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Age <span className="text-neutral-400 font-normal">(Optional)</span></span>
                </span>
                <span className="text-[11px] text-theme-subtext font-normal">Leave blank if preferred</span>
              </label>
              <input
                type="number"
                min={1}
                max={130}
                value={wish.age !== undefined && wish.age !== null ? wish.age : ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                  handleFieldChange("age", isNaN(val as number) ? undefined : val);
                }}
                placeholder="e.g. 25"
                className={`w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border text-sm text-theme-heading placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.age
                    ? "border-rose-400 focus:ring-rose-300"
                    : "border-theme-border focus:ring-amber-400 focus:border-amber-400"
                }`}
              />
              {errors.age && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.age}</span>
                </p>
              )}
            </div>
          </div>

          {/* Message Presets */}
          <MessagePresets
            onSelectPreset={(presetText) => handleFieldChange("message", presetText)}
          />

          {/* Heartfelt Message Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-theme-heading flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
                <span>Your Birthday Message <span className="text-rose-500">*</span></span>
              </label>
              <span className={`text-[11px] ${charCount > maxChar ? "text-rose-500 font-bold" : "text-theme-subtext opacity-75"}`}>
                {charCount}/{maxChar}
              </span>
            </div>
            <textarea
              rows={4}
              value={wish.message}
              onChange={(e) => handleFieldChange("message", e.target.value)}
              placeholder="Write something heartfelt, warm, or humorous here..."
              className={`w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border text-sm text-theme-heading placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all leading-relaxed ${
                errors.message
                  ? "border-rose-400 focus:ring-rose-300"
                  : "border-theme-border focus:ring-amber-400 focus:border-amber-400"
              }`}
              maxLength={maxChar}
            />
            {errors.message && (
              <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Theme Selector */}
          <ThemeSelector
            selectedTheme={wish.theme}
            onSelectTheme={(newTheme: ThemeName) => handleFieldChange("theme", newTheme)}
          />

          {/* Creator CTAs */}
          <div className="pt-4 border-t border-theme-border flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => handleValidateAndProceed("generate")}
              className="flex-1 py-3.5 px-6 rounded-2xl font-medium text-sm sm:text-base bg-theme-primary text-theme-primary-text hover:opacity-95 shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Share2 className="w-4 h-4" />
              <span>Generate Magic Link ✨</span>
            </button>

            <button
              type="button"
              onClick={() => handleValidateAndProceed("preview")}
              className="py-3.5 px-5 rounded-2xl font-medium text-sm text-theme-heading glass-pill hover:bg-white/80 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Eye className="w-4 h-4 text-amber-500" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Interactive Card Preview */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-theme-subtext flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Live Card Preview</span>
            </span>
            <span className="text-[11px] text-theme-subtext opacity-70">Updates in real-time</span>
          </div>

          {/* The Mini Card Preview */}
          <div className="relative rounded-3xl p-6 sm:p-7 glass-card shadow-xl overflow-hidden border border-amber-300/40 transition-all duration-300">
            {/* Soft decorative background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4 text-left">
              {/* Decorative Header Stamp */}
              <div className="flex items-center justify-between pb-3 border-b border-theme-border/60">
                <span className="font-playfair text-xs tracking-widest uppercase text-theme-subtext opacity-80">
                  Birthday Greeting Card
                </span>
                <span className="text-base">🎂</span>
              </div>

              {/* Greeting Heading */}
              <div>
                <h4 className="font-playfair text-xl sm:text-2xl font-bold text-theme-heading leading-snug">
                  Happy Birthday,{" "}
                  <span className="text-theme-primary">
                    {wish.recipient.trim() || "Someone Special"}
                  </span>
                  !
                </h4>

                {wish.age ? (
                  <p className="text-xs font-medium text-theme-subtext mt-1">
                    Celebrating {wish.age} wonderful years of memories ✨
                  </p>
                ) : (
                  <p className="text-xs font-medium text-theme-subtext mt-1">
                    Celebrating another year of wonder & light ✨
                  </p>
                )}
              </div>

              {/* Message Body */}
              <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-black/20 border border-theme-border/40 text-xs sm:text-sm text-theme-heading leading-relaxed font-light min-h-[90px] whitespace-pre-wrap">
                {wish.message.trim() || (
                  <span className="italic text-neutral-400">
                    Your heartwarming message will appear here as you type...
                  </span>
                )}
              </div>

              {/* Sender Signature */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-theme-subtext">
                  <span>With warmest wishes,</span>
                  <div className="font-caveat text-xl font-bold text-theme-heading mt-0.5">
                    {wish.sender.trim() || "A Friend"}
                  </div>
                </div>

                {/* Simulated seal */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-400 text-white flex items-center justify-center shadow-md font-playfair font-bold text-xs">
                  ✨
                </div>
              </div>
            </div>
          </div>

          <div className="text-center px-4">
            <p className="text-xs text-theme-subtext opacity-80">
              When the recipient opens their link, they'll embark on a 3-step interactive journey before revealing this card!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
