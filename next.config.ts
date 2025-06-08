// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'file.hstatic.net',
      // Thêm các domain khác nếu cần
    ],
    // Hoặc sử dụng remotePatterns (khuyến nghị cho Next.js 13+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
