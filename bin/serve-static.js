#!/usr/bin/env node

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const hostRoot = process.cwd();
const distRoot = path.resolve(
  hostRoot,
  process.argv[2] || process.env.UI_STORIES_DIST || 'dist/ui-stories'
);
const port = Number(process.env.PORT || process.env.UI_STORIES_PORT || 4173);

/** @type {Record<string, string>} */
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
  '.map': 'application/json; charset=utf-8',
};

/**
 * @param {string} rootDir
 * @param {string} pathname
 */
function safeFilePath(rootDir, pathname) {
  const rel = pathname.replace(/^\/+/, '') || 'index.html';
  const full = path.resolve(rootDir, rel);
  const relTo = path.relative(path.resolve(rootDir), full);
  if (relTo.startsWith('..') || path.isAbsolute(relTo)) return null;
  return full;
}

const server = http.createServer((req, res) => {
  if (!req.url || req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  const filePath = safeFilePath(distRoot, pathname);
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, st) => {
    if (!err && st.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const indexPath = path.join(distRoot, 'index.html');
    fs.stat(indexPath, (e2, st2) => {
      if (e2 || !st2.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    });
  });
});

server.listen(port, () => {
  console.log(`\n  \x1b[36m[ui-stories]\x1b[0m static → http://localhost:${port}`);
  console.log(`  root: ${distRoot}\n`);
});

server.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
