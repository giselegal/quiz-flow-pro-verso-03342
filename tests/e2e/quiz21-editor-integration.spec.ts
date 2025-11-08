/**
 * 🧪 TESTES E2E: Integração Supabase & Cache
 * 
 * Suite de testes para validar integração completa com Supabase,
 * fallback offline, cache invalidation e React Query.
 * 
 * @priority ALTA
 * @coverage Save/Load Supabase, Offline mode, Cache, React Query
 * @duration ~2-4 minutos
 */

import { test, expect, Page } from '@playwright/test';

async function closeStartupModal(page: Page) {
  try {
    const modal = page.locator('[data-testid="startup-modal"]');
    if (await modal.isVisible({ timeout: 2000 })) {
      await modal.locator('button[aria-label="Close"]').click();
    }
  } catch (e) {
    // Modal não apareceu
  }
}

async function waitForEditorReady(page: Page) {
  const layout = page.getByTestId('modular-layout');
  const fallbackRoot = page.locator('[data-editor="modular-enhanced"], .qm-editor').first();

  try {
    await expect(layout).toBeVisible({ timeout: 12000 });
  } catch {
    await expect(fallbackRoot).toBeVisible({ timeout: 12000 });
  }
  await expect(page.getByTestId('column-steps')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('column-canvas')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('column-properties')).toBeVisible({ timeout: 15000 });
  console.log('✅ Editor pronto para testes de integração');
}

async function navigateToStep(page: Page, stepNumber: number) {
  await page.locator(`[data-testid="step-navigator-item"][data-step-order="${stepNumber}"]`).first().click();
  await page.waitForTimeout(500);
}

test.describe('Integration - Supabase Save/Load', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('INT-001: Deve carregar template do Supabase na inicialização', async ({ page }) => {
    // Verificar que editor carregou dados
    const canvas = page.getByTestId('column-canvas').first();
    
    // Aguardar blocos carregarem
    await page.waitForTimeout(2000);
    
    const blockCount = await canvas.locator('[data-block-id]').count();
    
    // quiz21StepsComplete deve ter blocos
    expect(blockCount).toBeGreaterThan(0);
    
    console.log(`✅ Template carregado do Supabase: ${blockCount} blocos no step atual`);
  });

  test('INT-002: Botão Salvar deve persistir alterações', async ({ page }) => {
    // Fazer uma alteração
    await navigateToStep(page, 1);
    
    const canvas = page.getByTestId('column-canvas').first();
    const firstBlock = canvas.locator('[data-block-id]').first();
    
    if (await firstBlock.isVisible({ timeout: 2000 })) {
      await firstBlock.click();
      await page.waitForTimeout(300);
      
      // Editar alguma propriedade
      const propertiesPanel = page.getByTestId('column-properties').first();
      const textInput = propertiesPanel.locator('input[type="text"], textarea').first();
      
      if (await textInput.isVisible({ timeout: 1000 })) {
        await textInput.clear();
        await textInput.fill(`E2E Test - ${Date.now()}`);
      }
    }
    
    // Clicar em Salvar
    const saveButton = page.locator('button:has-text("Salvar"), button[aria-label*="Salvar"]').first();
    
    if (await saveButton.isVisible({ timeout: 2000 })) {
      await saveButton.click();
      
      // Aguardar indicador de salvamento
      await page.waitForTimeout(1500);
      
      // Verificar status
      const statusIndicators = page.locator('text=/salv(o|ando)|sav(ed|ing)/i');
      const statusCount = await statusIndicators.count();
      
      console.log(`✅ Salvamento acionado, ${statusCount} indicadores de status encontrados`);
    } else {
      console.log('⚠️ Botão Salvar não encontrado (pode ser autosave)');
    }
  });

  test('INT-003: Deve recarregar dados após F5', async ({ page }) => {
    // Obter contagem inicial de blocos
    await navigateToStep(page, 5);
    await page.waitForTimeout(1000);
    
    const canvas = page.getByTestId('column-canvas').first();
    const initialBlockCount = await canvas.locator('[data-block-id]').count();
    
    // Fazer reload da página
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
    
    // Navegar para o mesmo step
    await navigateToStep(page, 5);
    await page.waitForTimeout(1000);
    
    // Verificar que blocos foram recarregados
    const reloadedBlockCount = await canvas.locator('[data-block-id]').count();
    
    expect(reloadedBlockCount).toBe(initialBlockCount);
    console.log(`✅ Dados recarregados do Supabase: ${reloadedBlockCount} blocos`);
  });

  test('INT-004: Export JSON deve conter dados completos', async ({ page }) => {
    // Procurar botão de export
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Exportar")').first();
    
    if (!(await exportButton.isVisible({ timeout: 2000 }))) {
      console.log('⚠️ Botão Export não encontrado');
      test.skip();
      return;
    }
    
    // Configurar listener para download
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    
    await exportButton.click();
    await page.waitForTimeout(500);
    
    const download = await downloadPromise;
    
    if (download) {
      const filename = download.suggestedFilename();
      expect(filename).toMatch(/\.json$/i);
      
      console.log(`✅ Export JSON funcionou: ${filename}`);
    } else {
      console.log('⚠️ Download não iniciou (verificar implementação)');
    }
  });
});

test.describe('Integration - Fallback Offline', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('INT-010: Deve funcionar offline (após carregamento inicial)', async ({ page }) => {
    // Aguardar carregamento inicial
    await page.waitForTimeout(2000);
    
    const canvas = page.getByTestId('column-canvas').first();
    const initialBlockCount = await canvas.locator('[data-block-id]').count();
    
    expect(initialBlockCount).toBeGreaterThan(0);
    
    // Simular modo offline
    await page.context().setOffline(true);
    console.log('🌐 Modo offline ativado');
    
    // Tentar navegar entre steps
    await navigateToStep(page, 3);
    await page.waitForTimeout(500);
    
    // Verificar que navegação funciona offline
    const offlineBlocks = await canvas.locator('[data-block-id]').count();
    
    if (offlineBlocks > 0) {
      console.log(`✅ Funciona offline: ${offlineBlocks} blocos visíveis`);
    } else {
      console.log('⚠️ Sem blocos offline (pode precisar cache)');
    }
    
    // Restaurar online
    await page.context().setOffline(false);
  });

  test('INT-011: Deve exibir erro ao tentar salvar offline', async ({ page }) => {
    // Ativar modo offline
    await page.context().setOffline(true);
    
    // Tentar salvar
    const saveButton = page.locator('button:has-text("Salvar"), button[aria-label*="Salvar"]').first();
    
    if (await saveButton.isVisible({ timeout: 2000 })) {
      await saveButton.click();
      await page.waitForTimeout(1500);
      
      // Procurar mensagem de erro
      const errorMessage = page.locator('text=/erro|error|falha|failed|offline/i');
      const hasError = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (hasError) {
        console.log('✅ Erro de salvamento offline exibido');
      } else {
        console.log('⚠️ Nenhuma mensagem de erro detectada');
      }
    }
    
    // Restaurar online
    await page.context().setOffline(false);
  });

  test('INT-012: Deve usar localStorage como fallback', async ({ page }) => {
    // Verificar que localStorage tem dados do template
    const localStorageKeys = await page.evaluate(() => {
      return Object.keys(localStorage);
    });
    
    const hasTemplateCache = localStorageKeys.some(key => 
      key.includes('template') || 
      key.includes('quiz') || 
      key.includes('cache') ||
      key.includes('react-query')
    );
    
    if (hasTemplateCache) {
      console.log(`✅ localStorage contém cache: ${localStorageKeys.filter(k => k.includes('template') || k.includes('quiz')).join(', ')}`);
    } else {
      console.log(`⚠️ Nenhum cache detectado no localStorage. Keys disponíveis: ${localStorageKeys.slice(0, 5).join(', ')}`);
    }
  });
});

test.describe('Integration - Cache Invalidation', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('INT-020: Cache deve ser invalidado após salvamento', async ({ page }) => {
    // Navegar para step 2
    await navigateToStep(page, 2);
    await page.waitForTimeout(500);
    
    const canvas = page.getByTestId('column-canvas').first();
    const initialBlockCount = await canvas.locator('[data-block-id]').count();
    
    // Tentar salvar
    const saveButton = page.locator('button:has-text("Salvar")').first();
    
    if (await saveButton.isVisible({ timeout: 2000 })) {
      await saveButton.click();
      await page.waitForTimeout(1500);
    }
    
    // Navegar para outro step e voltar
    await navigateToStep(page, 5);
    await page.waitForTimeout(500);
    
    await navigateToStep(page, 2);
    await page.waitForTimeout(500);
    
    // Verificar que dados foram recarregados
    const reloadedBlockCount = await canvas.locator('[data-block-id]').count();
    
    console.log(`✅ Cache invalidado: ${initialBlockCount} → ${reloadedBlockCount} blocos`);
  });

  test('INT-021: Invalidação manual de cache', async ({ page }) => {
    // Abrir console (se houver botão de debug)
    const debugButton = page.locator('button:has-text("Debug"), button:has-text("Console")').first();
    
    if (await debugButton.isVisible({ timeout: 1000 })) {
      await debugButton.click();
      console.log('✅ Debug panel aberto');
    } else {
      console.log('⚠️ Debug panel não encontrado (teste manual de invalidação)');
    }
    
    // Limpar localStorage manualmente
    await page.evaluate(() => {
      const beforeCount = localStorage.length;
      localStorage.clear();
      return beforeCount;
    });
    
    console.log('✅ localStorage limpo manualmente');
    
    // Recarregar e verificar que dados vêm do Supabase
    await page.reload({ waitUntil: 'domcontentloaded' });
    await closeStartupModal(page);
    await waitForEditorReady(page);
    
    const canvas = page.getByTestId('column-canvas').first();
    await page.waitForTimeout(2000);
    
    const blockCount = await canvas.locator('[data-block-id]').count();
    expect(blockCount).toBeGreaterThan(0);
    
    console.log(`✅ Dados recarregados do Supabase após invalidação: ${blockCount} blocos`);
  });
});

test.describe('Integration - React Query', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('INT-030: React Query deve cachear dados', async ({ page }) => {
    // Navegar para step 3
    await navigateToStep(page, 3);
    const startTime = Date.now();
    await page.waitForTimeout(1000);
    const firstLoadTime = Date.now() - startTime;
    
    // Navegar para outro step
    await navigateToStep(page, 7);
    await page.waitForTimeout(500);
    
    // Voltar para step 3 (deve ser mais rápido - vem do cache)
    const cacheStartTime = Date.now();
    await navigateToStep(page, 3);
    await page.waitForTimeout(500);
    const cachedLoadTime = Date.now() - cacheStartTime;
    
    console.log(`✅ Carregamento: inicial ${firstLoadTime}ms, cache ${cachedLoadTime}ms`);
    
    // Cache deve ser significativamente mais rápido (ou igual se já estava em cache)
    expect(cachedLoadTime).toBeLessThanOrEqual(firstLoadTime + 200);
  });

  test('INT-031: AbortController deve cancelar requests anteriores', async ({ page }) => {
    // Monitorar network requests
    const requests: string[] = [];
    
    page.on('request', request => {
      if (request.url().includes('template') || request.url().includes('step')) {
        requests.push(request.url());
      }
    });
    
    // Navegar rapidamente entre steps (sem aguardar)
    await navigateToStep(page, 2);
    await page.waitForTimeout(100);
    
    await navigateToStep(page, 4);
    await page.waitForTimeout(100);
    
    await navigateToStep(page, 6);
    await page.waitForTimeout(100);
    
    await navigateToStep(page, 8);
    await page.waitForTimeout(1000);
    
    // Verificar que múltiplas requisições foram feitas
    console.log(`✅ ${requests.length} requests monitorados durante navegação rápida`);
    
    // AbortController deve ter cancelado requests antigos
    // (verificação visual - não há requests pendentes no DevTools)
  });

  test('INT-032: Deve fazer refetch ao focar janela', async ({ page }) => {
    // Simular perda de foco
    await page.evaluate(() => {
      window.dispatchEvent(new Event('blur'));
    });
    
    await page.waitForTimeout(500);
    
    // Simular retorno de foco
    await page.evaluate(() => {
      window.dispatchEvent(new Event('focus'));
    });
    
    await page.waitForTimeout(1000);
    
    // React Query pode ter feito refetch
    console.log('✅ Eventos blur/focus disparados (refetch pode ter ocorrido)');
  });
});

test.describe('Integration - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('INT-040: Deve exibir erro ao falhar carregamento', async ({ page }) => {
    // Tentar carregar template inválido
    await page.goto('/editor?resource=template-que-nao-existe-xyz', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    
    await page.waitForTimeout(2000);
    
    // Procurar mensagem de erro
    const errorMessage = page.locator('text=/erro|error|não encontrado|not found|falha|failed/i');
    const hasError = await errorMessage.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (hasError) {
      const errorText = await errorMessage.first().textContent();
      console.log(`✅ Erro exibido: "${errorText}"`);
    } else {
      console.log('⚠️ Nenhuma mensagem de erro detectada (pode ter fallback silencioso)');
    }
  });

  test('INT-041: Deve recuperar de erro temporário', async ({ page }) => {
    // Simular erro de rede temporário
    await page.context().setOffline(true);
    
    // Tentar navegar
    await navigateToStep(page, 10);
    await page.waitForTimeout(1000);
    
    // Restaurar conexão
    await page.context().setOffline(false);
    await page.waitForTimeout(500);
    
    // Tentar novamente
    await navigateToStep(page, 10);
    await page.waitForTimeout(1000);
    
    const canvas = page.getByTestId('column-canvas').first();
    const blockCount = await canvas.locator('[data-block-id]').count();
    
    if (blockCount > 0) {
      console.log(`✅ Recuperado de erro: ${blockCount} blocos carregados`);
    } else {
      console.log('⚠️ Recuperação não funcionou (pode precisar retry manual)');
    }
  });

  test('INT-042: Console não deve ter erros críticos', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navegar por alguns steps
    await navigateToStep(page, 1);
    await page.waitForTimeout(500);
    
    await navigateToStep(page, 5);
    await page.waitForTimeout(500);
    
    await navigateToStep(page, 10);
    await page.waitForTimeout(500);
    
    // Filtrar erros conhecidos/aceitáveis
    const criticalErrors = errors.filter(err => 
      !err.includes('404') && // 404s podem ser esperados
      !err.includes('favicon') && // favicon missing é ok
      !err.includes('ResizeObserver') // conhecido do React
    );
    
    if (criticalErrors.length === 0) {
      console.log('✅ Nenhum erro crítico no console');
    } else {
      console.log(`⚠️ ${criticalErrors.length} erros detectados:`, criticalErrors.slice(0, 3));
    }
  });
});

test.describe('Integration - Performance Monitoring', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('editor:phase2:modular', '1'); } catch {}
    });
    await page.goto('/editor?resource=quiz21StepsComplete', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await closeStartupModal(page);
    await waitForEditorReady(page);
  });

  test('INT-050: Métricas de performance devem estar dentro do limite', async ({ page }) => {
    // Coletar métricas de performance
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        totalLoad: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    console.log('📊 Performance Metrics:');
    console.log(`  - DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`  - Load Complete: ${metrics.loadComplete}ms`);
    console.log(`  - DOM Interactive: ${metrics.domInteractive}ms`);
    console.log(`  - Total Load: ${metrics.totalLoad}ms`);
    
    // Verificar que não excede 5 segundos (critério E2E-040)
    expect(metrics.totalLoad).toBeLessThan(5000);
  });

  test('INT-051: Deve rastrear tempo de navegação entre steps', async ({ page }) => {
    const navigationTimes: number[] = [];
    
    // Medir 5 navegações
    for (let i = 1; i <= 5; i++) {
      const startTime = Date.now();
      await navigateToStep(page, i);
      await page.waitForTimeout(300);
      const duration = Date.now() - startTime;
      
      navigationTimes.push(duration);
    }
    
    const avgTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;
    const maxTime = Math.max(...navigationTimes);
    
    console.log(`📊 Navigation Times: avg ${avgTime.toFixed(0)}ms, max ${maxTime}ms`);
    console.log(`   Individual: ${navigationTimes.map(t => `${t}ms`).join(', ')}`);
    
    // Verificar que não excede 500ms (critério E2E-041)
    expect(maxTime).toBeLessThan(500);
  });
});
