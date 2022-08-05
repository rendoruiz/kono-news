/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
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
      'base': '0.95em',
      'lg': '1.1em',
      'xl': '1.15em',
      '2xl': '1.2em',
      '3xl': '1.5em',
      '4xl': '1.75em',
      '5xl': '2em',
    },
    extend: {
      colors: {
        KonoAccentLight: 'rgb(230, 107, 25)',
        KonoAccentDark: 'rgb(255, 102, 0)',

        // Fluent any
        FluentSmokeFillColorDefault: '#0000004D',
        // FluentSubtleFillColorDisabled: '#FFFFFF00',
        
        // Fluent Light
        FluentLightTextFillColorPrimary: '#000000E4',
        FluentLightTextFillColorSecondary: '#0000009E',
        FluentLightTextFillColorTertiary: '#00000072',
        // FluentLightControlFillColorDefault: '#FFFFFFB3',
        FluentLightControlFillColorSecondary: '#F9F9F980',
        FluentLightControlFillColorTertiary: '#F9F9F94D',
        FluentLightControlStrokeColorDefault: '#0000000F',
        FluentLightControlStrokeColorSecondary: '#00000029',
        FluentLightSolidBackgroundFillColorBase: '#F3F3F3',
        // FluentLightSolidBackgroundFillColorSecondary: '#EEEEEE',
        // FluentLightSolidBackgroundFillColorTertiary: '#F9F9F9',
        FluentLightSolidBackgroundFillColorQuarternary: '#FFFFFF',
        FluentLightSubtleFillColorSecondary: '#00000009',
        FluentLightSubtleFillColorTertiary: '#00000006',
        FluentLightCardBackgroundFillColorDefault: '#FFFFFFB3',
        // FluentLightCardBackgroundFillColorSecondary: '#F6F6F680',
        FluentLightCardStrokeColorDefault: '#0000000F',
        // FluentLightCardStrokeColorDefaultSolid: '#EBEBEB',
        FluentLightDividerStrokeColorDefault: '#0000000F',
        FluentLightSurfaceStrokeColorDefault: '#75757566',
        // FluentLightSurfaceStrokeColorFlyout: '#0000000F',
        // FluentLightSystemFillColorAttentionBackground: '#F6F6F680',
        FluentLightSystemFillColorCautionBackground: '#FFF4CE',
        // FluentLightSystemFillColorCriticalBackground: '#FDE7E9',

        // Fluent Dark
        FluentDarkTextFillColorPrimary: '#FFFFFF',
        FluentDarkTextFillColorSecondary: '#FFFFFFC5',
        FluentDarkTextFillColorTertiary: '#FFFFFF87',
        // FluentDarkControlFillColorDefault: '#FFFFFF0F',
        FluentDarkControlFillColorSecondary: '#FFFFFF15',
        FluentDarkControlFillColorTertiary: '#FFFFFF08',
        FluentDarkControlStrokeColorDefault: '#FFFFFF12',
        FluentDarkControlStrokeColorSecondary: '#FFFFFF18',
        FluentDarkSolidBackgroundFillColorBase: '#202020',
        // FluentDarkSolidBackgroundFillColorSecondary: '#1C1C1C',
        // FluentDarkSolidBackgroundFillColorTertiary: '#282828',
        FluentDarkSolidBackgroundFillColorQuarternary: '#2C2C2C',
        FluentDarkSubtleFillColorSecondary: '#FFFFFF0F',
        FluentDarkSubtleFillColorTertiary: '#FFFFFF0A',
        FluentDarkCardBackgroundFillColorDefault: '#FFFFFF0D',
        // FluentDarkCardBackgroundFillColorSecondary: '#FFFFFF08',
        FluentDarkCardStrokeColorDefault: '#00000019',
        // FluentDarkCardStrokeColorDefaultSolid: '#1C1C1C',
        FluentDarkDividerStrokeColorDefault: '#FFFFFF15',
        FluentDarkSurfaceStrokeColorDefault: '#75757566',
        // FluentDarkSurfaceStrokeColorFlyout: '#00000033',
        // FluentDarkSystemFillColorAttentionBackground: '#FFFFFF08',
        FluentDarkSystemFillColorCautionBackground: '#433519',
        // FluentDarkSystemFillColorCriticalBackground: '#442726',
      },
      zIndex: {
        modal: '1000',
      },
      borderWidth: {
        1: '1px',
        1.5: '1.5px',
        3: '3px',
      },
      transitionProperty: {
        'transformOpacity': 'transform, opacity',
      }
    },
  },
  plugins: [],
}
