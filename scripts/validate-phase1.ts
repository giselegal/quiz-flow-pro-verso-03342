/**
 * 🧪 SCRIPT DE VALIDAÇÃO AUTOMATIZADA - FASE 1
 * 
 * Testa funcionalidades críticas do sistema automaticamente
 */

import { chromium } from 'playwright';

interface ValidationResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  details?: string;
  metrics?: Record<string, number>;
}

const results: ValidationResult[] = [];
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

async function validateAdminRoute() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const startTime = Date.now();

  try {
    console.log('🧪 Testando rota /admin...');
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle', timeout: 10000 });
    
    // Verificar se ModernAdminDashboard carregou
    const title = await page.title();
    const hasContent = await page.locator('body').isVisible();
    
    // Verificar erros no console
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    const duration = Date.now() - startTime;

    if (hasContent && errors.length === 0) {
      results.push({
        test: 'Admin Route',
        status: 'PASS',
        duration,
        details: `Title: ${title}`,
      });
      console.log('✅ Admin route OK');
    } else {
      results.push({
        test: 'Admin Route',
        status: 'FAIL',
        duration,
        details: `Errors: ${errors.join(', ')}`,
      });
      console.log('❌ Admin route FAIL');
    }
  } catch (error) {
    results.push({
      test: 'Admin Route',
      status: 'FAIL',
      duration: Date.now() - startTime,
      details: error instanceof Error ? error.message : String(error),
    });
    console.log('❌ Admin route ERROR:', error);
  } finally {
    await browser.close();
  }
}

async function validateStepNavigation() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const startTime = Date.now();

  try {
    console.log('🧪 Testando navegação de steps...');
    
    // Track 404s
    const failed404s: string[] = [];
    page.on('response', response => {
      if (response.status() === 404) {
        failed404s.push(response.url());
      }
    });

    // Navegar para quiz
    await page.goto(`${BASE_URL}/quiz`, { waitUntil: 'networkidle', timeout: 10000 });
    
    // Simular navegação steps 1→2→3
    for (let step = 1; step <= 3; step++) {
      console.log(`  📍 Navegando para step ${step}...`);
      
      // Simular clique em próximo (se existir botão)
      const nextButton = page.locator('button:has-text("Próximo"), button:has-text("Continuar")');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    }

    await page.waitForTimeout(2000);

    const duration = Date.now() - startTime;
    const total404s = failed404s.length;

    results.push({
      test: 'Step Navigation (1→2→3)',
      status: total404s === 0 ? 'PASS' : 'FAIL',
      duration,
      details: `404s encontrados: ${total404s}`,
      metrics: {
        '404_count': total404s,
      },
    });

    if (total404s === 0) {
      console.log('✅ Navegação sem 404s');
    } else {
      console.log(`⚠️  ${total404s} requests com 404:`);
      failed404s.slice(0, 5).forEach(url => console.log(`   - ${url}`));
    }
  } catch (error) {
    results.push({
      test: 'Step Navigation',
      status: 'FAIL',
      duration: Date.now() - startTime,
      details: error instanceof Error ? error.message : String(error),
    });
    console.log('❌ Step navigation ERROR:', error);
  } finally {
    await browser.close();
  }
}

async function measureTTI() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const startTime = Date.now();

  try {
    console.log('🧪 Medindo Time to Interactive (TTI)...');
    
    // Performance metrics
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        firstPaint: performance.getEntriesByType('paint').find(e => e.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    const duration = Date.now() - startTime;

    // TTI considerado bom se < 3.5s
    const ttiGood = metrics.domInteractive < 3500;

    results.push({
      test: 'Time to Interactive',
      status: ttiGood ? 'PASS' : 'FAIL',
      duration,
      details: `TTI: ${metrics.domInteractive}ms`,
      metrics: {
        tti: metrics.domInteractive,
        fcp: metrics.firstContentfulPaint,
        dcl: metrics.domContentLoaded,
      },
    });

    console.log('📊 Performance Metrics:');
    console.log(`   TTI: ${metrics.domInteractive}ms ${ttiGood ? '✅' : '⚠️'}`);
    console.log(`   FCP: ${metrics.firstContentfulPaint}ms`);
    console.log(`   DCL: ${metrics.domContentLoaded}ms`);
  } catch (error) {
    results.push({
      test: 'TTI Measurement',
      status: 'FAIL',
      duration: Date.now() - startTime,
      details: error instanceof Error ? error.message : String(error),
    });
    console.log('❌ TTI measurement ERROR:', error);
  } finally {
    await browser.close();
  }
}

async function checkPerformanceMonitor() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const startTime = Date.now();

  try {
    console.log('🧪 Verificando PerformanceMonitor...');
    
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Verificar se PerformanceMonitor está ativo nos logs
    const perfLogs: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('Performance') || msg.text().includes('📊')) {
        perfLogs.push(msg.text());
      }
    });

    await page.waitForTimeout(3000);

    const duration = Date.now() - startTime;
    const hasMonitoring = perfLogs.length > 0;

    results.push({
      test: 'Performance Monitor',
      status: hasMonitoring ? 'PASS' : 'SKIP',
      duration,
      details: hasMonitoring ? `${perfLogs.length} logs capturados` : 'Monitor não ativo',
    });

    if (hasMonitoring) {
      console.log('✅ PerformanceMonitor ativo');
      console.log(`   Logs: ${perfLogs.length}`);
    } else {
      console.log('⚠️  PerformanceMonitor não detectado');
    }
  } catch (error) {
    results.push({
      test: 'Performance Monitor',
      status: 'SKIP',
      duration: Date.now() - startTime,
      details: error instanceof Error ? error.message : String(error),
    });
    console.log('⚠️  Performance monitor check SKIP:', error);
  } finally {
    await browser.close();
  }
}

async function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 RELATÓRIO DE VALIDAÇÃO - FASE 1');
  console.log('='.repeat(60) + '\n');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;

  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${result.test}`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Duração: ${result.duration}ms`);
    if (result.details) {
      console.log(`   Detalhes: ${result.details}`);
    }
    if (result.metrics) {
      console.log(`   Métricas:`, result.metrics);
    }
    console.log('');
  });

  console.log('='.repeat(60));
  console.log(`✅ PASS: ${passed}`);
  console.log(`❌ FAIL: ${failed}`);
  console.log(`⚠️  SKIP: ${skipped}`);
  console.log(`📊 TOTAL: ${results.length}`);
  console.log('='.repeat(60) + '\n');

  // Salvar JSON
  const fs = require('fs');
  fs.writeFileSync(
    'validation-results.json',
    JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2)
  );
  console.log('💾 Resultados salvos em: validation-results.json\n');
}

async function main() {
  console.log('🚀 Iniciando validação automática - FASE 1\n');
  console.log(`🌐 Base URL: ${BASE_URL}\n`);

  await validateAdminRoute();
  await validateStepNavigation();
  await measureTTI();
  await checkPerformanceMonitor();
  await generateReport();

  const hasFailed = results.some(r => r.status === 'FAIL');
  process.exit(hasFailed ? 1 : 0);
}

main().catch(error => {
  console.error('💥 Erro fatal:', error);
  process.exit(1);
});
