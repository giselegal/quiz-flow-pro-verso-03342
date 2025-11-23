#!/usr/bin/env node
/**
 * 🔍 LIGHTHOUSE AUDIT AUTOMATIZADO - FASE 2
 * 
 * Executa Lighthouse audit e gera relatório de performance
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const OUTPUT_DIR = path.join(process.cwd(), 'reports');

async function runLighthouse(url) {
  console.log(`🔍 Executando Lighthouse audit em: ${url}`);
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);

  await chrome.kill();

  return runnerResult;
}

async function analyzeCoreWebVitals(lhr) {
  console.log('\n📊 Core Web Vitals:\n');

  const metrics = {
    fcp: lhr.audits['first-contentful-paint'].numericValue,
    lcp: lhr.audits['largest-contentful-paint'].numericValue,
    cls: lhr.audits['cumulative-layout-shift'].numericValue,
    tti: lhr.audits['interactive'].numericValue,
    tbt: lhr.audits['total-blocking-time'].numericValue,
    si: lhr.audits['speed-index'].numericValue,
  };

  // Thresholds (bom/médio/ruim)
  const thresholds = {
    fcp: { good: 1800, poor: 3000 },
    lcp: { good: 2500, poor: 4000 },
    cls: { good: 0.1, poor: 0.25 },
    tti: { good: 3800, poor: 7300 },
    tbt: { good: 200, poor: 600 },
    si: { good: 3400, poor: 5800 },
  };

  const getStatus = (value, threshold) => {
    if (value <= threshold.good) return '✅ BOM';
    if (value <= threshold.poor) return '⚠️  MÉDIO';
    return '❌ RUIM';
  };

  console.log(`FCP (First Contentful Paint): ${metrics.fcp.toFixed(0)}ms ${getStatus(metrics.fcp, thresholds.fcp)}`);
  console.log(`LCP (Largest Contentful Paint): ${metrics.lcp.toFixed(0)}ms ${getStatus(metrics.lcp, thresholds.lcp)}`);
  console.log(`CLS (Cumulative Layout Shift): ${metrics.cls.toFixed(3)} ${getStatus(metrics.cls, thresholds.cls)}`);
  console.log(`TTI (Time to Interactive): ${metrics.tti.toFixed(0)}ms ${getStatus(metrics.tti, thresholds.tti)}`);
  console.log(`TBT (Total Blocking Time): ${metrics.tbt.toFixed(0)}ms ${getStatus(metrics.tbt, thresholds.tbt)}`);
  console.log(`SI (Speed Index): ${metrics.si.toFixed(0)}ms ${getStatus(metrics.si, thresholds.si)}`);

  return metrics;
}

async function analyzeOpportunities(lhr) {
  console.log('\n💡 Oportunidades de Otimização:\n');

  const opportunities = lhr.audits;
  const critical = [];

  // Identificar oportunidades críticas (savings > 500ms)
  Object.keys(opportunities).forEach(key => {
    const audit = opportunities[key];
    if (audit.details && audit.details.overallSavingsMs > 500) {
      critical.push({
        title: audit.title,
        savings: audit.details.overallSavingsMs,
        description: audit.description,
      });
    }
  });

  critical.sort((a, b) => b.savings - a.savings);

  critical.slice(0, 5).forEach((opp, i) => {
    console.log(`${i + 1}. ${opp.title}`);
    console.log(`   Economia potencial: ${opp.savings.toFixed(0)}ms`);
  });

  if (critical.length === 0) {
    console.log('✅ Nenhuma otimização crítica identificada');
  }

  return critical;
}

async function main() {
  console.log('🚀 Lighthouse Audit - FASE 2\n');

  // Criar diretório de reports
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // Executar lighthouse
    const runnerResult = await runLighthouse(BASE_URL);
    const lhr = runnerResult.lhr;

    // Análise de scores
    console.log('\n📈 Scores Gerais:\n');
    console.log(`Performance: ${(lhr.categories.performance.score * 100).toFixed(0)}/100`);
    console.log(`Accessibility: ${(lhr.categories.accessibility.score * 100).toFixed(0)}/100`);
    console.log(`Best Practices: ${(lhr.categories['best-practices'].score * 100).toFixed(0)}/100`);

    // Core Web Vitals
    const metrics = await analyzeCoreWebVitals(lhr);

    // Oportunidades
    const opportunities = await analyzeOpportunities(lhr);

    // Salvar HTML report
    const reportHtml = runnerResult.report;
    const reportPath = path.join(OUTPUT_DIR, 'lighthouse-report.html');
    fs.writeFileSync(reportPath, reportHtml);
    console.log(`\n💾 Relatório HTML salvo em: ${reportPath}`);

    // Salvar JSON
    const jsonPath = path.join(OUTPUT_DIR, 'lighthouse-results.json');
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        url: BASE_URL,
        scores: {
          performance: lhr.categories.performance.score * 100,
          accessibility: lhr.categories.accessibility.score * 100,
          bestPractices: lhr.categories['best-practices'].score * 100,
        },
        metrics,
        opportunities: opportunities.slice(0, 5),
      }, null, 2)
    );
    console.log(`💾 Resultados JSON salvos em: ${jsonPath}\n`);

    // Exit code baseado no score de performance
    const perfScore = lhr.categories.performance.score * 100;
    if (perfScore < 50) {
      console.log('❌ Performance score CRÍTICO (<50)');
      process.exit(1);
    } else if (perfScore < 75) {
      console.log('⚠️  Performance score MÉDIO (50-75)');
    } else {
      console.log('✅ Performance score BOM (>75)');
    }
  } catch (error) {
    console.error('💥 Erro ao executar Lighthouse:', error);
    process.exit(1);
  }
}

main();
