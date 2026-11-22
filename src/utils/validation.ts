import type { BirthdayWish, ThemeName } from "../types/wish";

export interface ValidationResult {
  isValid: boolean;
  errors: {
    recipient?: string;
    sender?: string;
    message?: string;
    age?: string;
  };
}

const VALID_THEMES: ThemeName[] = [
  "golden-champagne",
  "berry-sunset",
  "enchanted-sage",
  "midnight-starlight",
];

export function validateWish(wish: Partial<BirthdayWish>): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  // Recipient validation
  if (!wish.recipient || !wish.recipient.trim()) {
    errors.recipient = "Please enter who this birthday wish is for.";
  } else if (wish.recipient.trim().length > 60) {
    errors.recipient = "Name should be within 60 characters.";
  }

  // Sender validation
  if (!wish.sender || !wish.sender.trim()) {
    errors.sender = "Please enter who is sending this wish.";
  } else if (wish.sender.trim().length > 60) {
    errors.sender = "Sender name should be within 60 characters.";
  }

  // Message validation
  if (!wish.message || !wish.message.trim()) {
    errors.message = "Please write a heartfelt message or choose a preset above.";
  } else if (wish.message.trim().length > 800) {
    errors.message = "Message is a little too long (max 800 characters).";
  }

  // Age validation (optional)
  if (wish.age !== undefined && wish.age !== null && String(wish.age).trim() !== "") {
    const ageNum = Number(wish.age);
    if (!Number.isInteger(ageNum) || ageNum <= 0 || ageNum > 130) {
      errors.age = "Please enter a valid age between 1 and 130, or leave it empty.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isValidTheme(theme: string | undefined): theme is ThemeName {
  return VALID_THEMES.includes(theme as ThemeName);
}
