import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { devtools } from '@tanstack/devtools-vite';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    plugins: [
      devtools(),
      tanstackRouter({ target: 'react', autoCodeSplitting: true }),
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src/renderer/src') }
    }
  }
});
