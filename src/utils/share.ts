import type { BirthdayWish, ThemeName } from "../types/wish";
import { isValidTheme, validateWish } from "./validation";

/**
 * Encodes a string into URL-safe Base64 with full UTF-8 Unicode support (supports Bangla, Emojis, etc.)
 */
function toUrlSafeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decodes a URL-safe Base64 string back to a UTF-8 string
 */
function fromUrlSafeBase64(base64: string): string {
  let str = base64.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Encodes a BirthdayWish into a compact shareable URL string
 */
export function encodeWish(wish: BirthdayWish): string {
  const payload = {
    r: wish.recipient.trim(),
    s: wish.sender.trim(),
    m: wish.message.trim(),
    t: wish.theme,
    ...(wish.age ? { a: Number(wish.age) } : {}),
  };
  return toUrlSafeBase64(JSON.stringify(payload));
}

/**
 * Decodes and validates a raw wish string into a BirthdayWish object.
 * Returns null if invalid or corrupted.
 */
export function decodeWish(encoded: string): BirthdayWish | null {
  try {
    const jsonStr = fromUrlSafeBase64(encoded);
    const parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed !== "object") return null;

    const theme: ThemeName = isValidTheme(parsed.t) ? parsed.t : "golden-champagne";
    const recipient = typeof parsed.r === "string" ? parsed.r.trim() : "";
    const sender = typeof parsed.s === "string" ? parsed.s.trim() : "";
    const message = typeof parsed.m === "string" ? parsed.m.trim() : "";
    const age = parsed.a && Number.isInteger(Number(parsed.a)) && Number(parsed.a) > 0 ? Number(parsed.a) : undefined;

    if (!recipient || !sender || !message) {
      return null;
    }

    const wish: BirthdayWish = {
      recipient,
      sender,
      message,
      theme,
      age,
    };

    const validation = validateWish(wish);
    if (!validation.isValid) {
      return null;
    }

    return wish;
  } catch {
    return null;
  }
}

/**
 * Builds the full URL for a wish
 */
export function generateWishUrl(wish: BirthdayWish): string {
  const code = encodeWish(wish);
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("wish", code);
  return url.toString();
}

/**
 * Parses the current URL search parameters for a shared wish
 */
export function getWishFromUrl(): BirthdayWish | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("wish");
    if (!code) return null;
    return decodeWish(code);
  } catch {
    return null;
  }
}

/**
 * Checks if a 'wish' parameter exists in the URL at all (valid or invalid)
 */
export function hasWishParam(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has("wish");
}

/**
 * Safely copies text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback to execCommand
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand("copy");
    textArea.remove();
    return success;
  } catch {
    return false;
  }
}

/**
 * Triggers native Web Share API if supported
 */
export async function shareWishNative(wish: BirthdayWish, url: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `✨ A Birthday Wish for ${wish.recipient}`,
        text: `Someone made a little birthday magic for ${wish.recipient}! 🎂 Open the gift here:`,
        url,
      });
      return true;
    } catch (err: unknown) {
      // AbortError is thrown when user cancels the share dialog, which is normal
      if (err instanceof Error && err.name !== "AbortError") {
        return false;
      }
      return false;
    }
  }
  return false;
}
