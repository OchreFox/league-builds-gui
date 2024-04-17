module.exports = {
  singleQuote: true,
  semi: false,
  printWidth: 120,
  arrowParens: 'always',
  trailingComma: 'es5',
  tabWidth: 2,
  importOrder: [
    '^(next/(.*)$)|^(next$)', // Imports by "next"
    '^(react/(.*)$)|^(react$)', // Imports by "react"
    '<THIRD_PARTY_MODULES>',
    'next-seo.config',
    // @ local imports
    '^@/(store|hooks|types|utils|components|styles)/(.*)$',
    // Components that do not end with .module.scss or .scss
    '^@/components/(?!.*module.scss$|.*s?css$)(.*)$',
    '^utils/(.*)$',
    '^assets/(.*)$',
    '^@fontsource(-variable)*/(.*)$',
    // CSS and SCSS imports (e.g. `import '/styles/global.scss'` or `import '/styles/index.module.scss'`)
    '^[/]*[-a-zA-Z0-9_].*.s?css$',
    '^[./]', // Other imports
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["prettier-plugin-tailwindcss"]
}
