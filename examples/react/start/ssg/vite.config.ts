import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tanstackStart({
      srcDirectory: "src",
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      pages: [{ path: "/" }, { path: "/ar" }],
    }),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
