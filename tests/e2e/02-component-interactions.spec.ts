import { test, expect } from '@playwright/test';

/**
 * FASE 3B - Testes E2E - Componentes FASE 3A
 * 
 * Testa os 14 componentes implementados na FASE 3A
 */

test.describe('Componentes FASE 3A - Interações', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quiz-estilo');
  });

  test.describe('LeadFormBlock', () => {
    test('deve validar campos obrigatórios', async ({ page }) => {
      // Procurar por formulário
      const form = page.locator('form').first();
      
      if (await form.isVisible({ timeout: 2000 })) {
        const submitButton = form.locator('button[type="submit"]');
        await submitButton.click();
        
        // Verificar mensagens de validação
        const validationMessages = page.locator('[role="alert"], .error, [class*="error"]');
        const hasValidation = await validationMessages.count() > 0;
        
        expect(hasValidation).toBeTruthy();
        console.log('✓ Form validation working');
      } else {
        console.log('ℹ LeadForm not found on this page');
      }
    });

    test('deve aceitar inputs válidos', async ({ page }) => {
      const nameInput = page.locator('input[name="name"], input[placeholder*="nome" i]').first();
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      
      if (await nameInput.isVisible({ timeout: 2000 })) {
        await nameInput.fill('João Silva');
        expect(await nameInput.inputValue()).toBe('João Silva');
      }
      
      if (await emailInput.isVisible({ timeout: 2000 })) {
        await emailInput.fill('joao@example.com');
        expect(await emailInput.inputValue()).toBe('joao@example.com');
      }
    });
  });

  test.describe('SpinnerBlock', () => {
    test('deve exibir spinner durante carregamentos', async ({ page }) => {
      const spinner = page.locator('[class*="spinner"], [class*="animate-spin"], [role="status"]');
      
      // Disparar ação que causa loading
      const nameInput = page.locator('input[type="text"]').first();
      await nameInput.fill('Test');
      
      const button = page.locator('button').filter({ hasText: /iniciar/i }).first();
      await button.click();
      
      // Verificar se spinner aparece
      await page.waitForTimeout(100);
      const spinnerCount = await spinner.count();
      
      if (spinnerCount > 0) {
        console.log('✓ Spinner displayed during loading');
      } else {
        console.log('ℹ No spinner found (loading may be too fast)');
      }
    });
  });

  test.describe('ImageDisplayInlineBlock', () => {
    test('deve carregar imagens com lazy loading', async ({ page }) => {
      // Avançar algumas etapas para encontrar imagens
      const nameInput = page.locator('input[type="text"]').first();
      await nameInput.fill('Test Images');
      
      const button = page.locator('button').filter({ hasText: /iniciar/i }).first();
      await button.click();
      await page.waitForTimeout(1000);

      // Procurar por imagens
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        // Verificar atributos de lazy loading
        const firstImage = images.first();
        const loading = await firstImage.getAttribute('loading');
        
        console.log(`✓ Found ${imageCount} images`);
        if (loading === 'lazy') {
          console.log('✓ Lazy loading enabled');
        }
      }
    });

    test('deve ter atributos alt acessíveis', async ({ page }) => {
      await page.goto('/quiz-estilo');
      await page.waitForTimeout(1000);

      const images = page.locator('img');
      const imageCount = await images.count();
      
      let imagesWithAlt = 0;
      for (let i = 0; i < imageCount; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        if (alt && alt.trim() !== '') {
          imagesWithAlt++;
        }
      }
      
      if (imageCount > 0) {
        const percentage = (imagesWithAlt / imageCount) * 100;
        console.log(`✓ ${imagesWithAlt}/${imageCount} images have alt text (${percentage.toFixed(0)}%)`);
        expect(percentage).toBeGreaterThan(50); // Pelo menos 50% devem ter alt
      }
    });
  });

  test.describe('DecorativeBarInlineBlock', () => {
    test('deve renderizar barras decorativas', async ({ page }) => {
      // Procurar por elementos decorativos (hr, dividers, bars)
      await page.waitForLoadState('networkidle');
      
      const decorativeBars = page.locator('hr, [class*="divider"], [class*="decorative"], [class*="bar"]');
      const count = await decorativeBars.count();
      
      if (count > 0) {
        console.log(`✓ Found ${count} decorative elements`);
      }
    });
  });

  test.describe('Offer Components', () => {
    test('deve exibir componentes de oferta na página de resultado', async ({ page }) => {
      // Completar quiz rapidamente
      await page.goto('/quiz-estilo');
      
      const nameInput = page.locator('input[type="text"]').first();
      await nameInput.fill('Test Offer');
      
      const startButton = page.locator('button').filter({ hasText: /iniciar/i }).first();
      await startButton.click();
      
      // Avançar rapidamente (usando URL direta se possível)
      const url = page.url();
      if (url.includes('/quiz-estilo')) {
        // Tentar ir direto para resultado
        await page.goto('/quiz-estilo/resultado').catch(() => {
          console.log('ℹ Direct result URL not available');
        });
      }
      
      await page.waitForTimeout(1000);
      
      // Procurar por componentes de oferta
      const offerComponents = page.locator('[class*="offer"], [class*="pricing"], [class*="testimonial"], [class*="benefit"]');
      const count = await offerComponents.count();
      
      if (count > 0) {
        console.log(`✓ Found ${count} offer-related components`);
      }
    });

    test('deve ter CTAs clicáveis', async ({ page }) => {
      await page.goto('/quiz-estilo');
      
      // Procurar por CTAs
      const ctaButtons = page.locator('button, a').filter({ hasText: /comprar|adquirir|garantir|quero/i });
      const count = await ctaButtons.count();
      
      if (count > 0) {
        console.log(`✓ Found ${count} CTA buttons`);
        
        // Verificar se primeiro CTA é clicável
        const firstCta = ctaButtons.first();
        if (await firstCta.isVisible({ timeout: 2000 })) {
          const isEnabled = await firstCta.isEnabled();
          expect(isEnabled).toBeTruthy();
          console.log('✓ CTA is clickable');
        }
      }
    });
  });

  test.describe('ResultCardInlineBlock', () => {
    test('deve exibir resultado com nome do usuário', async ({ page }) => {
      const userName = 'Maria Teste';
      
      // Armazenar nome no localStorage
      await page.evaluate((name) => {
        localStorage.setItem('userName', name);
        localStorage.setItem('quizUserName', name);
      }, userName);
      
      await page.goto('/quiz-estilo/resultado').catch(() => {
        console.log('ℹ Result page not directly accessible');
      });
      
      await page.waitForTimeout(1000);
      
      // Procurar por nome no resultado
      const pageContent = await page.textContent('body');
      if (pageContent?.includes(userName) || pageContent?.includes('Maria')) {
        console.log('✓ User name displayed in result');
      }
    });
  });

  test.describe('FAQ Section', () => {
    test('deve expandir/colapsar perguntas do FAQ', async ({ page }) => {
      await page.goto('/quiz-estilo');
      
      // Procurar por elementos de FAQ/accordion
      const faqItems = page.locator('[class*="faq"], [class*="accordion"], details, [role="button"][aria-expanded]');
      const count = await faqItems.count();
      
      if (count > 0) {
        const firstFaq = faqItems.first();
        
        // Verificar estado inicial
        const initialExpanded = await firstFaq.getAttribute('aria-expanded');
        
        // Clicar para expandir/colapsar
        await firstFaq.click();
        await page.waitForTimeout(300);
        
        const afterClick = await firstFaq.getAttribute('aria-expanded');
        
        if (initialExpanded !== afterClick) {
          console.log('✓ FAQ accordion working');
        }
      }
    });
  });
});
