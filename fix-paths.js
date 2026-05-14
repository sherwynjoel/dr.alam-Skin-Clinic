const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    if (fileName.endsWith('.html')) {
        // 1. Fix Navigation Links
        content = content.replace(/href="index\.html"/g, 'href="/"');
        
        const pages = [
            'about', 'services', 'technology', 'results', 'blog', 'contact',
            'acne-scars', 'hair-loss', 'laser-hair-removal', 'pigmentation', 
            'dermatosurgery', 'clinical-dermatology'
        ];
        
        pages.forEach(p => {
            const regex = new RegExp(`href="(\\.\\.\\/)*${p}(\\.html)?"`, 'g');
            content = content.replace(regex, `href="/${p}"`);
        });

        // 2. Fix Asset Paths (src, href, srcset)
        content = content.replace(/(src|href|srcset)="(\.\.\/)*(images|results|styles|scripts|assets)\//g, '$1="/$3/');

        // 3. Fix background-image paths in style attributes
        content = content.replace(/url\(['"]?(\.\.\/)*(images|results|assets)\/([^'"]+)['"]?\)/g, "url('/$2/$3')");

        // 4. Normalize underscores and parentheses/spaces to hyphens in asset paths
        content = content.replace(/(src|href|srcset|style)="([^"]+)"/g, (match, attr, val) => {
            if (val.includes('/images/') || val.includes('/results/')) {
                // Fix underscores, spaces, and parentheses in filenames
                let newVal = val.replace(/_/g, '-')
                               .replace(/\s+/g, '-')
                               .replace(/[()]/g, '');
                return `${attr}="${newVal}"`;
            }
            return match;
        });

        // 5. Fix specific broken filenames found in audit
        content = content.replace(/WhatsApp-Image-2026-04-19-at-10\.51\.54-PM/g, 'WhatsApp-Image-2026-04-19-at-10-51-54-PM');
        content = content.replace(/WhatsApp-Image-2026-04-19-at-10\.51\.55-PM/g, 'WhatsApp-Image-2026-04-19-at-10-51-55-PM');
        
        // Fix the weird .jpg.png extension issue
        content = content.replace(/IMG-20260112-195923-1\.jpg\.png/g, 'IMG-20260112-195923-1-jpg.png');
        content = content.replace(/IMG-20260112-195923-1\.jpg\.webp/g, 'IMG-20260112-195923-1-jpg.webp');
    } else if (fileName === 'main.js') {
        content = content.replace(/"services\.html"/g, '"/services"');
        content = content.replace(/"acne-scars\.html"/g, '"/acne-scars"');
        content = content.replace(/"pigmentation\.html"/g, '"/pigmentation"');
        content = content.replace(/"hair-loss\.html"/g, '"/hair-loss"');
    }

    fs.writeFileSync(filePath, content);
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            if (['node_modules', 'dist', '.git', 'assets', 'images', 'results'].includes(file)) return;
            processDirectory(filePath);
        } else if (file.endsWith('.html') || file === 'main.js') {
            processFile(filePath);
        }
    });
}

processDirectory(__dirname);
console.log('Advanced path normalization complete.');
