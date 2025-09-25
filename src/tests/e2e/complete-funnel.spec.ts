/**
 * 🧪 TESTES END-TO-END DO FUNIL COMPLETO
 * Testa cenários reais de usuário do início ao fim
 */

import { test, expect, type Page } from '@playwright/test';

test.describe('🎯 Funil Completo - Quiz de Estilo', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
  });

  test.describe('👤 Jornada do Usuário Completa', () => {
    test('deve completar todo o funil - usuário novo', async () => {
      // Etapa 1: Página inicial do quiz
      await expect(page.locator('h1')).toContainText('Quiz de Estilo');
      
      // Preenche nome
      await page.fill('input[placeholder*="nome"]', 'Maria Silva');
      await page.click('button:has-text("Começar")');

      // Etapas 2-11: Perguntas principais
      for (let step = 2; step <= 11; step++) {
        await expect(page.locator('h2')).toContainText(`Pergunta ${step - 1}`);
        
        // Seleciona primeira opção disponível
        await page.click('.quiz-option:first-child');
        
        // Aguarda botão de continuar ficar disponível
        await expect(page.locator('button:has-text("Continuar")')).toBeEnabled();
        await page.click('button:has-text("Continuar")');
      }

      // Etapa 12: Transição
      await expect(page.locator('text*="Calculando"')).toBeVisible();
      await page.waitForTimeout(3000); // Aguarda animação

      // Etapas 13-18: Perguntas estratégicas
      for (let step = 13; step <= 18; step++) {
        await page.click('.strategic-option:first-child');
        await page.click('button:has-text("Próxima")');
      }

      // Etapa 19: Transição para resultado
      await expect(page.locator('text*="Preparando resultado"')).toBeVisible();
      await page.waitForTimeout(2000);

      // Etapa 20: Resultado
      await expect(page.locator('.result-title')).toBeVisible();
      await expect(page.locator('text*="SEU ESTILO É"')).toBeVisible();
      
      // Verifica se mostra estilo calculado
      const resultStyle = await page.locator('.primary-style').textContent();
      expect(['ELEGANTE', 'NATURAL', 'CLÁSSICO', 'ROMÂNTICO', 'SEXY', 'DRAMÁTICO', 'CRIATIVO', 'CONTEMPORÂNEO']).toContain(resultStyle);

      // Etapa 21: Oferta personalizada
      await page.click('button:has-text("Ver oferta")');
      await expect(page.locator('.offer-title')).toBeVisible();
      await expect(page.locator('.cta-button')).toBeVisible();
    });

    test('deve permitir navegação para trás e alteração de respostas', async () => {
      // Completa primeiras etapas
      await page.fill('input[placeholder*="nome"]', 'Ana Costa');
      await page.click('button:has-text("Começar")');
      
      await page.click('.quiz-option:first-child');
      await page.click('button:has-text("Continuar")');
      
      await page.click('.quiz-option:nth-child(2)');
      await page.click('button:has-text("Continuar")');

      // Volta uma etapa
      await page.click('button:has-text("Voltar")');
      
      // Verifica se mantém resposta anterior
      await expect(page.locator('.quiz-option:nth-child(2)')).toHaveClass(/selected/);
      
      // Altera resposta
      await page.click('.quiz-option:first-child');
      await expect(page.locator('.quiz-option:first-child')).toHaveClass(/selected/);
      
      // Continua e verifica se alteração foi salva
      await page.click('button:has-text("Continuar")');
      await page.click('button:has-text("Voltar")');
      await expect(page.locator('.quiz-option:first-child')).toHaveClass(/selected/);
    });
  });

  test.describe('📱 Responsividade', () => {
    test('deve funcionar em dispositivos móveis', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.fill('input[placeholder*="nome"]', 'Mobile User');
      await page.click('button:has-text("Começar")');
      
      // Verifica layout mobile
      const container = page.locator('.quiz-container');
      await expect(container).toHaveCSS('padding', '24px');
      
      // Verifica opções empilhadas
      const options = page.locator('.quiz-option');
      const firstOption = options.first();
      const secondOption = options.nth(1);
      
      const firstBox = await firstOption.boundingBox();
      const secondBox = await secondOption.boundingBox();
      
      // Em mobile, opções devem estar empilhadas (Y diferente)
      expect(firstBox!.y).not.toBe(secondBox!.y);
    });

    test('deve funcionar em tablets', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.fill('input[placeholder*="nome"]', 'Tablet User');
      await page.click('button:has-text("Começar")');
      
      // Verifica grid de 2 colunas em tablet
      const options = page.locator('.quiz-option');
      const count = await options.count();
      
      if (count >= 4) {
        const firstBox = await options.first().boundingBox();
        const secondBox = await options.nth(1).boundingBox();
        const thirdBox = await options.nth(2).boundingBox();
        
        // Primeiras duas opções na mesma linha
        expect(Math.abs(firstBox!.y - secondBox!.y)).toBeLessThan(10);
        // Terceira opção em linha diferente
        expect(Math.abs(firstBox!.y - thirdBox!.y)).toBeGreaterThan(50);
      }
    });
  });

  test.describe('⏱️ Performance', () => {
    test('deve carregar rapidamente', async () => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000); // Menos de 3 segundos
    });

    test('deve ter transições suaves entre etapas', async () => {
      await page.fill('input[placeholder*="nome"]', 'Performance Test');
      
      const startTime = Date.now();
      await page.click('button:has-text("Começar")');
      await page.waitForSelector('.quiz-option:first-child');
      const transitionTime = Date.now() - startTime;
      
      expect(transitionTime).toBeLessThan(1000); // Menos de 1 segundo
    });
  });

  test.describe('🔄 Estados de Loading', () => {
    test('deve mostrar loading durante transições', async () => {
      await page.fill('input[placeholder*="nome"]', 'Loading Test');
      await page.click('button:has-text("Começar")');
      
      // Pula para etapa de transição
      for (let i = 0; i < 10; i++) {
        await page.click('.quiz-option:first-child');
        await page.click('button:has-text("Continuar")');
      }
      
      // Verifica loading na transição
      await expect(page.locator('.loading-spinner')).toBeVisible();
      await expect(page.locator('text*="Calculando"')).toBeVisible();
    });

    test('deve mostrar progresso correto', async () => {
      await page.fill('input[placeholder*="nome"]', 'Progress Test');
      await page.click('button:has-text("Começar")');
      
      // Verifica progresso inicial
      await expect(page.locator('.progress-bar')).toHaveAttribute('value', '5');
      
      // Avança algumas etapas
      for (let i = 0; i < 3; i++) {
        await page.click('.quiz-option:first-child');
        await page.click('button:has-text("Continuar")');
      }
      
      // Verifica progresso atualizado
      await expect(page.locator('.progress-bar')).toHaveAttribute('value', '20');
    });
  });

  test.describe('🛡️ Validações', () => {
    test('deve bloquear avanço sem nome', async () => {
      await expect(page.locator('button:has-text("Começar")')).toBeDisabled();
      
      await page.fill('input[placeholder*="nome"]', '');
      await expect(page.locator('button:has-text("Começar")')).toBeDisabled();
      
      await page.fill('input[placeholder*="nome"]', 'Valid Name');
      await expect(page.locator('button:has-text("Começar")')).toBeEnabled();
    });

    test('deve bloquear avanço sem resposta', async () => {
      await page.fill('input[placeholder*="nome"]', 'Validation Test');
      await page.click('button:has-text("Começar")');
      
      await expect(page.locator('button:has-text("Continuar")')).toBeDisabled();
      
      await page.click('.quiz-option:first-child');
      await expect(page.locator('button:has-text("Continuar")')).toBeEnabled();
    });

    test('deve validar seleções múltiplas', async () => {
      await page.fill('input[placeholder*="nome"]', 'Multi Select Test');
      await page.click('button:has-text("Começar")');
      
      // Procura por pergunta que requer múltiplas seleções
      let foundMultiSelect = false;
      for (let i = 0; i < 10 && !foundMultiSelect; i++) {
        const selectionText = await page.locator('.selection-requirement').textContent();
        if (selectionText?.includes('Selecione 2') || selectionText?.includes('Selecione 3')) {
          foundMultiSelect = true;
          
          // Testa seleção múltipla
          await page.click('.quiz-option:first-child');
          await expect(page.locator('button:has-text("Continuar")')).toBeDisabled();
          
          await page.click('.quiz-option:nth-child(2)');
          await expect(page.locator('button:has-text("Continuar")')).toBeEnabled();
        } else {
          await page.click('.quiz-option:first-child');
          await page.click('button:has-text("Continuar")');
        }
      }
    });
  });

  test.describe('💾 Persistência', () => {
    test('deve manter estado ao recarregar página', async () => {
      await page.fill('input[placeholder*="nome"]', 'Persistence Test');
      await page.click('button:has-text("Começar")');
      
      await page.click('.quiz-option:first-child');
      await page.click('button:has-text("Continuar")');
      
      // Recarrega página
      await page.reload();
      
      // Verifica se mantém progresso
      await expect(page.locator('.current-step')).toContainText('3');
      await expect(page.locator('.progress-bar')).toHaveAttribute('value', '10');
    });

    test('deve recuperar sessão em nova aba', async () => {
      await page.fill('input[placeholder*="nome"]', 'Session Test');
      await page.click('button:has-text("Começar")');
      
      await page.click('.quiz-option:first-child');
      await page.click('button:has-text("Continuar")');
      
      // Abre nova aba
      const newPage = await page.context().newPage();
      await newPage.goto('/');
      
      // Verifica se recupera sessão
      await expect(newPage.locator('.resume-session')).toBeVisible();
      await newPage.click('button:has-text("Continuar sessão")');
      
      await expect(newPage.locator('.current-step')).toContainText('3');
    });
  });

  test.describe('🎨 Resultado e Personalização', () => {
    test('deve gerar resultados diferentes para respostas diferentes', async () => {
      // Primeira sessão - todas respostas "elegante"
      await page.fill('input[placeholder*="nome"]', 'Elegante Test');
      await page.click('button:has-text("Começar")');
      
      for (let i = 0; i < 10; i++) {
        // Sempre seleciona opção "elegante" se disponível
        const elegantOption = page.locator('.quiz-option:has-text("elegante")').first();
        if (await elegantOption.count() > 0) {
          await elegantOption.click();
        } else {
          await page.click('.quiz-option:first-child');
        }
        await page.click('button:has-text("Continuar")');
      }
      
      // Pula transição e questões estratégicas
      await page.waitForTimeout(3000);
      for (let i = 0; i < 6; i++) {
        await page.click('.strategic-option:first-child');
        await page.click('button:has-text("Próxima")');
      }
      
      await page.waitForTimeout(2000);
      const result1 = await page.locator('.primary-style').textContent();
      
      // Segunda sessão - respostas diferentes
      await page.reload();
      await page.fill('input[placeholder*="nome"]', 'Natural Test');
      await page.click('button:has-text("Começar")');
      
      for (let i = 0; i < 10; i++) {
        // Sempre seleciona opção "natural" se disponível
        const naturalOption = page.locator('.quiz-option:has-text("natural")').first();
        if (await naturalOption.count() > 0) {
          await naturalOption.click();
        } else {
          await page.click('.quiz-option:last-child');
        }
        await page.click('button:has-text("Continuar")');
      }
      
      await page.waitForTimeout(3000);
      for (let i = 0; i < 6; i++) {
        await page.click('.strategic-option:last-child');
        await page.click('button:has-text("Próxima")');
      }
      
      await page.waitForTimeout(2000);
      const result2 = await page.locator('.primary-style').textContent();
      
      // Resultados devem ser diferentes
      expect(result1).not.toBe(result2);
    });

    test('deve mostrar ofertas personalizadas', async () => {
      // Completa quiz com respostas específicas
      await page.fill('input[placeholder*="nome"]', 'Offer Test');
      await page.click('button:has-text("Começar")');
      
      // Responde quiz completo
      for (let i = 0; i < 10; i++) {
        await page.click('.quiz-option:first-child');
        await page.click('button:has-text("Continuar")');
      }
      
      await page.waitForTimeout(3000);
      
      // Respostas estratégicas específicas
      await page.click('.strategic-option[data-value="business"]');
      await page.click('button:has-text("Próxima")');
      
      await page.click('.strategic-option[data-value="premium"]');
      await page.click('button:has-text("Próxima")');
      
      for (let i = 0; i < 4; i++) {
        await page.click('.strategic-option:first-child');
        await page.click('button:has-text("Próxima")');
      }
      
      await page.waitForTimeout(2000);
      await page.click('button:has-text("Ver oferta")');
      
      // Verifica oferta personalizada
      await expect(page.locator('.offer-title')).toBeVisible();
      await expect(page.locator('.personalized-content')).toBeVisible();
      await expect(page.locator('.testimonial-quote')).toBeVisible();
    });
  });
});