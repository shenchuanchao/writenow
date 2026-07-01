import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const CSP_PROD =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' https://*.supabase.co https://open.bigmodel.cn https://*.clarity.ms; font-src 'self' data:;";

const CSP_DEV =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' https://*.supabase.co https://open.bigmodel.cn https://*.clarity.ms http://192.168.2.56:* ws://192.168.2.56:*; font-src 'self' data:;";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          ...(!isDev
            ? [
                { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
                { key: "Content-Security-Policy", value: CSP_PROD },
              ]
            : [
                { key: "Content-Security-Policy", value: CSP_DEV },
              ]),
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
        ],
      },
    ];
  },
};

export default nextConfig;