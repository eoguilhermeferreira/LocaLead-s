/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          wine: '#8b1a2f',
          'wine-light': '#c41e3a',
          yellow: '#f59e0b',
          red: '#ef4444',
          bg: '#09090b',
          card: '#100508',
          card2: '#180a0e',
          border: '#2a1218',
        },
      },
    },
  },
  plugins: [],
}
