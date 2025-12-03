import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';
// Preferimos o parâmetro `funnel` que é usado em outros specs
const FUNNEL_ID = 'quiz21StepsComplete';

async function enterPreview(page: import('@playwright/test').Page) {
    // Tenta via API exposta no window
    await page.evaluate(() => {
        const api = (window as any).__editorMode;
        if (api && typeof api.setViewMode === 'function') {
            api.setViewMode('preview');
        }
    });

    // Se não renderizou, tenta via diversos seletores de toggle
    const previewCanvas = page.locator('[data-testid="canvas-preview-mode"]').first();
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

test.describe('Editor + Renderização - Carregamento de Funil', () => {
    test('Carrega /editor com funnel e sem erros de rede', async ({ page }) => {
        const failures: Array<{ url: string; status: number }> = [];
        page.on('response', (resp) => {
            const url = resp.url();
            const status = resp.status();
            const isAsset = /\.(js|css|png|jpg|jpeg|svg|woff2?)(\?|$)/.test(url);
            if (isAsset && status >= 400) failures.push({ url, status });
        });

        await page.goto(`${BASE_URL}/editor?funnel=${FUNNEL_ID}`);
        await page.waitForLoadState('networkidle', { timeout: 30000 });

        const hasRoot = await page.locator('#root, .editor-container, main').first().isVisible();
        expect(hasRoot).toBe(true);
        expect(failures, `Falhas de assets:\n${failures.map(f => `${f.status} ${f.url}`).join('\n')}`).toHaveLength(0);
    });

    test('Renderiza canvas no modo edição e preview', async ({ page }) => {
        await page.goto(`${BASE_URL}/editor?funnel=${FUNNEL_ID}`);
        await page.waitForLoadState('networkidle');

        const canvasEdit = page.getByTestId('canvas-editor');
        await expect(canvasEdit).toBeVisible({ timeout: 10000 });

        await enterPreview(page);
        const canvasPreview = page.locator('[data-testid="canvas-preview-mode"]').first();
        await expect(canvasPreview).toBeVisible({ timeout: 15000 });
    });

    test('Fluxo básico de preview: input + avançar step', async ({ page }) => {
        await page.goto(`${BASE_URL}/editor?funnel=${FUNNEL_ID}`);
        await page.waitForLoadState('networkidle');

        await enterPreview(page);

        const nameInput = page.locator('input[placeholder*="nome"], input[name*="name"], input[type="text"]').first();
        if (await nameInput.isVisible().catch(() => false)) {
            await nameInput.fill('Teste');
        }

        const startBtn = page.locator(
            'button:has-text("Começar"), button:has-text("Quero Descobrir"), button:has-text("Continuar")'
        ).first();
        if (await startBtn.isVisible().catch(() => false)) {
            await startBtn.click();
        }

        await page.waitForTimeout(800);

        const optionsGrid = page.locator('[data-testid*="options-grid"], .options-grid').first();
        const hasGrid = await optionsGrid.isVisible().catch(() => false);
        expect(hasGrid).toBeTruthy();
    });
});
