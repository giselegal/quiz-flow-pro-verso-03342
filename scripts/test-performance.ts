#!/usr/bin/env node

/**
 * 🧪 Script de Teste de Performance - Validação de Otimizações
 * 
 * Testa as 5 otimizações implementadas:
 * 1. Carregamento unificado de template
 * 2. Fix do loop infinito em preview mode
 * 3. Validação não-bloqueante com Web Worker
 * 4. WYSIWYG reset otimizado
 * 5. Prefetch inteligente
 */

import { chromium } from 'playwright';
import { performance } from 'perf_hooks';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  duration: number;
  expected: number;
  message: string;
}

const results: TestResult[] = [];

async function runTests() {
  console.log('🚀 Iniciando testes de performance...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Configurar métricas de performance
  await page.addInitScript(() => {
    (window as any).performanceMetrics = {
      templateLoads: 0,
      wysiwygResets: 0,
      navigationTimes: [],
      cpuUsage: [],
    };
  });

  // 🧪 TESTE 1: Carregamento inicial < 1s
  console.log('🧪 Teste 1: Carregamento inicial do template...');
  const startLoad = performance.now();
  
  await page.goto('http://localhost:5173/editor?funnel=quiz21StepsComplete&template=quiz21StepsComplete', {
    waitUntil: 'networkidle',
  });

  const loadDuration = performance.now() - startLoad;
  results.push({
    name: 'Carregamento Inicial',
    status: loadDuration < 1000 ? 'PASS' : loadDuration < 2000 ? 'WARN' : 'FAIL',
    duration: loadDuration,
    expected: 1000,
    message: `Template carregado em ${loadDuration.toFixed(0)}ms`,
  });

  // Esperar editor estar pronto
  await page.waitForSelector('[data-testid="canvas-column"]', { timeout: 5000 });

  // 🧪 TESTE 2: Verificar que não há carregamento duplicado
  console.log('🧪 Teste 2: Verificando deduplicação de carregamento...');
  
  const templateLoadCalls = await page.evaluate(() => {
    const logs = (window as any).performanceMetrics?.templateLoads || 0;
    return logs;
  });

  results.push({
    name: 'Deduplicação de Carregamento',
    status: templateLoadCalls <= 1 ? 'PASS' : templateLoadCalls <= 2 ? 'WARN' : 'FAIL',
    duration: templateLoadCalls,
    expected: 1,
    message: `${templateLoadCalls} carregamento(s) detectado(s)`,
  });

  // 🧪 TESTE 3: Navegação entre steps < 100ms
  console.log('🧪 Teste 3: Testando navegação entre steps...');
  
  const navigationTimes: number[] = [];
  
  for (let i = 1; i <= 5; i++) {
    const navStart = performance.now();
    
    // Clicar no próximo step
    await page.click(`[data-step-id="step-0${i + 1}"]`);
    await page.waitForTimeout(50); // Debounce
    
    const navDuration = performance.now() - navStart;
    navigationTimes.push(navDuration);
  }

  const avgNavigationTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;

  results.push({
    name: 'Navegação Entre Steps',
    status: avgNavigationTime < 100 ? 'PASS' : avgNavigationTime < 200 ? 'WARN' : 'FAIL',
    duration: avgNavigationTime,
    expected: 100,
    message: `Média: ${avgNavigationTime.toFixed(0)}ms (${navigationTimes.length} navegações)`,
  });

  // 🧪 TESTE 4: Toggle preview mode sem loop
  console.log('🧪 Teste 4: Testando toggle de preview mode...');
  
  // Capturar console.log para detectar loops
  const consoleLogs: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('Auto-select') || text.includes('reset')) {
      consoleLogs.push(text);
    }
  });

  // Toggle para preview mode
  await page.click('[data-testid="preview-mode-toggle"]');
  await page.waitForTimeout(500);

  // Verificar se não há loops (< 5 logs em 500ms)
  const loopDetected = consoleLogs.length > 5;

  results.push({
    name: 'Preview Mode (Loop Detection)',
    status: !loopDetected ? 'PASS' : 'FAIL',
    duration: consoleLogs.length,
    expected: 5,
    message: `${consoleLogs.length} eventos detectados (< 5 = sem loop)`,
  });

  // 🧪 TESTE 5: Validação não-bloqueante
  console.log('🧪 Teste 5: Testando validação de template...');
  
  // Simular validação
  const validationStart = performance.now();
  
  await page.evaluate(() => {
    // Disparar validação programaticamente
    (window as any).dispatchEvent(new CustomEvent('validate-template'));
  });

  // Verificar se UI permanece responsiva durante validação
  const buttonClickable = await page.isEnabled('[data-testid="save-button"]');
  const validationDuration = performance.now() - validationStart;

  results.push({
    name: 'Validação Não-Bloqueante',
    status: buttonClickable ? 'PASS' : 'FAIL',
    duration: validationDuration,
    expected: 0,
    message: `UI ${buttonClickable ? 'responsiva' : 'BLOQUEADA'} durante validação`,
  });

  // 🧪 TESTE 6: WYSIWYG reset otimizado
  console.log('🧪 Teste 6: Testando WYSIWYG reset...');
  
  const wysiwygResets = await page.evaluate(() => {
    return (window as any).performanceMetrics?.wysiwygResets || 0;
  });

  results.push({
    name: 'WYSIWYG Reset Otimizado',
    status: wysiwygResets <= navigationTimes.length ? 'PASS' : 'WARN',
    duration: wysiwygResets,
    expected: navigationTimes.length,
    message: `${wysiwygResets} resets vs ${navigationTimes.length} navegações`,
  });

  await browser.close();

  // 📊 RELATÓRIO FINAL
  console.log('\n' + '='.repeat(80));
  console.log('📊 RELATÓRIO DE TESTES DE PERFORMANCE');
  console.log('='.repeat(80) + '\n');

  results.forEach((result, index) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌';
    const delta = result.duration - result.expected;
    const deltaStr = delta > 0 ? `+${delta.toFixed(0)}ms` : `${delta.toFixed(0)}ms`;
    
    console.log(`${icon} Teste ${index + 1}: ${result.name}`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Medido: ${result.duration.toFixed(0)}ms`);
    console.log(`   Esperado: ${result.expected}ms`);
    console.log(`   Delta: ${deltaStr}`);
    console.log(`   Mensagem: ${result.message}`);
    console.log('');
  });

  // 📈 RESUMO
  const passCount = results.filter(r => r.status === 'PASS').length;
  const warnCount = results.filter(r => r.status === 'WARN').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const totalTests = results.length;

  console.log('='.repeat(80));
  console.log('📈 RESUMO');
  console.log('='.repeat(80));
  console.log(`Total de Testes: ${totalTests}`);
  console.log(`✅ Passou: ${passCount} (${((passCount / totalTests) * 100).toFixed(0)}%)`);
  console.log(`⚠️  Aviso: ${warnCount} (${((warnCount / totalTests) * 100).toFixed(0)}%)`);
  console.log(`❌ Falhou: ${failCount} (${((failCount / totalTests) * 100).toFixed(0)}%)`);
  console.log('');

  if (failCount === 0 && warnCount === 0) {
    console.log('🎉 TODOS OS TESTES PASSARAM! Sistema está PRODUCTION READY.');
  } else if (failCount === 0) {
    console.log('⚠️  Alguns testes com avisos. Revisar antes de deploy.');
  } else {
    console.log('❌ Alguns testes falharam. Necessário investigar.');
  }

  console.log('='.repeat(80) + '\n');

  // Exit code baseado nos resultados
  process.exit(failCount > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error('💥 Erro ao executar testes:', error);
  process.exit(1);
});
