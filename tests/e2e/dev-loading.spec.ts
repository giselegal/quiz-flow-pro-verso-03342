import { test, expect } from '@playwright/test';

test.describe('Diagnóstico de carregamento (DEV)', () => {
    test('Carrega sem erros críticos de React', async ({ page }) => {
        const consoleErrors: string[] = [];
        const scriptErrors: Array<{ url: string; status: number }> = [];

        page.on('console', (msg) => {
            const text = msg.text();
            if (msg.type() === 'error' || /TypeError|ReferenceError/.test(text)) {
                consoleErrors.push(text);
            }
        });

        page.on('response', async (resp) => {
            const url = resp.url();
            const status = resp.status();
            const ct = resp.headers()['content-type'] || '';

            // Registrar erros de scripts (JS) 4xx/5xx
            if ((/\.js(\?|$)/.test(url) || ct.includes('javascript')) && status >= 400) {
                scriptErrors.push({ url, status });
            }
        });

        await page.goto('/');

        // root presente
        await expect(page.locator('#root')).toBeVisible();
        await page.waitForFunction(() => (document.getElementById('root')?.children?.length || 0) > 0, {
            timeout: 15000,
        });

        // React Context API disponível (stub ou real)
        const hasCreateContext = await page.evaluate(() => {
            const w = window as any;
            return (
                (w.React && typeof w.React.createContext === 'function') ||
                typeof (w as any).createContext === 'function'
            );
        });
        expect(hasCreateContext).toBeTruthy();

        // Não pode ter erro de createContext undefined
        const ctxErrors = consoleErrors.filter((t) => /createContext/.test(t));
        expect(ctxErrors, `Erros de createContext detectados:\n${ctxErrors.join('\n')}`).toHaveLength(0);

        // Não pode ter 4xx/5xx para assets JS
        expect(
            scriptErrors,
            `Falhas ao carregar scripts:\n${scriptErrors.map((e) => `${e.status} ${e.url}`).join('\n')}`,
        ).toHaveLength(0);
    });
});
