const fs = require('fs');
const path = require('path');

const directories = ['images', 'results'];

directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) return;

    fs.readdirSync(dirPath).forEach(file => {
        let newName = file;
        
        // Pattern 1: "File (1).ext" -> "File-1.ext"
        newName = newName.replace(/\s*\((\d+)\)/g, '-$1');
        
        // Pattern 2: Replace spaces and special characters with hyphens (except extension dot)
        const ext = path.extname(file);
        const nameWithoutExt = path.basename(file, ext);
        
        let processedName = nameWithoutExt.replace(/[^a-zA-Z0-9]+/g, '-');
        
        // Pattern 3: Clean up multiple hyphens and hyphens at start/end
        processedName = processedName.replace(/-+/g, '-').replace(/^-|-$/g, '');
        
        newName = processedName + ext.toLowerCase();

        const oldPath = path.join(dirPath, file);
        const newPath = path.join(dirPath, newName);

        if (oldPath !== newPath) {
            if (fs.existsSync(newPath)) {
                console.log(`Skipping: "${file}" -> "${newName}" (Target already exists)`);
            } else {
                console.log(`Renaming: "${file}" -> "${newName}"`);
                fs.renameSync(oldPath, newPath);
            }
        }
    });
});

console.log('Renaming complete. Please rebuild the project with: npm run build');
