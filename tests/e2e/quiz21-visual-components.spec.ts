/**
 * 🎨 TESTES DE REGRESSÃO VISUAL: Componentes Individuais
 * 
 * Testa componentes específicos do quiz isoladamente
 * para detectar regressões em elementos individuais
 */

import { test, expect, Page } from '@playwright/test';

const VIEWPORT = { width: 1280, height: 720 };
const PIXEL_THRESHOLD = 0.15;

test.describe('Quiz 21 Steps - Visual Regression (Componentes)', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage({ viewport: VIEWPORT });
    await page.goto('/editor?template=quiz21StepsComplete&mode=preview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Componente: Barra de Progresso', async () => {
    console.log('📊 Testando visual da barra de progresso...');

    // Completar intro
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Progress Test');
    const startButton = page.locator('button').first();
    await startButton.click();
    await page.waitForTimeout(1500);

    // Localizar barra de progresso
    const progressBar = page.locator('[role="progressbar"], [class*="progress"]').first();
    
    if (await progressBar.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(progressBar).toHaveScreenshot('components/progress-bar.png', {
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });
      console.log('✅ Barra de progresso capturada');
    } else {
      console.log('ℹ️  Barra de progresso não encontrada');
    }
  });

  test('Componente: Opções de Quiz (Options Grid)', async () => {
    console.log('🎯 Testando visual das opções do quiz...');

    // Navegar até step com opções
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Options Test');
    const startButton = page.locator('button').first();
    await startButton.click();
    await page.waitForTimeout(1500);

    // Localizar grid de opções
    const optionsGrid = page.locator('[class*="options"], [class*="grid"]').first();
    
    if (await optionsGrid.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(optionsGrid).toHaveScreenshot('components/options-grid.png', {
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });
      console.log('✅ Options grid capturado');
    }
  });

  test('Componente: Opção Individual (Não Selecionada)', async () => {
    console.log('🔘 Testando visual de opção não selecionada...');

    // Navegar até step com opções
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Option Test');
    const startButton = page.locator('button').first();
    await startButton.click();
    await page.waitForTimeout(1500);

    // Localizar primeira opção
    const option = page.locator('button[class*="option"]').first();
    
    if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(option).toHaveScreenshot('components/option-unselected.png', {
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });
      console.log('✅ Opção não selecionada capturada');
    }
  });

  test('Componente: Opção Individual (Selecionada)', async () => {
    console.log('✅ Testando visual de opção selecionada...');

    // Navegar até step com opções
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Selected Test');
    const startButton = page.locator('button').first();
    await startButton.click();
    await page.waitForTimeout(1500);

    // Selecionar primeira opção
    const option = page.locator('button[class*="option"]').first();
    
    if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
      await option.click();
      await page.waitForTimeout(500);

      await expect(option).toHaveScreenshot('components/option-selected.png', {
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });
      console.log('✅ Opção selecionada capturada');
    }
  });

  test('Componente: Botões de Navegação', async () => {
    console.log('🔀 Testando visual dos botões de navegação...');

    // Navegar até step com navegação
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Nav Test');
    const startButton = page.locator('button').first();
    await startButton.click();
    await page.waitForTimeout(1500);

    // Localizar botões de navegação
    const navButtons = page.locator('[class*="navigation"]').first();
    
    if (await navButtons.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(navButtons).toHaveScreenshot('components/navigation-buttons.png', {
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });
      console.log('✅ Botões de navegação capturados');
    }
  });

  test('Componente: Título de Pergunta', async () => {
    console.log('📝 Testando visual do título de pergunta...');

    // Navegar até step de pergunta
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Question Test');
    const startButton = page.locator('button').first();
    await startButton.click();
    await page.waitForTimeout(1500);

    // Localizar título da pergunta
    const questionTitle = page.locator('h1, h2, h3').first();
    
    if (await questionTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(questionTitle).toHaveScreenshot('components/question-title.png', {
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });
      console.log('✅ Título de pergunta capturado');
    }
  });

  test('Componente: Loading Spinner (se disponível)', async () => {
    console.log('⏳ Testando visual do loading spinner...');

    // Tentar capturar loading state
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Loading Test');
    const startButton = page.locator('button').first();
    
    // Clicar e imediatamente procurar loading
    await startButton.click();
    
    const loadingSpinner = page.locator('[class*="loading"], [class*="spinner"], .animate-spin').first();
    
    if (await loadingSpinner.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(loadingSpinner).toHaveScreenshot('components/loading-spinner.png', {
        threshold: PIXEL_THRESHOLD,
      });
      console.log('✅ Loading spinner capturado');
    } else {
      console.log('ℹ️  Loading spinner não encontrado (transição pode ser muito rápida)');
    }
  });

  test('Componente: Card de Resultado', async () => {
    console.log('🎉 Testando visual do card de resultado...');

    // Navegar até resultado (simplificado - apenas preencher dados)
    await completeQuizQuickly(page);

    // Aguardar página de resultado
    await page.waitForTimeout(3000);

    // Localizar card de resultado
    const resultCard = page.locator('[class*="result"]').first();
    
    if (await resultCard.isVisible({ timeout: 10000 }).catch(() => false)) {
      await expect(resultCard).toHaveScreenshot('components/result-card.png', {
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });
      console.log('✅ Card de resultado capturado');
    }
  });

  test('Componente: Lista de Benefícios (Offer)', async () => {
    console.log('💎 Testando visual da lista de benefícios...');

    // Navegar até oferta
    await completeQuizQuickly(page);
    await page.waitForTimeout(3000);

    // Clicar em ver oferta
    const viewOfferBtn = page.locator('button').filter({
      hasText: /ver oferta|continuar/i,
    }).first();
    
    if (await viewOfferBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await viewOfferBtn.click();
      await page.waitForTimeout(2000);
    }

    // Localizar lista de benefícios
    const benefitsList = page.locator('ul, [class*="benefit"]').first();
    
    if (await benefitsList.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(benefitsList).toHaveScreenshot('components/benefits-list.png', {
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });
      console.log('✅ Lista de benefícios capturada');
    }
  });

  test('Componente: CTA Button (Offer)', async () => {
    console.log('🎯 Testando visual do CTA button...');

    // Navegar até oferta
    await completeQuizQuickly(page);
    await page.waitForTimeout(3000);

    const viewOfferBtn = page.locator('button').filter({
      hasText: /ver oferta|continuar/i,
    }).first();
    
    if (await viewOfferBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await viewOfferBtn.click();
      await page.waitForTimeout(2000);
    }

    // Localizar CTA principal
    const ctaButton = page.locator('button').filter({
      hasText: /quero|comprar|adquirir/i,
    }).first();
    
    if (await ctaButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(ctaButton).toHaveScreenshot('components/cta-button.png', {
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });
      console.log('✅ CTA button capturado');
    }
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function completeQuizQuickly(page: Page) {
  // Preencher nome
  const nameInput = page.locator('input[type="text"]').first();
  await nameInput.fill('Quick Test User');
  const startButton = page.locator('button').first();
  await startButton.click();
  await page.waitForTimeout(1000);

  // Completar steps rapidamente (selecionando primeira opção sempre)
  for (let i = 0; i < 20; i++) {
    const option = page.locator('button[class*="option"], [role="button"]').first();
    
    if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
      await option.click();
      await page.waitForTimeout(300);
      
      // Se multi-select, selecionar mais 2
      for (let j = 1; j < 3; j++) {
        const nextOption = page.locator('button[class*="option"]').nth(j);
        if (await nextOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await nextOption.click();
          await page.waitForTimeout(200);
        }
      }
    }
    
    await page.waitForTimeout(1500);

    // Clicar em continuar se houver
    const continueBtn = page.locator('button').filter({
      hasText: /continuar|próximo/i,
    }).first();
    
    if (await continueBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await continueBtn.click();
      await page.waitForTimeout(500);
    }
  }
}
