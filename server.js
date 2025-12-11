const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DB_PATH = path.join(DATA_DIR, 'registrations.json');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]', 'utf-8');
};

const serveStatic = (req, res) => {
  const safePath = req.url.split('?')[0].replace(/\/+$/, '') || '/';
  const filePath =
    safePath === '/'
      ? path.join(ROOT, 'index.html')
      : path.join(ROOT, safePath.replace(/^\//, ''));

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  });
};

const handleRegister = (req, res, body) => {
  try {
    const data = JSON.parse(body || '{}');
    const { firstName = '', lastName = '', email = '' } = data;
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Missing fields' }));
      return;
    }
    ensureDataFile();
    const current = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    current.push({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString(),
    });
    fs.writeFileSync(DB_PATH, JSON.stringify(current, null, 2), 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Server error' }));
  }
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url.startsWith('/api/register')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) req.destroy(); // simple protection
    });
    req.on('end', () => handleRegister(req, res, body));
    return;
  }

  serveStatic(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Depth site running at http://localhost:${PORT}`);
});
