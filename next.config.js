/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  distDir: 'build',
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
}

const imagePlugin = withImages({
  fileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
})

module.exports = withPlugins([imagePlugin, withBundleAnalyzer, nextConfig])
