export type ThemeName =
  | "golden-champagne"
  | "berry-sunset"
  | "enchanted-sage"
  | "midnight-starlight";

export interface BirthdayWish {
  recipient: string;
  sender: string;
  age?: number;
  message: string;
  theme: ThemeName;
}

export type CelebrationStage = "gift" | "cake" | "letter";

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  feeling: string;
  accentColor: string;
  previewBg: string;
  gradientClass: string;
  description: string;
}

export interface MessagePreset {
  id: string;
  title: string;
  category: "thoughtful" | "fun" | "gratitude" | "respectful" | "inspirational";
  text: string;
  tag: string;
}
