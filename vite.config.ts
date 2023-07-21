import { resolve } from 'path';
import { defineConfig } from 'vite'
import copy from 'rollup-plugin-copy';
import react from '@vitejs/plugin-react'


const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  resolve: {
    alias: {
      '@src': root,
      '@assets': assetsDir,
      '@pages': pagesDir,
    },
  },
  plugins: [react()],
  publicDir,
  build: {
    outDir,
    emptyOutDir: false,
    target: 'esnext',
    rollupOptions: {
      input: {
        background: resolve(pagesDir, 'background', 'index.ts'),
        popup: resolve(pagesDir, 'popup', 'index.html')
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
      },
    },
  },
});