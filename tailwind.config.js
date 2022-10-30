 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/*.{html,js}',
    './*.{html,js}',
  ],
  theme: {
    fontFamily: {
      sans: "Fira Sans, sans-serif",
      serif: "Roboto Slab, serif",
    },
    extend: {},
  },
  plugins: [],
};