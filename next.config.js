/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: ['@svgr/webpack'],
      }
    )

    return config
  },
  images: {
    loader: 'custom',
  },
}
