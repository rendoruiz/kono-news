/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandOrange: 'rgb(255, 102, 0)',
        brandBackground: 'rgb(246, 246, 239)',
        brandPrimary: 'rgb(30, 30, 30)',
        brandSecondary: 'rgb(130, 130, 130)',
        modalOverlay: 'rgba(0, 0, 0, 0.5)',
        itemSelected: 'rgba(0, 0, 0, 0.05)',
      },
      fontSize: {
        heading1: '1.75em',
        heading2: '1.5em',
        heading3: '1.2em',
        heading4: '1.1em',
        title: '1.15em',
        base: '1em',
        contentPrimary: '0.9em',
        contentSecondary: '0.85em',
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
