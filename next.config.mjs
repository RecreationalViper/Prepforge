// Static export: the whole app is pre-built and served free from GitHub Pages.
// BASE_PATH is "/prepforge" on GitHub Pages and empty on a custom domain.
const base = process.env.BASE_PATH ?? "/prepforge";
export default {
  output: "export",
  basePath: base,
  assetPrefix: base || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE: base },
  reactStrictMode: true
};
