/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins')
const optimizedImages = require('next-optimized-images')

// module.exports = {
//   reactStrictMode: true,
//   images: {
//     domains: ['raw.communitydragon.org'],
//   },
// }

module.exports = withPlugins([
  [
    optimizedImages,
    {
      /* config for next-optimized-images */
    },
  ],
  {
    images: {
      disableStaticImages: true,
    },
  },
  // your other plugins here
])
