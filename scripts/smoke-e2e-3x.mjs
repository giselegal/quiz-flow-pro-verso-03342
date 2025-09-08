// scripts/smoke-e2e-3x.mjs
// Fluxo E2E: preenche nome, seleciona 3 opções nas etapas 2–11, valida resultado na 20
import { chromium } from 'playwright';

const BASE = process.env.SMOKE_URL || 'http://localhost:5173';
const url = `${BASE}/quiz`;
const NAME = process.env.SMOKE_NAME || `Teste_${Date.now()}`;

const INPUT_SELECTORS = [
    '#intro-form-input', '#intro-name-input', 'input[name="userName"]', 'input[name="name"]'
];

const OPTION_CARD_SELECTOR = '.quiz-content [data-block-type="options-grid"] .option-card, .quiz-content [data-block-type="options-grid"] [role="button"]';
const OPTION_SELECTORS = [
    // Editor/options-grid impl
    '.quiz-content [data-block-type="options-grid"] [role="button"]',
    '.quiz-content [data-block-type="options-grid"] .option-card',
    '.quiz-options-grid-block [role="button"]',
    '.quiz-options-grid-block .option-card',
    // QuizQuestion impl
    '[data-testid="quiz-question"] [data-testid^="option-"]',
    '.quiz-content [data-testid^="option-"]',
    '[data-testid^="option-"]',
    // Novo: OptionsGridBlock agora expõe data-testid por opção
    '[data-testid^="grid-option-"]',
    '.quiz-content [data-testid^="grid-option-"]',
];

const log = (...args) => console.log('[SMOKE-E2E-3X]', ...args);

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    try {
        log('Abrindo', url);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(800);

        // Ir para etapa 1 e preencher nome
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', { detail: { stepId: 1, source: 'smoke-e2e-3x' } }));
        });
        await page.waitForTimeout(400);

        let inputSel = null;
        for (const sel of INPUT_SELECTORS) {
            try { await page.waitForSelector(sel, { timeout: 2000, state: 'visible' }); inputSel = sel; break; } catch { }
        }
        if (!inputSel) throw new Error('Input de nome não encontrado');
        await page.fill(inputSel, NAME);
        await page.keyboard.press('Tab');

        // Avançar para etapa 2
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', { detail: { stepId: 2, source: 'smoke-e2e-3x' } }));
        });
        await page.waitForTimeout(500);

        // Selecionar 3 opções por etapa de 2 a 11
        for (let step = 2; step <= 11; step++) {
            log('Etapa', step, '- selecionando 3 opções');
            // garantir que estamos na etapa correta
            await page.evaluate((s) => {
                window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', { detail: { stepId: s, source: 'smoke-e2e-3x' } }));
            }, step);
            await page.waitForTimeout(600);

            // aguardar container do grid aparecer
            let gridReady = false;
            for (let attempt = 0; attempt < 3 && !gridReady; attempt++) {
                try {
                    await page.waitForSelector('[data-block-type="options-grid"]', { timeout: 1500, state: 'attached' });
                    gridReady = true;
                } catch {
                    // tentar recarregar template
                    await page.evaluate((s) => {
                        try { window.dispatchEvent(new CustomEvent('quiz-template-updated', { detail: { stepId: `step-${s}` } })); } catch { }
                    }, step);
                    await page.waitForTimeout(300);
                }
            }

            // localizar opções com múltiplos seletores
            let loc = null;
            let count = 0;
            for (const sel of OPTION_SELECTORS) {
                const candidate = page.locator(sel);
                const c = await candidate.count();
                if (c > 0) { loc = candidate; count = c; break; }
            }

            if (!loc || count === 0) {
                // tentar limpar template publicado vazio e recarregar
                await page.evaluate((s) => {
                    try { localStorage.removeItem(`quiz_published_blocks_step-${s}`); } catch { }
                    try { window.dispatchEvent(new CustomEvent('quiz-template-updated', { detail: { stepId: `step-${s}` } })); } catch { }
                }, step);
                await page.waitForTimeout(700);
                // debug: contar opções no DOM
                const dbg = await page.evaluate(() => {
                    const q1 = document.querySelectorAll('.quiz-content [data-block-type="options-grid"] [role="button"]').length;
                    const q2 = document.querySelectorAll('.quiz-content [data-block-type="options-grid"] .option-card').length;
                    const q3 = document.querySelectorAll('[data-testid^="grid-option-"]').length;
                    const blocks = Array.from(document.querySelectorAll('[data-block-type]')).map(el => el.getAttribute('data-block-type'));
                    return { q1, q2, q3, blocks };
                });
                log('DEBUG etapa', step, dbg);
                // reavaliar seletores
                for (const sel of OPTION_SELECTORS) {
                    const candidate = page.locator(sel);
                    const c = await candidate.count();
                    if (c > 0) { loc = candidate; count = c; break; }
                }
            }

            if (!loc || count === 0) throw new Error(`Nenhuma opção visível na etapa ${step}`);

            const toClick = Math.min(3, count);
            for (let i = 0; i < toClick; i++) {
                await loc.nth(i).click();
                await page.waitForTimeout(80);
            }

            // tentar clicar no botão Próxima se disponível
            const nextBtn = page.locator('[data-testid="next-button"]');
            if (await nextBtn.count()) {
                await nextBtn.first().click({ timeout: 1000 }).catch(() => { });
            }

            // aguardar auto-advance (ou avançar manualmente)
            await page.waitForTimeout(500);
        }

        // Forçar etapa 19 para consolidar cálculo
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', { detail: { stepId: 19, source: 'smoke-e2e-3x' } }));
        });
        await page.waitForTimeout(600);

        // Ir para etapa 20 e validar resultado
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', { detail: { stepId: 20, source: 'smoke-e2e-3x' } }));
        });
        await page.waitForTimeout(800);

        const result = await page.evaluate(() => {
            const legacy = localStorage.getItem('quizResult');
            const unified = localStorage.getItem('unifiedQuizData');
            let legacyParsed = null, unifiedParsed = null;
            try { legacyParsed = legacy ? JSON.parse(legacy) : null; } catch { }
            try { unifiedParsed = unified ? JSON.parse(unified)?.result : null; } catch { }
            const hasAny = Boolean(legacyParsed || unifiedParsed);
            const style = legacyParsed?.primaryStyle?.style || unifiedParsed?.primaryStyle?.style || null;
            return { hasAny, style, unifiedHas: Boolean(unifiedParsed), legacyHas: Boolean(legacyParsed) };
        });

        const ok = result.hasAny;
        const out = { ok, result };
        log('Resultado final:', out);
        console.log(JSON.stringify(out));
    } catch (err) {
        console.error('[SMOKE-E2E-3X] Erro:', err);
        process.exitCode = 1;
    } finally {
        await page.close();
        await browser.close();
    }
})();
