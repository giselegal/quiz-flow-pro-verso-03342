import { test, expect } from '@playwright/test';

test.describe('Diagnóstico de carregamento (DEV)', () => {
    test('Carrega sem erros críticos de React e sem 405 do Lovable', async ({ page }) => {
        const consoleErrors: string[] = [];
        const scriptErrors: Array<{ url: string; status: number }> = [];
        const lovableResponses: Array<{ url: string; status: number }> = [];

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

            // Monitorar chamadas do Lovable e garantir status OK (mockado em DEV)
            if (url.includes('api.lovable.dev')) {
                lovableResponses.push({ url, status });
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

        // Se houver chamadas ao Lovable, garantir que não retornam 405/4xx
        const lovable4xx = lovableResponses.filter((r) => r.status >= 400);
        expect(
            lovable4xx,
            `Lovable respostas com erro:\n${lovable4xx.map((e) => `${e.status} ${e.url}`).join('\n')}`,
        ).toHaveLength(0);

        // Teste ativo: chamada direta a /projects//collaborators deve ser neutralizada em DEV
        const resp = await page.evaluate(async () => {
            try {
                const r = await fetch('https://api.lovable.dev/projects//collaborators', { mode: 'cors' as RequestMode });
                return { ok: r.ok, status: r.status };
            } catch (e: any) {
                return { ok: false, status: -1, err: String(e?.message || e) };
            }
        });
        expect(resp.ok, `fetch /projects//collaborators falhou: ${JSON.stringify(resp)}`).toBeTruthy();
    });
});
