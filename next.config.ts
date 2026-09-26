import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        root: __dirname,
    },
    experimental: {
        serverActions: {
            // Lab report PDFs are validated against this same limit in code.
            bodySizeLimit: "10mb",
        },
    },
};

export default nextConfig;
