const http = require('http');
const https = require('https');

const API_HOST = 'localhost';
const API_PORT = 5000;
const AUTH_HOST = 'localhost';
const AUTH_PORT = 6001;
const POLLINATIONS_BASE = 'https://image.pollinations.ai';

let jwtToken = '';

function request(options, body) {
  return new Promise((resolve, reject) => {
    const client = options.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    if (body) req.write(body);
    req.end();
  });
}

function getBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 120000 }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function getJson(path) {
  const res = await request({
    hostname: API_HOST,
    port: API_PORT,
    path: path,
    method: 'GET',
    timeout: 30000,
  });
  return JSON.parse(res.data);
}

async function login() {
  console.log('Logging in as admin...');
  const body = JSON.stringify({ email: 'admin@shop.com', password: 'Test1234!' });
  const res = await request({
    hostname: AUTH_HOST,
    port: AUTH_PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    timeout: 30000,
  }, body);

  if (res.status !== 200) {
    throw new Error(`Login failed: HTTP ${res.status} - ${res.data}`);
  }
  const json = JSON.parse(res.data);
  jwtToken = json.data?.accessToken || json.data?.token || json.token || json.data?.data?.accessToken;
  if (!jwtToken) {
    console.log('Response:', JSON.stringify(json, null, 2));
    throw new Error('Could not extract JWT token');
  }
  console.log('Logged in successfully');
}

async function uploadImage(productId, imageBuffer) {
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const preamble = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="product.jpg"\r\n` +
    `Content-Type: image/jpeg\r\n\r\n`,
    'utf-8'
  );
  const epilogue = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
  const body = Buffer.concat([preamble, imageBuffer, epilogue]);

  const res = await request({
    hostname: API_HOST,
    port: API_PORT,
    path: `/api/products/${productId}/image`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': body.length,
    },
    timeout: 60000,
  }, body);

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Upload failed: HTTP ${res.status} - ${res.data}`);
  }
}

function buildPrompt(product) {
  const parts = [];
  if (product.color) parts.push(product.color);
  if (product.material) parts.push(product.material);
  parts.push(product.name);
  if (product.categoryName) parts.push(product.categoryName);
  if (product.brand) parts.push(`by ${product.brand}`);

  const base = parts.join(' ');
  const en = base
    .replace(/Camiseta/gi, 't-shirt')
    .replace(/Jeans/gi, 'jeans')
    .replace(/Pantalón/gi, 'pants')
    .replace(/Vestido/gi, 'dress')
    .replace(/Chaqueta/gi, 'jacket')
    .replace(/Sudadera/gi, 'sweatshirt')
    .replace(/Zapatillas/gi, 'sneakers')
    .replace(/Gorra/gi, 'cap')
    .replace(/Leggings/gi, 'leggings')
    .replace(/Cuero/gi, 'leather')
    .replace(/Algodón/gi, 'cotton')
    .replace(/Mezclilla/gi, 'denim')
    .replace(/Poliéster/gi, 'polyester')
    .replace(/Seda/gi, 'silk')
    .replace(/Spandex/gi, 'spandex')
    .replace(/Textil/gi, 'textile')
    .replace(/Blanco/gi, 'white')
    .replace(/Negro/gi, 'black')
    .replace(/Azul/gi, 'blue')
    .replace(/Rojo/gi, 'red')
    .replace(/Rosa/gi, 'pink')
    .replace(/Beige/gi, 'beige')
    .replace(/Gris/gi, 'grey')
    .replace(/Infantil/gi, 'kids');

  return `${en}, fashion product photography, clean white background, professional e-commerce photo, centered, high quality`;
}

async function main() {
  await login();

  console.log('Fetching products...');
  const res = await getJson('/api/products?pageSize=100');
  const products = res.data?.items || [];
  console.log(`Found ${products.length} products`);

  for (const p of products) {
    if (p.hasImage) {
      console.log(`  [SKIP] ${p.name} already has image`);
      continue;
    }

    const prompt = buildPrompt(p);
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `${POLLINATIONS_BASE}/prompt/${encodedPrompt}?width=600&height=750&seed=${Math.floor(Math.random() * 100000)}&nologo=true&private=true`;

    console.log(`  [DOWNLOAD] ${p.name} ...`);
    console.log(`     Prompt: ${prompt}`);

    try {
      const imageBuffer = await getBuffer(imageUrl);
      console.log(`     Image size: ${imageBuffer.length} bytes`);

      console.log(`  [UPLOAD] ${p.name} ...`);
      await uploadImage(p.id, imageBuffer);
      console.log(`  [OK] ${p.name} image uploaded`);
    } catch (err) {
      console.error(`  [FAIL] ${p.name}: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('Done!');
}

main().catch(console.error);
