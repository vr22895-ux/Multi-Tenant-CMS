import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // specific static pages
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about-us.html',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/contact-us.html',
        destination: '/contact-us',
        permanent: true,
      },
      // Generic product pages (catch-all for .html)
      // We assume anything else ending in .html is a product
      {
        source: '/:slug.html',
        destination: '/products/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
