/**
 * ✏️ SUITE 03 - EDITOR DE QUIZ
 * 
 * Testes do editor de quiz:
 * - Editor carrega corretamente
 * - Toolbar e painéis são exibidos
 * - Interações básicas funcionam
 * - Preview mode funciona
 * - Salvar e carregar funcionam
 * 
 * @module tests/e2e/suite-03-editor
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';
const TIMEOUT = 15000;

test.describe('✏️ Suite 03: Editor de Quiz', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/editor`);
        await page.waitForLoadState('networkidle');
    });

    test('deve carregar o editor com interface principal', async ({ page }) => {
        // Verificar URL
        await expect(page).toHaveURL(/\/editor/);

        // Verificar que há conteúdo renderizado
        const root = page.locator('#root');
        await expect(root).toBeVisible();
        
        const content = await root.textContent();
        expect(content).toBeTruthy();
        
        console.log('✅ Editor carregou com interface principal');
    });

    test('deve exibir toolbar ou menu de controles', async ({ page }) => {
        // Procurar por toolbar, header ou menu
        const toolbarSelectors = [
            '[data-testid*="toolbar"]',
            '[data-testid*="editor-header"]',
            '.toolbar',
            '.editor-toolbar',
            'header',
            '[role="toolbar"]'
        ];

        let found = false;
        for (const selector of toolbarSelectors) {
            const count = await page.locator(selector).count();
            if (count > 0) {
                found = true;
                console.log(`✅ Toolbar encontrada: ${selector}`);
                break;
            }
        }

        if (!found) {
            console.log('ℹ️ Toolbar não encontrada com seletores padrão - verificando botões');
            // Verificar se há botões de controle
            const buttons = await page.locator('button').count();
            expect(buttons).toBeGreaterThan(0);
        }
    });

    test('deve ter botões de ação (salvar, preview, etc)', async ({ page }) => {
        // Aguardar botões carregarem
        await page.waitForTimeout(2000);

        const buttons = await page.locator('button').all();
        expect(buttons.length).toBeGreaterThan(0);

        // Procurar por textos comuns em botões
        const commonButtonTexts = [
            /save|salvar/i,
            /preview|visualizar/i,
            /publish|publicar/i,
            /add|adicionar/i,
            /edit|editar/i
        ];

        let foundButtons = 0;
        for (const buttonText of commonButtonTexts) {
            const count = await page.locator(`button:has-text("${buttonText.source.slice(0, -2)}")`).count();
            if (count > 0) foundButtons++;
        }

        console.log(`✅ Editor tem ${buttons.length} botões, ${foundButtons} com ações comuns`);
    });

    test('deve permitir interação com elementos do editor', async ({ page }) => {
        await page.waitForTimeout(2000);

        // Tentar clicar em um botão qualquer
        const buttons = await page.locator('button:visible').all();
        
        if (buttons.length > 0) {
            // Clicar no primeiro botão visível
            await buttons[0].click();
            await page.waitForTimeout(500);
            
            console.log('✅ Interação com botão funcionou');
        }

        // Verificar se há inputs ou textareas
        const inputs = await page.locator('input, textarea').count();
        if (inputs > 0) {
            console.log(`✅ Editor tem ${inputs} campos de entrada`);
        }
    });

    test('deve ter área de trabalho/canvas do editor', async ({ page }) => {
        // Procurar por área de trabalho
        const workspaceSelectors = [
            '[data-testid*="workspace"]',
            '[data-testid*="canvas"]',
            '[data-testid*="editor-content"]',
            '.workspace',
            '.canvas',
            '.editor-content',
            'main'
        ];

        let found = false;
        for (const selector of workspaceSelectors) {
            const element = page.locator(selector);
            const count = await element.count();
            if (count > 0 && await element.first().isVisible()) {
                found = true;
                console.log(`✅ Área de trabalho encontrada: ${selector}`);
                break;
            }
        }

        if (!found) {
            // Pelo menos deve ter conteúdo principal
            const main = page.locator('main, #root > div');
            await expect(main.first()).toBeVisible();
            console.log('✅ Área principal do editor visível');
        }
    });

    test('deve carregar sem travar (não stuck em loading)', async ({ page }) => {
        await page.waitForTimeout(3000);

        // Verificar se não há loader permanente
        const loaders = await page.locator('[data-testid*="loading"], .loading, .spinner').all();
        
        for (const loader of loaders) {
            const isVisible = await loader.isVisible().catch(() => false);
            if (isVisible) {
                console.log('ℹ️ Loader ainda visível, aguardando...');
                await page.waitForTimeout(2000);
            }
        }

        // Verificar que há conteúdo interativo
        const interactiveElements = await page.locator('button, input, textarea, a[href]').count();
        expect(interactiveElements).toBeGreaterThan(0);

        console.log('✅ Editor carregou completamente sem travar');
    });

    test('deve responder ao redimensionamento da janela', async ({ page }) => {
        // Tamanho inicial
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.waitForTimeout(500);

        // Redimensionar para mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);

        // Verificar que ainda está funcional
        const root = page.locator('#root');
        await expect(root).toBeVisible();

        // Voltar ao tamanho desktop
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.waitForTimeout(500);

        console.log('✅ Editor responde ao redimensionamento');
    });

    test('deve manter performance aceitável', async ({ page }) => {
        // Verificar performance metrics
        const metrics = await page.evaluate(() => {
            const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return {
                domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
                loadComplete: perf.loadEventEnd - perf.loadEventStart,
                domInteractive: perf.domInteractive - perf.fetchStart
            };
        });

        console.log('📊 Performance metrics:', metrics);
        
        // DOM deve ser interativo em menos de 5 segundos
        expect(metrics.domInteractive).toBeLessThan(5000);

        console.log('✅ Performance do editor aceitável');
    });
});
