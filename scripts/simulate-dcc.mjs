// scripts/simulate-dcc.mjs
// Simula seleções das opções Dramático, Clássico e Criativo ao longo das questões
// e valida o resultado na etapa 20.

import { chromium } from 'playwright';

const url = process.env.SIM_URL || 'http://localhost:5173/editor';

const S = {
    dramatico: ['Dramático', 'Dramatico'],
    classico: ['Clássico', 'Classico'],
    criativo: ['Criativo'],
};

const log = (...args) => console.log('[SIM:DCC]', ...args);

async function clickOption(page, key) {
    // Seleciona por data-testid usado no QuizQuestion
    const testId = page.locator(`[data-testid="option-${key}"]`).first();
    if (await testId.count()) {
        await testId.click({ timeout: 3000 }).catch(() => { });
        return true;
    }
    // Fallback: procura pelo texto dentro do card
    for (const t of (S[key] || [key])) {
        const loc = page.locator(`text=${t}`).first();
        if (await loc.count()) {
            await loc.click({ timeout: 3000 }).catch(() => { });
            return true;
        }
    }
    return false;
}

async function clickContinue(page) {
    // Botão próximo por data-testid
    const btn = page.locator('[data-testid="next-button"]').first();
    if (await btn.count()) {
        try { await btn.click({ timeout: 3000 }); return true; } catch { }
    }
    // Fallback por texto
    const texts = ['Continuar', 'Avançar', 'Próxima', 'Próximo', 'Prosseguir'];
    for (const t of texts) {
        const b = page.locator(`button:has-text("${t}")`).first();
        if (await b.count()) {
            try { await b.click({ timeout: 3000 }); return true; } catch { }
        }
    }
    return false;
}

const run = async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);

    const chosen = [];
    try {
        log('Abrindo', url);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        // Limpa storages para garantir ambiente limpo
        await page.evaluate(() => {
            try { localStorage.clear(); sessionStorage.clear(); } catch { }
        });
        await page.waitForTimeout(800);

        // Garantir que estamos no passo 2
        await page.evaluate(() => {
            const ev = new CustomEvent('quiz-navigate-to-step', { detail: { stepId: 2, source: 'simulate-dcc' } });
            window.dispatchEvent(ev);
        });
        await page.waitForTimeout(600);

        // Q1: listar opções e selecionar os 3 (dramatico, classico, criativo)
        const listQ1 = await page.evaluate(() => Array.from(document.querySelectorAll('[data-testid^="option-" ]')).map(el => ({ id: el.getAttribute('data-testid'), text: el.innerText?.slice(0, 80) })));
        log('Q1 opções visíveis:', listQ1);
        log('Q1: selecionando dramático, clássico, criativo');
        for (const key of ['dramatico', 'classico', 'criativo']) {
            const ok = await clickOption(page, key);
            chosen.push({ q: 1, key, ok });
            await page.waitForTimeout(150);
        }
        await clickContinue(page);
        await page.waitForTimeout(400);

        // Q2..Q10: selecionar alternando dramático → clássico → criativo
        const rotation = ['dramatico', 'classico', 'criativo'];
        for (let q = 2; q <= 10; q++) {
            const list = await page.evaluate(() => Array.from(document.querySelectorAll('[data-testid^="option-" ]')).map(el => ({ id: el.getAttribute('data-testid'), text: el.innerText?.slice(0, 80) })));
            log(`Q${q} opções visíveis:`, list);
            const key = rotation[(q - 2) % rotation.length];
            log(`Q${q}: selecionando ${key}`);
            const ok = await clickOption(page, key);
            chosen.push({ q, key, ok });
            await page.waitForTimeout(150);
            await clickContinue(page);
            await page.waitForTimeout(300);
        }

        // Navega para etapa 20
        log('Navegando para a etapa 20');
        await page.evaluate(() => {
            const ev = new CustomEvent('quiz-navigate-to-step', { detail: { stepId: 20, source: 'simulate-dcc' } });
            window.dispatchEvent(ev);
        });

        // Aguarda UI
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

        // Lê resultado do storage (legacy)
        const rawResult = await page.evaluate(() => {
            try { return localStorage.getItem('quizResult') || sessionStorage.getItem('quizResult') || null; } catch { return null; }
        });

        let parsed = null;
        try { parsed = rawResult ? JSON.parse(rawResult) : null; } catch { }

        if (parsed?.primaryStyle) {
            log('Resultado:', parsed.primaryStyle.style || parsed.primaryStyle.category);
        } else {
            log('Resultado não encontrado no storage');
        }

        console.log(JSON.stringify({ ok: found || Boolean(parsed), chosen, primary: parsed?.primaryStyle || null, hasVisualCue: found, hasStorageResult: Boolean(parsed) }));
    } catch (err) {
        console.error('[SIM:DCC] Erro:', err);
        process.exitCode = 1;
    } finally {
        await page.close();
        await browser.close();
    }
};

run();
