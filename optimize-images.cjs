const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, 'images');
const RESULTS_DIR = path.join(__dirname, 'results');
const EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

const QUALITY = { jpg: 75, png: 80, webp: 75 };

async function optimizeImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!EXTS.includes(ext)) return;

    const sizeBefore = fs.statSync(filePath).size;
    const tmp = filePath + '.tmp';

    try {
        const img = sharp(filePath);

        if (ext === '.png') {
            await img.png({ quality: QUALITY.png, compressionLevel: 9 }).toFile(tmp);
        } else if (ext === '.webp') {
            await img.webp({ quality: QUALITY.webp }).toFile(tmp);
        } else {
            await img.jpeg({ quality: QUALITY.jpg, mozjpeg: true }).toFile(tmp);
        }

        const sizeAfter = fs.statSync(tmp).size;
        if (sizeAfter < sizeBefore) {
            fs.renameSync(tmp, filePath);
            const saved = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
            console.log(`✓ ${path.basename(filePath)} — ${(sizeBefore/1024).toFixed(0)}KB → ${(sizeAfter/1024).toFixed(0)}KB (${saved}% saved)`);
        } else {
            fs.unlinkSync(tmp);
            console.log(`— ${path.basename(filePath)} already optimized, skipped`);
        }
    } catch (err) {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        console.error(`✗ ${path.basename(filePath)}: ${err.message}`);
    }
}

async function run() {
    const imgFiles = fs.readdirSync(INPUT_DIR).map(f => path.join(INPUT_DIR, f));
    const resFiles = fs.readdirSync(RESULTS_DIR).map(f => path.join(RESULTS_DIR, f));
    const files = [...imgFiles, ...resFiles];
    console.log(`Optimizing ${files.length} files...\n`);
    for (const file of files) await optimizeImage(file);
    console.log('\nDone.');
}

run();
