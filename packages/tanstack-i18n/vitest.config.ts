import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.test.json",
      include: ["test/**/*.test.ts"],
    },
  },
});
