<?php
// server.php

// Kunin ang hininging URL path ng user
$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Tanggalin ang leading slash para makuha ang filename
$filePath = ltrim($request, '/');

// Kung walang nilagay na file (e.g. localhost:8000/), default sa index.html
if ($filePath === '' || $filePath === '/') {
    $filePath = 'dashboard.html';
}

// Suriin kung umiiral ang hinihinging HTML/static file
if (file_exists($filePath) && !is_dir($filePath)) {
    
    // Alamin ang file extension para sa tamang Header Content-Type
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    
    switch ($ext) {
        case 'html':
        case 'htm':
            header('Content-Type: text/html; charset=utf-8');
            break;
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'png':
            header('Content-Type: image/png');
            break;
        case 'jpg':
        case 'jpeg':
            header('Content-Type: image/jpeg');
            break;
        default:
            header('Content-Type: text/plain');
    }

    // Basahin at i-output ang laman ng file
    readfile($filePath);
    exit;
} else {
    // Kapag hindi nahanap ang HTML file (404 Page)
    http_response_code(404);
    echo "<h1>404 Not Found</h1><p>Ang hininging file na <b>" . htmlspecialchars($filePath) . "</b> ay hindi mahanap.</p>";
}
?>