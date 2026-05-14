<?php
// --- CONFIGURATION ---
$DATA_FILE = '../data/blogs.json';

// Ensure data file exists
if (!file_exists($DATA_FILE)) {
    if (!is_dir('../data')) { mkdir('../data', 0755, true); }
    file_put_contents($DATA_FILE, json_encode([]));
}

$blogs = json_decode(file_get_contents($DATA_FILE), true) ?: [];

// --- BLOG LOGIC ---
// Add/Edit Blog
if (isset($_POST['save_blog'])) {
    $new_blog = [
        'id' => $_POST['id'] ?: uniqid(),
        'category' => $_POST['category'],
        'title' => $_POST['title'],
        'url' => $_POST['url'],
        'date' => date('Y-m-d')
    ];

    if ($_POST['id']) {
        // Edit
        foreach ($blogs as &$b) {
            if ($b['id'] === $_POST['id']) {
                $b = $new_blog;
                break;
            }
        }
    } else {
        // Add
        $blogs[] = $new_blog;
    }

    file_put_contents($DATA_FILE, json_encode($blogs, JSON_PRETTY_PRINT));
    header("Location: index.php?success=1");
    exit;
}

// Delete Blog
if (isset($_GET['delete'])) {
    $blogs = array_filter($blogs, function($b) {
        return $b['id'] !== $_GET['delete'];
    });
    file_put_contents($DATA_FILE, json_encode(array_values($blogs), JSON_PRETTY_PRINT));
    header("Location: index.php?deleted=1");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Dr. Alam's Skin Clinic</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #061d30;
            --accent: #b8973e;
            --bg: #f4f7f6;
        }
        body { font-family: 'Inter', sans-serif; background: var(--bg); margin: 0; padding: 20px; color: var(--primary); }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        h1 { margin-top: 0; border-bottom: 2px solid var(--accent); padding-bottom: 10px; font-size: 1.5rem; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem; }
        input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-danger { background: #e74c3c; color: white; text-decoration: none; font-size: 13px; padding: 5px 10px; border-radius: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
        th { background: #fafafa; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
        .success { color: #27ae60; background: #eafaf1; padding: 10px; border-radius: 6px; margin-bottom: 20px; font-size: 0.9rem; }
        .header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    </style>
</head>
<body>

<div class="container">
    <div class="header-flex">
        <div style="display: flex; align-items: center; gap: 15px;">
            <img src="../images/logo.png" alt="Logo" style="width: 40px;">
            <h1>Blog Management Hub</h1>
        </div>
        <a href="../blog" target="_blank" style="color: var(--accent); text-decoration: none; font-size: 0.9rem; font-weight: 600;">View Live Blog →</a>
    </div>

    <?php if (isset($_GET['success'])): ?><div class="success">✓ Blog saved successfully!</div><?php endif; ?>
    <?php if (isset($_GET['deleted'])): ?><div class="success">✓ Blog deleted.</div><?php endif; ?>

    <div style="background: #fafafa; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
        <h3 style="margin-top: 0; font-size: 1.1rem;">Add or Edit Blog</h3>
        <form method="POST">
            <input type="hidden" name="id" id="blog-id">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Category</label>
                    <select name="category" id="blog-category" required>
                        <option value="Acne & Scars">Acne & Scars</option>
                        <option value="Pigmentation & Melasma">Pigmentation & Melasma</option>
                        <option value="Hair Fall & Thinning">Hair Fall & Thinning</option>
                        <option value="Laser & Skin Procedures">Laser & Skin Procedures</option>
                        <option value="Medical Skin Diseases">Medical Skin Diseases</option>
                        <option value="Skincare & Skin Health">Skincare & Skin Health</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Blog Title</label>
                    <input type="text" name="title" id="blog-title" placeholder="e.g., How to treat acne" required>
                </div>
            </div>
            <div class="form-group">
                <label>Link / URL</label>
                <input type="text" name="url" id="blog-url" placeholder="e.g., /acne-treatment-guide or # " required>
            </div>
            <button type="submit" name="save_blog" class="btn btn-primary">Save Blog Link</button>
            <button type="button" onclick="resetForm()" class="btn" style="background: #ddd; color: #333;">Clear</button>
        </form>
    </div>

    <table>
        <thead>
            <tr>
                <th>Category</th>
                <th>Title</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($blogs)): ?>
                <tr><td colspan="3" style="text-align: center; color: #999; padding: 40px;">No blogs added yet.</td></tr>
            <?php endif; ?>
            <?php foreach ($blogs as $b): ?>
            <tr>
                <td><span style="background: #eee; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem;"><?php echo htmlspecialchars($b['category']); ?></span></td>
                <td><strong><?php echo htmlspecialchars($b['title']); ?></strong><br><small style="color: #999;"><?php echo htmlspecialchars($b['url']); ?></small></td>
                <td>
                    <button onclick='editBlog(<?php echo json_encode($b); ?>)' class="btn" style="font-size: 13px; padding: 5px 10px; background: #061d30; color: white;">Edit</button>
                    <a href="?delete=<?php echo $b['id']; ?>" class="btn btn-danger" onclick="return confirm('Delete this blog?')">Delete</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<script>
    function editBlog(blog) {
        document.getElementById('blog-id').value = blog.id;
        document.getElementById('blog-category').value = blog.category;
        document.getElementById('blog-title').value = blog.title;
        document.getElementById('blog-url').value = blog.url;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function resetForm() {
        document.getElementById('blog-id').value = '';
        document.getElementById('blog-category').value = 'Acne & Scars';
        document.getElementById('blog-title').value = '';
        document.getElementById('blog-url').value = '';
    }
</script>

</body>
</html>
