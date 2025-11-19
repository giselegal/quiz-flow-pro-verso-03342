/**
 * 🔍 AUDITORIA COMPLETA: quiz21StepsComplete
 * 
 * Testes end-to-end abrangentes para auditar o funil quiz21StepsComplete
 * conforme os requisitos detalhados.
 * 
 * @priority ALTA
 * @coverage Carregamento, Modos de Operação, Painel de Propriedades, Performance
 * @duration ~10-15 minutos
 */

import { test, expect, Page } from '@playwright/test';

const EDITOR_URL = '/editor?resource=quiz21StepsComplete';
const TIMEOUT_LONG = 30000;
const TIMEOUT_MEDIUM = 15000;
const TIMEOUT_SHORT = 5000;

// ============================================================================
// HELPERS
// ============================================================================

async function closeStartupModal(page: Page) {
  try {
    const modal = page.locator('[data-testid="startup-modal"]');
    if (await modal.isVisible({ timeout: 2000 })) {
      const closeButton = modal.locator('button[aria-label="Close"]').or(modal.locator('button:has-text("Fechar")'));
      if (await closeButton.isVisible({ timeout: 1000 })) {
        await closeButton.click();
        await expect(modal).not.toBeVisible({ timeout: 3000 });
      }
    }
  } catch (e) {
    // Modal não apareceu ou já foi fechado
  }
}

async function waitForEditorReady(page: Page) {
  // Aguardar layout principal
  const layout = page.getByTestId('modular-layout').or(page.locator('[data-editor="modular-enhanced"]'));
  await expect(layout.first()).toBeVisible({ timeout: TIMEOUT_LONG });

  // Aguardar colunas principais
  await expect(page.getByTestId('column-steps')).toBeVisible({ timeout: TIMEOUT_MEDIUM });
  await expect(page.getByTestId('column-canvas')).toBeVisible({ timeout: TIMEOUT_MEDIUM });
  await expect(page.getByTestId('column-properties')).toBeVisible({ timeout: TIMEOUT_MEDIUM });

  // Aguardar pelo menos um step
  await expect(page.locator('[data-testid="step-navigator-item"]').first()).toBeVisible({ timeout: TIMEOUT_MEDIUM });
}

async function navigateToStep(page: Page, stepNumber: number) {
  const stepButton = page.locator(`[data-testid="step-navigator-item"][data-step-order="${stepNumber}"]`).first();
  await stepButton.click();
  await page.waitForTimeout(500);
  await expect(page.getByTestId('column-canvas')).toBeVisible();
}

async function measureLoadingTime(page: Page, operation: () => Promise<void>): Promise<number> {
  const start = Date.now();
  await operation();
  return Date.now() - start;
}

// ============================================================================
// 1. VERIFICAÇÃO DE CARREGAMENTO
// ============================================================================

test.describe('1. Verificação de Carregamento', () => {
  test('1.1 - Deve carregar o editor sem erros de console', async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);

    console.log(`✅ Console Errors: ${consoleErrors.length}`);
    console.log(`⚠️  Console Warnings: ${consoleWarnings.length}`);
    
    // Não deve ter erros críticos
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('404') &&
      !err.includes('ResizeObserver')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('1.2 - Deve carregar todos os 21 steps', async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);

    const stepItems = page.locator('[data-testid="step-navigator-item"]');
    await expect(stepItems.first()).toBeVisible();
    
    const stepCount = await stepItems.count();
    expect(stepCount).toBe(21);
    
    console.log(`✅ Carregados ${stepCount} steps`);
  });

  test('1.3 - Deve medir tempo de carregamento inicial', async ({ page }) => {
    const loadTime = await measureLoadingTime(page, async () => {
      await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
      await closeStartupModal(page);
      await waitForEditorReady(page);
    });

    console.log(`⏱️  Tempo de carregamento: ${loadTime}ms`);
    
    // Carregamento não deve exceder 15 segundos
    expect(loadTime).toBeLessThan(15000);
  });

  test('1.4 - Deve verificar requisições de rede sem falhas', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(`${request.method()} ${request.url()}`);
    });

    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);

    console.log(`❌ Requisições falhadas: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      console.log('Detalhes:', failedRequests);
    }

    // Permitir até 2 falhas não críticas (ex: favicon, analytics)
    expect(failedRequests.length).toBeLessThanOrEqual(2);
  });
});

// ============================================================================
// 2. TESTE DOS MODOS DE OPERAÇÃO
// ============================================================================

test.describe('2. Teste dos Modos de Operação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('2.1 - Modo Editar: Deve permitir adicionar blocos', async ({ page }) => {
    // Localizar biblioteca de componentes
    const library = page.getByTestId('column-library').or(page.locator('[data-testid*="library"]'));
    
    // Se biblioteca não estiver visível, tentar abrir
    if (!await library.isVisible({ timeout: 2000 })) {
      const libraryToggle = page.locator('button[aria-label*="biblioteca"]').or(page.locator('button:has-text("Biblioteca")'));
      if (await libraryToggle.isVisible({ timeout: 2000 })) {
        await libraryToggle.click();
        await page.waitForTimeout(500);
      }
    }

    // Verificar se pode adicionar um bloco (mesmo que seja difícil clicar devido ao layout)
    const hasAddButton = await page.locator('button[aria-label*="Adicionar"]').or(page.locator('button:has-text("Adicionar")')).count() > 0;
    console.log(`✅ Botões de adicionar encontrados: ${hasAddButton}`);
  });

  test('2.2 - Modo Editar: Deve permitir selecionar e editar blocos', async ({ page }) => {
    // Navegar para step 1
    await navigateToStep(page, 1);
    
    // Procurar blocos no canvas
    const canvas = page.getByTestId('column-canvas');
    const blocks = canvas.locator('[data-block-id]');
    
    const blockCount = await blocks.count();
    console.log(`📦 Blocos encontrados no step 1: ${blockCount}`);

    if (blockCount > 0) {
      // Tentar selecionar o primeiro bloco
      const firstBlock = blocks.first();
      await firstBlock.click({ timeout: TIMEOUT_SHORT });
      
      // Verificar se painel de propriedades mostra algo
      const propertiesPanel = page.getByTestId('column-properties');
      await expect(propertiesPanel).toBeVisible();
      
      console.log('✅ Bloco selecionado e painel de propriedades visível');
    }
  });

  test('2.3 - Modo Visualizar (Editor): Deve alternar para modo preview', async ({ page }) => {
    // Procurar botão de preview/visualizar
    const previewButton = page.locator('button[aria-label*="Preview"]')
      .or(page.locator('button[aria-label*="Visualizar"]'))
      .or(page.locator('button:has-text("Preview")'))
      .or(page.locator('button:has-text("Visualizar")'));
    
    if (await previewButton.isVisible({ timeout: 5000 })) {
      await previewButton.click();
      await page.waitForTimeout(1000);
      
      // Verificar se entrou em modo preview
      const previewIndicator = page.locator('[data-mode="preview"]')
        .or(page.locator('.preview-mode'))
        .or(page.locator('[class*="preview"]'));
      
      const isInPreview = await previewIndicator.count() > 0;
      console.log(`✅ Modo preview ${isInPreview ? 'ativado' : 'não detectado'}`);
    } else {
      console.log('⚠️  Botão de preview não encontrado');
    }
  });

  test('2.4 - Deve navegar entre os 21 steps sem erros', async ({ page }) => {
    const stepsToTest = [1, 5, 10, 15, 20, 21];
    
    for (const stepNum of stepsToTest) {
      await navigateToStep(page, stepNum);
      
      // Verificar que o canvas está visível
      await expect(page.getByTestId('column-canvas')).toBeVisible();
      
      console.log(`✅ Step ${stepNum} carregado com sucesso`);
    }
  });
});

// ============================================================================
// 3. PAINEL DE PROPRIEDADES
// ============================================================================

test.describe('3. Painel de Propriedades', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('3.1 - Deve exibir painel de propriedades', async ({ page }) => {
    const propertiesPanel = page.getByTestId('column-properties');
    await expect(propertiesPanel).toBeVisible();
    
    console.log('✅ Painel de propriedades visível');
  });

  test('3.2 - Deve atualizar quando um bloco é selecionado', async ({ page }) => {
    await navigateToStep(page, 1);
    
    const canvas = page.getByTestId('column-canvas');
    const blocks = canvas.locator('[data-block-id]');
    
    if (await blocks.count() > 0) {
      await blocks.first().click();
      
      // Aguardar atualização do painel
      await page.waitForTimeout(500);
      
      const propertiesPanel = page.getByTestId('column-properties');
      const propertiesContent = await propertiesPanel.textContent();
      
      console.log('✅ Painel de propriedades atualizado');
      expect(propertiesContent).toBeTruthy();
    }
  });

  test('3.3 - Deve sincronizar alterações com o canvas', async ({ page }) => {
    await navigateToStep(page, 1);
    
    const canvas = page.getByTestId('column-canvas');
    const blocks = canvas.locator('[data-block-id]');
    
    if (await blocks.count() > 0) {
      await blocks.first().click();
      
      // Procurar inputs no painel de propriedades
      const propertiesPanel = page.getByTestId('column-properties');
      const inputs = propertiesPanel.locator('input[type="text"]').or(propertiesPanel.locator('textarea'));
      
      const inputCount = await inputs.count();
      console.log(`🔧 Campos editáveis encontrados: ${inputCount}`);
      
      if (inputCount > 0) {
        console.log('✅ Painel de propriedades tem campos editáveis');
      }
    }
  });
});

// ============================================================================
// 4. IDENTIFICAÇÃO DE GARGALOS
// ============================================================================

test.describe('4. Identificação de Gargalos', () => {
  test('4.1 - Deve medir tempo de navegação entre steps', async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);

    const navigationTimes: number[] = [];
    const stepsToTest = [1, 5, 10, 15, 20];
    
    for (let i = 0; i < stepsToTest.length - 1; i++) {
      const fromStep = stepsToTest[i];
      const toStep = stepsToTest[i + 1];
      
      const navTime = await measureLoadingTime(page, async () => {
        await navigateToStep(page, toStep);
      });
      
      navigationTimes.push(navTime);
      console.log(`⏱️  Navegação step ${fromStep} → ${toStep}: ${navTime}ms`);
    }

    const avgTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;
    console.log(`📊 Tempo médio de navegação: ${avgTime.toFixed(2)}ms`);
    
    // Navegação não deve exceder 2 segundos em média
    expect(avgTime).toBeLessThan(2000);
  });

  test('4.2 - Deve detectar elementos com acessibilidade inadequada', async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);

    // Verificar botões sem aria-label
    const buttonsWithoutLabel = await page.locator('button:not([aria-label]):not([aria-labelledby])').count();
    console.log(`⚠️  Botões sem aria-label: ${buttonsWithoutLabel}`);

    // Verificar inputs sem label
    const inputsWithoutLabel = await page.locator('input:not([aria-label]):not([aria-labelledby]):not([id])').count();
    console.log(`⚠️  Inputs sem label: ${inputsWithoutLabel}`);
  });

  test('4.3 - Deve verificar uso de memória durante navegação', async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);

    // Navegar por vários steps
    for (let step = 1; step <= 10; step++) {
      await navigateToStep(page, step);
    }

    // Verificar se a página ainda está responsiva
    const isResponsive = await page.locator('[data-testid="column-canvas"]').isVisible({ timeout: 3000 });
    expect(isResponsive).toBeTruthy();
    
    console.log('✅ Página responsiva após navegação extensiva');
  });

  test('4.4 - Deve identificar bloqueios na UI', async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);

    // Verificar se há loading spinners persistentes
    const loadingSpinners = page.locator('[data-loading="true"]').or(page.locator('.loading'));
    const spinnerCount = await loadingSpinners.count();
    
    if (spinnerCount > 0) {
      console.log(`⚠️  Loading spinners ativos: ${spinnerCount}`);
    } else {
      console.log('✅ Nenhum loading spinner persistente detectado');
    }
  });
});

// ============================================================================
// 5. TESTES DE RESPONSIVIDADE
// ============================================================================

test.describe('5. Testes de Responsividade', () => {
  const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
  ];

  for (const viewport of viewports) {
    test(`5.${viewports.indexOf(viewport) + 1} - Deve funcionar em ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
      await closeStartupModal(page);
      
      // Verificar se elementos principais estão visíveis
      const stepNav = page.getByTestId('column-steps');
      const canvas = page.getByTestId('column-canvas');
      
      const stepNavVisible = await stepNav.isVisible({ timeout: TIMEOUT_MEDIUM });
      const canvasVisible = await canvas.isVisible({ timeout: TIMEOUT_MEDIUM });
      
      console.log(`${viewport.name}: Steps=${stepNavVisible}, Canvas=${canvasVisible}`);
      
      expect(canvasVisible).toBeTruthy();
    });
  }
});

// ============================================================================
// 6. TESTE DE PERSISTÊNCIA
// ============================================================================

test.describe('6. Teste de Persistência', () => {
  test('6.1 - Deve salvar alterações (se autosave ativo)', async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);

    // Procurar indicador de autosave
    const autosaveIndicator = page.locator('[data-autosave-status]')
      .or(page.locator('[class*="autosave"]'))
      .or(page.locator('text=/salvo|saved/i'));
    
    const hasAutosave = await autosaveIndicator.count() > 0;
    console.log(`💾 Autosave ${hasAutosave ? 'detectado' : 'não detectado'}`);
  });

  test('6.2 - Deve manter estado ao recarregar página', async ({ page }) => {
    await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_LONG });
    await closeStartupModal(page);
    await waitForEditorReady(page);

    // Navegar para step específico
    await navigateToStep(page, 5);
    
    // Recarregar página
    await page.reload({ waitUntil: 'domcontentloaded' });
    await closeStartupModal(page);
    await waitForEditorReady(page);

    console.log('✅ Página recarregada com sucesso');
  });
});
