import type { ThemeConfig } from "../types/wish";

export const THEMES: ThemeConfig[] = [
  {
    id: "golden-champagne",
    name: "Golden Champagne",
    feeling: "Elegant & Warm",
    accentColor: "#d97706",
    previewBg: "linear-gradient(135deg, #fffdfa 0%, #faecd8 100%)",
    gradientClass: "from-amber-500 to-yellow-600",
    description: "Soft ivory and radiant gold tones that bring an elegant, timeless celebration aura.",
  },
  {
    id: "berry-sunset",
    name: "Berry Sunset",
    feeling: "Joyful & Vibrant",
    accentColor: "#e11d48",
    previewBg: "linear-gradient(135deg, #fff0f5 0%, #fbd5e5 100%)",
    gradientClass: "from-rose-500 to-pink-600",
    description: "Cheerful berry, soft rose, and coral hues full of warmth, smiles, and joyful energy.",
  },
  {
    id: "enchanted-sage",
    name: "Enchanted Sage",
    feeling: "Calm & Natural",
    accentColor: "#0d9488",
    previewBg: "linear-gradient(135deg, #f0fdf4 0%, #cbf3e0 100%)",
    gradientClass: "from-teal-600 to-emerald-500",
    description: "Soothing botanical emerald and sage greens that evoke peace, growth, and gentle gratitude.",
  },
  {
    id: "midnight-starlight",
    name: "Midnight Starlight",
    feeling: "Magical & Dreamy",
    accentColor: "#fbbf24",
    previewBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    gradientClass: "from-indigo-600 to-amber-400",
    description: "Deep twilight sky illuminated with glistening golden stars and magical night wonder.",
  },
];
