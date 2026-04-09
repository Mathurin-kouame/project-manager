/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind scanne ces fichiers pour purger les classes inutilisées en prod
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Epilogue', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
