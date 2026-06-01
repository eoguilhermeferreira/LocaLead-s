/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00d084',
          'green-alt': '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          bg: '#0d1117',
          card: '#111827',
          card2: '#1a2332',
          border: '#1f2937',
        },
      },
    },
  },
  plugins: [],
}
