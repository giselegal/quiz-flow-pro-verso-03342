/**
 * 🌐 TESTES DE ACESSIBILIDADE E QUALIDADE
 * 
 * Testes abrangentes de acessibilidade usando axe-core,
 * validação SEO e testes de usabilidade.
 */

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { 
  navigateToRoute, 
  waitForPageLoad, 
  collectPerformanceMetrics,
  validateBasicAccessibility,
  ROUTES,
  TIMEOUTS,
  testResponsiveness
} from './helpers/test-helpers';
import { VIEWPORT_FIXTURES } from './fixtures/test-fixtures';

test.describe('🔍 Acessibilidade e Qualidade', () => {
  
  test('✅ Validação de acessibilidade completa - Página inicial', async ({ page }) => {
    await navigateToRoute(page, ROUTES.HOME);
    await waitForPageLoad(page);
    
    // Usar axe-core para análise completa de acessibilidade
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Verificar se não há violações críticas
    expect(accessibilityScanResults.violations).toHaveLength(0);
    
    // Log de resultados para debug
    if (accessibilityScanResults.violations.length > 0) {
      console.log('🚨 Violações de acessibilidade encontradas:');
      accessibilityScanResults.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.id}: ${violation.description}`);
        violation.nodes.forEach(node => {
          console.log(`   - ${node.html}`);
          console.log(`   - ${node.failureSummary}`);
        });
      });
    }
    
    // Verificações manuais adicionais
    const basicA11y = await validateBasicAccessibility(page);
    expect(basicA11y.issues.length).toBeLessThan(3); // Permitir até 2 issues menores
    
    // Verificar navegação por teclado
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
  
  test('🎯 Validação SEO básica', async ({ page }) => {
    await navigateToRoute(page, ROUTES.HOME);
    
    const seoData = await page.evaluate(() => {
      const title = document.title;
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
      const h1Elements = document.querySelectorAll('h1');
      const h2Elements = document.querySelectorAll('h2');
      const images = document.querySelectorAll('img');
      const links = document.querySelectorAll('a[href]');
      
      // Verificar imagens sem alt
      const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt'));
      
      // Verificar links sem texto
      const linksWithoutText = Array.from(links).filter(link => 
        !link.textContent?.trim() && 
        !link.getAttribute('aria-label') &&
        !link.getAttribute('title')
      );
      
      return {
        title,
        metaDescription,
        metaKeywords,
        h1Count: h1Elements.length,
        h2Count: h2Elements.length,
        imagesTotal: images.length,
        imagesWithoutAlt: imagesWithoutAlt.length,
        linksTotal: links.length,
        linksWithoutText: linksWithoutText.length,
        lang: document.documentElement.getAttribute('lang'),
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content'),
      };
    });
    
    // Validações SEO
    expect(seoData.title).toBeTruthy();
    expect(seoData.title.length).toBeGreaterThan(10);
    expect(seoData.title.length).toBeLessThan(60);
    
    if (seoData.metaDescription) {
      expect(seoData.metaDescription.length).toBeGreaterThan(50);
      expect(seoData.metaDescription.length).toBeLessThan(160);
    }
    
    expect(seoData.h1Count).toBeGreaterThan(0);
    expect(seoData.h1Count).toBeLessThanOrEqual(1); // Apenas um H1 por página
    
    expect(seoData.imagesWithoutAlt).toBeLessThanOrEqual(2); // Permitir até 2 imagens decorativas
    expect(seoData.linksWithoutText).toBe(0);
    
    expect(seoData.lang).toBeTruthy(); // Lang deve estar definido
    expect(seoData.viewport).toBeTruthy(); // Viewport deve estar definido
    
    console.log('📊 Dados SEO coletados:', seoData);
  });
  
  test('📱 Responsividade completa com múltiplos viewports', async ({ page }) => {
    const viewportsToTest = [
      VIEWPORT_FIXTURES.MOBILE_PORTRAIT,
      VIEWPORT_FIXTURES.TABLET_PORTRAIT,
      VIEWPORT_FIXTURES.DESKTOP_MEDIUM,
    ];
    
    await navigateToRoute(page, ROUTES.HOME);
    
    const responsiveResults = await testResponsiveness(page, async (viewport: { name: string; width: number; height: number }) => {
      // Verificar se elementos principais estão visíveis
      await expect(page.locator('body')).toBeVisible();
      
      // Verificar se não há overflow horizontal
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      if (hasHorizontalScroll && viewport.width < 768) {
        console.log(`⚠️ Scroll horizontal detectado em ${viewport.name} - pode ser aceitável em mobile`);
      } else {
        expect(hasHorizontalScroll).toBe(false);
      }
      
      // Verificar se elementos interativos têm tamanho adequado para toque
      if (viewport.width < 768) { // Mobile
        const touchTargets = await page.evaluate(() => {
          const buttons = document.querySelectorAll('button, a[href], input[type="button"], input[type="submit"]');
          const smallTargets: { element: string; width: number; height: number }[] = [];
          
          buttons.forEach((button, index) => {
            const rect = button.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) { // 44px é o mínimo recomendado
              smallTargets.push({
                element: `${button.tagName}[${index}]`,
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              });
            }
          });
          
          return smallTargets;
        });
        
        if (touchTargets.length > 0) {
          console.log(`⚠️ Elementos pequenos para toque em ${viewport.name}:`, touchTargets);
        }
        expect(touchTargets.length).toBeLessThan(3); // Permitir alguns elementos pequenos
      }
    }, viewportsToTest);
    
    // Verificar se a maioria dos testes passou
    const successCount = responsiveResults.filter((r: { success: boolean }) => r.success).length;
    const successRate = (successCount / responsiveResults.length) * 100;
    
    expect(successRate).toBeGreaterThan(80); // Pelo menos 80% dos viewports devem passar
    
    console.log(`📱 Taxa de sucesso responsivo: ${successRate.toFixed(1)}%`);
  });
  
  test('🎨 Validação de contraste de cores', async ({ page }) => {
    await navigateToRoute(page, ROUTES.HOME);
    
    const contrastResults = await page.evaluate(() => {
      // Função para calcular luminância
      function getLuminance(rgb: { r: number; g: number; b: number }) {
        const { r, g, b } = rgb;
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }
      
      // Função para calcular contraste
      function getContrast(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }) {
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
      }
      
      // Função para converter hex/rgb para RGB object
      function parseColor(colorStr: string): { r: number; g: number; b: number } | null {
        if (colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') {
          return { r: 255, g: 255, b: 255 }; // Assume branco como padrão
        }
        
        // RGB/RGBA
        const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
          return {
            r: parseInt(rgbMatch[1]),
            g: parseInt(rgbMatch[2]),
            b: parseInt(rgbMatch[3]),
          };
        }
        
        // Hex
        const hexMatch = colorStr.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        if (hexMatch) {
          return {
            r: parseInt(hexMatch[1], 16),
            g: parseInt(hexMatch[2], 16),
            b: parseInt(hexMatch[3], 16),
          };
        }
        
        return null;
      }
      
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, input, label');
      const contrastIssues: Array<{
        element: string;
        contrast: number;
        textColor: string;
        bgColor: string;
        wcagAA: boolean;
        wcagAAA: boolean;
      }> = [];
      
      textElements.forEach((element, index) => {
        const styles = window.getComputedStyle(element);
        const textColor = styles.color;
        const bgColor = styles.backgroundColor;
        
        const textRGB = parseColor(textColor);
        const bgRGB = parseColor(bgColor);
        
        if (textRGB && bgRGB) {
          const contrast = getContrast(textRGB, bgRGB);
          const wcagAA = contrast >= 4.5; // WCAG AA padrão
          const wcagAAA = contrast >= 7; // WCAG AAA
          
          if (!wcagAA) {
            contrastIssues.push({
              element: `${element.tagName}[${index}]`,
              contrast: Math.round(contrast * 100) / 100,
              textColor,
              bgColor,
              wcagAA,
              wcagAAA,
            });
          }
        }
      });
      
      return {
        totalElements: textElements.length,
        issues: contrastIssues.slice(0, 10), // Limitar para evitar output excessivo
        issueCount: contrastIssues.length,
      };
    });
    
    console.log('🎨 Análise de contraste:', {
      elementos: contrastResults.totalElements,
      problemas: contrastResults.issueCount,
    });
    
    if (contrastResults.issues.length > 0) {
      console.log('🚨 Problemas de contraste encontrados:');
      contrastResults.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.element}: ${issue.contrast}:1 (${issue.textColor} on ${issue.bgColor})`);
      });
    }
    
    // Permitir alguns problemas menores, mas não muitos
    expect(contrastResults.issueCount).toBeLessThan(5);
  });
  
  test('⌨️ Navegação por teclado completa', async ({ page }) => {
    await navigateToRoute(page, ROUTES.HOME);
    
    // Coletar elementos navegáveis
    const focusableElements = await page.evaluate(() => {
      const selector = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const elements = Array.from(document.querySelectorAll(selector));
      
      return elements.map((el, index) => ({
        index,
        tag: el.tagName,
        type: (el as HTMLInputElement).type || '',
        id: el.id,
        class: el.className,
        text: el.textContent?.trim().substring(0, 50) || '',
        tabIndex: el.getAttribute('tabindex'),
      }));
    });
    
    console.log(`⌨️ Encontrados ${focusableElements.length} elementos navegáveis`);
    
    // Testar navegação sequencial
    let focusedCount = 0;
    const maxTabs = Math.min(focusableElements.length, 15); // Limitar para performance
    
    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press('Tab');
      
      const currentFocused = await page.evaluate(() => {
        const focused = document.activeElement;
        return focused ? {
          tag: focused.tagName,
          id: focused.id,
          class: focused.className,
          visible: focused.getBoundingClientRect().width > 0,
        } : null;
      });
      
      if (currentFocused?.visible) {
        focusedCount++;
      }
    }
    
    // Verificar se conseguiu focar em elementos
    expect(focusedCount).toBeGreaterThan(0);
    
    // Testar navegação reversa
    await page.keyboard.press('Shift+Tab');
    const reverseFocused = await page.evaluate(() => {
      return document.activeElement?.tagName || null;
    });
    
    expect(reverseFocused).toBeTruthy();
    
    console.log(`⌨️ Navegação por teclado: ${focusedCount}/${maxTabs} elementos focados com sucesso`);
  });
  
  test('🔊 Validação de leitores de tela (ARIA)', async ({ page }) => {
    await navigateToRoute(page, ROUTES.HOME);
    
    const ariaAnalysis = await page.evaluate(() => {
      const issues: string[] = [];
      const stats = {
        elementsWithAriaLabel: 0,
        elementsWithAriaDescribedBy: 0,
        landmarkElements: 0,
        headingStructure: [] as string[],
        formLabels: { total: 0, labeled: 0 },
      };
      
      // Verificar elementos com ARIA labels
      const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
      stats.elementsWithAriaLabel = elementsWithAria.length;
      
      // Verificar landmarks
      const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], header, nav, main, aside, footer');
      stats.landmarkElements = landmarks.length;
      
      // Verificar estrutura de headings
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      stats.headingStructure = Array.from(headings).map(h => h.tagName);
      
      // Verificar se há salto de níveis de heading
      for (let i = 1; i < stats.headingStructure.length; i++) {
        const currentLevel = parseInt(stats.headingStructure[i].substring(1));
        const previousLevel = parseInt(stats.headingStructure[i-1].substring(1));
        
        if (currentLevel - previousLevel > 1) {
          issues.push(`Salto de nível de heading: ${stats.headingStructure[i-1]} para ${stats.headingStructure[i]}`);
        }
      }
      
      // Verificar labels de formulário
      const formInputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
      stats.formLabels.total = formInputs.length;
      
      formInputs.forEach((input, index) => {
        const hasLabel = (
          input.id && document.querySelector(`label[for="${input.id}"]`) ||
          input.getAttribute('aria-label') ||
          input.getAttribute('aria-labelledby') ||
          input.getAttribute('title')
        );
        
        if (hasLabel) {
          stats.formLabels.labeled++;
        } else {
          issues.push(`Input sem label: ${input.tagName}[${index}]`);
        }
      });
      
      // Verificar botões sem texto acessível
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button, index) => {
        const hasAccessibleText = (
          button.textContent?.trim() ||
          button.getAttribute('aria-label') ||
          button.getAttribute('aria-labelledby') ||
          button.getAttribute('title')
        );
        
        if (!hasAccessibleText) {
          issues.push(`Botão sem texto acessível: button[${index}]`);
        }
      });
      
      return { issues, stats };
    });
    
    console.log('🔊 Análise ARIA:', ariaAnalysis.stats);
    
    if (ariaAnalysis.issues.length > 0) {
      console.log('🚨 Problemas de ARIA encontrados:');
      ariaAnalysis.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }
    
    // Validações
    expect(ariaAnalysis.stats.landmarkElements).toBeGreaterThan(0);
    expect(ariaAnalysis.stats.headingStructure.length).toBeGreaterThan(0);
    
    if (ariaAnalysis.stats.formLabels.total > 0) {
      const labelingRate = (ariaAnalysis.stats.formLabels.labeled / ariaAnalysis.stats.formLabels.total) * 100;
      expect(labelingRate).toBeGreaterThan(80); // Pelo menos 80% dos inputs devem ter labels
    }
    
    expect(ariaAnalysis.issues.length).toBeLessThan(3); // Permitir poucos problemas menores
  });
  
  test('⚡ Performance e Core Web Vitals', async ({ page }) => {
    await navigateToRoute(page, ROUTES.HOME, { waitForLoad: false });
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    
    const metrics = await collectPerformanceMetrics(page);
    console.log('⚡ Métricas de performance:', metrics);
    
    // Core Web Vitals (valores em ms)
    expect(metrics.firstContentfulPaint).toBeLessThan(2000); // FCP < 2s
    
    // Verificações de memória (se disponível)
    if (metrics.memory) {
      expect(metrics.memory.usedJSHeapSize).toBeLessThan(50); // < 50MB
    }
    
    // Verificar se não há muitos recursos
    expect(metrics.resourceCount).toBeLessThan(100);
    
    // Verificar CLS (Cumulative Layout Shift)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          resolve(clsValue);
        }).observe({ type: 'layout-shift', buffered: true });
        
        // Timeout caso não haja layout shifts
        setTimeout(() => resolve(0), 1000);
      });
    });
    
    expect(cls).toBeLessThan(0.1); // CLS < 0.1 é bom
    console.log(`🎯 Cumulative Layout Shift: ${cls}`);
  });
});