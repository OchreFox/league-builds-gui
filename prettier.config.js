module.exports = {
  singleQuote: true,
  semi: false,
  printWidth: 120,
  arrowParens: 'always',
  trailingComma: 'es5',
  importOrder: [
    '^(next/(.*)$)|^(next$)', // Imports by "next"
    '<THIRD_PARTY_MODULES>',
    'next-seo.config',
    '^components/(.*)$',
    '^utils/(.*)$',
    '^assets/(.*)$',
    '^@fontsource/(.*)$',
    '^[./]', // Other imports
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [require('prettier-plugin-tailwindcss')],
}
