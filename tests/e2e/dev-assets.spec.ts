import { test, expect } from '@playwright/test';

test.describe('Diagnóstico de assets (DEV)', () => {
    test('Sem falhas 4xx/5xx em chunks JS/CSS e registro de anomalias', async ({ page }) => {
        const failures: Array<{ url: string; status: number }> = [];
        const cssFailures: Array<{ url: string; status: number }> = [];
        const blockedLovable: Array<{ url: string; status: number }> = [];
        const start = Date.now();

        page.on('response', (resp) => {
            const url = resp.url();
            const status = resp.status();
            const isJs = /\.js(\?|$)/.test(url) || (resp.headers()['content-type'] || '').includes('javascript');
            const isCss = /\.css(\?|$)/.test(url) || (resp.headers()['content-type'] || '').includes('text/css');
            if (isJs && status >= 400) failures.push({ url, status });
            if (isCss && status >= 400) cssFailures.push({ url, status });
            if (url.includes('api.lovable.dev') && status >= 400) blockedLovable.push({ url, status });
        });

        await page.goto('/');
        await page.waitForFunction(() => (document.getElementById('root')?.children?.length || 0) > 0, { timeout: 15000 });
        const loadMs = Date.now() - start;

        // Guardar diagnóstico de tempo em console para referência futura
        console.log('[DEV-ASSETS] Tempo até render inicial (ms):', loadMs);

        expect(failures, `Falhas JS:\n${failures.map(f => `${f.status} ${f.url}`).join('\n')}`).toHaveLength(0);
        expect(cssFailures, `Falhas CSS:\n${cssFailures.map(f => `${f.status} ${f.url}`).join('\n')}`).toHaveLength(0);
        // Lovable deve ser neutralizado em DEV; status 200 ou não chamado
        expect(blockedLovable, `Lovable retornou status de erro:\n${blockedLovable.map(f => `${f.status} ${f.url}`).join('\n')}`).toHaveLength(0);
    });
});
