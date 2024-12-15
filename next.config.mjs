/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Previene que los módulos de Node.js se incluyan en el bundle del cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        "cpu-features": false,
        path: false,
        stream: false,
        constants: false,
        os: false,
        ssh2: false,
      };
    }
    return config;
  },
};

export default nextConfig;
