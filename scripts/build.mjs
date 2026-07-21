import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = resolve('public', 'index.html');
const html = await readFile(source, 'utf8');
const worker = `const routeDemoHtml = ${JSON.stringify(html)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== '/' && url.pathname !== '/index.html') {
      return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    }
    return new Response(routeDemoHtml, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300'
      }
    });
  }
};
`;

await mkdir(resolve('dist', 'server'), { recursive: true });
await writeFile(resolve('dist', 'server', 'index.js'), worker, 'utf8');
