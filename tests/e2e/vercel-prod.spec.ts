import { test, expect } from '@playwright/test';

const PROD_URL = process.env.PROD_URL?.replace(/\/$/, '');
const BYPASS_TOKEN = process.env.VERCEL_BYPASS_TOKEN || process.env.VERCEL_PROTECTION_BYPASS;

// Util: checa presença de header (case-insensitive)
function getHeader(headers: Record<string, string>, name: string) {
  const key = Object.keys(headers).find(k => k.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : undefined;
}

test.describe('Vercel Deploy (Produção)', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    if (!PROD_URL) {
      test.skip(true, 'PROD_URL não definido. Configure env/secret para executar este teste.');
    }
    if (BYPASS_TOKEN) {
      // Aplicar header de bypass para páginas protegidas de preview
      await page.setExtraHTTPHeaders({ 'x-vercel-protection-bypass': BYPASS_TOKEN });
      // Aplicar cookie de bypass (algumas proteções exigem cookie em vez do header)
      try {
        const host = new URL(PROD_URL!).hostname;
        await page.context().addCookies([
          {
            name: 'vercel-protection-bypass',
            value: BYPASS_TOKEN,
            domain: host,
            path: '/',
            secure: true,
            httpOnly: false,
            sameSite: 'Lax',
          },
        ]);
      } catch {}
    }
  });

  test('Raiz responde 200 e HTML válido', async ({ request }) => {
    const res = await request.get(`${PROD_URL}/`, {
      headers: BYPASS_TOKEN ? { 'x-vercel-protection-bypass': BYPASS_TOKEN } : undefined,
    });
    expect(res.status()).toBe(200);
    const ctype = res.headers()['content-type'] || '';
    expect(ctype).toContain('text/html');
    const body = await res.text();
    expect(body.toLowerCase()).toContain('<!doctype html');
    expect(body.toLowerCase()).toContain('<html');
  });

  test('Headers de segurança presentes (CSP e HSTS)', async ({ request }) => {
    const res = await request.get(`${PROD_URL}/`, {
      headers: BYPASS_TOKEN ? { 'x-vercel-protection-bypass': BYPASS_TOKEN } : undefined,
    });
    const headers = res.headers();
    const csp = getHeader(headers as any, 'Content-Security-Policy');
    const hsts = getHeader(headers as any, 'Strict-Transport-Security');
    expect(csp, 'CSP ausente em produção').toBeDefined();
    expect(String(csp)).toContain("default-src 'self'");
    expect(hsts, 'HSTS ausente em produção').toBeDefined();
    expect(String(hsts)).toMatch(/max-age=\d+/);
  });

  test('SPA fallback funciona (rota interna retorna HTML)', async ({ request }) => {
    const res = await request.get(`${PROD_URL}/editor`, {
      headers: BYPASS_TOKEN ? { 'x-vercel-protection-bypass': BYPASS_TOKEN } : undefined,
    });
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
      const status = res.status();
      const headers = res.headers();
      const cache = (headers['cache-control'] || '').toLowerCase();
      // Debug em caso de falha
      if (![200, 304].includes(status)) {
        console.warn('Asset status inválido', { anyAsset, status, headers });
      }
      expect([200, 304]).toContain(status);
      // Aceitar immutable + max-age alto (>= 31536000)
      expect(cache).toContain('immutable');
      expect(cache).toContain('max-age');
      const maxAgeMatch = cache.match(/max-age=(\d+)/);
      expect(maxAgeMatch, `Cache-Control deve conter max-age numérico. cache=${cache}`).toBeTruthy();
      const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 0;
      expect(maxAge).toBeGreaterThanOrEqual(31536000);
  });
});
