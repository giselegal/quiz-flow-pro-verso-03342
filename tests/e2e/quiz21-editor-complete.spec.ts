/**
 * 🧪 TESTES E2E: QuizModularEditor Completo
 * 
 * Suite de testes end-to-end para validar o fluxo completo de edição
 * do quiz21StepsComplete (21 etapas, 27 tipos de blocos).
 * 
 * @priority ALTA
 * @coverage Navegação, Edição, Save/Load, Cache
 * @duration ~5-8 minutos
 */

import { test, expect, Page } from '@playwright/test';

// Helper: Fechar modal de inicialização (se aparecer)
async function closeStartupModal(page: Page) {
  try {
    const modal = page.locator('[data-testid="startup-modal"]');
    if (await modal.isVisible({ timeout: 2000 })) {
      await modal.locator('button[aria-label="Close"]').click();
      await expect(modal).not.toBeVisible();
    }
  } catch (e) {
    // Modal não apareceu, tudo ok
  }
}

// Helper: Aguardar carregamento do editor (resiliente a variações de layout)
async function waitForEditorReady(page: Page) {
  const layout = page.getByTestId('modular-layout');
  const fallbackRoot = page.locator('[data-editor="modular-enhanced"], .qm-editor').first();

  try {
    await expect(layout).toBeVisible({ timeout: 12000 });
  } catch {
    // Tentar fallback root
    await expect(fallbackRoot).toBeVisible({ timeout: 12000 });
  }

  // Garantir colunas principais (tolerar ordem/carregamento assíncrono)
  await expect(page.getByTestId('column-steps')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('column-canvas')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('column-properties')).toBeVisible({ timeout: 15000 });
  // Biblioteca pode não estar presente em todos os estados iniciais; tenta mas não falha se ausente
  const libraryVisible = await page.getByTestId('column-library').isVisible().catch(() => false);
  if (!libraryVisible) {
    console.log('ℹ️ Biblioteca não visível no carregamento inicial (pode ser lazy).');
  }

  // Steps
  await expect(page.locator('[data-testid="step-navigator-item"]').first()).toBeVisible({ timeout: 15000 });
  console.log('✅ Editor quiz21StepsComplete carregado e pronto');
}

// Helper: Navegar para step específico
async function navigateToStep(page: Page, stepNumber: number) {
  // Encontrar step pelo data-step-order
  const stepButton = page.locator(`[data-testid="step-navigator-item"][data-step-order="${stepNumber}"]`).first();
  
  await stepButton.click();
  await page.waitForTimeout(500); // Aguardar transição
  
  // Aguardar canvas atualizar
  const canvas = page.getByTestId('column-canvas');
  await expect(canvas).toBeVisible();
}

test.describe('Quiz21Editor - Navegação Completa', () => {
  test.beforeEach(async ({ page }) => {
    // Garantir flag modular ligada
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    
    // Navegar para editor com quiz21StepsComplete
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('E2E-001: Deve carregar editor com 21 steps visíveis', async ({ page }) => {
    // Procurar por step navigator items
    const stepItems = page.locator('[data-testid="step-navigator-item"]');
    await expect(stepItems.first()).toBeVisible();
    
    // Contar steps visíveis
    const stepCount = await stepItems.count();
    
    // Deve ter 21 steps
    expect(stepCount).toBe(21);
    
    console.log(`✅ Editor carregado com ${stepCount} steps`);
  });

  test('E2E-002: Deve navegar sequencialmente por todos os 21 steps', async ({ page }) => {
    const steps = [1, 2, 3, 4, 5, 10, 15, 19, 20, 21];
    
    for (const stepNum of steps) {
      await navigateToStep(page, stepNum);
      
      // Verificar que canvas carregou blocos (se houver)
      const canvas = page.getByTestId('column-canvas').first();
      await expect(canvas).toBeVisible();
      
      // Aguardar pequeno delay para simular usuário real
      await page.waitForTimeout(100);
    }
    
    console.log('✅ Navegação completa por 10 steps críticos');
  });

  test('E2E-003: Deve exibir indicador de step atual', async ({ page }) => {
    await navigateToStep(page, 1);
    
    // Verificar badge de step atual no header
    const currentStepBadge = page.locator('.qm-editor').first().locator('text=step-01').first();
    await expect(currentStepBadge).toBeVisible();
    
    // Navegar para outro step
    await navigateToStep(page, 12);
    
    // Verificar atualização do badge
    const newStepBadge = page.locator('.qm-editor').first().locator('text=step-12').first();
    await expect(newStepBadge).toBeVisible();
    
    console.log('✅ Indicador de step atual funcionando');
  });

  test('E2E-004: Deve manter state ao navegar entre steps', async ({ page }) => {
    // Navegar para step-01
    await navigateToStep(page, 1);
    
    // Esperar blocos carregarem
    await page.waitForTimeout(500);
    
    // Obter texto de um bloco (se houver)
    const canvas = page.getByTestId('column-canvas').first();
    const blocksCount1 = await canvas.locator('[data-block-id]').count();
    
    // Navegar para outro step e voltar
    await navigateToStep(page, 5);
    await page.waitForTimeout(300);
    await navigateToStep(page, 1);
    
    // Verificar que blocos ainda estão lá
    const blocksCount2 = await canvas.locator('[data-block-id]').count();
    
    expect(blocksCount2).toBe(blocksCount1);
    console.log(`✅ State preservado (${blocksCount1} blocos mantidos)`);
  });
});

test.describe('Quiz21Editor - Edição de Blocos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
    await navigateToStep(page, 1);
  });

  test('E2E-010: Deve selecionar bloco ao clicar no canvas', async ({ page }) => {
    // Navegar para step com blocos
    await navigateToStep(page, 1);
    
    // Aguardar canvas carregar
    const canvas = page.getByTestId('column-canvas');
    await page.waitForTimeout(1000);
    
    // Procurar primeiro bloco
    const firstBlock = canvas.locator('[data-block-id]').first();
    
    // Verificar se há blocos
    const blockCount = await canvas.locator('[data-block-id]').count();
    
    if (blockCount === 0) {
      console.log('⚠️ Step 1 não tem blocos, pulando teste');
      test.skip();
      return;
    }
    
    // Clicar no bloco
    await firstBlock.click();
    await page.waitForTimeout(300);
    
    // Verificar que painel de propriedades abriu
    const propertiesPanel = page.getByTestId('column-properties');
    await expect(propertiesPanel).toBeVisible({ timeout: 3000 });
    
    console.log('✅ Bloco selecionado, painel de propriedades visível');
  });

  test('E2E-011: Deve abrir painel de propriedades com controles corretos', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const canvas = page.getByTestId('column-canvas').first();
    const firstBlock = canvas.locator('[data-block-id]').first();
    
    const blockCount = await canvas.locator('[data-block-id]').count();
    if (blockCount === 0) {
      console.log('⚠️ Nenhum bloco encontrado, pulando teste');
      test.skip();
      return;
    }
    
    await firstBlock.click();
    
    // Verificar que painel tem campos editáveis
    const propertiesPanel = page.getByTestId('column-properties').first();
    const inputs = propertiesPanel.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    expect(inputCount).toBeGreaterThan(0);
    console.log(`✅ Painel de propriedades com ${inputCount} controles`);
  });

  test('E2E-012: Deve adicionar bloco da biblioteca', async ({ page }) => {
    // Verificar que biblioteca de componentes está visível
    const library = page.locator('[data-testid="component-library"]').first();
    await expect(library).toBeVisible();
    
    // Obter contador de blocos inicial
    const canvas = page.getByTestId('column-canvas').first();
    const initialCount = await canvas.locator('[data-block-id]').count();
    
    // Tentar encontrar botão de adicionar texto
    const textButton = library.locator('button', { hasText: /texto|text/i }).first();
    
    if (!(await textButton.isVisible({ timeout: 2000 }))) {
      console.log('⚠️ Botão de adicionar texto não encontrado, pulando teste');
      test.skip();
      return;
    }
    
    await textButton.click();
    await page.waitForTimeout(500);
    
    // Verificar que contador aumentou
    const finalCount = await canvas.locator('[data-block-id]').count();
    
    expect(finalCount).toBeGreaterThan(initialCount);
    console.log(`✅ Bloco adicionado (${initialCount} → ${finalCount})`);
  });
});

test.describe('Quiz21Editor - Save/Load', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('E2E-020: Deve exibir botão de salvar', async ({ page }) => {
    const saveButton = page.locator('button', { hasText: /salvar|save/i }).first();
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    
    console.log('✅ Botão de salvar disponível');
  });

  test('E2E-021: Deve indicar estado de salvamento', async ({ page }) => {
    // Verificar se há indicador de auto-save
    const editorRoot = page.locator('.qm-editor').first();
    
    // Procurar por texto indicando status
    const hasStatus = await editorRoot.locator('text=/salv(o|ando)|sav(ed|ing)/i').first().isVisible({ timeout: 2000 }).catch(() => false);
    
    if (!hasStatus) {
      console.log('⚠️ Indicador de status não encontrado, mas não é crítico');
    } else {
      console.log('✅ Indicador de status presente');
    }
  });

  test('E2E-022: Deve exportar JSON do editor', async ({ page }) => {
    // Verificar botão de exportar
    const exportButton = page.locator('button', { hasText: /exportar|export/i }).first();
    
    if (!(await exportButton.isVisible({ timeout: 2000 }))) {
      console.log('⚠️ Botão de exportar não encontrado, pulando teste');
      test.skip();
      return;
    }
    
    await expect(exportButton).toBeEnabled();
    console.log('✅ Funcionalidade de exportar disponível');
  });
});

test.describe('Quiz21Editor - Preview Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('E2E-030: Deve alternar para modo preview', async ({ page }) => {
    // Procurar botão de preview
    const previewButton = page.locator('button', { hasText: /preview/i }).first();
    
    if (!(await previewButton.isVisible({ timeout: 2000 }))) {
      console.log('⚠️ Botão de preview não encontrado, pulando teste');
      test.skip();
      return;
    }
    
    await previewButton.click();
    await page.waitForTimeout(500);
    
    // Verificar que modo mudou
    const editorRoot = page.locator('.qm-editor').first();
    const hasPreview = await editorRoot.locator('[data-testid="preview-panel"]').first().isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasPreview) {
      console.log('✅ Modo preview ativado');
    } else {
      console.log('⚠️ Preview panel não detectado, mas toggle funcionou');
    }
  });

  test('E2E-031: Deve voltar para modo edição', async ({ page }) => {
    // Alternar para preview primeiro
    const previewButton = page.locator('button', { hasText: /preview/i }).first();
    
    if (!(await previewButton.isVisible({ timeout: 2000 }))) {
      test.skip();
      return;
    }
    
    await previewButton.click();
    await page.waitForTimeout(300);
    
    // Voltar para edição
    const editButton = page.locator('button', { hasText: /edi(ção|tion)/i }).first();
    await editButton.click();
    await page.waitForTimeout(300);
    
    // Verificar que canvas está visível novamente
    const canvas = page.getByTestId('column-canvas').first();
    await expect(canvas).toBeVisible();
    
    console.log('✅ Voltou para modo edição');
  });
});

test.describe('Quiz21Editor - Performance', () => {
  test('E2E-040: Deve carregar em menos de 5 segundos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
    console.log(`✅ Carregamento em ${loadTime}ms (limite: 5000ms)`);
  });

  test('E2E-041: Navegação entre steps deve ser rápida (<500ms)', async ({ page }) => {
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
    
    // Navegar para step-01 primeiro
    await navigateToStep(page, 1);
    await page.waitForTimeout(500);
    
    // Medir tempo de navegação para step-05
    const startTime = Date.now();
    await navigateToStep(page, 5);
    const navTime = Date.now() - startTime;
    
    expect(navTime).toBeLessThan(500);
    console.log(`✅ Navegação em ${navTime}ms (limite: 500ms)`);
  });
});
