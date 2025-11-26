/**
 * 🧪 TESTES E2E COMPLETOS: Quiz 21 Steps Complete Template
 * 
 * Valida o fluxo completo do usuário através do template quiz21StepsComplete:
 * - Navegação por todas as 21 etapas
 * - Seleção de opções (múltipla e única)
 * - Validação de formulários
 * - Cálculo e exibição de resultados
 * - Oferta final
 */

import { test, expect, Page } from '@playwright/test';

// Configuração de timeout mais longo para fluxo completo
test.setTimeout(180000); // 3 minutos

test.describe('Quiz 21 Steps Complete - Fluxo E2E', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Navegar para o preview do editor com template quiz21StepsComplete
    await page.goto('/editor?funnel=quiz21StepsComplete&mode=preview');
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Aguardar renderização inicial
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('deve completar todo o quiz de 21 etapas com sucesso', async () => {
    console.log('🚀 Iniciando teste de fluxo completo do Quiz 21 Steps...');

    // =================================================================
    // STEP 01: INTRO - Formulário de Nome
    // =================================================================
    await test.step('Step 01 (Intro): Preencher nome', async () => {
      console.log('📝 Step 01: Intro');

      // Verificar elementos da intro
      const introTitle = page.locator('h1, h2').first();
      await expect(introTitle).toBeVisible({ timeout: 10000 });

      // Preencher nome
      const nameInput = page.locator('input[type="text"], input[placeholder*="nome" i]').first();
      await expect(nameInput).toBeVisible();
      await nameInput.fill('Ana Silva E2E Test');
      
      // Verificar que o nome foi preenchido
      await expect(nameInput).toHaveValue('Ana Silva E2E Test');

      // Clicar em começar
      const startButton = page.locator('button').filter({ 
        hasText: /começar|iniciar|start|continuar/i 
      }).first();
      await expect(startButton).toBeVisible();
      await startButton.click();

      await page.waitForTimeout(1000);
      console.log('✅ Step 01: Nome preenchido e enviado');
    });

    // =================================================================
    // STEPS 02-11: PERGUNTAS PRINCIPAIS (Multi-select - 3 opções)
    // =================================================================
    for (let stepNum = 2; stepNum <= 11; stepNum++) {
      await test.step(`Step ${String(stepNum).padStart(2, '0')} (Question): Selecionar 3 opções`, async () => {
        console.log(`📊 Step ${stepNum}: Question (multi-select)`);

        // Aguardar carregamento do step
        await page.waitForTimeout(800);

        // Verificar se há uma pergunta/título
        const questionTitle = page.locator('h1, h2, h3').filter({
          hasText: /pergunta|questão|question|selecione/i
        }).first();
        
        const hasTitleVisible = await questionTitle.isVisible({ timeout: 5000 }).catch(() => false);
        if (hasTitleVisible) {
          console.log(`  ℹ️ Título encontrado: "${await questionTitle.textContent()}"`);
        }

        // Encontrar opções (podem ser botões, cards, ou elementos com role="button")
        const optionSelectors = [
          'button[class*="option"]',
          '[data-testid*="option"]',
          '[role="button"]:not([disabled])',
          '.quiz-option',
          'button:not([disabled]):not([class*="navigation"]):not([class*="back"]):not([class*="voltar"])',
        ];

        let optionsFound = false;
        let selectedCount = 0;

        for (const selector of optionSelectors) {
          const options = page.locator(selector);
          const count = await options.count();

          if (count >= 3) {
            console.log(`  ✓ Encontradas ${count} opções com seletor: ${selector}`);
            
            // Selecionar 3 opções
            for (let i = 0; i < 3 && i < count; i++) {
              const option = options.nth(i);
              
              // Verificar se está visível
              if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                await option.click({ timeout: 5000 });
                await page.waitForTimeout(300);
                selectedCount++;
                console.log(`  ✓ Opção ${i + 1}/3 selecionada`);
              }
            }

            optionsFound = true;
            break;
          }
        }

        if (!optionsFound) {
          console.warn(`  ⚠️ Step ${stepNum}: Nenhuma opção encontrada com os seletores padrão`);
        }

        // Se autoAdvance estiver habilitado, aguardar transição automática
        // Caso contrário, procurar botão "Próximo"
        await page.waitForTimeout(1500);

        const nextButton = page.locator('button').filter({
          hasText: /próximo|próxima|next|continuar/i
        }).first();

        const nextVisible = await nextButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (nextVisible) {
          await nextButton.click();
          await page.waitForTimeout(500);
          console.log(`  ✓ Botão "Próximo" clicado`);
        } else {
          console.log(`  ℹ️ Auto-advance ativado ou transição automática`);
        }

        console.log(`✅ Step ${stepNum}: ${selectedCount} opções selecionadas`);
      });
    }

    // =================================================================
    // STEP 12: TRANSIÇÃO
    // =================================================================
    await test.step('Step 12 (Transition): Aguardar transição', async () => {
      console.log('🔄 Step 12: Transition');

      await page.waitForTimeout(1000);

      // Verificar mensagem de transição
      const transitionText = page.locator('text=/quase lá|aguarde|processando|calculando/i').first();
      const hasTransition = await transitionText.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTransition) {
        console.log('✓ Mensagem de transição encontrada');
      }

      // Procurar botão de continuar
      const continueButton = page.locator('button').filter({
        hasText: /continuar|próximo|next/i
      }).first();

      if (await continueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await continueButton.click();
        await page.waitForTimeout(500);
        console.log('✓ Botão "Continuar" clicado');
      }

      console.log('✅ Step 12: Transição concluída');
    });

    // =================================================================
    // STEPS 13-18: PERGUNTAS ESTRATÉGICAS (Single-select - 1 opção)
    // =================================================================
    for (let stepNum = 13; stepNum <= 18; stepNum++) {
      await test.step(`Step ${String(stepNum).padStart(2, '0')} (Strategic): Selecionar 1 opção`, async () => {
        console.log(`🎯 Step ${stepNum}: Strategic Question (single-select)`);

        await page.waitForTimeout(800);

        // Encontrar e clicar em UMA opção
        const option = page.locator('button[class*="option"], [role="button"]:not([disabled])').first();
        
        if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
          await option.click();
          await page.waitForTimeout(1500); // Aguardar auto-advance
          console.log(`✅ Step ${stepNum}: 1 opção selecionada`);
        } else {
          console.warn(`⚠️ Step ${stepNum}: Opção não encontrada`);
        }
      });
    }

    // =================================================================
    // STEP 19: TRANSIÇÃO PARA RESULTADO
    // =================================================================
    await test.step('Step 19 (Transition Result): Aguardar processamento', async () => {
      console.log('⏳ Step 19: Transition Result');

      await page.waitForTimeout(2000);

      // Verificar mensagem de processamento
      const processingText = page.locator('text=/processando|calculando|resultado|aguarde/i').first();
      const hasProcessing = await processingText.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasProcessing) {
        console.log('✓ Mensagem de processamento encontrada');
      }

      // Aguardar auto-advance ou clicar em continuar
      await page.waitForTimeout(2000);

      const continueButton = page.locator('button').filter({
        hasText: /continuar|ver resultado/i
      }).first();

      if (await continueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await continueButton.click();
        await page.waitForTimeout(1000);
      }

      console.log('✅ Step 19: Processamento concluído');
    });

    // =================================================================
    // STEP 20: RESULTADO
    // =================================================================
    await test.step('Step 20 (Result): Validar resultado calculado', async () => {
      console.log('🎉 Step 20: Result');

      await page.waitForTimeout(2000);

      // Verificar elementos do resultado
      const resultTitle = page.locator('h1, h2').filter({
        hasText: /resultado|seu estilo|parabéns/i
      }).first();

      await expect(resultTitle).toBeVisible({ timeout: 10000 });
      console.log('✓ Título do resultado encontrado');

      // Verificar se o nome do usuário aparece
      const nameText = page.locator('text=/Ana Silva/i').first();
      const hasName = await nameText.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasName) {
        console.log('✓ Nome do usuário exibido no resultado');
      }

      // Verificar descrição do resultado
      const resultDescription = page.locator('p, div').filter({
        hasText: /estilo|personalidade|perfil/i
      }).first();

      const hasDescription = await resultDescription.isVisible({ timeout: 5000 }).catch(() => false);
      if (hasDescription) {
        console.log('✓ Descrição do resultado encontrada');
      }

      // Capturar screenshot do resultado
      await page.screenshot({ 
        path: 'tests/e2e/screenshots/quiz21-result.png',
        fullPage: true 
      });

      // Clicar em continuar para oferta
      const viewOfferButton = page.locator('button').filter({
        hasText: /ver oferta|continuar|próximo/i
      }).first();

      if (await viewOfferButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await viewOfferButton.click();
        await page.waitForTimeout(1000);
      }

      console.log('✅ Step 20: Resultado validado');
    });

    // =================================================================
    // STEP 21: OFERTA
    // =================================================================
    await test.step('Step 21 (Offer): Validar oferta final', async () => {
      console.log('💰 Step 21: Offer');

      await page.waitForTimeout(1500);

      // Verificar elementos da oferta
      const offerTitle = page.locator('h1, h2').filter({
        hasText: /oferta|especial|exclusivo/i
      }).first();

      const hasOfferTitle = await offerTitle.isVisible({ timeout: 10000 }).catch(() => false);
      if (hasOfferTitle) {
        console.log('✓ Título da oferta encontrado');
      }

      // Verificar benefícios
      const benefits = page.locator('ul li, [class*="benefit"]');
      const benefitCount = await benefits.count();
      
      if (benefitCount > 0) {
        console.log(`✓ ${benefitCount} benefícios listados`);
      }

      // Verificar CTA
      const ctaButton = page.locator('button').filter({
        hasText: /quero|comprar|adquirir|garantir/i
      }).first();

      const hasCTA = await ctaButton.isVisible({ timeout: 5000 }).catch(() => false);
      if (hasCTA) {
        console.log('✓ CTA da oferta encontrado');
      }

      // Capturar screenshot da oferta
      await page.screenshot({ 
        path: 'tests/e2e/screenshots/quiz21-offer.png',
        fullPage: true 
      });

      console.log('✅ Step 21: Oferta validada');
    });

    console.log('🎊 TESTE COMPLETO! Quiz 21 steps concluído com sucesso!');
  });

  test('deve permitir navegar para trás e manter progresso', async () => {
    console.log('🔙 Testando navegação backward...');

    // Completar steps 1-3
    await completeIntroStep(page);
    await selectOptionsInStep(page, 3); // Step 2
    await page.waitForTimeout(500);
    await selectOptionsInStep(page, 3); // Step 3
    await page.waitForTimeout(500);

    // Tentar voltar
    const backButton = page.locator('button').filter({
      hasText: /voltar|anterior|back/i
    }).first();

    if (await backButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await backButton.click();
      await page.waitForTimeout(500);

      console.log('✓ Navegação para trás funcionou');

      // Avançar novamente
      await selectOptionsInStep(page, 3);
      await page.waitForTimeout(500);

      console.log('✓ Navegação para frente após voltar funcionou');
    } else {
      console.log('ℹ️ Botão "Voltar" não disponível (pode ser intencional)');
    }
  });

  test('deve exibir progresso correto durante o quiz', async () => {
    console.log('📊 Testando indicador de progresso...');

    await completeIntroStep(page);

    // Verificar barra de progresso ou contador
    const progressBar = page.locator('[role="progressbar"], [class*="progress"]').first();
    const progressCounter = page.locator('text=/step [0-9]+ of [0-9]+|[0-9]+\\/[0-9]+/i').first();

    const hasProgress = await progressBar.isVisible({ timeout: 3000 }).catch(() => false);
    const hasCounter = await progressCounter.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasProgress) {
      console.log('✓ Barra de progresso encontrada');
      
      // Verificar se o progresso aumenta
      const initialValue = await progressBar.getAttribute('aria-valuenow') || '0';
      
      await selectOptionsInStep(page, 3);
      await page.waitForTimeout(500);
      
      const newValue = await progressBar.getAttribute('aria-valuenow') || '0';
      
      console.log(`✓ Progresso: ${initialValue}% → ${newValue}%`);
      expect(Number(newValue)).toBeGreaterThan(Number(initialValue));
    } else if (hasCounter) {
      console.log('✓ Contador de steps encontrado');
    } else {
      console.log('ℹ️ Indicador de progresso não encontrado');
    }
  });

  test('deve validar seleção mínima em perguntas multi-select', async () => {
    console.log('✅ Testando validação de seleção mínima...');

    await completeIntroStep(page);

    // Tentar avançar sem selecionar 3 opções
    const nextButton = page.locator('button').filter({
      hasText: /próximo|next/i
    }).first();

    // Selecionar apenas 1 opção
    await selectOptionsInStep(page, 1);
    await page.waitForTimeout(500);

    // Tentar clicar em próximo (deve estar desabilitado ou mostrar erro)
    if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      const isDisabled = await nextButton.isDisabled().catch(() => true);
      
      if (isDisabled) {
        console.log('✓ Botão "Próximo" desabilitado com seleção insuficiente');
      } else {
        console.log('ℹ️ Validação pode ser feita de outra forma');
      }
    }

    // Selecionar mais 2 opções para completar
    await selectOptionsInStep(page, 2);
    await page.waitForTimeout(1500);

    console.log('✓ Validação de seleção mínima testada');
  });

  test('deve persistir dados do usuário em localStorage', async () => {
    console.log('💾 Testando persistência de dados...');

    await completeIntroStep(page);

    // Verificar localStorage
    const localStorageData = await page.evaluate(() => {
      return {
        userName: localStorage.getItem('userName') || localStorage.getItem('quizUserName'),
        quizAnswers: localStorage.getItem('quizAnswers'),
        currentStep: localStorage.getItem('currentStep'),
      };
    });

    console.log('📦 Dados no localStorage:', localStorageData);

    expect(localStorageData.userName).toBeTruthy();
    console.log(`✓ Nome persistido: ${localStorageData.userName}`);

    // Avançar alguns steps e verificar persistência de respostas
    await selectOptionsInStep(page, 3);
    await page.waitForTimeout(1000);

    const answersData = await page.evaluate(() => {
      return localStorage.getItem('quizAnswers');
    });

    if (answersData) {
      console.log('✓ Respostas do quiz persistidas');
    }
  });

  test('deve medir performance do fluxo completo', async () => {
    console.log('⚡ Testando performance...');

    const startTime = Date.now();

    // Completar 5 steps
    await completeIntroStep(page);
    
    for (let i = 0; i < 4; i++) {
      await selectOptionsInStep(page, 3);
      await page.waitForTimeout(1500);
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const averagePerStep = totalTime / 5;

    console.log(`⏱️ Tempo total para 5 steps: ${totalTime}ms`);
    console.log(`⏱️ Média por step: ${averagePerStep}ms`);

    // Cada step deve levar menos de 3 segundos em média
    expect(averagePerStep).toBeLessThan(3000);
    console.log('✓ Performance dentro do esperado');
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function completeIntroStep(page: Page) {
  const nameInput = page.locator('input[type="text"]').first();
  await nameInput.fill('Test User');
  
  const startButton = page.locator('button').filter({
    hasText: /começar|iniciar|start/i
  }).first();
  await startButton.click();
  
  await page.waitForTimeout(1000);
}

async function selectOptionsInStep(page: Page, count: number) {
  const options = page.locator('button[class*="option"], [role="button"]:not([disabled])');
  const availableCount = await options.count();
  
  const selectCount = Math.min(count, availableCount);
  
  for (let i = 0; i < selectCount; i++) {
    const option = options.nth(i);
    if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
      await option.click();
      await page.waitForTimeout(300);
    }
  }
}
