/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure environnement variables to be accessible on client-side
  env: {
    META_APP_ID: process.env.META_APP_ID,
    META_APP_SECRET: process.env.META_APP_SECRET,
    META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN
  },
}

module.exports = nextConfig