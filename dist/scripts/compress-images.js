const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const directories = ['results', 'images'];

async function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath);
        } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
            await compressImage(fullPath);
        }
    }
}

async function compressImage(filePath) {
    const stats = fs.statSync(filePath);
    const sizeInMb = stats.size / (1024 * 1024);
    
    // Only compress if larger than 200KB
    if (sizeInMb < 0.2) {
        return;
    }

    console.log(`Processing: ${path.relative(projectRoot, filePath)} (${sizeInMb.toFixed(2)} MB)`);
    
    const ext = path.extname(filePath).toLowerCase();
    const tempPath = filePath + '.tmp';

    try {
        let pipeline = sharp(filePath).resize(1200, null, { withoutEnlargement: true });

        if (ext === '.png') {
            pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
        } else {
            pipeline = pipeline.jpeg({ quality: 80, progressive: true });
        }

        await pipeline.toFile(tempPath);
        
        // Replace original
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        
        const newStats = fs.statSync(filePath);
        const reduction = ((1 - (newStats.size / stats.size)) * 100).toFixed(1);
        console.log(`   Done: ${(newStats.size / 1024).toFixed(1)} KB (-${reduction}%)`);
    } catch (err) {
        console.error(`   Error processing ${filePath}:`, err.message);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
}

async function run() {
    console.log('--- Global Image Compression Started ---');
    for (const dir of directories) {
        const dirPath = path.join(projectRoot, dir);
        if (fs.existsSync(dirPath)) {
            console.log(`Scanning: /${dir}...`);
            await processDirectory(dirPath);
        }
    }
    console.log('--- Global Image Compression Finished ---');
}

run();
