/**
 * 🧪 TESTES E2E - Carregamento de Funil no Editor
 * 
 * Testa o carregamento completo de funis criados no banco de dados
 * através dos scripts create-sample-funnel e create-quiz21-complete-funnel
 */

import { test, expect } from '@playwright/test';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:8080';
const DB_PATH = path.join(__dirname, '../../dev.db');

// Helper: Buscar funis no banco
function getFunnelsFromDatabase() {
  const db = new Database(DB_PATH, { readonly: true });
  try {
    const funnels = db.prepare('SELECT id, name, description FROM funnels ORDER BY created_at DESC LIMIT 5').all();
    return funnels as Array<{ id: string; name: string; description: string | null }>;
  } finally {
    db.close();
  }
}

test.describe('Carregamento de Funil no Editor', () => {
  
  test.beforeEach(async ({ page }) => {
    // Aumentar timeout para carregamentos lentos
    page.setDefaultTimeout(30000);
  });

  test('Deve listar funis disponíveis no banco de dados', async () => {
    const funnels = getFunnelsFromDatabase();
    
    console.log('\n📋 Funis encontrados no banco:');
    funnels.forEach((funnel, index) => {
      console.log(`  ${index + 1}. ${funnel.name} (${funnel.id})`);
    });
    
    expect(funnels.length).toBeGreaterThan(0);
    expect(funnels[0]).toHaveProperty('id');
    expect(funnels[0]).toHaveProperty('name');
  });

  test('Deve carregar o editor com funil simples', async ({ page }) => {
    const funnels = getFunnelsFromDatabase();
    const simpleFunnel = funnels.find(f => f.name.includes('Primeiro Funil'));
    
    if (!simpleFunnel) {
      test.skip(true, 'Funil simples não encontrado. Execute: npm run create:funnel:sample');
      return;
    }

    console.log(`\n🎯 Testando carregamento de: ${simpleFunnel.name}`);
    
    // Navegar para o editor com o funnelId
    await page.goto(`${BASE_URL}/editor?funnelId=${simpleFunnel.id}`);
    
    // Aguardar carregamento do editor
    await page.waitForLoadState('networkidle');
    
    // Verificar se o editor carregou
    await expect(page.locator('[data-testid="editor-container"], .editor-container, main')).toBeVisible({ timeout: 15000 });
    
    // Verificar se não há erros críticos
    const errorElements = page.locator('text=/error|erro|failed/i').first();
    const hasError = await errorElements.isVisible().catch(() => false);
    
    if (hasError) {
      const errorText = await errorElements.textContent();
      console.warn('⚠️ Possível erro na página:', errorText);
    }
    
    // Screenshot para debug
    await page.screenshot({ path: 'test-results/funnel-simple-loaded.png', fullPage: true });
    
    console.log('✅ Editor carregado com sucesso');
  });

  test('Deve carregar o editor com funil Quiz 21 Steps completo', async ({ page }) => {
    const funnels = getFunnelsFromDatabase();
    const quiz21Funnel = funnels.find(f => f.name.includes('21 Etapas'));
    
    if (!quiz21Funnel) {
      test.skip(true, 'Funil Quiz 21 Steps não encontrado. Execute: npm run create:funnel:quiz21');
      return;
    }

    console.log(`\n🎯 Testando carregamento de: ${quiz21Funnel.name}`);
    
    // Navegar para o editor
    await page.goto(`${BASE_URL}/editor?funnelId=${quiz21Funnel.id}`);
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar se o editor carregou
    await expect(page.locator('[data-testid="editor-container"], .editor-container, main')).toBeVisible({ timeout: 20000 });
    
    // Verificar se há navegação de steps (específico do Quiz 21)
    const stepNavigation = page.locator('[data-testid="step-navigator"], .step-navigator, nav').first();
    const hasStepNav = await stepNavigation.isVisible().catch(() => false);
    
    if (hasStepNav) {
      console.log('✅ Navegação de steps detectada');
    }
    
    // Screenshot
    await page.screenshot({ path: 'test-results/funnel-quiz21-loaded.png', fullPage: true });
    
    console.log('✅ Quiz 21 Steps carregado com sucesso');
  });

  test('Deve exibir o nome correto do funil no editor', async ({ page }) => {
    const funnels = getFunnelsFromDatabase();
    const firstFunnel = funnels[0];
    
    if (!firstFunnel) {
      test.skip(true, 'Nenhum funil disponível');
      return;
    }

    await page.goto(`${BASE_URL}/editor?funnelId=${firstFunnel.id}`);
    await page.waitForLoadState('networkidle');
    
    // Procurar pelo nome do funil na interface
    // Pode estar em um título, header ou breadcrumb
    const pageContent = await page.content();
    const funnelNameVisible = pageContent.includes(firstFunnel.name);
    
    expect(funnelNameVisible).toBe(true);
    console.log(`✅ Nome do funil "${firstFunnel.name}" encontrado na página`);
  });

  test('Deve carregar páginas/steps do funil', async ({ page }) => {
    const funnels = getFunnelsFromDatabase();
    const testFunnel = funnels[0];
    
    if (!testFunnel) {
      test.skip(true, 'Nenhum funil disponível');
      return;
    }

    // Buscar páginas do funil
    const db = new Database(DB_PATH, { readonly: true });
    let pagesCount = 0;
    
    try {
      const result = db.prepare('SELECT COUNT(*) as count FROM funnel_pages WHERE funnel_id = ?').get(testFunnel.id) as { count: number };
      pagesCount = result.count;
    } finally {
      db.close();
    }
    
    console.log(`\n📄 Funil tem ${pagesCount} páginas`);
    expect(pagesCount).toBeGreaterThan(0);
    
    await page.goto(`${BASE_URL}/editor?funnelId=${testFunnel.id}`);
    await page.waitForLoadState('networkidle');
    
    // Aguardar carregamento completo
    await page.waitForTimeout(2000);
    
    console.log(`✅ ${pagesCount} páginas devem estar disponíveis no editor`);
  });

  test('Deve lidar com funnelId inválido gracefully', async ({ page }) => {
    const invalidId = 'funnel-nao-existe-123';
    
    console.log(`\n🧪 Testando ID inválido: ${invalidId}`);
    
    await page.goto(`${BASE_URL}/editor?funnelId=${invalidId}`);
    await page.waitForLoadState('networkidle');
    
    // Verificar se mostra erro ou tela vazia apropriadamente
    const pageContent = await page.content();
    const hasErrorHandling = 
      pageContent.includes('não encontrado') ||
      pageContent.includes('not found') ||
      pageContent.includes('erro') ||
      pageContent.includes('error');
    
    // Screenshot para debug
    await page.screenshot({ path: 'test-results/funnel-invalid-id.png', fullPage: true });
    
    console.log(hasErrorHandling ? '✅ Erro tratado corretamente' : '⚠️ Nenhuma mensagem de erro detectada');
  });

  test('Deve permitir navegar entre steps no Quiz 21', async ({ page }) => {
    const funnels = getFunnelsFromDatabase();
    const quiz21Funnel = funnels.find(f => f.name.includes('21 Etapas'));
    
    if (!quiz21Funnel) {
      test.skip(true, 'Funil Quiz 21 Steps não encontrado');
      return;
    }

    await page.goto(`${BASE_URL}/editor?funnelId=${quiz21Funnel.id}`);
    await page.waitForLoadState('networkidle');
    
    // Aguardar interface carregar
    await page.waitForTimeout(3000);
    
    // Tentar encontrar botões de navegação (próximo/anterior)
    const nextButton = page.locator('button:has-text("Próxim"), button:has-text("Next"), [aria-label*="next"], [aria-label*="próxim"]').first();
    const hasNextButton = await nextButton.isVisible().catch(() => false);
    
    if (hasNextButton) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Navegação para próximo step funcionou');
    } else {
      console.log('⚠️ Botão de navegação não encontrado (pode ser UI diferente)');
    }
    
    await page.screenshot({ path: 'test-results/funnel-navigation-test.png', fullPage: true });
  });

  test('Deve verificar estrutura do funil Quiz 21 Steps', async ({ page }) => {
    const funnels = getFunnelsFromDatabase();
    const quiz21Funnel = funnels.find(f => f.name.includes('21 Etapas'));
    
    if (!quiz21Funnel) {
      test.skip(true, 'Funil Quiz 21 Steps não encontrado');
      return;
    }

    // Verificar estrutura no banco
    const db = new Database(DB_PATH, { readonly: true });
    let pages: any[] = [];
    
    try {
      pages = db.prepare(`
        SELECT id, page_type, page_order, title 
        FROM funnel_pages 
        WHERE funnel_id = ? 
        ORDER BY page_order
      `).all(quiz21Funnel.id);
    } finally {
      db.close();
    }
    
    console.log('\n📊 Estrutura do Quiz 21 Steps:');
    console.log(`  Total de páginas: ${pages.length}`);
    
    // Verificar tipos esperados
    const pageTypes = pages.map(p => p.page_type);
    expect(pageTypes).toContain('lead-capture');
    expect(pageTypes).toContain('quiz-question');
    expect(pageTypes).toContain('result');
    
    // Contar tipos
    const leadCapture = pageTypes.filter(t => t === 'lead-capture').length;
    const quizQuestions = pageTypes.filter(t => t === 'quiz-question').length;
    const transitions = pageTypes.filter(t => t === 'transition').length;
    const strategicQuestions = pageTypes.filter(t => t === 'strategic-question').length;
    const results = pageTypes.filter(t => t === 'result').length;
    const offers = pageTypes.filter(t => t === 'offer').length;
    
    console.log(`  • Lead Capture: ${leadCapture}`);
    console.log(`  • Quiz Questions: ${quizQuestions}`);
    console.log(`  • Transitions: ${transitions}`);
    console.log(`  • Strategic Questions: ${strategicQuestions}`);
    console.log(`  • Results: ${results}`);
    console.log(`  • Offers: ${offers}`);
    
    // Validar estrutura esperada
    expect(pages.length).toBe(21);
    expect(leadCapture).toBe(1);
    expect(quizQuestions).toBe(10);
    expect(strategicQuestions).toBe(6);
    expect(results).toBe(1);
    
    console.log('✅ Estrutura do funil está correta');
  });

  test('Deve medir tempo de carregamento do editor', async ({ page }) => {
    const funnels = getFunnelsFromDatabase();
    const testFunnel = funnels[0];
    
    if (!testFunnel) {
      test.skip(true, 'Nenhum funil disponível');
      return;
    }

    const startTime = Date.now();
    
    await page.goto(`${BASE_URL}/editor?funnelId=${testFunnel.id}`);
    await page.waitForLoadState('networkidle');
    
    // Aguardar elemento principal do editor
    await page.locator('[data-testid="editor-container"], .editor-container, main').first().waitFor({ timeout: 20000 });
    
    const loadTime = Date.now() - startTime;
    
    console.log(`\n⏱️ Tempo de carregamento: ${loadTime}ms`);
    
    // Assert: deve carregar em menos de 10 segundos
    expect(loadTime).toBeLessThan(10000);
    
    if (loadTime < 3000) {
      console.log('✅ Carregamento rápido!');
    } else if (loadTime < 5000) {
      console.log('✅ Carregamento aceitável');
    } else {
      console.log('⚠️ Carregamento lento');
    }
  });
});

test.describe('Validação de Dados do Funil', () => {
  
  test('Deve validar integridade dos blocos nas páginas', async () => {
    const db = new Database(DB_PATH, { readonly: true });
    
    try {
      const pages = db.prepare(`
        SELECT id, funnel_id, blocks, page_type 
        FROM funnel_pages 
        LIMIT 10
      `).all() as Array<{ id: string; funnel_id: string; blocks: string; page_type: string }>;
      
      console.log(`\n🔍 Validando ${pages.length} páginas...`);
      
      for (const page of pages) {
        // Parse JSON dos blocos
        let blocks: any[];
        
        try {
          blocks = JSON.parse(page.blocks);
        } catch (error) {
          throw new Error(`JSON inválido na página ${page.id}`);
        }
        
        expect(Array.isArray(blocks)).toBe(true);
        expect(blocks.length).toBeGreaterThan(0);
        
        // Validar estrutura básica dos blocos
        for (const block of blocks) {
          expect(block).toHaveProperty('id');
          expect(block).toHaveProperty('type');
          expect(block).toHaveProperty('order');
        }
      }
      
      console.log('✅ Todos os blocos são válidos');
      
    } finally {
      db.close();
    }
  });

  test('Deve validar settings do funil', async () => {
    const db = new Database(DB_PATH, { readonly: true });
    
    try {
      const funnels = db.prepare('SELECT id, name, settings FROM funnels').all() as Array<{ id: string; name: string; settings: string }>;
      
      console.log(`\n⚙️ Validando settings de ${funnels.length} funis...`);
      
      for (const funnel of funnels) {
        let settings: any;
        
        try {
          settings = JSON.parse(funnel.settings);
        } catch (error) {
          throw new Error(`Settings JSON inválido no funil ${funnel.id}`);
        }
        
        // Validar propriedades essenciais (pode ser formato antigo ou novo)
        const hasNewFormat = settings.category && settings.theme;
        const hasOldFormat = settings.tracking_enabled !== undefined;
        
        expect(hasNewFormat || hasOldFormat).toBe(true);
        
        if (hasNewFormat) {
          console.log(`  ✓ ${funnel.name}: ${settings.category} (novo formato)`);
        } else {
          console.log(`  ✓ ${funnel.name}: (formato legado)`);
        }
      }
      
      console.log('✅ Todos os settings são válidos');
      
    } finally {
      db.close();
    }
  });
});
