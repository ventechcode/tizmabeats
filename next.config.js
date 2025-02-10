/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          // Dashboard redirect
          {
            source: '/dashboard',
            destination: '/dashboard/overview',
            permanent: true,
          },
        ]
      },
};

// Use CommonJS export
module.exports = nextConfig;
