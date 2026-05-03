import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function strapiUploadPatterns(): RemotePattern[] {
  const raw = process.env.NEXT_PUBLIC_STRAPI_URL?.trim();
  if (!raw) return [];
  try {
    const u = new URL(raw);
    const protocol = (u.protocol.replace(":", "") || "https") as "http" | "https";
    const pattern: RemotePattern = {
      protocol,
      hostname: u.hostname,
      pathname: "/uploads/**",
    };
    if (u.port) {
      pattern.port = u.port;
    }
    return [pattern];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    // Force Next to treat this folder as the project root
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "tetclima-api.onrender.com",
        pathname: "/uploads/**",
      },
      ...strapiUploadPatterns(),
    ],
  },
};

export default nextConfig;