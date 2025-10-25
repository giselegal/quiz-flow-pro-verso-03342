// scripts/smoke-step1-persist.mjs
// Digita um nome na etapa 1 e valida persistência no localStorage e no UnifiedQuizStorage

import { chromium } from 'playwright';

const url = process.env.SMOKE_URL || 'http://localhost:5173/quiz';
const NAME = process.env.SMOKE_NAME || `Teste_${Date.now()}`;
const INPUT_SELECTORS = [
    '#intro-form-input',
    '#intro-name-input',
    'input[name="userName"]',
    'input[name="name"]',
    '[data-testid="intro-name-input"]',
    '#step-1-fallback-input'
];
const CTA_SELECTORS = [
    '#intro-cta-button',
    '[data-testid="intro-cta-button"]',
    'button[type="submit"]',
    'button:has-text("Começar")',
    'button:has-text("Próxima")'
];

const log = (...args) => console.log('[SMOKE-STEP1-PERSIST]', ...args);

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(25000);
    try {
        log('Abrindo', url);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000);

        // Garantir que estamos na etapa 1
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', { detail: { stepId: 1, source: 'smoke-step1-persist' } }));
        });
        await page.waitForTimeout(500);

        // Encontrar input
        let inputSel = null;
        for (const sel of INPUT_SELECTORS) {
            try {
                await page.waitForSelector(sel, { timeout: 2000, state: 'visible' });
                inputSel = sel; break;
            } catch { }
        }
        if (!inputSel) throw new Error('Input de nome não encontrado');

        // Digitar nome e blur
        await page.fill(inputSel, NAME);
        await page.keyboard.press('Tab');
        await page.waitForTimeout(400);

        // Clicar CTA se existir (para acionar handlers que dependem de submit)
        for (const cta of CTA_SELECTORS) {
            const has = await page.$(cta);
            if (has) {
                await page.click(cta).catch(() => { });
                break;
            }
        }

        // Ler localStorage e unified
        const persisted = await page.evaluate(() => {
            const rawUnified = localStorage.getItem('unifiedQuizData');
            let unified = null;
            try { unified = rawUnified ? JSON.parse(rawUnified) : null; } catch { }
            return {
                local_userName: localStorage.getItem('userName') || null,
                local_quizUserName: localStorage.getItem('quizUserName') || null,
                unified_userName: unified?.formData?.userName || unified?.formData?.name || null,
                unified_currentStep: unified?.metadata?.currentStep || null,
            };
        });

        const ok = Boolean(
            (persisted.local_userName && persisted.local_userName.includes('Teste_')) ||
            (persisted.local_quizUserName && persisted.local_quizUserName.includes('Teste_')) ||
            (persisted.unified_userName && persisted.unified_userName.includes('Teste_'))
        );

        const result = { ok, inputSel, name: NAME, persisted };
        log('Resultado:', result);
        console.log(JSON.stringify(result));
    } catch (err) {
        console.error('[SMOKE-STEP1-PERSIST] Erro:', err);
        process.exitCode = 1;
    } finally {
        await page.close();
        await browser.close();
    }
})();
