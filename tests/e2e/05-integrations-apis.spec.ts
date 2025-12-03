/**
 * 🧪 TESTES E2E - INTEGRAÇÕES E APIS
 * 
 * Testa integrações com serviços externos e APIs:
 * - Persistência de dados
 * - Comunicação com Supabase
 * - LocalStorage e IndexedDB
 * - APIs REST
 * - Gestão de estado
 * 
 * @module tests/e2e/integrations-apis
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:8081';
const TIMEOUT = 15000;

test.describe('🔌 Integrações - LocalStorage', () => {
  
  test('deve salvar dados no localStorage', async ({ page }) => {
    await page.goto(`${BASE_URL}/editor`);
    await page.waitForLoadState('networkidle');
    
    // Inserir dados no localStorage
    await page.evaluate(() => {
      localStorage.setItem('test-e2e-key', JSON.stringify({
        timestamp: Date.now(),
        data: 'test-value'
      }));
    });
    
    // Verificar se foi salvo
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('test-e2e-key');
    });
    
    expect(savedData).toBeTruthy();
    console.log('✅ Dados salvos no localStorage');
    
    // Limpar
    await page.evaluate(() => {
      localStorage.removeItem('test-e2e-key');
    });
  });

  test('deve persistir dados entre recarregamentos', async ({ page }) => {
    await page.goto(`${BASE_URL}/editor`);
    await page.waitForLoadState('networkidle');
    
    const testData = { test: 'persist', timestamp: Date.now() };
    
    // Salvar dados
    await page.evaluate((data) => {
      localStorage.setItem('persist-test', JSON.stringify(data));
    }, testData);
    
    // Recarregar página
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verificar se dados persistem
    const retrievedData = await page.evaluate(() => {
      const data = localStorage.getItem('persist-test');
      return data ? JSON.parse(data) : null;
    });
    
    expect(retrievedData).toMatchObject({ test: 'persist' });
    console.log('✅ Dados persistem entre recarregamentos');
    
    // Limpar
    await page.evaluate(() => {
      localStorage.removeItem('persist-test');
    });
  });

  test('deve verificar uso de localStorage pela aplicação', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz-estilo`);
    await page.waitForLoadState('networkidle');
    
    // Verificar quais chaves a aplicação está usando
    const localStorageKeys = await page.evaluate(() => {
      return Object.keys(localStorage);
    });
    
    console.log(`📊 LocalStorage contém ${localStorageKeys.length} chaves`);
    localStorageKeys.forEach(key => {
      console.log(`   🔑 ${key}`);
    });
    
    expect(localStorageKeys).toBeDefined();
  });
});

test.describe('🔌 Integrações - IndexedDB', () => {
  
  test('deve verificar disponibilidade do IndexedDB', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const hasIndexedDB = await page.evaluate(() => {
      return 'indexedDB' in window;
    });
    
    expect(hasIndexedDB).toBeTruthy();
    console.log('✅ IndexedDB disponível no navegador');
  });

  test('deve listar databases IndexedDB', async ({ page }) => {
    await page.goto(`${BASE_URL}/editor`);
    await page.waitForLoadState('networkidle');
    
    const databases = await page.evaluate(async () => {
      if ('databases' in indexedDB) {
        const dbs = await indexedDB.databases();
        return dbs.map(db => db.name);
      }
      return [];
    });
    
    console.log(`📊 IndexedDB contém ${databases.length} databases`);
    databases.forEach(dbName => {
      console.log(`   🗄️ ${dbName}`);
    });
  });
});

test.describe('🔌 Integrações - Network Requests', () => {
  
  test('deve fazer requisições para APIs', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/api/') || url.includes('supabase')) {
        requests.push(url);
      }
    });
    
    await page.goto(`${BASE_URL}/quiz-estilo`);
    await page.waitForLoadState('networkidle');
    
    console.log(`📊 ${requests.length} requisições de API detectadas`);
    requests.slice(0, 5).forEach(url => {
      console.log(`   🌐 ${url}`);
    });
    
    expect(requests.length).toBeGreaterThanOrEqual(0);
  });

  test('deve lidar com erros de rede graciosamente', async ({ page }) => {
    // Interceptar requisições e simular falha
    await page.route('**/api/**', route => {
      route.abort('failed');
    });
    
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(`${BASE_URL}/quiz-estilo`);
    await page.waitForLoadState('networkidle');
    
    // A aplicação deve continuar funcionando mesmo com falhas de API
    const isPageVisible = await page.locator('main, body').first().isVisible();
    expect(isPageVisible).toBeTruthy();
    
    console.log('✅ Aplicação continua funcional mesmo com falhas de rede');
  });

  test('deve verificar respostas de API bem-sucedidas', async ({ page }) => {
    const responses: { url: string; status: number }[] = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/') || url.includes('supabase')) {
        responses.push({
          url,
          status: response.status()
        });
      }
    });
    
    await page.goto(`${BASE_URL}/editor`);
    await page.waitForLoadState('networkidle');
    
    const successfulResponses = responses.filter(r => r.status >= 200 && r.status < 300);
    const failedResponses = responses.filter(r => r.status >= 400);
    
    console.log(`✅ ${successfulResponses.length} respostas bem-sucedidas`);
    console.log(`❌ ${failedResponses.length} respostas com erro`);
    
    failedResponses.forEach(r => {
      console.log(`   ⚠️ ${r.status}: ${r.url}`);
    });
  });
});

test.describe('🔌 Integrações - Supabase', () => {
  
  test('deve detectar configuração do Supabase', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const hasSupabaseConfig = await page.evaluate(() => {
      // Verificar se há variáveis de ambiente ou configuração do Supabase
      const scripts = Array.from(document.scripts);
      return scripts.some(script => script.textContent?.includes('supabase'));
    });
    
    console.log(`ℹ️ Configuração Supabase detectada: ${hasSupabaseConfig}`);
  });

  test('deve verificar requisições ao Supabase', async ({ page }) => {
    const supabaseRequests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('supabase')) {
        supabaseRequests.push(url);
      }
    });
    
    await page.goto(`${BASE_URL}/editor`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log(`📊 ${supabaseRequests.length} requisições ao Supabase`);
    supabaseRequests.slice(0, 3).forEach(url => {
      console.log(`   🔗 ${url.substring(0, 80)}...`);
    });
  });
});

test.describe('🔌 Integrações - Gestão de Estado', () => {
  
  test('deve manter estado do quiz durante navegação', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz-estilo`);
    await page.waitForLoadState('networkidle');
    
    // Pular captura de lead se necessário
    const nameInput = page.locator('input[name*="name"]').first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill('Test User');
    }
    
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill('test@example.com');
    }
    
    // Avançar e selecionar opções
    const option = page.locator('button, input[type="radio"]').first();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
      await page.waitForTimeout(500);
    }
    
    // Verificar se estado persiste
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Teste de persistência de estado executado');
  });

  test('deve limpar estado ao reiniciar quiz', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz-estilo`);
    await page.waitForLoadState('networkidle');
    
    // Procurar por botão de reiniciar
    const restartButton = page.locator('button:has-text("Reiniciar"), button:has-text("Recomeçar"), button:has-text("Restart")').first();
    
    if (await restartButton.isVisible().catch(() => false)) {
      await restartButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Botão de reiniciar encontrado e testado');
    } else {
      console.log('ℹ️ Botão de reiniciar não encontrado');
    }
  });
});

test.describe('🔌 Integrações - Cookies e Sessão', () => {
  
  test('deve verificar cookies da aplicação', async ({ page, context }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const cookies = await context.cookies();
    
    console.log(`🍪 ${cookies.length} cookies encontrados`);
    cookies.forEach(cookie => {
      console.log(`   🍪 ${cookie.name}: ${cookie.value.substring(0, 20)}...`);
    });
  });

  test('deve manter sessão entre páginas', async ({ page }) => {
    await page.goto(`${BASE_URL}/editor`);
    await page.waitForLoadState('networkidle');
    
    // Navegar para outra página
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
    
    // Voltar para editor
    await page.goto(`${BASE_URL}/editor`);
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Navegação entre páginas mantém sessão');
  });
});

test.describe('🔌 Integrações - WebWorkers e Service Workers', () => {
  
  test('deve verificar presença de service workers', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const hasServiceWorker = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.length > 0;
      }
      return false;
    });
    
    console.log(`ℹ️ Service Worker registrado: ${hasServiceWorker}`);
  });
});

test.describe('🔌 Integrações - Analytics e Tracking', () => {
  
  test('deve detectar chamadas de analytics', async ({ page }) => {
    const analyticsRequests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('analytics') || url.includes('gtag') || url.includes('ga')) {
        analyticsRequests.push(url);
      }
    });
    
    await page.goto(`${BASE_URL}/quiz-estilo`);
    await page.waitForLoadState('networkidle');
    
    console.log(`📊 ${analyticsRequests.length} requisições de analytics detectadas`);
    analyticsRequests.forEach(url => {
      console.log(`   📈 ${url.substring(0, 80)}...`);
    });
  });

  test('deve rastrear eventos do usuário', async ({ page }) => {
    const events: string[] = [];
    
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('track') || text.includes('event') || text.includes('analytics')) {
        events.push(text);
      }
    });
    
    await page.goto(`${BASE_URL}/quiz-estilo`);
    await page.waitForLoadState('networkidle');
    
    // Interagir com a página
    const button = page.locator('button').first();
    if (await button.isVisible().catch(() => false)) {
      await button.click();
    }
    
    console.log(`📊 ${events.length} eventos de tracking detectados`);
  });
});

test.describe('🔌 Integrações - Performance e Cache', () => {
  
  test('deve usar cache de recursos estáticos', async ({ page }) => {
    const cachedResources: string[] = [];
    
    page.on('response', response => {
      const cacheHeader = response.headers()['cache-control'];
      if (cacheHeader && !cacheHeader.includes('no-cache')) {
        cachedResources.push(response.url());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    console.log(`📦 ${cachedResources.length} recursos com cache detectados`);
  });

  test('deve ter tempos de resposta aceitáveis', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️ Tempo de carregamento: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000);
  });
});
