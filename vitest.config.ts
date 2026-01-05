import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
    environment: 'node',
    reporters: ['default'],
    sequence: { concurrent: false },
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov'],
      all: true,
      include: ['app/src/utils/**/*.ts']
    }
  }
});
