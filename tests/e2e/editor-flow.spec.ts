/**
 * 🧪 TESTES END-TO-END - FLUXO COMPLETO DO EDITOR
 * 
 * Testa o fluxo completo: Criar → Editar → Preview → Publicar
 * Valida funcionalidades críticas em diferentes dispositivos
 */

import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo do Editor', () => {
    test.beforeEach(async ({ page }) => {
        // Navegar para a página inicial
        await page.goto('/');
    });

    test('Criar novo funil e editar propriedades', async ({ page }) => {
        // 1. CRIAR: Acessar página de criação
        await page.getByRole('button', { name: /criar novo/i }).click();
        await expect(page).toHaveURL(/.*\/editor/);

        // 2. EDITAR: Verificar se o editor carregou
        await expect(page.getByTestId('canvas-editor')).toBeVisible();
        await expect(page.getByTestId('properties-panel')).toBeVisible();

        // Selecionar um bloco no canvas
        await page.getByTestId('block-header').first().click();

        // Verificar se o painel de propriedades mostra o bloco selecionado
        await expect(page.getByText('Propriedades')).toBeVisible();

        // Editar uma propriedade (título)
        const titleInput = page.getByLabel(/título/i);
        await titleInput.fill('Título de Teste E2E');

        // Verificar se a mudança aparece no canvas
        await expect(page.getByTestId('block-header')).toContainText('Título de Teste E2E');
    });

    test('Preview do funil criado', async ({ page }) => {
        // Navegar para o editor (assumindo que há um funil exemplo)
        await page.goto('/editor');

        // 3. PREVIEW: Clicar no botão de preview
        await page.getByRole('button', { name: /preview/i }).click();

        // Verificar se abriu em nova aba ou modal
        const previewElement = page.getByTestId('preview-container');
        await expect(previewElement).toBeVisible();

        // Testar navegação no preview
        const nextButton = page.getByRole('button', { name: /próximo|continuar/i });
        if (await nextButton.isVisible()) {
            await nextButton.click();
            // Verificar se a navegação funcionou
            await expect(page.getByTestId('step-indicator')).toBeVisible();
        }
    });

    test('Sistema de drag and drop funciona', async ({ page }) => {
        await page.goto('/editor');

        // Aguardar o canvas carregar
        await expect(page.getByTestId('canvas-editor')).toBeVisible();

        // Verificar se há elementos na sidebar de componentes
        await expect(page.getByTestId('components-sidebar')).toBeVisible();

        // Tentar arrastar um componente (se possível no headless mode)
        const textComponent = page.getByTestId('component-text');
        const dropZone = page.getByTestId('canvas-drop-zone');

        if (await textComponent.isVisible() && await dropZone.isVisible()) {
            // Simular drag and drop
            await textComponent.hover();
            await page.mouse.down();
            await dropZone.hover();
            await page.mouse.up();

            // Verificar se o componente foi adicionado
            await expect(page.getByTestId('block-text')).toBeVisible();
        }
    });

    test('Responsividade - Mobile viewport', async ({ page }) => {
        // Definir viewport mobile
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto('/');

        // Verificar se a interface se adapta ao mobile
        await expect(page.getByTestId('mobile-menu')).toBeVisible();

        // Testar criação no mobile
        await page.getByRole('button', { name: /criar/i }).click();
        await expect(page.getByTestId('mobile-editor')).toBeVisible();
    });

    test('Responsividade - Tablet viewport', async ({ page }) => {
        // Definir viewport tablet
        await page.setViewportSize({ width: 768, height: 1024 });

        await page.goto('/editor');

        // Verificar se os painéis se reorganizam adequadamente
        const propertiesPanel = page.getByTestId('properties-panel');
        const canvas = page.getByTestId('canvas-editor');

        await expect(propertiesPanel).toBeVisible();
        await expect(canvas).toBeVisible();

        // Verificar se não há sobreposição
        const panelBox = await propertiesPanel.boundingBox();
        const canvasBox = await canvas.boundingBox();

        if (panelBox && canvasBox) {
            // Verificar se os elementos não se sobrepõem
            expect(panelBox.x + panelBox.width <= canvasBox.x ||
                canvasBox.x + canvasBox.width <= panelBox.x).toBeTruthy();
        }
    });

    test('Sistema de fallback em caso de erro', async ({ page }) => {
        // Simular erro de rede interceptando requests
        await page.route('**/api/**', route => {
            route.abort('failed');
        });

        await page.goto('/editor');

        // Verificar se o sistema de fallback aparece
        await expect(page.getByText(/erro|fallback|offline/i)).toBeVisible();

        // Verificar se ainda é possível usar funcionalidades básicas
        const offlineIndicator = page.getByTestId('offline-mode');
        if (await offlineIndicator.isVisible()) {
            // Tentar editar algo no modo offline
            await page.getByTestId('block-header').first().click();
            await expect(page.getByText('Propriedades')).toBeVisible();
        }
    });

    test('Performance - Tempo de carregamento', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/editor');

        // Aguardar elementos críticos carregarem
        await expect(page.getByTestId('canvas-editor')).toBeVisible();
        await expect(page.getByTestId('properties-panel')).toBeVisible();

        const loadTime = Date.now() - startTime;

        // Verificar se carregou em menos de 5 segundos
        expect(loadTime).toBeLessThan(5000);

        console.log(`⚡ Editor carregou em ${loadTime}ms`);
    });

    test('Persistência de dados', async ({ page }) => {
        await page.goto('/editor');

        // Fazer uma alteração
        await page.getByTestId('block-header').first().click();
        const titleInput = page.getByLabel(/título/i);
        const testTitle = 'Teste Persistência E2E';
        await titleInput.fill(testTitle);

        // Aguardar um pouco para garantir que foi salvo
        await page.waitForTimeout(1000);

        // Recarregar a página
        await page.reload();

        // Verificar se a alteração foi persistida
        await expect(page.getByTestId('canvas-editor')).toBeVisible();
        await page.getByTestId('block-header').first().click();

        const persistedTitle = await page.getByLabel(/título/i).inputValue();
        expect(persistedTitle).toBe(testTitle);
    });
});

test.describe('Fluxos Específicos por Funcionalidade', () => {
    test('FullFunnelPreview - Sistema de 21 etapas', async ({ page }) => {
        await page.goto('/editor');

        // Verificar se o sistema de 21 etapas está disponível
        const stepIndicator = page.getByTestId('step-navigation');
        if (await stepIndicator.isVisible()) {
            // Testar navegação entre etapas
            for (let step = 1; step <= 3; step++) {
                await page.getByTestId(`step-${step}`).click();
                await expect(page.getByTestId(`step-${step}-content`)).toBeVisible();
            }
        }
    });

    test('Sistema de Templates', async ({ page }) => {
        await page.goto('/templates');

        // Verificar se os templates carregaram
        await expect(page.getByTestId('templates-grid')).toBeVisible();

        // Selecionar um template
        const firstTemplate = page.getByTestId('template-card').first();
        await firstTemplate.click();

        // Verificar se foi redirecionado para o editor
        await expect(page).toHaveURL(/.*\/editor/);
        await expect(page.getByTestId('canvas-editor')).toBeVisible();
    });
});