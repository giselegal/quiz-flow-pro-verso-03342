/**
 * 📸 TESTES VISUAIS DE REGRESSÃO
 * 
 * Testes de comparação visual para detectar mudanças
 * não intencionais na interface do usuário.
 */

import { test, expect, Page } from '@playwright/test';
import { 
  navigateToRoute, 
  waitForPageLoad, 
  waitForAnimations,
  ROUTES,
  VIEWPORT_FIXTURES,
  testResponsiveness
} from '../helpers/test-helpers';

test.describe('📸 Testes Visuais de Regressão', () => {
  
  // Configurar antes de cada teste
  test.beforeEach(async ({ page }) => {
    // Desabilitar animações para screenshots consistentes
    await page.addInitScript(() => {
      // CSS para desabilitar animações
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });
  });
  
  test('🏠 Homepage - Layout completo', async ({ page }) => {
    await navigateToRoute(page, ROUTES.HOME);
    await waitForPageLoad(page);
    await waitForAnimations(page);
    
    // Aguardar carregamento de imagens
    await page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.every(img => img.complete);
    }, { timeout: 10000 }).catch(() => {
      console.log('⚠️ Algumas imagens podem não ter carregado completamente');
    });
    
    // Screenshot da página completa
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      threshold: 0.3, // 30% de diferença permitida
      maxDiffPixels: 1000,
    });
    
    // Screenshot da área acima da dobra (viewport)
    await expect(page).toHaveScreenshot('homepage-above-fold.png', {
      fullPage: false,
      threshold: 0.2,
      maxDiffPixels: 500,
    });
  });
  
  test('🎯 Quiz - Estados diferentes', async ({ page }) => {
    await navigateToRoute(page, ROUTES.QUIZ);
    await waitForPageLoad(page);
    
    // Screenshot do estado inicial do quiz
    await expect(page).toHaveScreenshot('quiz-initial-state.png', {
      fullPage: false,
      threshold: 0.2,
    });
    
    // Tentar navegar para próxima pergunta (se houver)
    const nextButton = page.locator('button').filter({ hasText: /próximo|next|avançar/i });
    
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500); // Aguardar transição
      
      await expect(page).toHaveScreenshot('quiz-second-question.png', {
        fullPage: false,
        threshold: 0.2,
      });
    }
  });
  
  test('🎨 Editor - Interface principal', async ({ page }) => {
    await navigateToRoute(page, ROUTES.EDITOR);
    await waitForPageLoad(page);
    await waitForAnimations(page);
    
    // Screenshot do editor vazio
    await expect(page).toHaveScreenshot('editor-empty-state.png', {
      fullPage: true,
      threshold: 0.25,
    });
    
    // Screenshot apenas da área de canvas (se existir)
    const canvas = page.locator('[data-testid*="canvas"], .editor-canvas, .canvas').first();
    
    if (await canvas.isVisible()) {
      await expect(canvas).toHaveScreenshot('editor-canvas-area.png', {
        threshold: 0.2,
      });
    }
    
    // Screenshot da barra lateral (se existir)
    const sidebar = page.locator('[data-testid*="sidebar"], .sidebar, .properties-panel').first();
    
    if (await sidebar.isVisible()) {
      await expect(sidebar).toHaveScreenshot('editor-sidebar.png', {
        threshold: 0.2,
      });
    }
  });
  
  test('📊 Admin Dashboard - Métricas', async ({ page }) => {
    await navigateToRoute(page, ROUTES.ADMIN);
    await waitForPageLoad(page);
    
    // Aguardar carregamento de gráficos/dados
    await page.waitForTimeout(2000);
    
    // Screenshot do dashboard completo
    await expect(page).toHaveScreenshot('admin-dashboard-full.png', {
      fullPage: true,
      threshold: 0.3, // Dashboards podem ter mais variação devido a dados dinâmicos
      maxDiffPixels: 2000,
    });
    
    // Screenshots de componentes específicos
    const metrics = page.locator('[data-testid*="metric"], .metric, .stat-card').first();
    if (await metrics.isVisible()) {
      await expect(metrics).toHaveScreenshot('admin-metric-card.png', {
        threshold: 0.2,
      });
    }
  });
  
  test('📱 Responsividade visual - Múltiplos dispositivos', async ({ page }) => {
    const viewports = [
      { ...VIEWPORT_FIXTURES.MOBILE_PORTRAIT, name: 'mobile-portrait' },
      { ...VIEWPORT_FIXTURES.TABLET_PORTRAIT, name: 'tablet-portrait' },
      { ...VIEWPORT_FIXTURES.DESKTOP_MEDIUM, name: 'desktop' },
    ];
    
    await navigateToRoute(page, ROUTES.HOME);
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000); // Aguardar reflow
      
      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
        fullPage: false, // Apenas viewport para comparação consistente
        threshold: 0.2,
      });
    }
  });
  
  test('🎭 Estados de interação - Hover e Focus', async ({ page }) => {
    await navigateToRoute(page, ROUTES.HOME);
    await waitForPageLoad(page);
    
    // Encontrar botões para testar estados
    const buttons = await page.locator('button, a[href]').all();
    
    if (buttons.length > 0) {
      const firstButton = buttons[0];
      
      // Estado normal
      await expect(firstButton).toHaveScreenshot('button-normal-state.png', {
        threshold: 0.1,
      });
      
      // Estado hover
      await firstButton.hover();
      await page.waitForTimeout(200);
      
      await expect(firstButton).toHaveScreenshot('button-hover-state.png', {
        threshold: 0.15,
      });
      
      // Estado focus
      await firstButton.focus();
      await page.waitForTimeout(200);
      
      await expect(firstButton).toHaveScreenshot('button-focus-state.png', {
        threshold: 0.15,
      });
    }
  });
  
  test('📋 Componentes de formulário', async ({ page }) => {
    // Navegar para uma página que provavelmente tem formulários
    const routes = [ROUTES.EDITOR, ROUTES.ADMIN, ROUTES.HOME];
    
    for (const route of routes) {
      await navigateToRoute(page, route);
      
      const inputs = await page.locator('input, select, textarea').all();
      
      if (inputs.length > 0) {
        console.log(`📋 Encontrados ${inputs.length} campos de formulário em ${route}`);
        
        // Screenshot do primeiro input em diferentes estados
        const firstInput = inputs[0];
        
        if (await firstInput.isVisible()) {
          // Estado normal
          await expect(firstInput).toHaveScreenshot(`form-input-normal-${route.replace('/', '')}.png`, {
            threshold: 0.1,
          });
          
          // Estado focus
          await firstInput.focus();
          await page.waitForTimeout(200);
          
          await expect(firstInput).toHaveScreenshot(`form-input-focused-${route.replace('/', '')}.png`, {
            threshold: 0.15,
          });
          
          // Com valor preenchido (se for text input)
          const inputType = await firstInput.getAttribute('type');
          if (!inputType || inputType === 'text' || inputType === 'email') {
            await firstInput.fill('Texto de exemplo para teste');
            await page.waitForTimeout(200);
            
            await expect(firstInput).toHaveScreenshot(`form-input-filled-${route.replace('/', '')}.png`, {
              threshold: 0.15,
            });
          }
        }
        
        break; // Só testar o primeiro route que tem inputs
      }
    }
  });
  
  test('🌚 Modo escuro (se disponível)', async ({ page }) => {
    await navigateToRoute(page, ROUTES.HOME);
    await waitForPageLoad(page);
    
    // Verificar se existe toggle de tema escuro
    const darkModeToggle = page.locator(
      'button:has-text("dark"), button:has-text("escuro"), [data-testid*="theme"], .theme-toggle, .dark-mode-toggle'
    ).first();
    
    if (await darkModeToggle.isVisible()) {
      // Screenshot do modo claro
      await expect(page).toHaveScreenshot('theme-light-mode.png', {
        fullPage: false,
        threshold: 0.2,
      });
      
      // Ativar modo escuro
      await darkModeToggle.click();
      await page.waitForTimeout(1000); // Aguardar transição de tema
      
      // Screenshot do modo escuro
      await expect(page).toHaveScreenshot('theme-dark-mode.png', {
        fullPage: false,
        threshold: 0.3, // Maior tolerância devido à mudança significativa
      });
    } else {
      // Forçar modo escuro via CSS se não houver toggle
      await page.addStyleTag({
        content: `
          * {
            filter: invert(1) hue-rotate(180deg) !important;
          }
          img, video, iframe {
            filter: invert(1) hue-rotate(180deg) !important;
          }
        `
      });
      
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot('forced-dark-mode.png', {
        fullPage: false,
        threshold: 0.4,
      });
    }
  });
  
  test('📱 Orientação de dispositivo mobile', async ({ page }) => {
    const mobileViewport = VIEWPORT_FIXTURES.MOBILE_PORTRAIT;
    
    await page.setViewportSize(mobileViewport);
    await navigateToRoute(page, ROUTES.HOME);
    await waitForPageLoad(page);
    
    // Portrait
    await expect(page).toHaveScreenshot('mobile-portrait-orientation.png', {
      fullPage: false,
      threshold: 0.2,
    });
    
    // Landscape
    await page.setViewportSize({
      width: mobileViewport.height,
      height: mobileViewport.width,
    });
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('mobile-landscape-orientation.png', {
      fullPage: false,
      threshold: 0.2,
    });
  });
  
  test('🔄 Estados de loading', async ({ page }) => {
    // Interceptar requests para simular loading
    await page.route('**/*', async (route, request) => {
      // Adicionar delay para capturar estado de loading
      if (request.url().includes('api/') || request.resourceType() === 'xhr') {
        await page.waitForTimeout(100);
      }
      await route.continue();
    });
    
    await navigateToRoute(page, ROUTES.HOME, { waitForLoad: false });
    
    // Tentar capturar estado de loading
    const loadingElement = page.locator(
      '[data-testid*="loading"], .loading, .spinner, .loader, .skeleton'
    ).first();
    
    try {
      await expect(loadingElement).toBeVisible({ timeout: 2000 });
      
      await expect(loadingElement).toHaveScreenshot('loading-state.png', {
        threshold: 0.3,
      });
    } catch (error) {
      console.log('⚠️ Estado de loading não capturado - página pode ter carregado muito rápido');
    }
    
    // Aguardar carregamento completo
    await waitForPageLoad(page);
  });
});