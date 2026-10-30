import type { NextConfig } from "next";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "production" && !process.env.LOCAL_DEV ? "" : "http://127.0.0.1:8000");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (backendUrl) {
      return [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
