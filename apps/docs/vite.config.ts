import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";

import mdxConfig, { docs } from "./source.config";

export default defineConfig(async () => ({
  server: {
    port: 5173,
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
    }),
    await mdx({ docs, default: mdxConfig }),
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      pages: [{ path: "/" }],
    }),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
}));
