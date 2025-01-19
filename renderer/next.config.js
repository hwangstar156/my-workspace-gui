/** @type {import('next').NextConfig} */
const withTm = require('next-transpile-modules')

const nextConfig = {
  output: 'export',
  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  compiler: {
    styledComponents: {
      ssr: true,
    },
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  },
}

module.exports = withTm(['antd', '@ant-design/icons'])(nextConfig)
