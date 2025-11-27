import { test, expect } from '@playwright/test';

const PROD_URL = process.env.PROD_URL?.replace(/\/$/, '');

// Util: checa presença de header (case-insensitive)
function getHeader(headers: Record<string, string>, name: string) {
  const key = Object.keys(headers).find(k => k.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : undefined;
}

test.describe('Vercel Deploy (Produção)', () => {
  test.beforeEach(async ({}, testInfo) => {
    if (!PROD_URL) {
      test.skip(true, 'PROD_URL não definido. Configure env/secret para executar este teste.');
    }
  });

  test('Raiz responde 200 e HTML válido', async ({ request }) => {
    const res = await request.get(`${PROD_URL}/`);
    expect(res.status()).toBe(200);
    const ctype = res.headers()['content-type'] || '';
    expect(ctype).toContain('text/html');
    const body = await res.text();
    expect(body.toLowerCase()).toContain('<!doctype html');
    expect(body.toLowerCase()).toContain('<html');
  });

  test('Headers de segurança presentes (CSP e HSTS)', async ({ request }) => {
    const res = await request.get(`${PROD_URL}/`);
    const headers = res.headers();
    const csp = getHeader(headers as any, 'Content-Security-Policy');
    const hsts = getHeader(headers as any, 'Strict-Transport-Security');
    expect(csp, 'CSP ausente em produção').toBeDefined();
    expect(String(csp)).toContain("default-src 'self'");
    expect(hsts, 'HSTS ausente em produção').toBeDefined();
    expect(String(hsts)).toMatch(/max-age=\d+/);
  });

  test('SPA fallback funciona (rota interna retorna HTML)', async ({ request }) => {
    const res = await request.get(`${PROD_URL}/editor`);
    expect(res.status()).toBe(200);
    const ctype = res.headers()['content-type'] || '';
    expect(ctype).toContain('text/html');
    const body = await res.text();
    expect(body.toLowerCase()).toContain('<html');
  });

  test('Assets JS/CSS servidos com cache imutável', async ({ page, request }) => {
    // Carrega a página e coleta srcs de scripts e links CSS
    await page.goto(`${PROD_URL}/`, { waitUntil: 'domcontentloaded' });

    const jsSrcs = await page.$$eval('script[src$=".js"]', els => els.map(e => (e as HTMLScriptElement).src));
    const cssHrefs = await page.$$eval('link[rel="stylesheet"][href$=".css"]', els => els.map(e => (e as HTMLLinkElement).href));

    const anyAsset = [...jsSrcs, ...cssHrefs][0];
    if (!anyAsset) {
      test.skip(true, 'Nenhum asset JS/CSS encontrado na página');
    }

    const res = await request.get(anyAsset);
    expect([200, 304]).toContain(res.status());
    const cache = res.headers()['cache-control'] || '';
    expect(cache.toLowerCase()).toContain('immutable');
    expect(cache.toLowerCase()).toContain('max-age');
  });
});
