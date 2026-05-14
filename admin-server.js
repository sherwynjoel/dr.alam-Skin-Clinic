const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'blogs.json');
const PORT = 8000;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/api/blogs' && req.method === 'GET') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: "Could not read data" }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } 
    else if (req.url === '/api/blogs' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { action, blog } = JSON.parse(body);
                let blogs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');

                if (action === 'save') {
                    if (blog.id) {
                        const index = blogs.findIndex(b => b.id === blog.id);
                        if (index !== -1) blogs[index] = blog;
                        else blogs.push(blog);
                    } else {
                        blog.id = Date.now().toString();
                        blog.date = new Date().toISOString().split('T')[0];
                        blogs.push(blog);
                    }
                } else if (action === 'delete') {
                    blogs = blogs.filter(b => b.id !== blog.id);
                }

                fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: "Invalid request" }));
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `Admin API running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:5174/admin/index.html to manage blogs`);
});
