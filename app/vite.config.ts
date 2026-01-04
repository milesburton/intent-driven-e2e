import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    strictPort: false,
    port: 5173
  },
  build: {
    outDir: 'dist'
  }
});
