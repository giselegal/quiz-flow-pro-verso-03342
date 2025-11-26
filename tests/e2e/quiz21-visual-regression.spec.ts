/**
 * 🎨 TESTES DE REGRESSÃO VISUAL: Quiz 21 Steps
 * 
 * Captura screenshots de cada step e compara com baseline
 * para detectar mudanças não intencionais na UI
 * 
 * IMPORTANTE:
 * - Primeira execução: cria screenshots baseline
 * - Execuções seguintes: compara com baseline
 * - Para atualizar baseline: npm run test:e2e:update-snapshots
 */

import { test, expect, Page } from '@playwright/test';

// Configuração de viewport consistente para screenshots
const VIEWPORT = { width: 1280, height: 720 };

// Threshold de diferença aceitável (0-1, onde 0 = idêntico, 1 = completamente diferente)
const PIXEL_THRESHOLD = 0.2; // 20% de diferença é aceitável

// Configuração de timeout para steps lentos
test.setTimeout(240000); // 4 minutos

test.describe('Quiz 21 Steps - Visual Regression Testing', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage({ viewport: VIEWPORT });
    
    // Navegar para preview do editor
    await page.goto('/editor?funnel=quiz21StepsComplete&mode=preview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Aguardar animações iniciais
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Step 01 (Intro) - Visual Snapshot', async () => {
    console.log('📸 Capturando snapshot do Step 01 (Intro)...');

    // Aguardar carregamento completo
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Capturar screenshot da página inteira
    await expect(page).toHaveScreenshot('step-01-intro-full.png', {
      fullPage: true,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled', // Desabilitar animações para consistência
    });

    // Capturar apenas viewport visível
    await expect(page).toHaveScreenshot('step-01-intro-viewport.png', {
      fullPage: false,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    console.log('✅ Step 01: Snapshots capturados');
  });

  test('Steps 02-11 (Questions) - Visual Snapshots', async () => {
    console.log('📸 Capturando snapshots dos Steps 02-11 (Questions)...');

    // Completar intro
    await fillIntroAndStart(page);

    // Capturar cada step de pergunta
    for (let stepNum = 2; stepNum <= 11; stepNum++) {
      const stepId = String(stepNum).padStart(2, '0');
      console.log(`  📸 Capturando Step ${stepId}...`);

      // Aguardar carregamento do step
      await page.waitForTimeout(1500);
      
      // Aguardar elementos principais
      await page.waitForSelector('button[class*="option"], [role="button"]', {
        timeout: 10000,
      }).catch(() => {
        console.warn(`  ⚠️ Opções não encontradas no Step ${stepId}`);
      });

      // Capturar screenshot full page
      await expect(page).toHaveScreenshot(`step-${stepId}-question-full.png`, {
        fullPage: true,
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });

      // Capturar apenas viewport
      await expect(page).toHaveScreenshot(`step-${stepId}-question-viewport.png`, {
        fullPage: false,
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });

      console.log(`  ✅ Step ${stepId}: Snapshots capturados`);

      // Avançar para próximo step
      if (stepNum < 11) {
        await selectOptionsAndAdvance(page, 3);
      }
    }

    console.log('✅ Steps 02-11: Todos os snapshots capturados');
  });

  test('Step 12 (Transition) - Visual Snapshot', async () => {
    console.log('📸 Capturando snapshot do Step 12 (Transition)...');

    // Completar intro e steps 2-11
    await completeSteps(page, 1, 11);

    // Aguardar carregamento do step de transição
    await page.waitForTimeout(2000);

    // Capturar screenshot
    await expect(page).toHaveScreenshot('step-12-transition-full.png', {
      fullPage: true,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    await expect(page).toHaveScreenshot('step-12-transition-viewport.png', {
      fullPage: false,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    console.log('✅ Step 12: Snapshots capturados');
  });

  test('Steps 13-18 (Strategic Questions) - Visual Snapshots', async () => {
    console.log('📸 Capturando snapshots dos Steps 13-18 (Strategic)...');

    // Completar até step 12
    await completeSteps(page, 1, 12);

    // Capturar cada step estratégico
    for (let stepNum = 13; stepNum <= 18; stepNum++) {
      const stepId = String(stepNum).padStart(2, '0');
      console.log(`  📸 Capturando Step ${stepId}...`);

      await page.waitForTimeout(1500);

      // Capturar screenshots
      await expect(page).toHaveScreenshot(`step-${stepId}-strategic-full.png`, {
        fullPage: true,
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });

      await expect(page).toHaveScreenshot(`step-${stepId}-strategic-viewport.png`, {
        fullPage: false,
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
      });

      console.log(`  ✅ Step ${stepId}: Snapshots capturados`);

      // Avançar para próximo step
      if (stepNum < 18) {
        await selectOptionsAndAdvance(page, 1);
      }
    }

    console.log('✅ Steps 13-18: Todos os snapshots capturados');
  });

  test('Step 19 (Transition Result) - Visual Snapshot', async () => {
    console.log('📸 Capturando snapshot do Step 19 (Transition Result)...');

    // Completar até step 18
    await completeSteps(page, 1, 18);

    await page.waitForTimeout(2000);

    // Capturar screenshot
    await expect(page).toHaveScreenshot('step-19-transition-result-full.png', {
      fullPage: true,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    await expect(page).toHaveScreenshot('step-19-transition-result-viewport.png', {
      fullPage: false,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    console.log('✅ Step 19: Snapshots capturados');
  });

  test('Step 20 (Result) - Visual Snapshot', async () => {
    console.log('📸 Capturando snapshot do Step 20 (Result)...');

    // Completar até step 19
    await completeSteps(page, 1, 19);

    await page.waitForTimeout(2500);

    // Aguardar elementos do resultado
    await page.waitForSelector('h1, h2', { timeout: 15000 }).catch(() => {
      console.warn('  ⚠️ Título do resultado não encontrado');
    });

    // Capturar screenshot
    await expect(page).toHaveScreenshot('step-20-result-full.png', {
      fullPage: true,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    await expect(page).toHaveScreenshot('step-20-result-viewport.png', {
      fullPage: false,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    console.log('✅ Step 20: Snapshots capturados');
  });

  test('Step 21 (Offer) - Visual Snapshot', async () => {
    console.log('📸 Capturando snapshot do Step 21 (Offer)...');

    // Completar até step 20
    await completeSteps(page, 1, 20);

    // Clicar em "Ver oferta" ou avançar
    const viewOfferButton = page.locator('button').filter({
      hasText: /ver oferta|continuar|próximo/i,
    }).first();

    if (await viewOfferButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await viewOfferButton.click();
      await page.waitForTimeout(2000);
    } else {
      await page.waitForTimeout(3000);
    }

    // Capturar screenshot
    await expect(page).toHaveScreenshot('step-21-offer-full.png', {
      fullPage: true,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    await expect(page).toHaveScreenshot('step-21-offer-viewport.png', {
      fullPage: false,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    console.log('✅ Step 21: Snapshots capturados');
  });

  test('Todos os Steps - Comparativo Completo', async () => {
    console.log('📸 Capturando snapshots de TODOS os 21 steps...');
    console.log('⚠️  Este teste demora ~4 minutos para completar');

    const totalSteps = 21;

    for (let stepNum = 1; stepNum <= totalSteps; stepNum++) {
      const stepId = String(stepNum).padStart(2, '0');
      console.log(`  📸 [${stepNum}/${totalSteps}] Capturando Step ${stepId}...`);

      // Aguardar carregamento
      await page.waitForTimeout(1500);

      // Determinar tipo do step
      let stepType = 'unknown';
      if (stepNum === 1) stepType = 'intro';
      else if (stepNum >= 2 && stepNum <= 11) stepType = 'question';
      else if (stepNum === 12) stepType = 'transition';
      else if (stepNum >= 13 && stepNum <= 18) stepType = 'strategic';
      else if (stepNum === 19) stepType = 'transition-result';
      else if (stepNum === 20) stepType = 'result';
      else if (stepNum === 21) stepType = 'offer';

      // Capturar screenshot viewport
      await expect(page).toHaveScreenshot(`all-steps/step-${stepId}-${stepType}.png`, {
        fullPage: false,
        threshold: PIXEL_THRESHOLD,
        animations: 'disabled',
        maxDiffPixels: 100, // Permitir até 100 pixels diferentes
      });

      console.log(`  ✅ Step ${stepId} capturado`);

      // Avançar para próximo step
      if (stepNum < totalSteps) {
        if (stepNum === 1) {
          await fillIntroAndStart(page);
        } else if (stepNum >= 2 && stepNum <= 11) {
          await selectOptionsAndAdvance(page, 3);
        } else if (stepNum === 12 || stepNum === 19) {
          // Transições - aguardar auto-advance ou clicar continuar
          const continueBtn = page.locator('button').filter({
            hasText: /continuar|próximo/i,
          }).first();
          if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await continueBtn.click();
            await page.waitForTimeout(1000);
          } else {
            await page.waitForTimeout(2000);
          }
        } else if (stepNum >= 13 && stepNum <= 18) {
          await selectOptionsAndAdvance(page, 1);
        } else if (stepNum === 20) {
          const viewOfferBtn = page.locator('button').filter({
            hasText: /ver oferta|continuar/i,
          }).first();
          if (await viewOfferBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await viewOfferBtn.click();
            await page.waitForTimeout(1500);
          }
        }
      }
    }

    console.log('✅ Todos os 21 steps capturados com sucesso!');
    console.log('📊 Total de screenshots: 21');
  });
});

test.describe('Quiz 21 Steps - Visual Regression (Mobile)', () => {
  let page: Page;

  const MOBILE_VIEWPORT = { width: 375, height: 667 };

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage({ viewport: MOBILE_VIEWPORT });
    
    await page.goto('/editor?funnel=quiz21StepsComplete&mode=preview');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Step 01 (Intro) - Mobile Visual Snapshot', async () => {
    console.log('📱 Capturando snapshot mobile do Step 01...');

    await page.waitForSelector('h1, h2', { timeout: 10000 });
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('mobile/step-01-intro-mobile.png', {
      fullPage: true,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    console.log('✅ Step 01 Mobile: Snapshot capturado');
  });

  test('Sample Steps - Mobile Visual Snapshots', async () => {
    console.log('📱 Capturando snapshots mobile de steps selecionados...');

    // Step 01 (Intro)
    await expect(page).toHaveScreenshot('mobile/step-01-mobile.png', {
      fullPage: false,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    await fillIntroAndStart(page);

    // Step 02 (Question)
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('mobile/step-02-mobile.png', {
      fullPage: false,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    // Avançar para step 12 (Transition)
    for (let i = 2; i <= 11; i++) {
      await selectOptionsAndAdvance(page, 3);
    }

    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('mobile/step-12-mobile.png', {
      fullPage: false,
      threshold: PIXEL_THRESHOLD,
      animations: 'disabled',
    });

    console.log('✅ Snapshots mobile capturados');
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function fillIntroAndStart(page: Page) {
  const nameInput = page.locator('input[type="text"]').first();
  await nameInput.fill('Visual Test User');
  
  const startButton = page.locator('button').filter({
    hasText: /começar|iniciar|start/i,
  }).first();
  await startButton.click();
  
  await page.waitForTimeout(1500);
}

async function selectOptionsAndAdvance(page: Page, count: number) {
  const options = page.locator('button[class*="option"], [role="button"]:not([disabled])');
  
  // Aguardar opções estarem disponíveis
  await page.waitForTimeout(500);
  
  const availableCount = await options.count();
  const selectCount = Math.min(count, availableCount);
  
  for (let i = 0; i < selectCount; i++) {
    const option = options.nth(i);
    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
      await option.click();
      await page.waitForTimeout(400);
    }
  }
  
  // Aguardar auto-advance ou clicar em próximo
  await page.waitForTimeout(1500);
  
  const nextButton = page.locator('button').filter({
    hasText: /próximo|next|continuar/i,
  }).first();
  
  if (await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
    await nextButton.click();
    await page.waitForTimeout(500);
  }
}

async function completeSteps(page: Page, fromStep: number, toStep: number) {
  console.log(`  ⏩ Completando steps ${fromStep}-${toStep}...`);

  for (let stepNum = fromStep; stepNum <= toStep; stepNum++) {
    if (stepNum === 1) {
      await fillIntroAndStart(page);
    } else if (stepNum >= 2 && stepNum <= 11) {
      await selectOptionsAndAdvance(page, 3);
    } else if (stepNum === 12 || stepNum === 19) {
      // Transições
      await page.waitForTimeout(2000);
      const continueBtn = page.locator('button').filter({
        hasText: /continuar|próximo/i,
      }).first();
      if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await continueBtn.click();
        await page.waitForTimeout(1000);
      }
    } else if (stepNum >= 13 && stepNum <= 18) {
      await selectOptionsAndAdvance(page, 1);
    } else if (stepNum === 20) {
      await page.waitForTimeout(2000);
    }
  }

  console.log(`  ✅ Steps ${fromStep}-${toStep} completados`);
}
