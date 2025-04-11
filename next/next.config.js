/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/kmg-robust/products/:slug*',
        destination: '/kmg-robust/product/:slug*',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig