/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'teal-peaceful-llama-626.mypinata.cloud',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
