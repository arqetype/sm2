import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src/renderer/src') }
    }
  }
});
