// server.js
// Node.js version ng server.php — walang dependency, plain Node lang.
// Ginawa para sa pag-host sa Render (walang database, static files lang ang ise-serve).

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT_DIR = __dirname;

// Kailangan ito ni Render — binibigay nila ang PORT sa pamamagitan ng environment variable.
// Kapag tumatakbo lang locally (sa sarili mong computer), gagamit ng 3000.
const PORT = process.env.PORT || 3000;

// Content-Type per file extension (kaparehas ng switch sa server.php)
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Kunin ang hiningi na URL path (hal. "/coc-file/coc1-file/coc1.html")
  const parsedUrl = url.parse(req.url);
  let filePath = decodeURIComponent(parsedUrl.pathname);

  // Kung root lang ang hiningi (localhost:3000/), default sa index.html (login page)
  if (filePath === '' || filePath === '/') {
    filePath = '/dashboard.html';
  }

  // I-resolve ang buong path, at siguraduhing hindi makakalabas sa project folder
  // (basic protection laban sa "../../" path traversal)
  const safePath = path.normalize(path.join(ROOT_DIR, filePath));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(safePath).toLowerCase();
      const contentType = CONTENT_TYPES[ext] || 'text/plain';

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(safePath).pipe(res);
    } else {
      // Kapag hindi nahanap ang file (404 page)
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>404 Not Found</h1><p>Ang hininging file na <b>${filePath}</b> ay hindi mahanap.</p>`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
