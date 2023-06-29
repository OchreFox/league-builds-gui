/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      body: ['"Epilogue Variable"', 'system-ui', 'sans-serif'],
      serif: ['"IBM Plex Serif"', 'serif'],
      wide: ['"Work Sans Variable"', 'sans-serif'],
      sans: ['"Inter Variable"', 'sans-serif'],
      monospace: ['"IBM Plex Mono"', 'monospace'],
      league: ['var(--font-beaufort)', 'serif'],
    },
    extend: {
      zIndex: {
        '-1': '-1',
      },
      screens: {
        xs: '320px',
        '3xl': '1920px',
      },
      transitionProperty: {
        'extended-colors':
          'color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow, filter, backdrop-filter',
      },
      colors: {
        brand: {
          light: '#f18e4d',
          default: '#dd7a39',
          dark: '#cc2936',
        },
        league: {
          gold: '#C8AA6E',
          goldLight: '#F0E6D2',
          goldYellow: '#C89B3C',
          goldDark: '#785A28',
          goldDarker: '#463714',
          goldDarkest: '#32281E',
          blue: '#0397AB',
          blueLight: '#CDFAFA',
          blueLighter: '#0AC8B9',
          blueDark: '#005A82',
          cyan: '#0A323C',
          navy: '#091428',
          navyDark: '#0A1428',
        },
      },
      transitionTimingFunction: {
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
}
