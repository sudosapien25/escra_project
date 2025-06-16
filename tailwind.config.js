
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  safelist: [
    'border-blue-500',
    'border-gray-400',
    'border-yellow-500',
    'border-orange-400',
    'border-purple-500',
    'border-teal-500',
    'border-green-500',
    'border-red-500',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#23B5B5', // Teal
        secondary: '#FFFFFF', // White
        tertiary: '#000000', // Black
        blue: {
          100: '#DBEAFE',
          800: '#1E40AF',
        },
        yellow: {
          100: '#FEF9C3',
          800: '#92400E',
        },
        green: {
          100: '#DCFCE7',
          600: '#22C55E',
          800: '#166534',
        },
        purple: {
          100: '#EDE9FE',
          800: '#5B21B6',
        },
      },
      fontFamily: {
        sans: ['Avenir', 'Avenir Next', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 