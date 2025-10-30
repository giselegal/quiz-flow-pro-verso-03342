/**
 * 🎨 TESTES VISUAIS - MODO PREVIEW DO EDITOR
 * 
 * Testes de regressão visual usando screenshots
 * Valida que a renderização não mudou inesperadamente
 * 
 * Para atualizar screenshots base:
 * npx playwright test --update-snapshots
 */

import { test, expect } from '@playwright/test';

// Helper: entrar em modo preview de forma determinística
async function enterPreview(page: import('@playwright/test').Page) {
    // Tenta via API exposta no window (mais estável)
    await page.evaluate(() => {
        // @ts-ignore
        const api = (window as any).__editorMode;
        if (api && typeof api.setViewMode === 'function') {
            api.setViewMode('preview');
        }
    });
    // Se o canvas de preview não aparecer, usa o botão como fallback
    const previewCanvas = page.locator('[data-testid="canvas-preview-mode"]').first();
    if (!(await previewCanvas.isVisible().catch(() => false))) {
        const previewBtn = page.locator('button:has-text("Preview")').first();
        if (await previewBtn.isVisible().catch(() => false)) {
            await previewBtn.click();
        }
    }
    await page.waitForSelector('[data-testid="canvas-preview-mode"]', { timeout: 5000 });
}

// Usa URL absoluta para evitar dependência do baseURL do Playwright
const EDITOR_URL = 'http://localhost:8080/editor?template=quiz21StepsComplete';

test.describe('Editor Preview - Testes Visuais', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(EDITOR_URL);
        await page.waitForLoadState('networkidle');
    });

    test.describe('Renderização de Steps', () => {
        test('step-01: captura visual completa', async ({ page }) => {
            // Aguardar renderização completa
            await page.waitForSelector('input[placeholder*="nome"]', { timeout: 5000 });
            await page.waitForTimeout(500);

            // Capturar screenshot do canvas completo
            const canvas = page.locator('[data-testid="canvas-editor"], .canvas-area').first();
            await expect(canvas).toHaveScreenshot('step-01-edit-mode.png', {
                maxDiffPixels: 100,
            });
        });

        test('step-01: modo preview', async ({ page }) => {
            // Entrar no modo preview de forma determinística
            await enterPreview(page);
            await page.waitForTimeout(500);

            // Capturar screenshot do preview
            const preview = page.locator('[data-testid="canvas-preview-mode"]').first();
            await expect(preview).toHaveScreenshot('step-01-preview-mode.png', {
                maxDiffPixels: 100,
            });
        });

        test('step-02: grid de opções com imagens', async ({ page }) => {
            // Navegar para step-02 no preview
            await enterPreview(page);
            await page.waitForTimeout(500);

            await page.locator('input[placeholder*="nome"]').first().fill('Teste Visual');
            await page.locator('button:has-text("Quero Descobrir"), button:has-text("Começar")').first().click();
            await page.waitForTimeout(1500);

            // Aguardar carregamento das imagens
            await page.waitForSelector('text=/QUAL O SEU TIPO DE ROUPA/i', { timeout: 5000 });
            await page.waitForTimeout(1000);

            // Capturar screenshot do grid de opções
            const optionsGrid = page.locator('[data-testid*="options-grid"], .options-grid').first();
            await expect(optionsGrid).toHaveScreenshot('step-02-options-grid.png', {
                maxDiffPixels: 200, // Maior tolerância para imagens
            });
        });

        test('step-02: opções selecionadas (estado visual)', async ({ page }) => {
            // Setup
            await enterPreview(page);
            await page.waitForTimeout(500);
            await page.locator('input[placeholder*="nome"]').first().fill('Teste Visual');
            await page.locator('button:has-text("Quero Descobrir"), button:has-text("Começar")').first().click();
            await page.waitForTimeout(1500);

            // Selecionar 3 opções
            const options = page.locator('[data-testid*="option"], .option-card, button[role="checkbox"]');
            for (let i = 0; i < 3; i++) {
                await options.nth(i).click();
                await page.waitForTimeout(300);
            }

            // Capturar estado visual com seleções
            const optionsGrid = page.locator('[data-testid*="options-grid"], .options-grid').first();
            await expect(optionsGrid).toHaveScreenshot('step-02-options-selected.png', {
                maxDiffPixels: 200,
            });
        });
    });

    test.describe('Componentes Atômicos', () => {
        test('intro-logo: renderização do logo', async ({ page }) => {
            const logo = page.locator('img[alt*="Logo"], img[src*="LOGO_DA_MARCA"]').first();
            await logo.waitFor({ state: 'visible', timeout: 5000 });

            await expect(logo).toHaveScreenshot('intro-logo-block.png', {
                maxDiffPixels: 50,
            });
        });

        test('intro-title: título com HTML inline', async ({ page }) => {
            const title = page.locator('text=/Chega.*guarda-roupa/i').first();
            await title.waitFor({ state: 'visible' });

            // Capturar elemento pai para incluir estilos
            const titleContainer = title.locator('xpath=ancestor::div[1]');
            await expect(titleContainer).toHaveScreenshot('intro-title-block.png', {
                maxDiffPixels: 50,
            });
        });

        test('progress-bar: barra de progresso', async ({ page }) => {
            // Navegar para step-02 para ter progresso visível
            await enterPreview(page);
            await page.waitForTimeout(500);
            await page.locator('input[placeholder*="nome"]').first().fill('Teste');
            await page.locator('button:has-text("Quero Descobrir"), button:has-text("Começar")').first().click();
            await page.waitForTimeout(1500);

            const progressBar = page.locator('[role="progressbar"], .progress-bar').first();
            await progressBar.waitFor({ state: 'visible', timeout: 5000 });

            await expect(progressBar).toHaveScreenshot('progress-bar-block.png', {
                maxDiffPixels: 50,
            });
        });

        test('navigation-buttons: botões de navegação', async ({ page }) => {
            // Entrar no preview e ir para step-02
            await enterPreview(page);
            await page.waitForTimeout(500);
            await page.locator('input[placeholder*="nome"]').first().fill('Teste');
            await page.locator('button:has-text("Quero Descobrir")').first().click();
            await page.waitForTimeout(1500);

            // Selecionar 3 opções para habilitar botão Avançar
            const options = page.locator('[data-testid*="option"], button[role="checkbox"]');
            for (let i = 0; i < 3; i++) {
                await options.nth(i).click();
                await page.waitForTimeout(200);
            }

            const navigationButtons = page.locator('[data-testid*="navigation"], .navigation-buttons').first();
            await expect(navigationButtons).toHaveScreenshot('navigation-buttons.png', {
                maxDiffPixels: 50,
            });
        });
    });

    test.describe('Estados de Validação', () => {
        test('formulário: campo vazio (estado inicial)', async ({ page }) => {
            await enterPreview(page);
            await page.waitForTimeout(500);

            const form = page.locator('input[placeholder*="nome"]').first();
            const formContainer = form.locator('xpath=ancestor::div[2]');
            
            await expect(formContainer).toHaveScreenshot('form-empty-state.png', {
                maxDiffPixels: 50,
            });
        });

        test('formulário: campo preenchido', async ({ page }) => {
            await enterPreview(page);
            await page.waitForTimeout(500);

            const input = page.locator('input[placeholder*="nome"]').first();
            await input.fill('Maria Silva');
            await page.waitForTimeout(300);

            const formContainer = input.locator('xpath=ancestor::div[2]');
            await expect(formContainer).toHaveScreenshot('form-filled-state.png', {
                maxDiffPixels: 50,
            });
        });

        test('botão desabilitado: sem seleções suficientes', async ({ page }) => {
            // Setup para step-02
            await enterPreview(page);
            await page.waitForTimeout(500);
            await page.locator('input[placeholder*="nome"]').first().fill('Teste');
            await page.locator('button:has-text("Quero Descobrir")').first().click();
            await page.waitForTimeout(1500);

            // Selecionar apenas 1 opção (requer 3)
            const option = page.locator('[data-testid*="option"], button[role="checkbox"]').first();
            await option.click();
            await page.waitForTimeout(300);

            const nextButton = page.locator('button:has-text("Avançar")').first();
            await expect(nextButton).toHaveScreenshot('button-disabled-state.png', {
                maxDiffPixels: 50,
            });
        });

        test('botão habilitado: validação satisfeita', async ({ page }) => {
            // Setup para step-02
            await enterPreview(page);
            await page.waitForTimeout(500);
            await page.locator('input[placeholder*="nome"]').first().fill('Teste');
            await page.locator('button:has-text("Quero Descobrir")').first().click();
            await page.waitForTimeout(1500);

            // Selecionar 3 opções
            const options = page.locator('[data-testid*="option"], button[role="checkbox"]');
            for (let i = 0; i < 3; i++) {
                await options.nth(i).click();
                await page.waitForTimeout(200);
            }

            const nextButton = page.locator('button:has-text("Avançar")').first();
            await expect(nextButton).toHaveScreenshot('button-enabled-state.png', {
                maxDiffPixels: 50,
            });
        });
    });

    test.describe('Responsividade', () => {
        const viewports = [
            { name: 'desktop', width: 1920, height: 1080 },
            { name: 'tablet', width: 768, height: 1024 },
            { name: 'mobile', width: 375, height: 667 },
        ];

        viewports.forEach(({ name, width, height }) => {
            test(`step-01 em ${name} (${width}x${height})`, async ({ page }) => {
                await page.setViewportSize({ width, height });
                await page.waitForTimeout(500);

                const canvas = page.locator('[data-testid="canvas-editor"], .canvas-area').first();
                await expect(canvas).toHaveScreenshot(`step-01-${name}.png`, {
                    maxDiffPixels: 150,
                });
            });
        });
    });

    test.describe('Temas e Estilos', () => {
        test('modo claro: renderização padrão', async ({ page }) => {
            const canvas = page.locator('[data-testid="canvas-editor"]').first();
            await expect(canvas).toHaveScreenshot('theme-light.png', {
                maxDiffPixels: 100,
            });
        });

        test('cores de marca: verificação visual', async ({ page }) => {
            // Verificar se cores da marca (#B89B7A, #432818) são aplicadas
            await enterPreview(page);
            await page.waitForTimeout(500);

            const title = page.locator('text=/Chega.*guarda-roupa/i').first();
            const titleContainer = title.locator('xpath=ancestor::div[1]');
            
            await expect(titleContainer).toHaveScreenshot('brand-colors.png', {
                maxDiffPixels: 50,
            });
        });
    });
});

/**
 * 🎯 TESTES DE ACESSIBILIDADE VISUAL
 */
test.describe('Acessibilidade Visual', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(EDITOR_URL);
        await page.waitForLoadState('networkidle');
    });

    test('contraste: botão primário', async ({ page }) => {
        await enterPreview(page);
        await page.waitForTimeout(500);

        const primaryButton = page.locator('button:has-text("Quero Descobrir")').first();
        await expect(primaryButton).toHaveScreenshot('a11y-button-contrast.png', {
            maxDiffPixels: 30,
        });
    });

    test('tamanho de fonte: legibilidade', async ({ page }) => {
        const title = page.locator('text=/Chega.*guarda-roupa/i').first();
        await expect(title).toHaveScreenshot('a11y-font-size.png', {
            maxDiffPixels: 30,
        });
    });

    test('espaçamento: toque em mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await enterPreview(page);
        await page.waitForTimeout(500);
        await page.locator('input[placeholder*="nome"]').first().fill('Teste');
        await page.locator('button:has-text("Quero Descobrir")').first().click();
        await page.waitForTimeout(1500);

        const options = page.locator('[data-testid*="option"], button[role="checkbox"]');
        const optionsContainer = options.first().locator('xpath=ancestor::div[3]');
        
        await expect(optionsContainer).toHaveScreenshot('a11y-touch-targets.png', {
            maxDiffPixels: 100,
        });
    });
});
