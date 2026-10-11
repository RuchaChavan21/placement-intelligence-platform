/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#05060B',
          900: '#0A0C16',
          800: '#121527',
        },
        gold: {
          100: '#FDF8F0',
          200: '#F3E4C8',
          300: '#EBCD94',
          400: '#E2BA70',
          500: '#D4A64F', // Primary Accent
          600: '#B88D3D',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',
        },
      },
      boxShadow: {
        glass: '0 8px 32px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        glow: '0 0 24px 0 rgba(212, 166, 79, 0.35)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(6vw, -4vh) scale(1.1)' },
          '66%': { transform: 'translate(-4vw, 5vh) scale(0.95)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-5px)', opacity: '1' },
        },
      },
      animation: {
        drift: 'drift 22s ease-in-out infinite',
        'drift-slow': 'drift 30s ease-in-out infinite reverse',
        'bounce-dot': 'bounceDot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
