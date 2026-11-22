/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        caveat: ['Caveat', 'cursive', 'sans-serif'],
      },
      colors: {
        theme: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          border: 'var(--color-border)',
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'primary-text': 'var(--color-primary-text)',
          accent: 'var(--color-accent)',
          heading: 'var(--color-heading)',
          subtext: 'var(--color-subtext)',
          glow: 'var(--color-glow)',
        },
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'flicker': 'flicker 1.8s ease-in-out infinite alternate',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
        },
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.95' },
          '25%': { transform: 'scale(1.08, 0.95) rotate(1.5deg)', opacity: '1' },
          '50%': { transform: 'scale(0.95, 1.05) rotate(-0.5deg)', opacity: '0.9' },
          '75%': { transform: 'scale(1.04, 1.02) rotate(2deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
