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
      },
      colors: {
        premium: {
          sidebar: '#111111',
          bg: '#F8F8F8',
          card: '#FFFFFF',
        },
        gold: {
          100: '#FDF8F0',
          200: '#F3E4C8', // Light gold highlight
          400: '#E2BA70',
          500: '#D4A64F', // Primary Accent
          600: '#B88D3D',
        },
        dark: {
          DEFAULT: '#111111',
          muted: '#737373',
          border: '#262626'
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -4px rgba(0, 0, 0, 0.04)',
        'float': '0 12px 32px -4px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px 0 rgba(212, 166, 79, 0.15)',
      },
    },
  },
  plugins: [],
}
