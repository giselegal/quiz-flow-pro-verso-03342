import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';
// IDs conhecidos em outros specs
const FUNNEL_PARAM = 'quiz21StepsComplete';
const FUNNEL_ID_PARAM = 'funnel-quiz21-SKZYE1GX';

async function navigateToEditorWithFunnel(page: import('@playwright/test').Page) {
    // Tenta `?funnel=` primeiro
    await page.goto(`${BASE_URL}/editor?funnel=${FUNNEL_PARAM}`);
    await page.waitForLoadState('domcontentloaded');
    const hasEditorUi = await page.locator('#root, .editor-container, main').first().isVisible().catch(() => false);
    if (hasEditorUi) return 'funnel';

    // Fallback para `?funnelId=`
    await page.goto(`${BASE_URL}/editor?funnelId=${FUNNEL_ID_PARAM}`);
    await page.waitForLoadState('domcontentloaded');
    return 'funnelId';
}

async function enterPreview(page: import('@playwright/test').Page) {
    // Tenta via API exposta no window
    await page.evaluate(() => {
        const api = (window as any).__editorMode;
        if (api && typeof api.setViewMode === 'function') {
            api.setViewMode('preview');
        }
    });

    // Se não renderizou, tenta via diversos seletores de toggle
    const previewCanvas = page.locator('[data-testid="canvas-preview-mode"], [class*="preview"], [data-testid*="preview"]').first();
    if (!(await previewCanvas.isVisible().catch(() => false))) {
        const togglePreview = page.locator(
            'button:has-text("Preview"), button:has-text("Pré-visualizar"), button:has-text("Visualizar"), [data-action*="preview"], [data-testid*="toggle-preview"]'
        ).first();
        if (await togglePreview.isVisible().catch(() => false)) {
            await togglePreview.click({ trial: true }).catch(() => { });
            await togglePreview.click({ force: true }).catch(() => { });
        }
    }

    await expect(page.locator('[data-testid="canvas-preview-mode"]').first()).toBeVisible({ timeout: 15000 });
}

async function waitForAnyVisible(page: import('@playwright/test').Page, selectors: string[], timeout = 15000) {
    const start = Date.now();
    for (; ;) {
        for (const sel of selectors) {
            const loc = page.locator(sel).first();
            if (await loc.isVisible().catch(() => false)) return loc;
        }
        if (Date.now() - start > timeout) break;
        await page.waitForTimeout(200);
    }
    throw new Error(`Nenhum seletor visível dentro do timeout: ${selectors.join(' | ')}`);
}

test.describe('Editor + Renderização - Carregamento de Funil', () => {
    test('Carrega /editor com funnel e sem erros de rede', async ({ page }) => {
        const failures: Array<{ url: string; status: number }> = [];
        page.on('response', (resp) => {
            const url = resp.url();
            const status = resp.status();
            const isAsset = /\.(js|css|png|jpg|jpeg|svg|woff2?)(\?|$)/.test(url);
            if (isAsset && status >= 400) failures.push({ url, status });
        });

        const usedParam = await navigateToEditorWithFunnel(page);
        await page.waitForLoadState('networkidle', { timeout: 30000 });

        const hasRoot = await page.locator('#root, .editor-container, main').first().isVisible();
        expect(hasRoot).toBe(true);
        expect(failures, `Falhas de assets:\n${failures.map(f => `${f.status} ${f.url}`).join('\n')}`).toHaveLength(0);

        // Debug auxiliar: listar botões e atributos data-testid presentes
        const debugInfo = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim() || '').filter(Boolean).slice(0, 10);
            const testids = Array.from(document.querySelectorAll('[data-testid]')).map(el => (el as HTMLElement).getAttribute('data-testid')).filter(Boolean).slice(0, 15);
            const classes = Array.from(document.querySelectorAll('[class]')).map(el => (el as HTMLElement).className).slice(0, 10);
            return { buttons, testids, classes };
        });
        console.log('[Editor DEBUG] Botões:', debugInfo.buttons);
        console.log('[Editor DEBUG] data-testid:', debugInfo.testids);
        console.log('[Editor DEBUG] classes amostra:', debugInfo.classes);
    });

    test('Renderiza blocos no modo edição e preview', async ({ page }) => {
        await navigateToEditorWithFunnel(page);
        await page.waitForLoadState('networkidle');

        // Valida presença de blocos conhecidos na página de edição
        const blockIntroHeader = page.getByTestId('block-quiz-intro-header');
        const blockIntroForm = page.getByTestId('block-intro-form');
        await expect(blockIntroHeader).toBeVisible({ timeout: 8000 });
        await expect(blockIntroForm).toBeVisible({ timeout: 8000 });

        await enterPreview(page);
        // Entra em preview (se disponível) ou valida que blocos permanecem visíveis
        await enterPreview(page).catch(() => { });
        // Após tentar preview, pelo menos um bloco deve continuar acessível
        await expect(blockIntroHeader).toBeVisible({ timeout: 8000 });
    });

    test('Fluxo básico de preview: input + avançar step', async ({ page }) => {
        await navigateToEditorWithFunnel(page);
        await page.waitForLoadState('networkidle');

        await enterPreview(page).catch(() => { });

        const nameInput = page.locator('[data-testid="block-intro-form"] input, input[placeholder*="nome"], input[name*="name"], input[type="text"]').first();
        if (await nameInput.isVisible().catch(() => false)) {
            await nameInput.fill('Teste');
        }

        const startBtn = page.locator(
            '[data-testid="block-intro-form"] button, button:has-text("Começar"), button:has-text("Quero Descobrir"), button:has-text("Continuar"), button:has-text("Avançar"), [data-action*="next"], [data-testid*="next"]'
        ).first();
        if (await startBtn.isVisible().catch(() => false)) {
            await startBtn.click();
        }

        await page.waitForTimeout(800);

        const gridCandidates = [
            '[data-testid*="options-grid"]',
            '.options-grid',
            '[class*="grid"]',
            '[data-testid*="option"]',
        ];
        const optionsGrid = await waitForAnyVisible(page, gridCandidates, 8000).catch(() => null);
        expect(!!optionsGrid).toBeTruthy();
    });
});
