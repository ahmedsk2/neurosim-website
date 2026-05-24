#!/usr/bin/env node
/**
 * Minimal static file server for the MNM-Edu Next.js export.
 * Serves the `out/` directory relative to this script's parent on port 3041.
 *
 *   node scripts/serve.js          → serves on http://localhost:3041
 *   node scripts/serve.js 4000     → serves on http://localhost:4000
 *
 * No npm dependencies. Handles trailing-slash redirects and the Next.js
 * static-export pattern of foo.html / foo/index.html.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ROOT = path.join(PROJECT_ROOT, 'out');
const PORT = parseInt(process.argv[2] || process.env.PORT || '3041', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'text/xml; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

if (!fs.existsSync(ROOT)) {
  console.error('');
  console.error('  Error: out/ directory not found.');
  console.error('  Expected: ' + ROOT);
  console.error('  Run `npm run build` first to generate the static export.');
  console.error('');
  process.exit(1);
}

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^[\\/]+/, '');
  const full = path.join(root, normalized);
  if (!full.startsWith(root)) return null;
  return full;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-store', ...headers });
  res.end(body);
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 500, 'Read error');
    send(res, 200, data, { 'Content-Type': type });
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '/');
  const target = safeJoin(ROOT, parsed.pathname || '/');
  if (target === null) return send(res, 400, 'Bad path');

  fs.stat(target, (err, stat) => {
    if (err) {
      const tryHtml = target + '.html';
      fs.stat(tryHtml, (err2, stat2) => {
        if (!err2 && stat2.isFile()) return serveFile(tryHtml, res);
        return send(res, 404, 'Not found: ' + parsed.pathname);
      });
      return;
    }
    if (stat.isDirectory()) {
      const idx = path.join(target, 'index.html');
      fs.stat(idx, (e2, s2) => {
        if (!e2 && s2.isFile()) return serveFile(idx, res);
        return send(res, 404, 'No index.html in ' + parsed.pathname);
      });
      return;
    }
    serveFile(target, res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('');
    console.error('  Port ' + PORT + ' is already in use.');
    console.error('  Either close the existing server or pass a different port:');
    console.error('  node scripts/serve.js 4000');
    console.error('');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  MNM-Edu static server is running.');
  console.log('  Local:  http://localhost:' + PORT + '/');
  console.log('  Root:   ' + ROOT);
  console.log('');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});
