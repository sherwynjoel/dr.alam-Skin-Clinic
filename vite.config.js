import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const htmlFiles = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.html'))
  .reduce((acc, file) => {
    const name = file.replace('.html', '');
    acc[name] = resolve(__dirname, file);
    return acc;
  }, {});

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: htmlFiles,
    },
  },
});
