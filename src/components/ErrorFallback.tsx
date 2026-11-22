import React from "react";
import { PlusCircle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onReset: () => void;
  actionText?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = "Oops! This birthday wish seems to have gotten a little lost.",
  message = "We couldn't read the celebration details from this link. It might be incomplete or from an older version.",
  onReset,
  actionText = "Create a New Wish",
}) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-amber-300/50 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner text-3xl">
          🎈
        </div>

        <div className="space-y-2">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-theme-heading leading-snug">
            {title}
          </h2>
          <p className="text-sm text-theme-subtext font-light leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onReset}
            className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm bg-theme-primary text-theme-primary-text hover:opacity-95 shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{actionText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-amber-50/50">
          <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center space-y-4">
            <div className="text-4xl">🎂</div>
            <h2 className="font-playfair text-2xl font-bold text-amber-950">
              Something unexpected occurred
            </h2>
            <p className="text-sm text-amber-800">
              Don't worry, your birthday magic isn't gone. Let's restart fresh!
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 rounded-full bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
