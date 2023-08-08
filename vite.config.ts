import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');
const componentsDir = resolve(root, 'components');
const contextsDir = resolve(root, 'contexts');
const hooksDir = resolve(root, 'hooks');

export default defineConfig({
  resolve: {
    alias: {
      '@src': root,
      '@assets': assetsDir,
      '@pages': pagesDir,
      '@components': componentsDir,
      '@hooks': hooksDir,
      '@contexts': contextsDir,
    },
  },
  plugins: [react()],
  publicDir,
  build: {
    outDir,
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        background: resolve(pagesDir, 'background', 'index.ts'),
        "popup/sandbox": resolve(pagesDir, 'popup', 'index.html')
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`
      },
    },
  },
});