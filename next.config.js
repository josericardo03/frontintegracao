/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    LDAP_URL: process.env.LDAP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4001/:path*",
      },
    ];
  },
  output: "standalone",
};

module.exports = nextConfig;
