/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source\\ Code\\ Pro', 'system-ui'],
      },
      colors: {
        primary: colors.slate,
        secondary: colors.cyan
      }
    },
  },
  plugins: [],
};
