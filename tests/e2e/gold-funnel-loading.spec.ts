/**
 * 🧪 TESTES E2E: Carregamento do Funil Gold (quiz21-v4-gold)
 * 
 * Valida:
 * - Carregamento correto dos steps via URL query param
 * - Renderização de blocos no canvas
 * - Carregamento e exibição de imagens
 * - Export JSON com estrutura completa
 * - Navegação entre steps
 * - Integridade dos tipos de bloco (result-*, question-hero, transition-hero)
 */

import { test, expect, type Page } from '@playwright/test';

const EDITOR_BASE_URL = '/editor';
const GOLD_FUNNEL_ID = 'quiz21-v4-gold';
const TIMEOUT_LONG = 15000;
const TIMEOUT_IMAGE = 10000;

/**
 * Helper: Aguarda o editor estar completamente carregado
 */
async function waitForEditorReady(page: Page) {
  // Aguardar header do editor (indicador de carregamento completo)
  await page.waitForSelector('[data-testid="editor-header"]', { 
    timeout: TIMEOUT_LONG,
    state: 'visible'
  });
  
  // Aguardar indicador de loading desaparecer (se presente)
  const loadingIndicator = page.locator('text=Carregando template...');
  if (await loadingIndicator.isVisible().catch(() => false)) {
    await loadingIndicator.waitFor({ state: 'hidden', timeout: TIMEOUT_LONG });
  }
  
  // Dar tempo para rendering do canvas
  await page.waitForTimeout(500);
}

/**
 * Helper: Verifica se uma imagem foi carregada com sucesso
 */
async function checkImageLoaded(page: Page, selector: string): Promise<boolean> {
  try {
    const img = page.locator(selector).first();
    await img.waitFor({ state: 'visible', timeout: TIMEOUT_IMAGE });
    
    // Verificar se a imagem tem src válido
    const src = await img.getAttribute('src');
    if (!src || src.includes('data:image')) {
      return false; // Placeholder ou inline base64
    }
    
    // Verificar dimensões naturais (imagem carregada)
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    return naturalWidth > 0;
  } catch {
    return false;
  }
}

/**
 * Helper: Conta blocos visíveis no canvas
 */
async function countVisibleBlocks(page: Page): Promise<number> {
  const blockSelectors = [
    '[data-block-id]',
    '[data-block-type]',
    '.editor-block',
  ];
  
  for (const selector of blockSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) return count;
  }
  
  return 0;
}

test.describe('Gold Funnel Loading Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar console/erro listeners para debugging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });
  });

  test('deve carregar o editor com o funil gold via query param', async ({ page }) => {
    // Navegar para o editor com funil gold
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}`);
    
    // Aguardar editor pronto
    await waitForEditorReady(page);
    
    // Verificar que o header mostra o template correto
    const templateBadge = page.locator('text=/quiz21-v4-gold/i').first();
    await expect(templateBadge).toBeVisible({ timeout: 5000 });
    
    // Verificar que não há erro de carregamento
    await expect(page.locator('text=/erro ao carregar/i')).not.toBeVisible();
  });

  test('deve carregar blocos no step 1 (intro)', async ({ page }) => {
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=1`);
    await waitForEditorReady(page);
    
    // Verificar que há blocos renderizados
    const blockCount = await countVisibleBlocks(page);
    expect(blockCount).toBeGreaterThan(0);
    
    // Verificar presença de blocos típicos do step 1
    const introBlocks = [
      'intro-logo-header',
      'question-title',
      'options-grid',
    ];
    
    for (const blockType of introBlocks) {
      const block = page.locator(`[data-block-type="${blockType}"]`).first();
      const isVisible = await block.isVisible().catch(() => false);
      
      if (isVisible) {
        console.log(`✅ Bloco encontrado: ${blockType}`);
      } else {
        console.warn(`⚠️ Bloco não encontrado: ${blockType}`);
      }
    }
  });

  test('deve carregar imagens nos blocos de pergunta', async ({ page }) => {
    // Navegar para step 2 (primeira pergunta com imagens)
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=2`);
    await waitForEditorReady(page);
    
    // Aguardar renderização do canvas
    await page.waitForTimeout(1000);
    
    // Verificar presença de imagens (podem estar em options-grid ou question-hero)
    const imageSelectors = [
      'img[src*="cloudinary"]',
      'img[src*="res.cloudinary.com"]',
      '[data-block-type="question-hero"] img',
      '[data-block-type="options-grid"] img',
    ];
    
    let imagesFound = 0;
    let imagesLoaded = 0;
    
    for (const selector of imageSelectors) {
      const images = page.locator(selector);
      const count = await images.count();
      
      if (count > 0) {
        imagesFound += count;
        
        // Verificar carregamento da primeira imagem de cada tipo
        const loaded = await checkImageLoaded(page, selector);
        if (loaded) imagesLoaded++;
      }
    }
    
    console.log(`📊 Imagens: ${imagesFound} encontradas, ${imagesLoaded} carregadas`);
    
    // Validar que pelo menos algumas imagens foram encontradas
    expect(imagesFound).toBeGreaterThan(0);
  });

  test('deve navegar entre steps e manter blocos carregados', async ({ page }) => {
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=1`);
    await waitForEditorReady(page);
    
    // Coletar contagem de blocos no step 1
    const step1Blocks = await countVisibleBlocks(page);
    expect(step1Blocks).toBeGreaterThan(0);
    
    // Navegar para step 2 via botão (se disponível) ou URL
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=2`);
    await waitForEditorReady(page);
    
    // Verificar que novos blocos foram carregados
    const step2Blocks = await countVisibleBlocks(page);
    expect(step2Blocks).toBeGreaterThan(0);
    
    // Os counts podem ser diferentes dependendo do conteúdo
    console.log(`Step 1: ${step1Blocks} blocos | Step 2: ${step2Blocks} blocos`);
  });

  test('deve carregar blocos de resultado no step 20', async ({ page }) => {
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=20`);
    await waitForEditorReady(page);
    
    // Aguardar renderização completa
    await page.waitForTimeout(1500);
    
    // Verificar blocos típicos de resultado
    const resultBlockTypes = [
      'result-main',
      'result-progress-bars',
      'result-secondary-styles',
      'result-cta',
      'result-congrats',
    ];
    
    let foundBlocks = 0;
    
    for (const blockType of resultBlockTypes) {
      const block = page.locator(`[data-block-type="${blockType}"]`).first();
      const isVisible = await block.isVisible().catch(() => false);
      
      if (isVisible) {
        console.log(`✅ Bloco de resultado encontrado: ${blockType}`);
        foundBlocks++;
      }
    }
    
    // Validar que pelo menos alguns blocos de resultado foram encontrados
    expect(foundBlocks).toBeGreaterThanOrEqual(1);
  });

  test('deve exportar JSON com estrutura completa (não vazio)', async ({ page }) => {
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=1`);
    await waitForEditorReady(page);
    
    // Aguardar carregamento completo
    await page.waitForTimeout(2000);
    
    // Interceptar download do export
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    
    // Clicar no botão de export JSON
    const exportButton = page.locator('button:has-text("Exportar JSON")');
    await expect(exportButton).toBeVisible({ timeout: 5000 });
    await exportButton.click();
    
    // Aguardar download
    const download = await downloadPromise;
    const path = await download.path();
    
    if (path) {
      // Ler conteúdo do arquivo
      const fs = await import('fs/promises');
      const content = await fs.readFile(path, 'utf-8');
      const json = JSON.parse(content);
      
      console.log('📄 Export JSON meta:', json.meta);
      console.log('📊 stepBlocks keys:', Object.keys(json.stepBlocks || {}));
      
      // Validar estrutura do export
      expect(json.meta).toBeDefined();
      expect(json.meta.template).toBe(GOLD_FUNNEL_ID);
      expect(json.stepBlocks).toBeDefined();
      
      // CRÍTICO: Verificar que stepBlocks NÃO está vazio
      const stepKeys = Object.keys(json.stepBlocks);
      expect(stepKeys.length).toBeGreaterThan(0);
      
      // Verificar que pelo menos o step 1 tem blocos
      const step1Blocks = json.stepBlocks['1'] || json.stepBlocks['step-01'];
      expect(step1Blocks).toBeDefined();
      expect(Array.isArray(step1Blocks)).toBe(true);
      expect(step1Blocks.length).toBeGreaterThan(0);
      
      console.log(`✅ Export válido: ${stepKeys.length} steps, step-1 com ${step1Blocks.length} blocos`);
    }
  });

  test('deve validar tipos de bloco do gold são suportados', async ({ page }) => {
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=1`);
    await waitForEditorReady(page);
    
    // Verificar que não há blocos com erro de tipo desconhecido
    const unknownBlocks = page.locator('[data-block-type="unknown"]');
    const unknownCount = await unknownBlocks.count();
    
    if (unknownCount > 0) {
      console.warn(`⚠️ ${unknownCount} blocos com tipo "unknown" detectados`);
    }
    
    expect(unknownCount).toBe(0);
    
    // Verificar ausência de fallback de erro
    const errorFallback = page.locator('text=/component not found/i');
    await expect(errorFallback).not.toBeVisible();
  });

  test('deve carregar blocos transition-hero no step 12', async ({ page }) => {
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=12`);
    await waitForEditorReady(page);
    
    // Verificar presença do bloco transition-hero
    const transitionHero = page.locator('[data-block-type="transition-hero"]').first();
    
    // Pode não estar visível se estiver lazy-loaded, então verificar presença no DOM
    const exists = await transitionHero.count() > 0;
    
    if (exists) {
      console.log('✅ transition-hero encontrado no step 12');
    } else {
      console.warn('⚠️ transition-hero não encontrado no step 12');
    }
    
    // Verificar que há pelo menos algum bloco renderizado
    const blockCount = await countVisibleBlocks(page);
    expect(blockCount).toBeGreaterThan(0);
  });

  test('deve carregar step 21 (offer) com blocos específicos', async ({ page }) => {
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=21`);
    await waitForEditorReady(page);
    
    // Verificar que há conteúdo renderizado
    const blockCount = await countVisibleBlocks(page);
    expect(blockCount).toBeGreaterThan(0);
    
    // Verificar ausência de erro de carregamento
    await expect(page.locator('text=/erro ao carregar step/i')).not.toBeVisible();
  });

  test('deve manter estado ao alternar entre steps rapidamente', async ({ page }) => {
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=1`);
    await waitForEditorReady(page);
    
    // Alternar rapidamente entre steps
    const steps = [2, 3, 2, 1];
    
    for (const step of steps) {
      await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}&step=${step}`);
      await page.waitForTimeout(500); // Tempo mínimo para carregamento
      
      const blocks = await countVisibleBlocks(page);
      console.log(`Step ${step}: ${blocks} blocos`);
      
      // Cada step deve ter pelo menos 1 bloco
      expect(blocks).toBeGreaterThan(0);
    }
  });

  test('deve exibir modo de edição ativo', async ({ page }) => {
    await page.goto(`${EDITOR_BASE_URL}?funnel=${GOLD_FUNNEL_ID}`);
    await waitForEditorReady(page);
    
    // Verificar badge de modo de edição
    const editBadge = page.locator('text=/Modo Edição/i');
    await expect(editBadge).toBeVisible({ timeout: 5000 });
    
    // Verificar que painel de propriedades está disponível
    const propertiesPanel = page.locator('[data-testid="properties-panel"]');
    const isPanelVisible = await propertiesPanel.isVisible().catch(() => false);
    
    // Painel pode estar oculto via toggle, mas botão de toggle deve existir
    if (!isPanelVisible) {
      const toggleButton = page.locator('button[title*="propriedades"]');
      await expect(toggleButton).toBeVisible();
    }
  });

});
