// scripts/smoke-step1.mjs
// Verifica se o campo de nome da etapa 1 aparece em /quiz

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const DEFAULTS = {
    primary: 'http://localhost:8080/quiz',
    fallback: 'http://localhost:4173/quiz',
};
let url = process.env.SMOKE_URL || DEFAULTS.primary;

const SELECTORS = [
    // IDs mais comuns
    '#intro-name-input',
    'input#intro-name-input',
    '[data-testid="intro-name-input"]',
    '#intro-form-input',
    'input#intro-form-input',

    // Fallback/variantes conhecidas
    '#name-input',
    'input#name-input',
    '#step-1-fallback-input',
    'input#step-1-fallback-input',
    '#step01-name-input',
    'input#step01-name-input',
    '#name-input-modular',

    // Atributos semânticos
    'input[name="userName"]',
    'input[name="name"]',
    '[data-name-input]',
    '[data-block-id="intro-form-input"] input',
    '[data-block-type="form-input"] input[name="userName"]',
];

const log = (...args) => console.log('[SMOKE-STEP1]', ...args);

async function tryGoto(page, targetUrl, attempts = 1, label = 'goto') {
    let lastErr = null;
    for (let i = 0; i < attempts; i++) {
        try {
            await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
            return true;
        } catch (err) {
            lastErr = err;
            await page.waitForTimeout(300);
        }
    }
    if (lastErr) log(`${label} falhou:`, lastErr.message || lastErr);
    return false;
}

(async () => {
    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.setDefaultTimeout(25000);
    let serverProc = null;
    try {
        log('Abrindo', url);
        let ok = await tryGoto(page, url, 1, 'primeira tentativa');
        if (!ok) {
            // Se a URL principal falhar, tenta iniciar o preview server e usar fallback
            if (!process.env.SMOKE_URL) {
                try {
                    log('Servidor não acessível. Iniciando preview server (npm run preview)...');
                    serverProc = spawn('npm', ['run', 'preview'], { stdio: 'inherit', env: process.env });
                } catch (spawnErr) {
                    log('Falha ao iniciar preview server:', spawnErr?.message || spawnErr);
                }
                url = DEFAULTS.fallback;
                // tenta várias vezes até o servidor subir
                ok = await tryGoto(page, url, 20, 'tentando fallback 4173');
            }
        }
        if (!ok) throw new Error(`Não foi possível acessar ${url}`);

        // aguarda render inicial e possível preload
        await page.waitForTimeout(1200);

        let found = null;
        for (const sel of SELECTORS) {
            try {
                await page.waitForSelector(sel, { timeout: 2500, state: 'visible' });
                found = sel;
                break;
            } catch { }
        }

        if (!found) {
            // tenta navegar explicitamente para step 1
            await page.evaluate(() => {
                window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', { detail: { stepId: 1, source: 'smoke-step1' } }));
            });
            await page.waitForTimeout(800);
            for (const sel of SELECTORS) {
                try {
                    await page.waitForSelector(sel, { timeout: 2000, state: 'visible' });
                    found = sel;
                    break;
                } catch { }
            }
        }

        if (!found) {
            // Debug: listar inputs visíveis na tela
            const inputs = await page.evaluate(() => {
                const arr = Array.from(document.querySelectorAll('input'));
                return arr.map(el => ({
                    id: el.id,
                    name: el.getAttribute('name'),
                    type: el.getAttribute('type'),
                    placeholder: el.getAttribute('placeholder'),
                    visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
                    dataBlockId: el.closest('[data-block-id]')?.getAttribute('data-block-id') || null,
                    dataBlockType: el.closest('[data-block-type]')?.getAttribute('data-block-type') || null,
                }));
            });
            log('DEBUG inputs visíveis:', inputs);
        }

        const result = { ok: Boolean(found), selector: found };
        log('Resultado:', result);
        console.log(JSON.stringify(result));
    } catch (err) {
        console.error('[SMOKE-STEP1] Erro:', err);
        process.exitCode = 1;
    } finally {
        try { await page.close(); } catch {}
        try { await browser.close(); } catch {}
        if (serverProc && !serverProc.killed) {
            log('Encerrando preview server...');
            try { serverProc.kill('SIGINT'); } catch {}
        }
    }
})();
