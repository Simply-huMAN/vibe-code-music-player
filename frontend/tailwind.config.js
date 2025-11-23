/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6', // Violet-500
        secondary: '#ec4899', // Pink-500
        dark: '#0f172a', // Slate-900
        glass: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Aptos', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
