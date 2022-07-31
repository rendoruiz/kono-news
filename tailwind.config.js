/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      'text-xs': '0.75em',
      'text-sm': '0,8em',
      'text-base': '0.9em',
      'text-lg': '1.1em',
      'text-xl': '1.15em',
      'text-2xl': '1.2em',
      'text-3xl': '1.5em',
      'text-4xl': '1.75em',
      'text-5xl': '2em',
    },
    extend: {
      colors: {
        brandOrange: 'rgb(255, 102, 0)',
        brandBackground: 'rgb(246, 246, 239)',
        brandPrimary: 'rgb(30, 30, 30)',
        brandSecondary: 'rgb(130, 130, 130)',
        modalOverlay: 'rgba(0, 0, 0, 0.5)',
        itemSelected: 'rgba(0, 0, 0, 0.05)',
        commentThread: 'rgb(255, 194, 153)',
      },
      spacing: {
        '1px': '0.0625rem',
        '2px': '0.125rem',
        '6px': '0.375rem',
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
