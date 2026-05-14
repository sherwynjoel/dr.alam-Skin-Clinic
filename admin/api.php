<?php
// Production API for saving blogs (PHP version)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data_file = '../data/blogs.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'];
    $blog = $input['blog'];

    $blogs = json_decode(file_get_contents($data_file), true) ?: [];

    if ($action === 'save') {
        if (!empty($blog['id'])) {
            $found = false;
            foreach ($blogs as &$b) {
                if ($b['id'] == $blog['id']) {
                    $b = $blog;
                    $found = true;
                    break;
                }
            }
            if (!$found) $blogs[] = $blog;
        } else {
            $blog['id'] = strval(time());
            $blog['date'] = date('Y-m-d');
            $blogs[] = $blog;
        }
    } else if ($action === 'delete') {
        $blogs = array_filter($blogs, function($b) use ($blog) {
            return $b['id'] != $blog['id'];
        });
        $blogs = array_values($blogs);
    }

    file_put_contents($data_file, json_encode($blogs, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo file_get_contents($data_file);
    exit;
}
?>
