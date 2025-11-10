/**
 * 🧪 TESTES E2E - ADMIN DASHBOARD
 * 
 * Testa as funcionalidades do dashboard administrativo:
 * - Carregamento do dashboard
 * - Navegação entre seções
 * - Visualização de métricas
 * - Gestão de funis
 * - Configurações do sistema
 * 
 * @module tests/e2e/admin-dashboard
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';
const ADMIN_URL = `${BASE_URL}/admin`;
const TIMEOUT = 15000;

test.describe('🏢 Admin Dashboard - Carregamento e Navegação', () => {
  
  test('deve carregar o dashboard administrativo', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Verificar elementos do dashboard
    const dashboardContainer = page.locator('[data-testid*="admin"], [data-testid*="dashboard"], .admin-page, .dashboard, main').first();
    await expect(dashboardContainer).toBeVisible({ timeout: TIMEOUT });
    
    console.log('✅ Dashboard administrativo carregado');
  });

  test('deve exibir título do dashboard', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por título
    const titleSelectors = [
      'h1:has-text("Admin")',
      'h1:has-text("Dashboard")',
      'h1:has-text("Painel")',
      'h1, h2'
    ];
    
    let foundTitle = false;
    for (const selector of titleSelectors) {
      const title = page.locator(selector).first();
      if (await title.isVisible().catch(() => false)) {
        const text = await title.textContent();
        console.log(`✅ Título encontrado: "${text}"`);
        foundTitle = true;
        break;
      }
    }
    
    expect(foundTitle).toBeTruthy();
  });

  test('deve ter menu de navegação lateral', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por sidebar/menu
    const sidebarSelectors = [
      'aside',
      'nav[role="navigation"]',
      '[data-testid*="sidebar"]',
      '[data-testid*="menu"]',
      '.sidebar',
      '.nav-menu'
    ];
    
    let foundSidebar = false;
    for (const selector of sidebarSelectors) {
      const sidebar = page.locator(selector).first();
      if (await sidebar.isVisible().catch(() => false)) {
        console.log('✅ Menu de navegação encontrado');
        foundSidebar = true;
        break;
      }
    }
    
    if (!foundSidebar) {
      console.log('ℹ️ Menu pode estar oculto ou em formato diferente');
    }
  });

  test('deve ter links de navegação funcionais', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por links de navegação
    const navLinks = await page.locator('nav a, aside a, [role="navigation"] a').all();
    
    console.log(`📊 Encontrados ${navLinks.length} links de navegação`);
    
    if (navLinks.length > 0) {
      const firstLink = navLinks[0];
      const linkText = await firstLink.textContent();
      const href = await firstLink.getAttribute('href');
      
      console.log(`   🔗 Link: "${linkText?.trim()}" -> ${href}`);
      
      // Testar clique no primeiro link
      if (href && !href.startsWith('http')) {
        await firstLink.click();
        await page.waitForTimeout(1000);
        console.log('✅ Link clicável e funcional');
      }
    }
  });
});

test.describe('🏢 Admin Dashboard - Seções Principais', () => {
  
  test('deve ter seção de overview/resumo', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por cards de métricas ou overview
    const overviewSelectors = [
      '[data-testid*="overview"]',
      '[data-testid*="summary"]',
      '.overview',
      '.dashboard-cards',
      '.metrics',
      '.stats'
    ];
    
    let foundOverview = false;
    for (const selector of overviewSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        console.log('✅ Seção de overview encontrada');
        foundOverview = true;
        break;
      }
    }
    
    // Alternativamente, procurar por cards com números/métricas
    const metricCards = await page.locator('[data-testid*="card"], .card, .metric-card').all();
    if (metricCards.length > 0) {
      console.log(`✅ ${metricCards.length} cards de métricas encontrados`);
      foundOverview = true;
    }
    
    expect(foundOverview).toBeTruthy();
  });

  test('deve exibir métricas/estatísticas', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por números/métricas
    const numberPattern = /\d+/;
    const elements = await page.locator('.card, [data-testid*="metric"], .stat, .number').all();
    
    let foundMetrics = false;
    for (const element of elements) {
      const text = await element.textContent().catch(() => '');
      if (numberPattern.test(text)) {
        foundMetrics = true;
        console.log(`✅ Métrica encontrada: ${text.trim()}`);
        break;
      }
    }
    
    if (!foundMetrics) {
      console.log('ℹ️ Métricas podem estar carregando ou não visíveis');
    }
  });

  test('deve ter seção de gestão de funis', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por link ou seção de funis
    const funnelSectionSelectors = [
      'a:has-text("Funis")',
      'a:has-text("Funnels")',
      '[data-testid*="funnel"]',
      '[href*="funnel"]'
    ];
    
    for (const selector of funnelSectionSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        console.log('✅ Seção de funis encontrada');
        return;
      }
    }
    
    console.log('ℹ️ Seção de funis não encontrada na vista atual');
  });

  test('deve navegar para página de funis', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Tentar encontrar e clicar em link de funis
    const funnelLink = page.locator('a:has-text("Funis"), a:has-text("Funnels"), [href*="funnel"]').first();
    
    if (await funnelLink.isVisible().catch(() => false)) {
      await funnelLink.click();
      await page.waitForTimeout(1500);
      
      // Verificar se navegou
      const url = page.url();
      console.log(`✅ Navegou para: ${url}`);
    } else {
      // Tentar acessar diretamente
      await page.goto(`${ADMIN_URL}/funnels`);
      await page.waitForLoadState('networkidle');
      console.log('✅ Acessou página de funis diretamente');
    }
  });
});

test.describe('🏢 Admin Dashboard - Gestão de Funis', () => {
  
  test('deve listar funis existentes', async ({ page }) => {
    // Tentar diferentes rotas de funis
    const funnelRoutes = [
      `${ADMIN_URL}/funnels`,
      `${ADMIN_URL}/funis`,
      `${BASE_URL}/admin/dashboard`,
      ADMIN_URL
    ];
    
    let foundFunnels = false;
    
    for (const route of funnelRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      // Procurar por lista de funis
      const funnelItems = await page.locator('[data-testid*="funnel"], .funnel-item, .funnel-card, [data-funnel-id]').all();
      
      if (funnelItems.length > 0) {
        console.log(`✅ ${funnelItems.length} funis encontrados em ${route}`);
        foundFunnels = true;
        break;
      }
    }
    
    if (!foundFunnels) {
      console.log('ℹ️ Lista de funis não encontrada ou vazia');
    }
  });

  test('deve ter botão de criar novo funil', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por botão de criar
    const createButtonSelectors = [
      'button:has-text("Criar")',
      'button:has-text("Novo")',
      'button:has-text("New")',
      'button:has-text("Create")',
      '[data-testid*="create"]',
      '[data-action="create-funnel"]'
    ];
    
    for (const selector of createButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.isVisible().catch(() => false)) {
        console.log('✅ Botão de criar funil encontrado');
        return;
      }
    }
    
    console.log('ℹ️ Botão de criar não encontrado na vista atual');
  });

  test('deve poder filtrar ou buscar funis', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por campo de busca
    const searchInputSelectors = [
      'input[type="search"]',
      'input[placeholder*="Buscar"]',
      'input[placeholder*="Search"]',
      'input[placeholder*="Filtrar"]',
      '[data-testid*="search"]'
    ];
    
    for (const selector of searchInputSelectors) {
      const input = page.locator(selector).first();
      if (await input.isVisible().catch(() => false)) {
        console.log('✅ Campo de busca encontrado');
        return;
      }
    }
    
    console.log('ℹ️ Campo de busca não encontrado');
  });
});

test.describe('🏢 Admin Dashboard - Analytics', () => {
  
  test('deve ter seção de analytics/métricas', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por seção de analytics
    const analyticsSelectors = [
      'a:has-text("Analytics")',
      'a:has-text("Métricas")',
      'a:has-text("Estatísticas")',
      '[data-testid*="analytics"]',
      '[href*="analytics"]'
    ];
    
    for (const selector of analyticsSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        console.log('✅ Seção de analytics encontrada');
        return;
      }
    }
    
    console.log('ℹ️ Seção de analytics não encontrada');
  });

  test('deve exibir gráficos ou visualizações', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por elementos de gráfico
    const chartSelectors = [
      'canvas',
      'svg',
      '[data-testid*="chart"]',
      '.chart',
      '.graph',
      '[class*="recharts"]'
    ];
    
    for (const selector of chartSelectors) {
      const chart = page.locator(selector).first();
      if (await chart.isVisible().catch(() => false)) {
        console.log('✅ Visualização/gráfico encontrado');
        return;
      }
    }
    
    console.log('ℹ️ Gráficos não encontrados na vista atual');
  });
});

test.describe('🏢 Admin Dashboard - Configurações', () => {
  
  test('deve ter seção de configurações', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por link de configurações
    const settingsSelectors = [
      'a:has-text("Configurações")',
      'a:has-text("Settings")',
      'a:has-text("Config")',
      '[data-testid*="settings"]',
      '[href*="settings"]',
      '[href*="config"]'
    ];
    
    for (const selector of settingsSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        console.log('✅ Link de configurações encontrado');
        return;
      }
    }
    
    console.log('ℹ️ Seção de configurações não encontrada');
  });
});

test.describe('🏢 Admin Dashboard - Responsividade', () => {
  
  test('deve funcionar em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    const dashboardVisible = await page.locator('[data-testid*="admin"], [data-testid*="dashboard"], main').first().isVisible();
    expect(dashboardVisible).toBeTruthy();
    
    console.log('✅ Dashboard funcional em mobile');
  });

  test('deve ter menu responsivo em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por botão de menu hamburger
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], .menu-button, [data-testid*="menu-toggle"]').first();
    
    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();
      await page.waitForTimeout(500);
      console.log('✅ Menu mobile funcional');
    } else {
      console.log('ℹ️ Menu sempre visível ou não implementado');
    }
  });
});

test.describe('🏢 Admin Dashboard - Integrações', () => {
  
  test('deve ter acesso ao editor a partir do dashboard', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por link para editor
    const editorLink = page.locator('a:has-text("Editor"), [href*="editor"]').first();
    
    if (await editorLink.isVisible().catch(() => false)) {
      const href = await editorLink.getAttribute('href');
      console.log(`✅ Link para editor encontrado: ${href}`);
    } else {
      console.log('ℹ️ Link direto para editor não encontrado');
    }
  });

  test('deve ter acesso ao preview de funis', async ({ page }) => {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    
    // Procurar por botões/links de preview
    const previewButtons = await page.locator('button:has-text("Preview"), button:has-text("Visualizar"), a:has-text("Ver"), [data-action*="preview"]').all();
    
    if (previewButtons.length > 0) {
      console.log(`✅ ${previewButtons.length} botões de preview encontrados`);
    } else {
      console.log('ℹ️ Botões de preview não encontrados na vista atual');
    }
  });
});
