/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0E3A2F',
          DEFAULT: '#4BA82E',
          light: '#78FAAE',
          muted: '#1a5a42',
        }
      },
      animation: {
        'bounce-slow': 'bounce 1.4s infinite',
      }
    },
  },
  plugins: [],
}
