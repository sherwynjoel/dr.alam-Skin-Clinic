const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'results');

const imagesToCompress = [
    '49.jpg',
    '51.jpg',
    '15 (1).jpg',
    '16 (2).jpg',
    '14 (4).jpg'
];

async function compress() {
    console.log('--- Image Compression Start ---');
    for (const imageName of imagesToCompress) {
        const inputPath = path.join(targetDir, imageName);
        const outputPath = path.join(targetDir, 'temp_' + imageName);

        if (!fs.existsSync(inputPath)) {
            console.log(`Skipping: ${imageName} (File not found)`);
            continue;
        }

        const stats = fs.statSync(inputPath);
        const sizeInMb = stats.size / (1024 * 1024);
        
        if (sizeInMb < 0.5) {
            console.log(`Skipping: ${imageName} (Already small: ${sizeInMb.toFixed(2)} MB)`);
            continue;
        }

        console.log(`Compressing: ${imageName} (${sizeInMb.toFixed(2)} MB)...`);
        try {
            await sharp(inputPath)
                .jpeg({ quality: 80, progressive: true })
                .resize(1600, null, { withoutEnlargement: true })
                .toFile(outputPath);
            
            // Replace original
            fs.unlinkSync(inputPath);
            fs.renameSync(outputPath, inputPath);
            
            const newStats = fs.statSync(inputPath);
            console.log(`Success: ${imageName} -> ${(newStats.size / 1024).toFixed(2)} KB`);
        } catch (err) {
            console.error(`Error processing ${imageName}:`, err.message);
        }
    }
    console.log('--- Image Compression Finished ---');
}

compress();
