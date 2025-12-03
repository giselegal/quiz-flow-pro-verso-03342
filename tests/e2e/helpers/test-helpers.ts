/**
 * 🛠️ HELPERS E UTILITÁRIOS PARA TESTES E2E
 * 
 * Conjunto de funções auxiliares para melhorar a robustez,
 * reutilização e manutenibilidade dos testes E2E.
 */

import { Page, Locator, expect } from '@playwright/test';

// Timeouts configuráveis
export const TIMEOUTS = {
  FAST: 5000,
  NORMAL: 10000,
  SLOW: 30000,
  VERY_SLOW: 60000,
  NAVIGATION: 30000,
  API_CALL: 15000,
} as const;

// Seletores comuns reutilizáveis
export const SELECTORS = {
  // Elementos de navegação
  NAVIGATION: 'nav, [role="navigation"], header',
  MAIN_CONTENT: 'main, [role="main"], .main-content',
  FOOTER: 'footer, [role="contentinfo"]',
  
  // Quiz elements
  QUIZ_CONTAINER: '[data-testid="quiz-container"], .quiz-container, .quiz-wrapper',
  QUIZ_QUESTION: '[data-testid="question"], .quiz-question, .question',
  QUIZ_OPTIONS: '[data-testid*="option"], .option, .quiz-option',
  QUIZ_PROGRESS: '[data-testid*="progress"], .progress, .quiz-progress',
  QUIZ_NEXT_BUTTON: '[data-testid="next"], .next-button, button:has-text("próximo")',
  
  // Editor elements
  EDITOR_CANVAS: '[data-testid*="canvas"], .editor-canvas, .canvas',
  EDITOR_SIDEBAR: '[data-testid*="sidebar"], .sidebar, .properties-panel',
  EDITOR_TOOLBAR: '[data-testid*="toolbar"], .toolbar, .editor-toolbar',
  EDITOR_BLOCKS: '[data-testid*="block"], .block, .component',
  
  // Admin elements
  ADMIN_METRICS: '[data-testid*="metric"], .metric, .stat-card, .dashboard-card',
  ADMIN_TABLES: 'table, .table, .data-table, .admin-table',
  ADMIN_CHARTS: '[data-testid*="chart"], .chart, canvas[data-chart], svg[data-chart]',
  
  // Form elements
  BUTTONS: 'button, [role="button"], input[type="button"], input[type="submit"]',
  LINKS: 'a[href], [role="link"]',
  INPUTS: 'input, textarea, select, [role="textbox"]',
  
  // Loading states
  LOADING_SPINNER: '[data-testid*="loading"], .loading, .spinner, .loader',
  SKELETON_LOADER: '[data-testid*="skeleton"], .skeleton, .loading-skeleton',
} as const;

// URLs e rotas comuns
export const ROUTES = {
  HOME: '/',
  QUIZ: '/quiz-estilo',
  EDITOR: '/editor',
  ADMIN: '/admin',
  TEMPLATES: '/templates',
  DASHBOARD: '/dashboard',
} as const;

/**
 * 📡 Helper para aguardar carregamento de página com múltiplas estratégias
 */
export async function waitForPageLoad(page: Page, options: {
  timeout?: number;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  fallback?: boolean;
} = {}) {
  const { timeout = TIMEOUTS.NORMAL, waitUntil = 'networkidle', fallback = true } = options;
  
  try {
    await page.waitForLoadState(waitUntil, { timeout });
  } catch (error) {
    if (fallback) {
      console.log(`⚠️ Fallback: ${waitUntil} failed, trying domcontentloaded`);
      await page.waitForLoadState('domcontentloaded', { timeout: TIMEOUTS.FAST });
    } else {
      throw error;
    }
  }
}

/**
 * 🎯 Helper para aguardar elementos com retry automático
 */
export async function waitForElement(
  page: Page,
  selector: string,
  options: {
    timeout?: number;
    visible?: boolean;
    retries?: number;
    retryDelay?: number;
  } = {}
): Promise<Locator> {
  const { timeout = TIMEOUTS.NORMAL, visible = true, retries = 3, retryDelay = 1000 } = options;
  
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const locator = page.locator(selector);
      
      if (visible) {
        await expect(locator).toBeVisible({ timeout });
      } else {
        await expect(locator).toBeAttached({ timeout });
      }
      
      return locator;
    } catch (error) {
      lastError = error as Error;
      
      if (i < retries - 1) {
        console.log(`⚠️ Retry ${i + 1}/${retries} for selector: ${selector}`);
        await page.waitForTimeout(retryDelay);
      }
    }
  }
  
  throw new Error(`Failed to find element after ${retries} retries: ${selector}. Last error: ${lastError?.message}`);
}

/**
 * 📸 Helper para screenshots com contexto melhorado
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  options: {
    fullPage?: boolean;
    path?: string;
    quality?: number;
  } = {}
) {
  const { fullPage = true, quality = 80 } = options;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  const path = options.path || `tests/e2e/screenshots/${filename}`;
  
  await page.screenshot({ path, fullPage, quality });
  console.log(`📸 Screenshot saved: ${path}`);
  return path;
}

/**
 * 🌐 Helper para navegação robusta com validação
 */
export async function navigateToRoute(
  page: Page,
  route: string,
  options: {
    waitForLoad?: boolean;
    validateUrl?: boolean;
    timeout?: number;
    retries?: number;
  } = {}
) {
  const { waitForLoad = true, validateUrl = true, timeout = TIMEOUTS.NAVIGATION, retries = 2 } = options;
  const baseUrl = 'http://localhost:8081';
  const fullUrl = `${baseUrl}${route}`;
  
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await page.goto(fullUrl, { timeout });
      
      if (response && response.status() >= 400) {
        throw new Error(`Navigation failed with status: ${response.status()}`);
      }
      
      if (waitForLoad) {
        await waitForPageLoad(page, { timeout: TIMEOUTS.NORMAL });
      }
      
      if (validateUrl) {
        const currentUrl = page.url();
        if (!currentUrl.includes(route) && route !== '/') {
          console.log(`⚠️ URL mismatch: expected ${route}, got ${currentUrl}`);
        }
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      if (i < retries - 1) {
        console.log(`⚠️ Navigation retry ${i + 1}/${retries} for route: ${route}`);
        await page.waitForTimeout(2000);
      }
    }
  }
  
  throw new Error(`Navigation failed after ${retries} retries to ${route}. Last error: ${lastError?.message}`);
}

/**
 * 🔍 Helper para verificação de responsividade
 */
export async function testResponsiveness(
  page: Page,
  testFn: (viewport: { name: string; width: number; height: number }) => Promise<void>,
  viewports: Array<{ name: string; width: number; height: number }> = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ]
) {
  const results: Array<{ viewport: string; success: boolean; error?: string }> = [];
  
  for (const viewport of viewports) {
    try {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500); // Aguardar reflow
      
      await testFn(viewport);
      
      results.push({ viewport: viewport.name, success: true });
      console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}): OK`);
    } catch (error) {
      results.push({ 
        viewport: viewport.name, 
        success: false, 
        error: (error as Error).message 
      });
      console.log(`❌ ${viewport.name} (${viewport.width}x${viewport.height}): ${(error as Error).message}`);
    }
  }
  
  return results;
}

/**
 * 📊 Helper para coleta de métricas de performance
 */
export async function collectPerformanceMetrics(page: Page) {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      // Navigation timing (usando fetchStart como referência)
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
      loadComplete: Math.round(navigation.loadEventEnd - navigation.fetchStart),
      
      // Paint timing
      firstPaint: Math.round(paint.find(p => p.name === 'first-paint')?.startTime || 0),
      firstContentfulPaint: Math.round(paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0),
      
      // Memory (if available)
      memory: (performance as any).memory ? {
        usedJSHeapSize: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024), // MB
        totalJSHeapSize: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024), // MB
      } : null,
      
      // Resource timing
      resourceCount: performance.getEntriesByType('resource').length,
    };
  });
  
  return metrics;
}

/**
 * 🔄 Helper para retry de operações com backoff exponencial
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    exponentialBackoff?: boolean;
    condition?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const { 
    retries = 3, 
    delay = 1000, 
    exponentialBackoff = true,
    condition = () => true 
  } = options;
  
  let lastError: Error;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (!condition(lastError)) {
        throw lastError; // Não fazer retry se condição não for atendida
      }
      
      if (i < retries - 1) {
        const currentDelay = exponentialBackoff ? delay * Math.pow(2, i) : delay;
        console.log(`⚠️ Operation failed, retrying in ${currentDelay}ms (attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }
  }
  
  throw new Error(`Operation failed after ${retries} retries. Last error: ${lastError!.message}`);
}

/**
 * 🎨 Helper para aguardar animações CSS
 */
export async function waitForAnimations(page: Page, selector?: string) {
  await page.evaluate((sel) => {
    return new Promise((resolve) => {
      const elements = sel ? document.querySelectorAll(sel) : [document.documentElement];
      
      let animationCount = 0;
      
      elements.forEach(element => {
        const animations = element.getAnimations();
        animationCount += animations.length;
        
        animations.forEach(animation => {
          animation.addEventListener('finish', () => {
            animationCount--;
            if (animationCount === 0) resolve(undefined);
          });
          animation.addEventListener('cancel', () => {
            animationCount--;
            if (animationCount === 0) resolve(undefined);
          });
        });
      });
      
      // Se não há animações, resolver imediatamente
      if (animationCount === 0) resolve(undefined);
      
      // Fallback timeout
      setTimeout(() => resolve(undefined), 5000);
    });
  }, selector);
}

/**
 * 📱 Helper para simular interações de usuário mobile
 */
export async function simulateMobileInteractions(page: Page) {
  // Simular toque em vez de clique
  await page.addInitScript(() => {
    // Converter cliques em eventos de toque quando apropriado
    document.addEventListener('click', (e) => {
      if ('ontouchstart' in window) {
        e.preventDefault();
        const touchEvent = new TouchEvent('touchstart', {
          bubbles: true,
          cancelable: true,
        });
        e.target?.dispatchEvent(touchEvent);
      }
    });
  });
  
  // Simular orientação de dispositivo
  await page.evaluate(() => {
    Object.defineProperty(screen, 'orientation', {
      value: { angle: 0, type: 'portrait-primary' },
      writable: true
    });
  });
}

/**
 * 🔍 Helper para debug de elementos não encontrados
 */
export async function debugElementSearch(page: Page, selector: string) {
  const debug = await page.evaluate((sel) => {
    const elements = document.querySelectorAll(sel);
    const allElements = document.querySelectorAll('*');
    
    return {
      found: elements.length,
      selector: sel,
      similarSelectors: Array.from(allElements)
        .map(el => el.tagName.toLowerCase())
        .filter((tag, index, arr) => arr.indexOf(tag) === index)
        .slice(0, 20),
      bodyContent: document.body?.textContent?.substring(0, 200) || 'No body content',
      documentReady: document.readyState,
    };
  }, selector);
  
  console.log('🔍 Debug element search:');
  console.log(`   Selector: ${debug.selector}`);
  console.log(`   Found: ${debug.found} elements`);
  console.log(`   Document ready: ${debug.documentReady}`);
  console.log(`   Available tags: ${debug.similarSelectors.join(', ')}`);
  console.log(`   Body preview: ${debug.bodyContent}...`);
  
  return debug;
}

/**
 * 📋 Helper para validação de acessibilidade básica
 */
export async function validateBasicAccessibility(page: Page) {
  const a11yIssues = await page.evaluate(() => {
    const issues: string[] = [];
    
    // Verificar imagens sem alt
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.getAttribute('alt')) {
        issues.push(`Image ${index + 1} missing alt attribute`);
      }
    });
    
    // Verificar botões sem texto ou aria-label
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      const hasText = button.textContent?.trim();
      const hasAriaLabel = button.getAttribute('aria-label');
      const hasTitle = button.getAttribute('title');
      
      if (!hasText && !hasAriaLabel && !hasTitle) {
        issues.push(`Button ${index + 1} missing accessible name`);
      }
    });
    
    // Verificar headings em ordem
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    if (headings.length === 0) {
      issues.push('No headings found on page');
    }
    
    // Verificar contraste (básico)
    const hasWhiteBackground = document.body.style.backgroundColor === 'white' || 
                              document.body.style.backgroundColor === '#fff' ||
                              document.body.style.backgroundColor === '#ffffff';
    
    return {
      issues,
      stats: {
        images: images.length,
        buttons: buttons.length,
        headings: headings.length,
        hasWhiteBackground
      }
    };
  });
  
  return a11yIssues;
}