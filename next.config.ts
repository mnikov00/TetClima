// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "1337",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;