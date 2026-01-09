import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    __BUILD_HASH__: JSON.stringify(Date.now().toString(36)),
  },
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
    environment: "node",
    reporters: ["default"],
    sequence: { concurrent: false },
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "lcov"],
      all: true,
      include: ["app/src/utils/**/*.ts"],
    },
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: !!process.env.OPENFIN,
      },
    },
  },
});
