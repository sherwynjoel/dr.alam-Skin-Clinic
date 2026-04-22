import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

const htmlFiles = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.html'))
  .reduce((acc, file) => {
    const name = file.replace('.html', '');
    acc[name] = resolve(__dirname, file);
    return acc;
  }, {});

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const copyFoldersPlugin = {
  name: 'copy-static-folders',
  closeBundle() {
    const folders = ['images', 'results', 'services', 'scripts'];
    for (const folder of folders) {
      const src = resolve(__dirname, folder);
      const dest = resolve(__dirname, 'dist', folder);
      if (fs.existsSync(src)) {
        copyDir(src, dest);
        console.log(`Copied ${folder}/ → dist/${folder}/`);
      }
    }
  }
};

export default defineConfig({
  base: './',
  root: './',

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: htmlFiles,
    },
  },
  plugins: [copyFoldersPlugin],
});
