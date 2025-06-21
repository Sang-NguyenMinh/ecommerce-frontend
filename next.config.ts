/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'file.hstatic.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
