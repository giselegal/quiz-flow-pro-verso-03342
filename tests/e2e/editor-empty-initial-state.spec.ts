import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

/**
 * Valida estado inicial do /editor vazio:
 * - Lista de etapas genéricas (3): Bem-vindo, Pergunta, Resultado
 * - Contagem de blocos por etapa exibida (sem renderização de canvas)
 * - Ausência do canvas de edição/preview
 */

test.describe('Editor vazio - Estado Inicial', () => {
    test('Deve exibir 3 etapas genéricas e nenhum canvas', async ({ page }) => {
        await page.goto(`${BASE_URL}/editor`);
        await page.waitForLoadState('networkidle');

        // Verifica títulos/etiquetas típicas
        const overview = page.locator('text=/Etapas \(3\)/i').first();
        await expect(overview).toBeVisible({ timeout: 10000 });

        const stepWelcome = page.locator('text=/Bem-vindo/i').first();
        const stepQuestion = page.locator('text=/Pergunta/i').first();
        const stepResult = page.locator('text=/Resultado/i').first();

        await expect(stepWelcome).toBeVisible();
        await expect(stepQuestion).toBeVisible();
        await expect(stepResult).toBeVisible();

        // Verifica contagem de blocos mostrada na UI
        const blocksCounters = await page.locator('text=/\b\d+\s+blocos\b/i').count();
        expect(blocksCounters).toBeGreaterThanOrEqual(3);

        // Confirma ausência de canvas
        const hasEditCanvas = await page.locator('[data-testid="canvas-editor"], .canvas-area, [class*="canvas"]').first().isVisible().catch(() => false);
        const hasPreviewCanvas = await page.locator('[data-testid="canvas-preview-mode"], [class*="preview"], [data-testid*="preview"]').first().isVisible().catch(() => false);

        expect(hasEditCanvas).toBeFalsy();
        expect(hasPreviewCanvas).toBeFalsy();
    });

    test('Com id de funil, mantém estrutura genérica sem render de blocos', async ({ page }) => {
        const funnelId = 'funnel-quiz21-SKZYE1GX';
        await page.goto(`${BASE_URL}/editor?funnelId=${funnelId}`);
        await page.waitForLoadState('networkidle');

        const overview = page.locator('text=/Etapas \(3\)/i').first();
        await expect(overview).toBeVisible({ timeout: 10000 });

        const hasEditCanvas = await page.locator('[data-testid="canvas-editor"], .canvas-area, [class*="canvas"]').first().isVisible().catch(() => false);
        const hasPreviewCanvas = await page.locator('[data-testid="canvas-preview-mode"], [class*="preview"], [data-testid*="preview"]').first().isVisible().catch(() => false);

        expect(hasEditCanvas).toBeFalsy();
        expect(hasPreviewCanvas).toBeFalsy();
    });
});
