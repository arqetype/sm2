import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { devtools } from '@tanstack/devtools-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      bytecodePlugin(),
      viteStaticCopy({
        targets: [
          {
            src: 'src/main/database/generated/**/*',
            dest: 'database/generated'
          }
        ]
      })
    ],
    resolve: {
      alias: {
        '@main': path.resolve(__dirname, 'src/main'),
        '@shared': path.resolve(__dirname, 'src/_shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, 'src/_shared'),
        '@preload': path.resolve(__dirname, 'src/preload')
      }
    }
  },
  renderer: {
    plugins: [
      devtools(),
      tanstackRouter({ target: 'react', autoCodeSplitting: true }),
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/renderer/src')
      }
    }
  }
});
