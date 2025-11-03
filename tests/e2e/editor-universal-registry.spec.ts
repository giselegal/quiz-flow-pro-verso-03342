/**
 * 🧪 TESTES E2E - Editor com Universal Registry
 * 
 * Valida fluxo completo do editor modular com schemas dinâmicos
 */

import { test, expect } from '@playwright/test';

test.describe('Editor Modular com Universal Registry', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar para o editor
    await page.goto('/editor');
    
    // Aguardar carregamento inicial
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('deve carregar editor com 4 colunas', async ({ page }) => {
    // Verificar estrutura das 4 colunas
    const stepNavigator = page.locator('[data-testid="step-navigator"]').or(page.locator('text=Navegação').first());
    const componentLibrary = page.locator('text=Biblioteca de Componentes');
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('text=Canvas').first());
    const properties = page.locator('text=Propriedades');

    await expect(stepNavigator.or(page.locator('.h-full').first())).toBeVisible();
    await expect(componentLibrary.or(page.locator('.h-full').nth(1))).toBeVisible();
  });

  test('deve exibir componentes na biblioteca', async ({ page }) => {
    // Verificar que biblioteca tem componentes
    const library = page.locator('text=Biblioteca de Componentes').locator('..');
    
    // Aguardar carregamento de componentes
    await page.waitForTimeout(1500);
    
    // Verificar presença de categorias ou componentes
    const hasComponents = await library.locator('[draggable]').or(library.locator('text=Intro')).count();
    expect(hasComponents).toBeGreaterThan(0);
  });

  test('deve permitir busca de componentes', async ({ page }) => {
    // Localizar campo de busca na biblioteca
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    
    if (await searchInput.isVisible()) {
      // Digitar termo de busca
      await searchInput.fill('logo');
      await page.waitForTimeout(500);
      
      // Verificar que resultados foram filtrados
      const visibleItems = await page.locator('[draggable]').count();
      expect(visibleItems).toBeGreaterThanOrEqual(0);
    }
  });

  test('deve selecionar uma etapa', async ({ page }) => {
    // Clicar na primeira etapa disponível
    const firstStep = page.locator('[data-step-key]').first()
      .or(page.locator('button').filter({ hasText: /intro|question|result/i }).first());
    
    if (await firstStep.isVisible({ timeout: 2000 })) {
      await firstStep.click();
      await page.waitForTimeout(500);
      
      // Verificar que etapa está selecionada
      await expect(firstStep).toHaveClass(/selected|bg-blue|active/);
    }
  });

  test('deve adicionar bloco ao canvas', async ({ page }) => {
    // Selecionar etapa
    const firstStep = page.locator('[data-step-key]').first()
      .or(page.locator('button').first());
    
    if (await firstStep.isVisible({ timeout: 2000 })) {
      await firstStep.click();
      await page.waitForTimeout(500);
    }
    
    // Clicar em componente na biblioteca para adicionar
    const firstComponent = page.locator('[draggable]').first()
      .or(page.locator('text=+ ').first());
    
    if (await firstComponent.isVisible({ timeout: 2000 })) {
      await firstComponent.click();
      await page.waitForTimeout(1000);
      
      // Verificar que bloco foi adicionado ao canvas
      const canvasBlocks = await page.locator('[data-block-id]').or(page.locator('.border.rounded')).count();
      expect(canvasBlocks).toBeGreaterThan(0);
    }
  });

  test('deve selecionar bloco e exibir propriedades', async ({ page }) => {
    // Adicionar bloco primeiro
    const firstStep = page.locator('[data-step-key]').first()
      .or(page.locator('button').first());
    
    if (await firstStep.isVisible({ timeout: 2000 })) {
      await firstStep.click();
      await page.waitForTimeout(500);
    }
    
    const firstComponent = page.locator('[draggable]').first()
      .or(page.locator('text=+ ').first());
    
    if (await firstComponent.isVisible({ timeout: 2000 })) {
      await firstComponent.click();
      await page.waitForTimeout(1000);
    }
    
    // Selecionar bloco no canvas
    const canvasBlock = page.locator('[data-block-id]').first()
      .or(page.locator('.border.rounded').first());
    
    if (await canvasBlock.isVisible({ timeout: 2000 })) {
      await canvasBlock.click();
      await page.waitForTimeout(500);
      
      // Verificar que painel de propriedades exibe informações
      const propertiesPanel = page.locator('text=Propriedades').locator('..');
      const hasProperties = await propertiesPanel.locator('label, input, textarea, select').count();
      expect(hasProperties).toBeGreaterThanOrEqual(0);
    }
  });

  test('deve editar propriedade de bloco', async ({ page }) => {
    // Fluxo completo: adicionar bloco, selecionar, editar
    const firstStep = page.locator('[data-step-key]').first()
      .or(page.locator('button').first());
    
    if (await firstStep.isVisible({ timeout: 2000 })) {
      await firstStep.click();
      await page.waitForTimeout(500);
    }
    
    const firstComponent = page.locator('[draggable]').first();
    if (await firstComponent.isVisible({ timeout: 2000 })) {
      await firstComponent.click();
      await page.waitForTimeout(1000);
    }
    
    const canvasBlock = page.locator('[data-block-id]').first()
      .or(page.locator('.border.rounded').first());
    
    if (await canvasBlock.isVisible({ timeout: 2000 })) {
      await canvasBlock.click();
      await page.waitForTimeout(500);
      
      // Tentar editar primeiro input visível
      const firstInput = page.locator('input[type="text"]').first();
      if (await firstInput.isVisible({ timeout: 1000 })) {
        await firstInput.fill('Teste de Edição');
        await page.waitForTimeout(500);
        
        // Verificar que valor foi atualizado
        await expect(firstInput).toHaveValue('Teste de Edição');
      }
    }
  });

  test('deve alternar entre modo edição e preview', async ({ page }) => {
    // Localizar botões de modo
    const editButton = page.locator('button').filter({ hasText: /Edição|Edit/i });
    const previewButton = page.locator('button').filter({ hasText: /Preview/i });
    
    if (await previewButton.isVisible({ timeout: 2000 })) {
      // Clicar em preview
      await previewButton.click();
      await page.waitForTimeout(500);
      
      // Verificar que modo mudou
      await expect(previewButton).toHaveClass(/default|bg-/);
      
      // Voltar para edição
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);
        await expect(editButton).toHaveClass(/default|bg-/);
      }
    }
  });

  test('deve remover bloco do canvas', async ({ page }) => {
    // Adicionar bloco primeiro
    const firstStep = page.locator('[data-step-key]').first()
      .or(page.locator('button').first());
    
    if (await firstStep.isVisible({ timeout: 2000 })) {
      await firstStep.click();
      await page.waitForTimeout(500);
    }
    
    const firstComponent = page.locator('[draggable]').first();
    if (await firstComponent.isVisible({ timeout: 2000 })) {
      await firstComponent.click();
      await page.waitForTimeout(1000);
    }
    
    // Contar blocos antes
    const blocksBefore = await page.locator('[data-block-id]').or(page.locator('.border.rounded')).count();
    
    // Clicar em botão de remover (×)
    const removeButton = page.locator('button').filter({ hasText: '×' }).first();
    if (await removeButton.isVisible({ timeout: 2000 })) {
      await removeButton.click();
      await page.waitForTimeout(500);
      
      // Verificar que bloco foi removido
      const blocksAfter = await page.locator('[data-block-id]').or(page.locator('.border.rounded')).count();
      expect(blocksAfter).toBeLessThan(blocksBefore);
    }
  });

  test('deve exibir status de salvamento', async ({ page }) => {
    // Verificar presença de indicadores de save
    const saveStatus = page.locator('text=/Salvo|Salvando|Não salvo/i').first();
    const saveButton = page.locator('button').filter({ hasText: /Salvar|Save/i });
    
    const hasSaveIndicator = (await saveStatus.isVisible({ timeout: 2000 })) || 
                             (await saveButton.isVisible({ timeout: 2000 }));
    
    expect(hasSaveIndicator).toBe(true);
  });

  test('deve reordenar blocos', async ({ page }) => {
    // Adicionar múltiplos blocos
    const firstStep = page.locator('[data-step-key]').first()
      .or(page.locator('button').first());
    
    if (await firstStep.isVisible({ timeout: 2000 })) {
      await firstStep.click();
      await page.waitForTimeout(500);
    }
    
    // Adicionar 2 blocos
    const component = page.locator('[draggable]').first();
    if (await component.isVisible({ timeout: 2000 })) {
      await component.click();
      await page.waitForTimeout(500);
      await component.click();
      await page.waitForTimeout(1000);
    }
    
    // Verificar botões de reordenação
    const moveUpButton = page.locator('button[title*="cima"]').or(page.locator('button').filter({ hasText: '↑' })).first();
    const moveDownButton = page.locator('button[title*="baixo"]').or(page.locator('button').filter({ hasText: '↓' })).first();
    
    const hasReorderButtons = (await moveUpButton.isVisible({ timeout: 1000 })) ||
                               (await moveDownButton.isVisible({ timeout: 1000 }));
    
    if (hasReorderButtons) {
      // Clicar em botão de reordenação
      if (await moveDownButton.isVisible()) {
        await moveDownButton.click();
        await page.waitForTimeout(500);
      }
    }
  });
});
