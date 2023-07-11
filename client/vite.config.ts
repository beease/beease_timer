import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
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
}