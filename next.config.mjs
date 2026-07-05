import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile Spline packages so their exports-field ("import"-only)
  // resolves in both the client and server compilation passes.
  transpilePackages: ["@splinetool/react-spline", "@splinetool/runtime"],
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // The package's exports field only declares the "import" condition, so
      // Next's server compilation pass can't resolve the bare specifier for a
      // dynamic import(). Alias it straight to the "use client" dist entry.
      "@splinetool/react-spline$": path.resolve(
        __dirname,
        "node_modules/@splinetool/react-spline/dist/react-spline.js"
      ),
    };
    return config;
  },
};

export default nextConfig;
