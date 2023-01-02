module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      body: ['Epilogue', 'system-ui', 'sans-serif'],
      serif: ['"IBM Plex Serif"', 'serif'],
      wide: ['"Work Sans"', 'sans-serif'],
      sans: ['"Inter"', 'sans-serif'],
      monospace: ['"IBM Plex Mono"', 'monospace'],
    },
    extend: {
      zIndex: {
        '-1': '-1',
      },
      screens: {
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
          gold: '#c7a96e',
        },
      },
      transitionTimingFunction: {
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
