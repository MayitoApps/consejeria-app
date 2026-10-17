/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f6f2',
          100: '#e8ece3',
          200: '#d5ded0',
          300: '#b9c8b2',
          400: '#96ad8e',
          500: '#75926c',
          600: '#587450',
          700: '#3f5a3b',
          800: '#2d5a43', // noble pastoral sage
          900: '#1e3c2d',
          950: '#13261d',
        },
        navy: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7dbfe',
          300: '#a1c2fd',
          400: '#729dfa',
          500: '#4c78f5',
          600: '#3457e8',
          700: '#2841d2',
          800: '#2436aa',
          900: '#0f172a',
          950: '#080d1a',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        parchment: {
          50: '#f8faf6',
          100: '#f2f4ee',
          200: '#e6eae0',
          300: '#d8dfd0',
          400: '#c5cebc',
          500: '#aab4a0',
          600: '#8c9881',
          700: '#707c65',
          800: '#56604e',
          900: '#3f4739',
          950: '#252b21',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Merriweather', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 10px rgba(217, 119, 6, 0.12)',
        'gold-md': '0 8px 30px rgba(217, 119, 6, 0.18)',
        'gold-lg': '0 15px 45px rgba(217, 119, 6, 0.25)',
        'navy-sm': '0 4px 15px rgba(15, 23, 42, 0.08)',
        'navy-md': '0 10px 30px rgba(15, 23, 42, 0.15)',
        'navy-lg': '0 20px 50px rgba(8, 13, 26, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
