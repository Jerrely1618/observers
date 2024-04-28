/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  content:  ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D232A', 
          dark: '#352ED0', 
          light: '#7D7BFF',
        },
        secondary: {
          DEFAULT: '#A6ADBB',
          dark: '#D97706', 
          light: '#FDE68A',
        },
      },
    },
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

