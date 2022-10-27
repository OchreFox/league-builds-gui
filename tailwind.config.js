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
      colors: {
        brand: {
          light: '#f18e4d',
          default: '#dd7a39',
          dark: '#cc2936',
        },
      },
    },
  },
  plugins: [],
}
