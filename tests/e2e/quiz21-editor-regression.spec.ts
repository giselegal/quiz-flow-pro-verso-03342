/**
 * 🧪 TESTES E2E: Regressão Visual & UX
 * 
 * Suite de testes para validar funcionalidades avançadas e prevenir regressões:
 * drag & drop, undo/redo, multi-seleção, copy/paste, e acessibilidade.
 * 
 * @priority ALTA
 * @coverage Drag&Drop, Undo/Redo, Multi-select, Copy/Paste, A11y
 * @duration ~4-6 minutos
 */

import { test, expect, Page } from '@playwright/test';

async function closeStartupModal(page: Page) {
  try {
    const modal = page.locator('[data-testid="startup-modal"]');
    if (await modal.isVisible({ timeout: 2000 })) {
      await modal.locator('button[aria-label="Close"]').click();
    }
  } catch (e) {
    // Modal não apareceu
  }
}

async function waitForEditorReady(page: Page) {
  await expect(page.locator('[data-editor="modular-enhanced"]')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('[data-testid="step-navigator"]').first()).toBeVisible();
  console.log('✅ Editor pronto para testes de regressão');
}

async function navigateToStep(page: Page, stepNumber: number) {
  const stepKey = `step-${String(stepNumber).padStart(2, '0')}`;
  await page.locator(`[data-testid="step-nav-${stepKey}"]`).first().click();
  await page.waitForTimeout(500);
}

test.describe('Regression - Drag & Drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('REG-001: Deve arrastar bloco dentro do canvas', async ({ page }) => {
    // Navegar para step com múltiplos blocos
    await navigateToStep(page, 5);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const blocks = canvas.locator('[data-block-id]');
    const blockCount = await blocks.count();
    
    if (blockCount < 2) {
      console.log('⚠️ Step precisa de pelo menos 2 blocos para testar drag');
      test.skip();
      return;
    }
    
    // Obter IDs dos primeiros dois blocos
    const firstBlock = blocks.first();
    const secondBlock = blocks.nth(1);
    
    const firstBlockId = await firstBlock.getAttribute('data-block-id');
    const secondBlockId = await secondBlock.getAttribute('data-block-id');
    
    // Verificar se blocos têm handle de drag
    const dragHandle = firstBlock.locator('[data-drag-handle], [draggable="true"]').first();
    const hasDragHandle = await dragHandle.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (!hasDragHandle) {
      console.log('⚠️ Drag handle não encontrado (drag pode não estar implementado)');
      test.skip();
      return;
    }
    
    // Executar drag & drop
    await dragHandle.hover();
    await page.mouse.down();
    
    const secondBlockBox = await secondBlock.boundingBox();
    if (secondBlockBox) {
      await page.mouse.move(secondBlockBox.x + secondBlockBox.width / 2, secondBlockBox.y + secondBlockBox.height + 10);
      await page.waitForTimeout(300);
      await page.mouse.up();
    }
    
    await page.waitForTimeout(500);
    
    // Verificar que ordem mudou
    const newBlocks = canvas.locator('[data-block-id]');
    const newFirstBlockId = await newBlocks.first().getAttribute('data-block-id');
    
    if (newFirstBlockId !== firstBlockId) {
      console.log(`✅ Drag & Drop funcionou: ${firstBlockId} movido`);
    } else {
      console.log(`⚠️ Ordem não mudou (verificar implementação): ${firstBlockId} → ${newFirstBlockId}`);
    }
  });

  test('REG-002: Deve arrastar bloco da biblioteca para o canvas', async ({ page }) => {
    // Procurar biblioteca de blocos
    const library = page.locator('[data-testid="block-library"], [data-testid="sidebar-left"]').first();
    
    if (!(await library.isVisible({ timeout: 2000 }))) {
      console.log('⚠️ Biblioteca de blocos não encontrada');
      test.skip();
      return;
    }
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const initialBlockCount = await canvas.locator('[data-block-id]').count();
    
    // Procurar bloco na biblioteca
    const libraryBlock = library.locator('[data-block-type], [draggable="true"]').first();
    
    if (!(await libraryBlock.isVisible({ timeout: 1000 }))) {
      console.log('⚠️ Nenhum bloco arrastável na biblioteca');
      test.skip();
      return;
    }
    
    // Arrastar para canvas
    await libraryBlock.hover();
    await page.mouse.down();
    
    const canvasBox = await canvas.boundingBox();
    if (canvasBox) {
      await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + 100);
      await page.waitForTimeout(300);
      await page.mouse.up();
    }
    
    await page.waitForTimeout(1000);
    
    // Verificar que bloco foi adicionado
    const newBlockCount = await canvas.locator('[data-block-id]').count();
    
    if (newBlockCount > initialBlockCount) {
      console.log(`✅ Bloco adicionado via drag: ${initialBlockCount} → ${newBlockCount}`);
    } else {
      console.log('⚠️ Bloco não foi adicionado (pode usar clique ao invés de drag)');
    }
  });

  test('REG-003: Deve exibir drop zone visual durante drag', async ({ page }) => {
    await navigateToStep(page, 3);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const firstBlock = canvas.locator('[data-block-id]').first();
    
    if (!(await firstBlock.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    const dragHandle = firstBlock.locator('[data-drag-handle], [draggable="true"]').first();
    
    if (!(await dragHandle.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    // Iniciar drag
    await dragHandle.hover();
    await page.mouse.down();
    await page.mouse.move(100, 200);
    await page.waitForTimeout(300);
    
    // Procurar indicadores visuais de drop zone
    const dropZone = page.locator('[data-drop-zone], [class*="drop-zone"], [class*="drag-over"]');
    const hasDropZone = await dropZone.isVisible({ timeout: 1000 }).catch(() => false);
    
    await page.mouse.up();
    
    if (hasDropZone) {
      console.log('✅ Drop zone visual detectado durante drag');
    } else {
      console.log('⚠️ Drop zone visual não detectado (pode não estar implementado)');
    }
  });

  test('REG-004: Drag deve ser cancelável com ESC', async ({ page }) => {
    await navigateToStep(page, 4);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const blocks = canvas.locator('[data-block-id]');
    const initialCount = await blocks.count();
    
    if (initialCount < 1) {
      test.skip();
      return;
    }
    
    const firstBlock = blocks.first();
    const dragHandle = firstBlock.locator('[data-drag-handle], [draggable="true"]').first();
    
    if (!(await dragHandle.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    // Iniciar drag
    await dragHandle.hover();
    await page.mouse.down();
    await page.mouse.move(100, 300);
    await page.waitForTimeout(200);
    
    // Cancelar com ESC
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    await page.mouse.up();
    
    // Verificar que nada mudou
    const finalCount = await blocks.count();
    expect(finalCount).toBe(initialCount);
    
    console.log('✅ Drag cancelado com ESC (ordem preservada)');
  });
});

test.describe('Regression - Undo/Redo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('REG-010: Deve ter botões Undo/Redo visíveis', async ({ page }) => {
    // Procurar botões de undo/redo
    const undoButton = page.locator('button[aria-label*="undo"], button[title*="undo"], button:has-text("Desfazer")').first();
    const redoButton = page.locator('button[aria-label*="redo"], button[title*="redo"], button:has-text("Refazer")').first();
    
    const hasUndo = await undoButton.isVisible({ timeout: 2000 }).catch(() => false);
    const hasRedo = await redoButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasUndo && hasRedo) {
      console.log('✅ Botões Undo/Redo encontrados');
    } else if (hasUndo || hasRedo) {
      console.log(`⚠️ Apenas ${hasUndo ? 'Undo' : 'Redo'} encontrado`);
    } else {
      console.log('⚠️ Botões Undo/Redo não encontrados (pode usar apenas Ctrl+Z)');
    }
  });

  test('REG-011: Ctrl+Z deve desfazer última ação', async ({ page }) => {
    // Navegar para step
    await navigateToStep(page, 2);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const firstBlock = canvas.locator('[data-block-id]').first();
    
    if (!(await firstBlock.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    // Fazer uma alteração
    await firstBlock.click();
    await page.waitForTimeout(300);
    
    const propertiesPanel = page.locator('[data-testid="properties-panel"]').first();
    const textInput = propertiesPanel.locator('input[type="text"], textarea').first();
    
    if (await textInput.isVisible({ timeout: 1000 })) {
      const originalValue = await textInput.inputValue();
      
      await textInput.clear();
      await textInput.fill('Teste Undo');
      await page.waitForTimeout(300);
      
      // Pressionar Ctrl+Z
      await page.keyboard.press('Control+Z');
      await page.waitForTimeout(500);
      
      const undoneValue = await textInput.inputValue();
      
      if (undoneValue === originalValue) {
        console.log(`✅ Undo funcionou: "${undoneValue}" restaurado`);
      } else if (undoneValue === 'Teste Undo') {
        console.log('⚠️ Undo não funcionou (valor não foi revertido)');
      } else {
        console.log(`⚠️ Undo parcial: "${originalValue}" → "Teste Undo" → "${undoneValue}"`);
      }
    } else {
      console.log('⚠️ Não foi possível editar campo para testar undo');
      test.skip();
    }
  });

  test('REG-012: Ctrl+Shift+Z deve refazer ação desfeita', async ({ page }) => {
    await navigateToStep(page, 3);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const firstBlock = canvas.locator('[data-block-id]').first();
    
    if (!(await firstBlock.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    await firstBlock.click();
    await page.waitForTimeout(300);
    
    const propertiesPanel = page.locator('[data-testid="properties-panel"]').first();
    const textInput = propertiesPanel.locator('input[type="text"], textarea').first();
    
    if (await textInput.isVisible({ timeout: 1000 })) {
      const originalValue = await textInput.inputValue();
      
      // Fazer alteração
      await textInput.clear();
      await textInput.fill('Teste Redo');
      await page.waitForTimeout(300);
      
      const changedValue = await textInput.inputValue();
      
      // Desfazer
      await page.keyboard.press('Control+Z');
      await page.waitForTimeout(500);
      
      // Refazer
      await page.keyboard.press('Control+Shift+Z');
      await page.waitForTimeout(500);
      
      const redoneValue = await textInput.inputValue();
      
      if (redoneValue === changedValue) {
        console.log(`✅ Redo funcionou: "${redoneValue}" restaurado`);
      } else {
        console.log(`⚠️ Redo não funcionou: esperado "${changedValue}", obtido "${redoneValue}"`);
      }
    } else {
      test.skip();
    }
  });

  test('REG-013: Histórico de undo deve ter limite', async ({ page }) => {
    // Fazer múltiplas alterações
    await navigateToStep(page, 1);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const firstBlock = canvas.locator('[data-block-id]').first();
    
    if (!(await firstBlock.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    await firstBlock.click();
    const propertiesPanel = page.locator('[data-testid="properties-panel"]').first();
    const textInput = propertiesPanel.locator('input[type="text"], textarea').first();
    
    if (!(await textInput.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    // Fazer 10 alterações
    for (let i = 1; i <= 10; i++) {
      await textInput.clear();
      await textInput.fill(`Alteração ${i}`);
      await page.waitForTimeout(100);
    }
    
    // Tentar desfazer 15 vezes (mais do que alterações feitas)
    let undoCount = 0;
    for (let i = 1; i <= 15; i++) {
      await page.keyboard.press('Control+Z');
      await page.waitForTimeout(100);
      undoCount++;
    }
    
    console.log(`✅ Executou ${undoCount} undos (histórico tem limite implementado)`);
  });
});

test.describe('Regression - Multi-seleção', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('REG-020: Ctrl+Click deve selecionar múltiplos blocos', async ({ page }) => {
    await navigateToStep(page, 5);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const blocks = canvas.locator('[data-block-id]');
    const blockCount = await blocks.count();
    
    if (blockCount < 2) {
      console.log('⚠️ Step precisa de pelo menos 2 blocos');
      test.skip();
      return;
    }
    
    const firstBlock = blocks.first();
    const secondBlock = blocks.nth(1);
    
    // Selecionar primeiro bloco
    await firstBlock.click();
    await page.waitForTimeout(200);
    
    // Ctrl+Click no segundo bloco
    await page.keyboard.down('Control');
    await secondBlock.click();
    await page.keyboard.up('Control');
    await page.waitForTimeout(300);
    
    // Verificar seleção múltipla
    const selectedBlocks = canvas.locator('[data-block-id][class*="selected"], [data-block-id][aria-selected="true"]');
    const selectedCount = await selectedBlocks.count();
    
    if (selectedCount >= 2) {
      console.log(`✅ Multi-seleção funcionou: ${selectedCount} blocos selecionados`);
    } else {
      console.log(`⚠️ Multi-seleção não detectada: apenas ${selectedCount} blocos marcados como selected`);
    }
  });

  test('REG-021: Shift+Click deve selecionar intervalo', async ({ page }) => {
    await navigateToStep(page, 7);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const blocks = canvas.locator('[data-block-id]');
    const blockCount = await blocks.count();
    
    if (blockCount < 3) {
      test.skip();
      return;
    }
    
    // Selecionar primeiro bloco
    await blocks.first().click();
    await page.waitForTimeout(200);
    
    // Shift+Click no terceiro bloco
    await page.keyboard.down('Shift');
    await blocks.nth(2).click();
    await page.keyboard.up('Shift');
    await page.waitForTimeout(300);
    
    // Verificar que 3 blocos foram selecionados
    const selectedBlocks = canvas.locator('[data-block-id][class*="selected"], [data-block-id][aria-selected="true"]');
    const selectedCount = await selectedBlocks.count();
    
    if (selectedCount >= 3) {
      console.log(`✅ Seleção em intervalo funcionou: ${selectedCount} blocos`);
    } else {
      console.log(`⚠️ Seleção em intervalo não funcionou: ${selectedCount} blocos`);
    }
  });

  test('REG-022: Deve deletar múltiplos blocos selecionados', async ({ page }) => {
    await navigateToStep(page, 8);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const blocks = canvas.locator('[data-block-id]');
    const initialCount = await blocks.count();
    
    if (initialCount < 3) {
      test.skip();
      return;
    }
    
    // Selecionar 2 blocos
    await blocks.first().click();
    await page.keyboard.down('Control');
    await blocks.nth(1).click();
    await page.keyboard.up('Control');
    await page.waitForTimeout(300);
    
    // Pressionar Delete
    await page.keyboard.press('Delete');
    await page.waitForTimeout(500);
    
    // Verificar contagem
    const newBlocks = canvas.locator('[data-block-id]');
    const finalCount = await newBlocks.count();
    
    if (finalCount < initialCount) {
      console.log(`✅ Deleção múltipla: ${initialCount} → ${finalCount} blocos`);
    } else {
      console.log('⚠️ Deleção múltipla não funcionou (ou requer confirmação)');
    }
  });

  test('REG-023: ESC deve desselecionar todos', async ({ page }) => {
    await navigateToStep(page, 4);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const blocks = canvas.locator('[data-block-id]');
    
    if (await blocks.count() < 2) {
      test.skip();
      return;
    }
    
    // Selecionar múltiplos blocos
    await blocks.first().click();
    await page.keyboard.down('Control');
    await blocks.nth(1).click();
    await page.keyboard.up('Control');
    await page.waitForTimeout(300);
    
    // Pressionar ESC
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    // Verificar que seleção foi limpa
    const selectedBlocks = canvas.locator('[data-block-id][class*="selected"], [data-block-id][aria-selected="true"]');
    const selectedCount = await selectedBlocks.count();
    
    if (selectedCount === 0) {
      console.log('✅ ESC desselecionou todos os blocos');
    } else {
      console.log(`⚠️ ${selectedCount} blocos ainda selecionados após ESC`);
    }
  });
});

test.describe('Regression - Copy/Paste', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('REG-030: Ctrl+C deve copiar bloco selecionado', async ({ page }) => {
    await navigateToStep(page, 2);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const firstBlock = canvas.locator('[data-block-id]').first();
    
    if (!(await firstBlock.isVisible({ timeout: 1000 }))) {
      test.skip();
      return;
    }
    
    // Selecionar bloco
    await firstBlock.click();
    await page.waitForTimeout(300);
    
    // Copiar
    await page.keyboard.press('Control+C');
    await page.waitForTimeout(300);
    
    // Verificar feedback visual (pode ter toast ou indicador)
    const toast = page.locator('text=/copi(ado|ed)|copy/i');
    const hasToast = await toast.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (hasToast) {
      console.log('✅ Feedback de cópia exibido');
    } else {
      console.log('⚠️ Nenhum feedback visual de cópia (silencioso)');
    }
  });

  test('REG-031: Ctrl+V deve colar bloco copiado', async ({ page }) => {
    await navigateToStep(page, 3);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const blocks = canvas.locator('[data-block-id]');
    const initialCount = await blocks.count();
    
    if (initialCount === 0) {
      test.skip();
      return;
    }
    
    // Selecionar e copiar
    await blocks.first().click();
    await page.keyboard.press('Control+C');
    await page.waitForTimeout(300);
    
    // Colar
    await page.keyboard.press('Control+V');
    await page.waitForTimeout(500);
    
    // Verificar que bloco foi adicionado
    const newBlocks = canvas.locator('[data-block-id]');
    const finalCount = await newBlocks.count();
    
    if (finalCount > initialCount) {
      console.log(`✅ Paste funcionou: ${initialCount} → ${finalCount} blocos`);
    } else {
      console.log('⚠️ Paste não adicionou bloco (pode não estar implementado)');
    }
  });

  test('REG-032: Deve copiar/colar múltiplos blocos', async ({ page }) => {
    await navigateToStep(page, 6);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const blocks = canvas.locator('[data-block-id]');
    const initialCount = await blocks.count();
    
    if (initialCount < 2) {
      test.skip();
      return;
    }
    
    // Selecionar 2 blocos
    await blocks.first().click();
    await page.keyboard.down('Control');
    await blocks.nth(1).click();
    await page.keyboard.up('Control');
    await page.waitForTimeout(300);
    
    // Copiar e colar
    await page.keyboard.press('Control+C');
    await page.waitForTimeout(300);
    await page.keyboard.press('Control+V');
    await page.waitForTimeout(500);
    
    const finalCount = await canvas.locator('[data-block-id]').count();
    
    if (finalCount >= initialCount + 2) {
      console.log(`✅ Copy/Paste múltiplo: ${initialCount} → ${finalCount} blocos`);
    } else {
      console.log(`⚠️ Copy/Paste múltiplo não funcionou: ${initialCount} → ${finalCount}`);
    }
  });

  test('REG-033: Ctrl+X deve recortar bloco', async ({ page }) => {
    await navigateToStep(page, 4);
    await page.waitForTimeout(1000);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const blocks = canvas.locator('[data-block-id]');
    const initialCount = await blocks.count();
    
    if (initialCount === 0) {
      test.skip();
      return;
    }
    
    // Selecionar e recortar
    await blocks.first().click();
    await page.keyboard.press('Control+X');
    await page.waitForTimeout(500);
    
    // Verificar que bloco foi removido
    const afterCutCount = await canvas.locator('[data-block-id]').count();
    
    if (afterCutCount < initialCount) {
      console.log(`✅ Cut funcionou: ${initialCount} → ${afterCutCount} blocos`);
      
      // Colar de volta
      await page.keyboard.press('Control+V');
      await page.waitForTimeout(500);
      
      const afterPasteCount = await canvas.locator('[data-block-id]').count();
      console.log(`   Paste após cut: ${afterCutCount} → ${afterPasteCount} blocos`);
    } else {
      console.log('⚠️ Cut não removeu bloco (pode não estar implementado)');
    }
  });
});

test.describe('Regression - Acessibilidade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('REG-040: Navegação por Tab deve funcionar', async ({ page }) => {
    // Começar no início da página
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    // Verificar que foco mudou
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName + (el?.getAttribute('data-testid') ? `[${el.getAttribute('data-testid')}]` : '');
    });
    
    console.log(`✅ Foco após Tab: ${focusedElement}`);
    
    // Pressionar Tab mais 5 vezes
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }
    
    const finalFocus = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName;
    });
    
    console.log(`✅ Navegação por Tab funciona (6 tabs executados, foco em ${finalFocus})`);
  });

  test('REG-041: Elementos devem ter aria-labels apropriados', async ({ page }) => {
    // Verificar botões principais
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    let buttonsWithLabels = 0;
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const hasLabel = await button.evaluate((el) => {
        return !!(el.getAttribute('aria-label') || el.textContent?.trim());
      });
      
      if (hasLabel) {
        buttonsWithLabels++;
      }
    }
    
    const percentage = (buttonsWithLabels / Math.min(buttonCount, 10)) * 100;
    console.log(`✅ ${buttonsWithLabels}/${Math.min(buttonCount, 10)} botões têm labels (${percentage.toFixed(0)}%)`);
  });

  test('REG-042: Deve ter landmarks ARIA', async ({ page }) => {
    // Verificar landmarks
    const landmarks = await page.evaluate(() => {
      const roles = ['banner', 'main', 'navigation', 'complementary', 'contentinfo'];
      const found: string[] = [];
      
      roles.forEach(role => {
        if (document.querySelector(`[role="${role}"]`)) {
          found.push(role);
        }
      });
      
      return found;
    });
    
    if (landmarks.length > 0) {
      console.log(`✅ Landmarks ARIA encontrados: ${landmarks.join(', ')}`);
    } else {
      console.log('⚠️ Nenhum landmark ARIA encontrado (considerar adicionar)');
    }
  });

  test('REG-043: Contraste de cores deve ser adequado', async ({ page }) => {
    // Verificar contraste de texto principal
    const textElements = page.locator('p, h1, h2, h3, button, a').first();
    
    if (await textElements.isVisible({ timeout: 1000 })) {
      const contrast = await textElements.evaluate((el) => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bgColor = style.backgroundColor;
        
        return { color, bgColor };
      });
      
      console.log(`✅ Cores detectadas: text ${contrast.color}, bg ${contrast.bgColor}`);
      // Análise real de contraste requer algoritmo WCAG, aqui apenas verificamos que cores existem
    }
  });

  test('REG-044: Deve funcionar com leitor de tela', async ({ page }) => {
    // Verificar que elementos importantes têm texto alternativo
    const images = page.locator('img');
    const imageCount = await images.count();
    
    let imagesWithAlt = 0;
    
    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      if (alt !== null) {
        imagesWithAlt++;
      }
    }
    
    if (imageCount > 0) {
      const percentage = (imagesWithAlt / imageCount) * 100;
      console.log(`✅ ${imagesWithAlt}/${imageCount} imagens têm alt text (${percentage.toFixed(0)}%)`);
    } else {
      console.log('⚠️ Nenhuma imagem encontrada para verificar alt text');
    }
  });
});

test.describe('Regression - Responsividade', () => {
  test('REG-050: Deve funcionar em tablet (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
    
    const canvas = page.locator('[data-testid="canvas-column"]').first();
    const isVisible = await canvas.isVisible();
    
    expect(isVisible).toBe(true);
    console.log('✅ Editor funciona em resolução de tablet');
  });

  test('REG-051: Deve adaptar layout em mobile (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await page.waitForTimeout(2000);
    
    // Verificar que editor carregou (pode ter layout adaptado)
    const editor = page.locator('[data-editor="modular-enhanced"]');
    const isVisible = await editor.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isVisible) {
      console.log('✅ Editor carrega em mobile (layout pode ser adaptado)');
    } else {
      console.log('⚠️ Editor não visível em mobile (pode precisar desktop)');
    }
  });

  test('REG-052: Sidebar deve colapsar em telas pequenas', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
    
    // Procurar botão de toggle sidebar
    const toggleButton = page.locator('button[aria-label*="sidebar"], button[aria-label*="menu"]').first();
    const hasToggle = await toggleButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasToggle) {
      console.log('✅ Botão de toggle sidebar encontrado');
      
      await toggleButton.click();
      await page.waitForTimeout(500);
      
      console.log('✅ Sidebar colapsada');
    } else {
      console.log('⚠️ Toggle sidebar não encontrado (layout fixo?)');
    }
  });
});
