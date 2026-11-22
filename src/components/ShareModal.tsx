import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Share2, QrCode, Sparkles } from "lucide-react";
import QRCode from "qrcode";
import type { BirthdayWish } from "../types/wish";
import { copyToClipboard, generateWishUrl, shareWishNative } from "../utils/share";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  wish: BirthdayWish;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  wish,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null);
  const [showQr, setShowQr] = React.useState(false);
  const shareUrl = React.useMemo(() => generateWishUrl(wish), [wish]);

  React.useEffect(() => {
    if (isOpen) {
      // Generate QR Code data URL
      QRCode.toDataURL(shareUrl, {
        width: 220,
        margin: 2,
        color: {
          dark: "#451a03",
          light: "#ffffff",
        },
      })
        .then((dataUri) => {
          setQrDataUrl(dataUri);
        })
        .catch(() => {
          // QR code error fallback
        });
    }
  }, [isOpen, shareUrl]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    await shareWishNative(wish, shareUrl);
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
        >
          {/* Backdrop click to close */}
          <div className="fixed inset-0" onClick={onClose} />

          {/* Modal Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-300/60 overflow-hidden text-left"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pr-8 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300/60 mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Magic Link Ready</span>
              </div>
              <h3 id="share-modal-title" className="font-playfair text-2xl sm:text-3xl font-bold text-theme-heading">
                Share the Celebration
              </h3>
              <p className="text-xs sm:text-sm text-theme-subtext font-light">
                Send this link to <span className="font-semibold text-theme-heading">{wish.recipient}</span>. When they open it, their personalized surprise begins!
              </p>
            </div>

            {/* Link Box */}
            <div className="mt-6 space-y-3">
              <label className="text-xs font-semibold text-theme-heading flex items-center justify-between">
                <span>Unique Celebration URL</span>
                {copied && <span className="text-teal-600 font-bold">Copied to clipboard! ✨</span>}
              </label>

              <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-theme-border">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="flex-1 px-2 py-1 text-xs text-theme-heading bg-transparent border-none focus:outline-none select-all truncate font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    copied
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-theme-primary text-theme-primary-text hover:opacity-90 shadow-sm"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Native Share & QR Buttons */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              {canNativeShare && (
                <button
                  onClick={handleNativeShare}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send via App / WhatsApp</span>
                </button>
              )}

              <button
                onClick={() => setShowQr(!showQr)}
                className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold glass-pill hover:bg-white/80 dark:hover:bg-slate-800 text-theme-heading border border-theme-border flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <QrCode className="w-4 h-4 text-amber-500" />
                <span>{showQr ? "Hide QR" : "Show QR Code"}</span>
              </button>
            </div>

            {/* Collapsible QR Code Display */}
            {showQr && qrDataUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 pt-4 border-t border-theme-border flex flex-col items-center text-center space-y-2"
              >
                <div className="p-3 bg-white rounded-2xl shadow-md border border-neutral-200">
                  <img
                    src={qrDataUrl}
                    alt={`QR code for ${wish.recipient}'s birthday celebration`}
                    className="w-44 h-44 object-contain"
                  />
                </div>
                <p className="text-[11px] text-theme-subtext">
                  Scan with any phone camera to open the celebration directly.
                </p>
              </motion.div>
            )}

            {/* Footer tips */}
            <div className="mt-6 pt-4 border-t border-theme-border/60 text-center">
              <p className="text-[11px] text-theme-subtext opacity-80">
                🔒 Completely private & serverless. The entire celebration is stored safely right in the link!
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
