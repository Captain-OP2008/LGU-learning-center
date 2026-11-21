/* 本地静态服务器（仅开发/预览用）：
 *   node _serve.js
 *   → http://127.0.0.1:8811/
 *
 * 站点根是「学习中心」，另外把上一级的「CUHKSZ course」资料目录挂到
 * /CUHKSZ course/* ，方便未打包时预览「资料库」里指向项目外的原始 PDF / PPT
 * （../../../CUHKSZ course/...）。运行过 tools/pack-resources.js 后，资料库
 * 指向项目内 resources/，本脚本只作普通静态服务器用。
 * 双击 file:// 打开时不需要这个脚本，链接同样可用。
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const dataRoot = path.resolve(__dirname, '..', 'CUHKSZ course');
const DATA_PREFIX = '/CUHKSZ course/';

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.ttf': 'font/ttf', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.zip': 'application/zip', '.ipynb': 'application/x-ipynb+json',
  '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.py': 'text/plain; charset=utf-8', '.java': 'text/plain; charset=utf-8',
  '.c': 'text/plain; charset=utf-8', '.cpp': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4', '.webm': 'video/webm'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';

  let base = root;
  let rel = p;
  if (p.startsWith(DATA_PREFIX)) {
    base = dataRoot;
    rel = p.slice(DATA_PREFIX.length);
  }

  const file = path.resolve(base, '.' + path.sep + rel);
  if (!file.startsWith(base + path.sep) && file !== base) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 forbidden');
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 ' + p);
    }
    res.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}).listen(8811, '127.0.0.1', () => {
  console.log('serving on http://127.0.0.1:8811/');
  console.log('resources: http://127.0.0.1:8811' + encodeURI('/CUHKSZ course/'));
});
