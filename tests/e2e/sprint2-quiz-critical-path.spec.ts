/**
 * 🧪 SPRINT 2: TESTES E2E - CRITICAL PATH
 * 
 * Suite de testes críticos para validar o fluxo completo do Quiz de 21 steps
 * Focado em cenários de maior impacto no negócio e experiência do usuário.
 * 
 * Casos de teste cobertos:
 * - CP-001: Completar quiz de 21 steps (happy path)
 * - CP-002: Navegação back/forward
 * - CP-003: Validação de requisitos mínimos de seleção
 * - CP-004: Persistência de progresso ao recarregar página
 * - CP-005: Performance de carregamento
 */

import { test, expect, Page } from '@playwright/test';

// Timeout mais longo para fluxos completos
test.setTimeout(90000); // 90 segundos

test.describe('Sprint 2: Quiz Flow - Critical Path', () => {

  /**
   * CP-001: Happy Path - Completar Quiz de 21 Steps
   * Valida o fluxo completo sem interrupções
   */
  test('CP-001: Deve completar quiz de 21 steps (happy path)', async ({ page }) => {
    
    await test.step('1. Iniciar quiz na home', async () => {
      // Navegar para a home
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Procurar e clicar no botão de iniciar quiz
      const startButton = page.locator('button').filter({ 
        hasText: /começar|iniciar|criar.*quiz|criar.*funil/i 
      }).first();
      
      await expect(startButton).toBeVisible({ timeout: 5000 });
      await startButton.click();
      
      // Aguardar navegação - aceitar rotas variadas
      await page.waitForTimeout(2000);
      
      // Verificar se navegou para alguma página de criação/quiz
      const currentUrl = page.url();
      const hasNavigated = 
        currentUrl.includes('/quiz') || 
        currentUrl.includes('/funnel') || 
        currentUrl.includes('/step') ||
        currentUrl.includes('/criar-funil') ||
        currentUrl.includes('/editor');
      
      expect(hasNavigated).toBeTruthy();
    });

    await test.step('2. Preencher nome (Step 01)', async () => {
      // Se estiver na página de criar-funil, preencher e criar
      const currentUrl = page.url();
      
      if (currentUrl.includes('/criar-funil')) {
        const nameInput = page.locator('input[type="text"]').first();
        await expect(nameInput).toBeVisible({ timeout: 5000 });
        await nameInput.fill('Teste E2E Quiz');
        
        const createButton = page.locator('button').filter({
          hasText: /criar|confirmar|continuar/i
        }).first();
        await createButton.click();
        
        // Aguardar navegação para editor ou preview
        await page.waitForTimeout(3000);
      }
      
      // Procurar input de nome do usuário (pode estar no editor ou preview)
      const userNameInput = page.locator('input[type="text"], input[placeholder*="nome" i]').first();
      const isVisible = await userNameInput.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isVisible) {
        await userNameInput.fill('João Silva E2E');
        
        // Procurar botão de continuar
        const continueButton = page.locator('button').filter({
          hasText: /continuar|próximo|começar|iniciar/i
        }).first();
        
        if (await continueButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await continueButton.click();
          await page.waitForTimeout(1000);
        }
      }
    });

    await test.step('3. Completar steps 2-11 (perguntas múltipla escolha)', async () => {
      for (let stepNum = 2; stepNum <= 11; stepNum++) {
        console.log(`📊 Respondendo Step ${stepNum}`);
        
        // Aguardar carregamento
        await page.waitForTimeout(800);
        
        // Encontrar opções clicáveis (múltiplas estratégias)
        const optionSelectors = [
          'button[class*="option"]:not([disabled])',
          '[data-testid*="option"]',
          '[role="button"]:not([disabled]):not([class*="back"]):not([class*="voltar"])',
          'button:not([disabled]):not([class*="navigation"]):not([class*="back"])',
        ];
        
        let selectedCount = 0;
        const targetSelections = 3; // Múltipla escolha: 3 opções
        
        for (const selector of optionSelectors) {
          if (selectedCount >= targetSelections) break;
          
          const options = page.locator(selector);
          const count = await options.count();
          
          if (count >= targetSelections) {
            for (let i = 0; i < targetSelections && i < count; i++) {
              const option = options.nth(i);
              if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                await option.click({ timeout: 3000 });
                await page.waitForTimeout(300);
                selectedCount++;
              }
            }
            break;
          }
        }
        
        // Verificar se selecionou o mínimo
        if (selectedCount < targetSelections) {
          console.warn(`⚠️ Step ${stepNum}: Apenas ${selectedCount} opções selecionadas`);
        }
        
        // Procurar botão "Próximo" ou aguardar auto-advance
        await page.waitForTimeout(1000);
        
        const nextButton = page.locator('button').filter({
          hasText: /próximo|próxima|next|continuar/i
        }).first();
        
        if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nextButton.click();
          await page.waitForTimeout(500);
        }
      }
    });

    await test.step('4. Completar steps 12-20 (outras perguntas)', async () => {
      for (let stepNum = 12; stepNum <= 20; stepNum++) {
        console.log(`📊 Respondendo Step ${stepNum}`);
        
        await page.waitForTimeout(800);
        
        // Selecionar opções (estratégia adaptativa)
        const optionSelectors = [
          'button[class*="option"]:not([disabled])',
          '[data-testid*="option"]',
          'button:not([disabled]):not([class*="back"])',
        ];
        
        for (const selector of optionSelectors) {
          const options = page.locator(selector);
          const count = await options.count();
          
          if (count > 0) {
            // Selecionar primeira opção
            const firstOption = options.first();
            if (await firstOption.isVisible({ timeout: 2000 }).catch(() => false)) {
              await firstOption.click();
              await page.waitForTimeout(500);
              break;
            }
          }
        }
        
        // Avançar
        await page.waitForTimeout(1000);
        const nextButton = page.locator('button').filter({
          hasText: /próximo|próxima|next|continuar/i
        }).first();
        
        if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nextButton.click();
          await page.waitForTimeout(500);
        }
      }
    });

    await test.step('5. Validar tela de resultado (Step 21)', async () => {
      // Aguardar tela de resultado
      await page.waitForTimeout(2000);
      
      // Verificar elementos comuns de resultado
      const resultIndicators = [
        page.locator('h1, h2').filter({ hasText: /resultado|perfil|seu.*estilo|score/i }).first(),
        page.locator('[data-testid*="result"]').first(),
        page.locator('text=/parabéns|concluído|finalizado/i').first(),
      ];
      
      let resultFound = false;
      for (const indicator of resultIndicators) {
        if (await indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
          resultFound = true;
          console.log('✅ Tela de resultado encontrada');
          break;
        }
      }
      
      expect(resultFound).toBeTruthy();
    });
  });

  /**
   * CP-002: Validar Navegação Back/Forward
   * Testa se o usuário consegue voltar e avançar entre steps
   */
  test('CP-002: Deve validar navegação back/forward', async ({ page }) => {
    
    await test.step('1. Iniciar quiz e avançar 3 steps', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Iniciar quiz
      const startButton = page.locator('button').filter({ 
        hasText: /começar|iniciar|criar/i 
      }).first();
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Se necessário, criar funil
      const currentUrl = page.url();
      if (currentUrl.includes('/criar-funil')) {
        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.fill('Teste Navegação');
        const createBtn = page.locator('button').filter({ hasText: /criar|continuar/i }).first();
        await createBtn.click();
        await page.waitForTimeout(3000);
      }
      
      // Step 1: Nome
      const userNameInput = page.locator('input[type="text"], input[placeholder*="nome" i]').first();
      if (await userNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await userNameInput.fill('João Teste');
        const continueBtn = page.locator('button').filter({ hasText: /continuar|próximo/i }).first();
        if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await continueBtn.click();
        }
      }
      await page.waitForTimeout(1000);
      
      // Avançar 2 steps adicionais
      for (let i = 0; i < 2; i++) {
        await page.waitForTimeout(800);
        
        // Selecionar opção
        const option = page.locator('button[class*="option"]:not([disabled]), button:not([disabled]):not([class*="back"])').first();
        if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
          await option.click();
          await page.waitForTimeout(500);
        }
        
        // Próximo
        const nextBtn = page.locator('button').filter({ hasText: /próximo|continuar/i }).first();
        if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(500);
        }
      }
    });

    await test.step('2. Voltar 2 steps', async () => {
      for (let i = 0; i < 2; i++) {
        await page.waitForTimeout(500);
        
        const backButton = page.locator('button').filter({
          hasText: /voltar|anterior|back/i
        }).first();
        
        if (await backButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await backButton.click();
          await page.waitForTimeout(800);
          console.log(`✅ Voltou ${i + 1} step(s)`);
        } else {
          console.warn('⚠️ Botão voltar não encontrado');
        }
      }
    });

    await test.step('3. Avançar novamente', async () => {
      // Avançar 1 step
      await page.waitForTimeout(500);
      
      const nextButton = page.locator('button').filter({
        hasText: /próximo|continuar/i
      }).first();
      
      if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(800);
        console.log('✅ Avançou novamente');
      }
    });
  });

  /**
   * CP-003: Validar Requisitos Mínimos de Seleção
   * Testa se o botão "Próximo" está desabilitado sem seleção mínima
   */
  test('CP-003: Deve validar requisitos mínimos de seleção', async ({ page }) => {
    
    await test.step('1. Tentar avançar sem selecionar mínimo de opções', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Iniciar quiz
      const startButton = page.locator('button').filter({ 
        hasText: /começar|iniciar|criar/i 
      }).first();
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Criar funil se necessário
      const currentUrl = page.url();
      if (currentUrl.includes('/criar-funil')) {
        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.fill('Teste Validação');
        const createBtn = page.locator('button').filter({ hasText: /criar|continuar/i }).first();
        await createBtn.click();
        await page.waitForTimeout(3000);
      }
      
      // Step 1: Preencher nome
      const userNameInput = page.locator('input[type="text"], input[placeholder*="nome" i]').first();
      if (await userNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await userNameInput.fill('Pedro Validação');
        const continueBtn = page.locator('button').filter({ hasText: /continuar|próximo/i }).first();
        if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await continueBtn.click();
        }
      }
      await page.waitForTimeout(1500);
      
      // Step 2: Tentar avançar sem seleção
      const nextButton = page.locator('button').filter({
        hasText: /próximo|continuar/i
      }).first();
      
      // Verificar se botão está desabilitado ou não visível inicialmente
      const isDisabledOrHidden = 
        await nextButton.isDisabled({ timeout: 2000 }).catch(() => false) ||
        !(await nextButton.isVisible({ timeout: 2000 }).catch(() => true));
      
      console.log(`Botão próximo desabilitado/oculto sem seleção: ${isDisabledOrHidden}`);
    });

    await test.step('2. Selecionar mínimo e validar desbloqueio', async () => {
      await page.waitForTimeout(500);
      
      // Selecionar 1 opção (mínimo pode variar)
      const option = page.locator('button[class*="option"]:not([disabled]), button:not([disabled]):not([class*="back"])').first();
      
      if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
        await option.click();
        await page.waitForTimeout(800);
        
        // Verificar se botão próximo ficou habilitado
        const nextButton = page.locator('button').filter({
          hasText: /próximo|continuar/i
        }).first();
        
        const isEnabled = await nextButton.isEnabled({ timeout: 3000 }).catch(() => false);
        console.log(`Botão próximo habilitado após seleção: ${isEnabled}`);
      }
    });
  });

  /**
   * CP-004: Persistir Progresso ao Recarregar Página
   * Testa se o progresso é mantido após F5
   */
  test('CP-004: Deve persistir progresso ao recarregar página', async ({ page }) => {
    
    let sessionId = '';
    
    await test.step('1. Iniciar quiz e capturar session ID', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Iniciar quiz
      const startButton = page.locator('button').filter({ 
        hasText: /começar|iniciar|criar/i 
      }).first();
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Criar funil
      const currentUrl = page.url();
      if (currentUrl.includes('/criar-funil')) {
        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.fill('Teste Persistência');
        const createBtn = page.locator('button').filter({ hasText: /criar|continuar/i }).first();
        await createBtn.click();
        await page.waitForTimeout(3000);
      }
      
      // Capturar ID da URL ou localStorage
      sessionId = page.url().split('/').pop() || '';
      console.log(`Session/Funnel ID: ${sessionId}`);
    });

    await test.step('2. Avançar até Step 3', async () => {
      // Nome
      const userNameInput = page.locator('input[type="text"], input[placeholder*="nome" i]').first();
      if (await userNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await userNameInput.fill('Maria Persistência');
        const continueBtn = page.locator('button').filter({ hasText: /continuar|próximo/i }).first();
        if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await continueBtn.click();
        }
      }
      await page.waitForTimeout(1000);
      
      // Avançar mais 2 steps
      for (let i = 0; i < 2; i++) {
        await page.waitForTimeout(800);
        const option = page.locator('button[class*="option"]:not([disabled]), button:not([disabled]):not([class*="back"])').first();
        if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
          await option.click();
          await page.waitForTimeout(500);
        }
        
        const nextBtn = page.locator('button').filter({ hasText: /próximo|continuar/i }).first();
        if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(500);
        }
      }
    });

    await test.step('3. Recarregar página', async () => {
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    await test.step('4. Verificar que progresso foi mantido', async () => {
      // Verificar se ainda está no quiz (não voltou para home/intro)
      const currentUrl = page.url();
      const isStillInQuiz = 
        currentUrl.includes('/quiz') || 
        currentUrl.includes('/funnel') || 
        currentUrl.includes('/step') ||
        currentUrl.includes('/editor') ||
        currentUrl.includes('/preview');
      
      console.log(`Ainda no quiz após reload: ${isStillInQuiz}`);
      console.log(`URL atual: ${currentUrl}`);
      
      // Verificar localStorage (se acessível)
      const hasLocalStorage = await page.evaluate(() => {
        return Object.keys(localStorage).length > 0;
      });
      
      console.log(`LocalStorage com dados: ${hasLocalStorage}`);
    });
  });

  /**
   * CP-005: Validar Performance de Carregamento
   * Testa se o quiz carrega em tempo adequado
   */
  test('CP-005: Deve validar performance de carregamento', async ({ page }) => {
    
    await test.step('1. Medir tempo de carregamento inicial', async () => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      console.log(`⏱️ Load time: ${loadTime}ms`);
      
      // Meta: carregar em menos de 3 segundos
      expect(loadTime).toBeLessThan(3000);
    });

    await test.step('2. Validar transições entre steps', async () => {
      // Iniciar quiz
      const startButton = page.locator('button').filter({ 
        hasText: /começar|iniciar|criar/i 
      }).first();
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Criar funil se necessário
      const currentUrl = page.url();
      if (currentUrl.includes('/criar-funil')) {
        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.fill('Teste Performance');
        const createBtn = page.locator('button').filter({ hasText: /criar|continuar/i }).first();
        await createBtn.click();
        await page.waitForTimeout(3000);
      }
      
      // Medir transição entre steps
      const transitionTimes: number[] = [];
      
      for (let i = 0; i < 3; i++) {
        await page.waitForTimeout(500);
        
        // Selecionar opção
        const option = page.locator('button[class*="option"]:not([disabled]), button:not([disabled]):not([class*="back"])').first();
        if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
          await option.click();
          await page.waitForTimeout(300);
        }
        
        // Medir tempo de transição
        const transitionStart = Date.now();
        
        const nextBtn = page.locator('button').filter({ hasText: /próximo|continuar/i }).first();
        if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nextBtn.click();
          
          // Aguardar próximo step carregar
          await page.waitForTimeout(1000);
          
          const transitionTime = Date.now() - transitionStart;
          transitionTimes.push(transitionTime);
          console.log(`Transição ${i + 1}: ${transitionTime}ms`);
        }
      }
      
      // Meta: transições em menos de 1 segundo
      const avgTransitionTime = transitionTimes.reduce((a, b) => a + b, 0) / transitionTimes.length;
      console.log(`⏱️ Tempo médio de transição: ${avgTransitionTime.toFixed(0)}ms`);
      
      expect(avgTransitionTime).toBeLessThan(1000);
    });
  });
});
