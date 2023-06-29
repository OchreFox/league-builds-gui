/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: 'next/core-web-vitals',
  plugins: ['@limegrass/import-alias'],
  rules: {
    '@limegrass/import-alias/import-alias': 'error',
  },
}
