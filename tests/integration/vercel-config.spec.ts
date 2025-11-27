import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function readJson(file: string) {
  const full = path.resolve(process.cwd(), file);
  const raw = fs.readFileSync(full, 'utf-8');
  return JSON.parse(raw);
}

describe('Vercel Integration Configuration', () => {
  const vercel = readJson('vercel.json');
  const pkg = readJson('package.json');

  it('has basic structure and schema reference', () => {
    expect(vercel).toBeDefined();
    expect(typeof vercel.$schema).toBe('string');
    expect(vercel.$schema).toContain('vercel.json');
  });

  it('uses Vite framework with correct build and output', () => {
    expect(vercel.framework).toBe('vite');
    expect(vercel.buildCommand).toBe('npm run build');
    expect(vercel.outputDirectory).toBe('dist');

    expect(pkg.scripts?.build).toBeDefined();
    expect(String(pkg.scripts.build)).toContain('vite');
    // index.html must exist for SPA fallback
    expect(fs.existsSync(path.resolve(process.cwd(), 'index.html'))).toBe(true);
  });

  it('has correct rewrites for SPA and API proxy', () => {
    const rewrites: Array<{ source: string; destination: string }> = vercel.rewrites || [];
    expect(Array.isArray(rewrites)).toBe(true);
    const spa = rewrites.find(r => r.source === '/(.*)' && r.destination === '/index.html');
    expect(spa).toBeDefined();

    const api = rewrites.find(r => r.source === '/api/:path*');
    expect(api).toBeDefined();
    expect(api!.destination).toMatch(/railway\.app\/api\//);
  });

  it('defines secure headers including CSP and HSTS', () => {
    const headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }> = vercel.headers || [];
    expect(Array.isArray(headers)).toBe(true);

    const global = headers.find(h => h.source === '/(.*)');
    expect(global).toBeDefined();
    const csp = global!.headers.find(h => h.key === 'Content-Security-Policy');
    expect(csp).toBeDefined();
    expect(csp!.value).toContain("default-src 'self'");
    expect(csp!.value).toContain('img-src');
    expect(csp!.value).toContain('connect-src');

    const hsts = global!.headers.find(h => h.key === 'Strict-Transport-Security');
    expect(hsts).toBeDefined();
    expect(hsts!.value).toMatch(/max-age=\d+/);

    const cachingJs = headers.find(h => h.source === '/(.*\\.js)');
    const cachingCss = headers.find(h => h.source === '/(.*\\.css)');
    expect(cachingJs).toBeDefined();
    expect(cachingCss).toBeDefined();
  });

  it('targets a valid region and has GitHub integration enabled', () => {
    expect(Array.isArray(vercel.regions)).toBe(true);
    expect(vercel.regions).toContain('iad1');

    expect(vercel.github?.enabled).toBe(true);
  });
});
