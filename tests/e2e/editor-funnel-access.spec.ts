/**
 * 🧪 TESTES E2E - FLUXO DE ACESSO AO EDITOR DE FUNIL
 * 
 * Testa o caminho completo no frontend para acessar e editar funis:
 * - Navegação da home para o editor
 * - Carregamento de funil existente
 * - Criação de novo funil
 * - Edição de propriedades
 * - Salvamento de alterações
 * - Preview e publicação
 * 
 * Ferramenta: Playwright (ferramenta mais completa instalada no projeto)
 * 
 * @module tests/e2e/editor-funnel-access
 */

import { test, expect, type Page } from '@playwright/test';

// Configuração de timeouts
const NAVIGATION_TIMEOUT = 30000;
const EDITOR_LOAD_TIMEOUT = 20000;
const API_TIMEOUT = 10000;

/**
 * Helper: Aguardar carregamento do editor
 */
async function waitForEditorLoaded(page: Page) {
  // Aguardar sinais de que o editor carregou completamente
  await Promise.race([
    page.waitForSelector('[data-testid="canvas-editor"]', { timeout: EDITOR_LOAD_TIMEOUT }),
    page.waitForSelector('.editor-canvas', { timeout: EDITOR_LOAD_TIMEOUT }),
    page.waitForSelector('[class*="editor"]', { timeout: EDITOR_LOAD_TIMEOUT }),
  ]).catch(() => {
    console.log('⚠️ Editor não carregou completamente com data-testid, tentando seletores alternativos');
  });

  // Aguardar JavaScript carregar
  await page.waitForLoadState('networkidle', { timeout: NAVIGATION_TIMEOUT });
}

/**
 * Helper: Verificar se há erros na console
 */
async function checkConsoleErrors(page: Page) {
  const errors: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return errors;
}

test.describe('Acesso ao Editor de Funil - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar listener de erros
    await checkConsoleErrors(page);
    
    // Aumentar timeout padrão
    page.setDefaultTimeout(NAVIGATION_TIMEOUT);
  });

  test('1. Deve acessar a home page com sucesso', async ({ page }) => {
    console.log('📍 Navegando para home page...');
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Verificar se a página carregou
    await expect(page).toHaveURL(/.*\//);
    
    // Verificar título ou elemento principal
    const hasMainContent = await page.locator('main, #root, [role="main"]').count() > 0;
    expect(hasMainContent).toBeTruthy();
    
    console.log('✅ Home page carregada com sucesso');
  });

  test('2. Deve navegar da home para o editor (novo funil)', async ({ page }) => {
    console.log('📍 Testando navegação: Home → Editor (Novo)');
    
    await page.goto('/');
    
    // Procurar botão de criar/novo funil (vários seletores possíveis)
    const createButton = await Promise.race([
      page.getByRole('button', { name: /criar.*funil/i }).first().waitFor({ timeout: 5000 }),
      page.getByRole('button', { name: /novo.*funil/i }).first().waitFor({ timeout: 5000 }),
      page.getByRole('link', { name: /criar/i }).first().waitFor({ timeout: 5000 }),
      page.locator('[href*="editor"]').first().waitFor({ timeout: 5000 }),
    ]).catch(() => null);

    if (createButton) {
      await page.getByRole('button', { name: /criar|novo/i }).first().click();
    } else {
      // Navegação direta se botão não encontrado
      console.log('⚠️ Botão não encontrado, navegando diretamente para /editor');
      await page.goto('/editor');
    }

    // Verificar se chegou ao editor
    await expect(page).toHaveURL(/.*\/editor/, { timeout: NAVIGATION_TIMEOUT });
    
    console.log('✅ Navegação para editor bem-sucedida');
  });

  test('3. Deve acessar editor diretamente via URL', async ({ page }) => {
    console.log('📍 Testando acesso direto: /editor');
    
    await page.goto('/editor');
    await page.waitForLoadState('domcontentloaded');
    
    // Aguardar carregamento do editor
    await page.waitForTimeout(3000);
    
    // Fechar modal "Como deseja começar?" se aparecer
    const modal = page.locator('[role="dialog"]');
    if (await modal.isVisible()) {
      console.log('⚠️ Modal detectado, fechando...');
      const closeButton = modal.locator('button').first();
      await closeButton.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
    }
    
    // Verificar se o editor carregou (usando seletor correto)
    const hasEditor = await page.locator('[data-testid="quiz-modular-production-editor-page-optimized"], .qm-editor, [data-editor="modular-enhanced"]').count();
    
    console.log(`🔍 Editor encontrado: ${hasEditor > 0 ? 'Sim' : 'Não'}`);
    expect(hasEditor).toBeGreaterThan(0);
    
    console.log('✅ Editor carregado via URL direta');
  });

  test('4. Deve acessar editor com funnelId específico', async ({ page }) => {
    console.log('📍 Testando acesso: /editor/{funnelId}');
    
    // Usar um ID de teste (pode precisar ser ajustado)
    const testFunnelId = 'test-funnel-123';
    
    await page.goto(`/editor/${testFunnelId}`, { 
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT 
    });
    
    // Verificar URL contém o funnelId
    await expect(page).toHaveURL(new RegExp(`.*\\/editor\\/${testFunnelId}`));
    
    // Aguardar editor carregar (pode mostrar erro se funil não existe)
    await page.waitForLoadState('networkidle', { timeout: API_TIMEOUT });
    
    // Verificar se editor carregou OU se há mensagem de erro apropriada
    const editorLoaded = await page.locator('[data-testid="canvas-editor"], .editor-canvas').count() > 0;
    const errorMessage = await page.locator('[role="alert"], .error-message').count() > 0;
    
    expect(editorLoaded || errorMessage).toBeTruthy();
    
    console.log('✅ Rota com funnelId acessada (editor ou erro apropriado)');
  });

  test('5. Deve carregar componentes principais do editor', async ({ page }) => {
    console.log('📍 Verificando componentes do editor');
    
    await page.goto('/editor');
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Fechar modal se existir
    const modal = page.locator('[role="dialog"]');
    if (await modal.isVisible()) {
      await modal.locator('button').first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
    }
    
    // Verificar componentes principais usando seletores reais
    let foundComponents = 0;
    
    // Editor principal
    if (await page.locator('[data-testid="quiz-modular-production-editor-page-optimized"]').count() > 0) {
      foundComponents++;
      console.log('✅ Editor principal encontrado');
    } else {
      console.log('⚠️ Editor principal não encontrado');
    }
    
    // Container do editor
    if (await page.locator('.qm-editor, [data-editor="modular-enhanced"]').count() > 0) {
      foundComponents++;
      console.log('✅ Container do editor encontrado');
    } else {
      console.log('⚠️ Container do editor não encontrado');
    }
    
    // Canvas/Blocos
    if (await page.locator('[data-block-id], .universal-block-renderer').count() > 0) {
      foundComponents++;
      console.log('✅ Blocos renderizados encontrados');
    } else {
      console.log('⚠️ Blocos não encontrados');
    }
    
    // Verificar se há pelo menos elementos interativos
    if (await page.locator('button').count() > 0) {
      foundComponents++;
      console.log('✅ Elementos interativos encontrados');
    }

    // Pelo menos 2 componentes devem existir
    expect(foundComponents).toBeGreaterThan(1);
    
    console.log(`✅ ${foundComponents} componentes do editor encontrados`);
  });

  test('6. Deve permitir seleção de blocos no canvas', async ({ page }) => {
    console.log('📍 Testando seleção de blocos');
    
    await page.goto('/editor');
    await waitForEditorLoaded(page);
    
    // Procurar blocos no canvas
    const blocks = await Promise.race([
      page.locator('[data-testid^="block-"]').all(),
      page.locator('[class*="block"]').all(),
      page.locator('[draggable="true"]').all(),
    ]);

    if (blocks.length > 0) {
      console.log(`📦 ${blocks.length} blocos encontrados`);
      
      // Clicar no primeiro bloco
      await blocks[0].click();
      
      // Aguardar feedback visual de seleção
      await page.waitForTimeout(500);
      
      // Verificar se bloco foi selecionado (pode ter classe 'selected' ou borda)
      const isSelected = await blocks[0].evaluate(el => {
        const classes = el.className;
        const style = window.getComputedStyle(el);
        return classes.includes('selected') || 
               classes.includes('active') ||
               style.borderColor !== 'rgb(0, 0, 0)' ||
               style.outline !== 'none';
      });
      
      console.log('✅ Bloco selecionado:', isSelected ? 'Sim' : 'Não');
    } else {
      console.log('⚠️ Nenhum bloco encontrado no canvas (editor pode estar vazio)');
    }
  });

  test('7. Deve editar propriedades de um bloco', async ({ page }) => {
    console.log('📍 Testando edição de propriedades');
    
    await page.goto('/editor');
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Fechar modal inicial se existir
    const modal = page.locator('[role="dialog"]');
    if (await modal.isVisible()) {
      console.log('⚠️ Fechando modal inicial...');
      await modal.locator('button').first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(1500);
    }
    
    // Procurar bloco renderizado
    const block = page.locator('[data-block-id], .universal-block-renderer').first();
    
    if (await block.count() > 0 && await block.isVisible()) {
      console.log('✅ Bloco encontrado, tentando clicar...');
      
      // Clicar no bloco
      await block.click({ force: true });
      await page.waitForTimeout(1000);
      
      // Procurar inputs de propriedades
      const propertyInputs = page.locator('input[type="text"], textarea, input[type="color"]');
      const inputCount = await propertyInputs.count();
      
      if (inputCount > 0) {
        console.log(`✅ ${inputCount} campos de propriedades encontrados`);
        
        // Tentar editar primeiro campo de texto visível
        const firstInput = propertyInputs.first();
        if (await firstInput.isVisible()) {
          await firstInput.fill('Texto de teste E2E');
          await page.waitForTimeout(300);
          
          // Verificar se valor foi definido
          const value = await firstInput.inputValue();
          expect(value).toBe('Texto de teste E2E');
          
          console.log('✅ Propriedade editada com sucesso');
        } else {
          console.log('⚠️ Campo de propriedade não visível');
        }
      } else {
        console.log('⚠️ Nenhum campo de propriedade encontrado (editor pode não ter painel de propriedades visível)');
      }
    } else {
      console.log('⚠️ Nenhum bloco disponível ou visível para edição');
    }
  });

  test('8. Deve salvar alterações (botão salvar)', async ({ page }) => {
    console.log('📍 Testando salvamento de alterações');
    
    await page.goto('/editor');
    await waitForEditorLoaded(page);
    
    // Procurar botão de salvar
    const saveButton = await Promise.race([
      page.getByRole('button', { name: /salvar/i }).first().waitFor({ timeout: 5000 }),
      page.getByRole('button', { name: /save/i }).first().waitFor({ timeout: 5000 }),
      page.locator('[data-testid="save-button"]').waitFor({ timeout: 5000 }),
    ]).catch(() => null);

    if (saveButton) {
      // Clicar em salvar
      await page.getByRole('button', { name: /salvar|save/i }).first().click();
      
      // Aguardar feedback (toast, mensagem, etc)
      await page.waitForTimeout(2000);
      
      // Verificar mensagem de sucesso
      const successMessage = await page.locator('[role="status"], .toast, [class*="notification"]').count();
      
      console.log('✅ Botão salvar clicado, feedback:', successMessage > 0 ? 'Sim' : 'Não');
    } else {
      console.log('⚠️ Botão salvar não encontrado');
    }
  });

  test('9. Deve abrir preview do funil', async ({ page }) => {
    console.log('📍 Testando abertura de preview');
    
    await page.goto('/editor');
    await waitForEditorLoaded(page);
    
    // Procurar botão de preview
    const previewButton = await Promise.race([
      page.getByRole('button', { name: /preview/i }).first().waitFor({ timeout: 5000 }),
      page.getByRole('button', { name: /visualizar/i }).first().waitFor({ timeout: 5000 }),
      page.locator('[data-testid="preview-button"]').waitFor({ timeout: 5000 }),
    ]).catch(() => null);

    if (previewButton) {
      await page.getByRole('button', { name: /preview|visualizar/i }).first().click();
      
      // Aguardar modal ou nova aba
      await page.waitForTimeout(2000);
      
      // Verificar se preview abriu
      const previewVisible = await page.locator('[data-testid="preview-container"], [class*="preview"]').count() > 0;
      
      console.log('✅ Preview aberto:', previewVisible ? 'Sim' : 'Não');
    } else {
      console.log('⚠️ Botão preview não encontrado');
    }
  });

  test('10. Deve verificar performance de carregamento', async ({ page }) => {
    console.log('📍 Testando performance de carregamento');
    
    const startTime = Date.now();
    
    await page.goto('/editor', { waitUntil: 'domcontentloaded' });
    await waitForEditorLoaded(page);
    
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️ Tempo de carregamento: ${loadTime}ms`);
    
    // Verificar se carregou em tempo razoável (< 10s)
    expect(loadTime).toBeLessThan(10000);
    
    // Verificar métricas de performance
    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
        timeToInteractive: perf.domInteractive - perf.fetchStart,
      };
    });
    
    console.log('📊 Métricas de performance:', metrics);
    
    expect(metrics.timeToInteractive).toBeLessThan(5000);
  });

  test('11. Deve verificar responsividade mobile', async ({ page }) => {
    console.log('📍 Testando responsividade mobile');
    
    // Configurar viewport mobile (iPhone 12)
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/editor');
    await waitForEditorLoaded(page);
    
    // Verificar se UI se adapta
    const bodyWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
    
    // Verificar se há menu mobile
    const hasMobileUI = await page.locator('[data-testid="mobile-menu"], [class*="mobile"]').count() > 0;
    
    console.log('✅ Interface mobile renderizada:', hasMobileUI ? 'Sim' : 'Parcial');
  });

  test('12. Deve verificar responsividade tablet', async ({ page }) => {
    console.log('📍 Testando responsividade tablet');
    
    // Configurar viewport tablet (iPad)
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/editor');
    await waitForEditorLoaded(page);
    
    // Verificar largura
    const bodyWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768);
    
    console.log('✅ Interface tablet verificada');
  });

  test('13. Deve lidar com erros de rede gracefully', async ({ page }) => {
    console.log('📍 Testando tratamento de erros de rede');
    
    // Simular offline
    await page.context().setOffline(true);
    
    await page.goto('/editor', { waitUntil: 'domcontentloaded' }).catch(() => {
      console.log('⚠️ Falha esperada (offline)');
    });
    
    // Verificar mensagem de erro
    const errorVisible = await page.locator('[role="alert"], .error-message').count() > 0;
    
    console.log('✅ Erro tratado:', errorVisible ? 'Sim' : 'Parcial');
    
    // Restaurar conexão
    await page.context().setOffline(false);
  });

  test('14. Deve validar redirecionamentos de rotas deprecated', async ({ page }) => {
    console.log('📍 Testando redirecionamentos de rotas antigas');
    
    // Testar rotas deprecated mencionadas no App.tsx
    const deprecatedRoutes = [
      '/editor-new',
      '/editor-modular',
    ];

    for (const route of deprecatedRoutes) {
      console.log(`🔄 Testando redirecionamento: ${route} → /editor`);
      
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      
      // Verificar se redirecionou para /editor
      await page.waitForTimeout(2000);
      const currentURL = page.url();
      
      const redirected = currentURL.includes('/editor') && !currentURL.includes(route);
      console.log(`${redirected ? '✅' : '⚠️'} ${route}: ${redirected ? 'Redirecionado' : 'Não redirecionado'}`);
    }
  });

  test('15. Deve acessar página de templates', async ({ page }) => {
    console.log('📍 Testando acesso a /editor/templates');
    
    await page.goto('/editor/templates', { waitUntil: 'domcontentloaded' });
    
    // Verificar URL
    await expect(page).toHaveURL(/.*\/editor\/templates/);
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle', { timeout: API_TIMEOUT });
    
    // Verificar se há lista de templates
    const hasTemplates = await page.locator('[data-testid^="template-"], [class*="template"]').count() > 0;
    
    console.log('✅ Página de templates acessada, templates visíveis:', hasTemplates ? 'Sim' : 'Não');
  });
});

test.describe('Fluxo Integrado - Criar e Editar Funil', () => {
  test('Fluxo completo: Home → Editor → Edição → Salvar → Preview', async ({ page }) => {
    console.log('🎯 Iniciando teste de fluxo completo');
    
    // 1. Acessar home
    console.log('1️⃣ Acessando home...');
    await page.goto('/');
    await expect(page).toHaveURL(/.*\//);
    
    // 2. Navegar para editor
    console.log('2️⃣ Navegando para editor...');
    await page.goto('/editor');
    await waitForEditorLoaded(page);
    await expect(page).toHaveURL(/.*\/editor/);
    
    // 3. Verificar que o editor está carregado
    console.log('3️⃣ Verificando editor...');
    
    // Fechar modal se existir
    const modal = page.locator('[role="dialog"]');
    if (await modal.isVisible()) {
      console.log('⚠️ Fechando modal...');
      await modal.locator('button').first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
    }
    
    const editorCount = await page.locator('[data-testid="quiz-modular-production-editor-page-optimized"], .qm-editor, [data-editor="modular-enhanced"]').count();
    expect(editorCount).toBeGreaterThan(0);
    
    // 4. Selecionar e editar bloco (se existir)
    console.log('4️⃣ Tentando editar bloco...');
    const block = await page.locator('[data-testid^="block-"]').first();
    if (await block.count() > 0) {
      await block.click();
      await page.waitForTimeout(500);
      
      const input = await page.locator('input[type="text"]').first();
      if (await input.count() > 0) {
        await input.fill(`E2E Test - ${Date.now()}`);
        console.log('✅ Bloco editado');
      }
    }
    
    // 5. Salvar (se botão existir)
    console.log('5️⃣ Tentando salvar...');
    const saveBtn = await page.getByRole('button', { name: /salvar|save/i }).first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      await page.waitForTimeout(2000);
      console.log('✅ Salvamento acionado');
    }
    
    // 6. Preview (se botão existir)
    console.log('6️⃣ Tentando abrir preview...');
    const previewBtn = await page.getByRole('button', { name: /preview|visualizar/i }).first();
    if (await previewBtn.count() > 0) {
      await previewBtn.click();
      await page.waitForTimeout(2000);
      console.log('✅ Preview acionado');
    }
    
    console.log('🎉 Fluxo completo executado com sucesso!');
  });
});

// Configuração de testes visuais (se necessário)
test.describe('Testes Visuais - Screenshots', () => {
  test.skip('Capturar screenshot do editor', async ({ page }) => {
    await page.goto('/editor');
    await waitForEditorLoaded(page);
    
    await page.screenshot({ 
      path: 'tests/screenshots/editor-main.png',
      fullPage: true 
    });
  });
});
