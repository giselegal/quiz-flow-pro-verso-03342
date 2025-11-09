import { test, expect } from '@playwright/test';

// Limite de tempo (ms) aceitável até primeiro conteúdo renderizado
const SOFT_LIMIT_MS = 6000; // ajustável conforme necessidade

test.describe('Diagnóstico de performance inicial (DEV)', () => {
    test('Tempo até primeiro render abaixo do limite', async ({ page }) => {
        const t0 = Date.now();
        await page.goto('/');
        await page.waitForFunction(() => (document.getElementById('root')?.children?.length || 0) > 0, { timeout: 15000 });
        const elapsed = Date.now() - t0;
        console.log('[DEV-PERF] First render ms:', elapsed);
        expect(elapsed, `Primeiro render muito lento: ${elapsed}ms > ${SOFT_LIMIT_MS}ms`).toBeLessThan(SOFT_LIMIT_MS);
    });
});
