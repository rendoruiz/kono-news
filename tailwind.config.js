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
        textPrimary: 'rgb(30, 30, 30)',
        textSecondary: 'rgb(130, 130, 130)',
      },
      fontSize: {
        heading1: '',
        heading2: '',
        heading3: '',
        base: '1em',
        contentPrimary: '0.9em',
        contentSecondary: '0.85em',
      },
      spacing: {
        '1px': '0.0625rem',
        '2px': '0.125rem',
      }
    },
  },
  plugins: [],
}
