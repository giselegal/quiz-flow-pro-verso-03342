// scripts/smoke-step20.mjs
// Smoke test: abre /editor, navega para a etapa 20 e verifica se o resultado aparece/calcula

import { chromium } from 'playwright';

const url = process.env.SMOKE_URL || 'http://localhost:5173/editor';

const log = (...args) => console.log('[SMOKE]', ...args);

const run = async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);

    try {
        log('Abrindo', url);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1200);

        // Dispara navegação para etapa 20
        log('Navegando para a etapa 20 via evento');
        await page.evaluate(() => {
            try {
                const ev = new CustomEvent('quiz-navigate-to-step', { detail: { stepId: 20, source: 'smoke' } });
                window.dispatchEvent(ev);
            } catch (e) {
                console.warn('Falha ao disparar evento de navegação:', e);
            }
        });

        // Aguarda um dos seletores típicos
        const possibleSelectors = [
            'text=Seu Estilo',
            'text=Seu estilo é',
            'text=Resultado',
            'text=Calculando seu resultado',
            'text=Modo Fallback Ativo',
        ];

        let found = false;
        for (const sel of possibleSelectors) {
            try { await page.waitForSelector(sel, { timeout: 6000 }); found = true; break; } catch { }
        }

        const rawResult = await page.evaluate(() => {
            try {
                return localStorage.getItem('quizResult') || sessionStorage.getItem('quizResult') || null;
            } catch { return null; }
        });

        let parsed = null;
        try { parsed = rawResult ? JSON.parse(rawResult) : null; } catch { }

        if (parsed?.primaryStyle) {
            log('Resultado detectado:', parsed.primaryStyle.style || parsed.primaryStyle.category);
        } else {
            log('Resultado não encontrado no storage');
        }

        console.log(JSON.stringify({ ok: found || Boolean(parsed), hasVisualCue: found, hasStorageResult: Boolean(parsed) }));
    } catch (err) {
        console.error('[SMOKE] Erro:', err);
        process.exitCode = 1;
    } finally {
        await page.close();
        await browser.close();
    }
};

run();
