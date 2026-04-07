/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /**
   * Default `npm run dev` uses `--turbopack` (see package.json) to avoid webpack’s
   * `.next/cache/webpack/*.pack.gz` persistent cache, which often corrupts on Windows
   * when OneDrive/antivirus locks files or `..next` is touched while the server runs.
   *
   * If you use `npm run dev:webpack` instead, webpack dev cache is disabled (no `.pack.gz` under `.next/cache`).
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
