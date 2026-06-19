import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [tanstackStart(), solid({ ssr: true })],
  resolve: {
    tsconfigPaths: true,
  },
});
