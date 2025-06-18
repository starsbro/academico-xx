// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to support Clerk middleware and server-side features
  // output: 'export', // Commented out to enable SSR
  // Add any other Next.js specific configurations here if you need them in the future.
};

module.exports = nextConfig;
