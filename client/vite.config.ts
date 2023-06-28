import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 4200,
    host: 'localhost',
  },
  build: {
    outDir: 'build',
    assetsDir: 'content',
  },
  plugins: [
    react(),
  ],
});
