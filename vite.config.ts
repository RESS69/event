// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      // ใช้ค่า default:
      // routesDirectory: './src/routes'
      // generatedRouteTree: './src/routeTree.gen.ts'
    }),
    react(),
  ],
});
