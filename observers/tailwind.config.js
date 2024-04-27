/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  content:  ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'), plugin(function({ addUtilities }) {
      const newUtilities = {
        '.double-border': {
          borderTop: '2px double',
          borderBottom: '2px double',
        },
      };
      addUtilities(newUtilities);
    }),],
}

