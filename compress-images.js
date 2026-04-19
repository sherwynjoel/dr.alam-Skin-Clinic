const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const folders = ['images', 'results'];
const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

async function compressFolder(folder) {
    const dir = path.join(__dirname, folder);
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    
    console.log(`\x1b[36mProcessing folder: ${folder}\x1b[0m`);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (extensions.includes(ext)) {
            const inputPath = path.join(dir, file);
            const stats = fs.statSync(inputPath);
            const sizeKB = stats.size / 1024;

            // Only compress if larger than 150KB to catch more bottlenecks
            if (sizeKB > 150) {
                const tempPath = path.join(dir, `temp_${file}`);
                try {
                    let pipeline = sharp(inputPath);
                    
                    // Resize if too large (1920px is perfect for web)
                    pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });

                    if (ext === '.png') {
                        pipeline = pipeline.png({ quality: 75, compressionLevel: 9 });
                    } else {
                        pipeline = pipeline.jpeg({ quality: 75, progressive: true, mozjpeg: true });
                    }

                    await pipeline.toFile(tempPath);
                    
                    const newStats = fs.statSync(tempPath);
                    const newSizeKB = newStats.size / 1024;

                    if (newSizeKB < sizeKB) {
                        fs.unlinkSync(inputPath);
                        fs.renameSync(tempPath, inputPath);
                        console.log(`✅ Compressed ${file}: ${(sizeKB).toFixed(1)}KB -> ${(newSizeKB).toFixed(1)}KB`);
                    } else {
                        fs.unlinkSync(tempPath);
                        console.log(`⏩ Skipped ${file} (No reduction)`);
                    }
                } catch (err) {
                    console.error(`❌ Error processing ${file}:`, err.message);
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                }
            }
        }
    }
}

async function run() {
    try {
        await compressFolder('images');
        await compressFolder('results');
        console.log('\n\x1b[32m✨ All high-resolution images have been clinicaly optimized!\x1b[0m');
    } catch (err) {
        console.error('Critical Error:', err);
    }
}

run();
