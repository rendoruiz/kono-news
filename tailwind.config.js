/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'serif': ['Merriweather', 'serif'],
      'sans': ['Open Sans', 'sans-serif'],
      'mono': [...defaultTheme.fontFamily.mono],
    },
    fontSize: {
      '2xs': '0.75em',
      'xs': '0.8em',
      'sm': '0.9em',
      'base': '1em',
      'lg': '1.1em',
      'xl': '1.15em',
      '2xl': '1.2em',
      '3xl': '1.5em',
      '4xl': '1.75em',
      '5xl': '2em',
    },
    extend: {
      colors: {
        knOrange: 'rgb(255, 102, 0)',
        knBackground: 'rgb(246, 246, 239)',
        knPrimary: 'rgb(30, 30, 30)',
        knSecondary: 'rgb(130, 130, 130)',
        knModalOverlay: 'rgba(0, 0, 0, 0.5)',
        knItemSelected: 'rgba(0, 0, 0, 0.05)',
        knCommentThreadBorder: 'rgb(255, 194, 153)',
      },
      zIndex: {
        modal: '1000',
      },
      transitionTimingFunction: {
        'panel': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      transitionDuration: {
        'panel': '400ms',
      },
      borderWidth: {
        1: '1px',
        1.5: '1.5px',
        3: '3px',
      }
    },
  },
  plugins: [],
}
