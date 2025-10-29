#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO COMPLETO: Alinhamento JSON ↔ Componentes Modulares
 * 
 * Verifica se os tipos de blocos nos JSONs são suportados pelos componentes:
 * - ModularIntroStep (step-01)
 * - ModularQuestionStep (steps 02-11, 13-18)
 * - ModularTransitionStep (steps 12, 19)
 * - ModularResultStep (step-20)
 * - ModularOfferStep (step-21)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Mapa de tipos esperados por componente
const EXPECTED_BLOCK_TYPES = {
  intro: [
    'intro-logo',
    'intro-logo-header',
    'quiz-intro-header',
    'intro-title',
    'intro-image',
    'intro-description',
    'intro-form',
  ],
  question: [
    'question-progress',
    'question-number',
    'question-title',
    'question-text',
    'options-grid',
    'quiz-options',
    'question-navigation',
    'quiz-navigation',
  ],
  transition: [
    'transition-title',
    'transition-text',
    'transition-loader',
    'transition-progress',
    'transition-message',
    'text-inline',
    'cta-inline',
  ],
  result: [
    'result-header',
    'result-congrats',
    'result-main',
    'result-image',
    'result-description',
    'result-style',
    'result-characteristics',
    'result-progress-bars',
    'result-secondary-styles',
    'result-secondaryList',
    'result-cta',
    'result-cta-primary',
    'result-cta-secondary',
    'result-share',
  ],
  offer: [
    'offer-hero',
    'offer-header',
    'offer-description',
    'pricing',
    'benefits',
    'guarantee',
    'urgency-timer',
    'urgency-timer-inline',
    'offer-cta',
  ],
};

// Mapa de step → componente
const STEP_TO_COMPONENT = {
  'step-01': 'ModularIntroStep',
  'step-02': 'ModularQuestionStep',
  'step-03': 'ModularQuestionStep',
  'step-04': 'ModularQuestionStep',
  'step-05': 'ModularQuestionStep',
  'step-06': 'ModularQuestionStep',
  'step-07': 'ModularQuestionStep',
  'step-08': 'ModularQuestionStep',
  'step-09': 'ModularQuestionStep',
  'step-10': 'ModularQuestionStep',
  'step-11': 'ModularQuestionStep',
  'step-12': 'ModularTransitionStep',
  'step-13': 'ModularQuestionStep',
  'step-14': 'ModularQuestionStep',
  'step-15': 'ModularQuestionStep',
  'step-16': 'ModularQuestionStep',
  'step-17': 'ModularQuestionStep',
  'step-18': 'ModularQuestionStep',
  'step-19': 'ModularTransitionStep',
  'step-20': 'ModularResultStep',
  'step-21': 'ModularOfferStep',
};

const COMPONENT_TO_TYPE = {
  'ModularIntroStep': 'intro',
  'ModularQuestionStep': 'question',
  'ModularTransitionStep': 'transition',
  'ModularResultStep': 'result',
  'ModularOfferStep': 'offer',
};

console.log('🔍 DIAGNÓSTICO: Alinhamento JSON ↔ Componentes Modulares\n');
console.log('═'.repeat(100));

// Carregar per-step JSONs
const blocksDir = path.join(rootDir, 'public/templates/blocks');
const results = [];

for (let i = 1; i <= 21; i++) {
  const stepId = `step-${String(i).padStart(2, '0')}`;
  const component = STEP_TO_COMPONENT[stepId];
  const componentType = COMPONENT_TO_TYPE[component];
  const expectedTypes = EXPECTED_BLOCK_TYPES[componentType] || [];

  try {
    const filePath = path.join(blocksDir, `${stepId}.json`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    const blocks = Array.isArray(data.blocks) ? data.blocks : [];
    const blockTypes = blocks.map(b => b.type);
    const uniqueTypes = [...new Set(blockTypes)];

    // Verificar tipos não suportados
    const unsupported = uniqueTypes.filter(t => !expectedTypes.includes(t));
    const missing = expectedTypes.filter(t => !uniqueTypes.includes(t));

    const status = unsupported.length === 0 ? '✅' : '⚠️';

    results.push({
      stepId,
      component,
      componentType,
      blocksCount: blocks.length,
      uniqueTypes,
      unsupported,
      missing,
      status,
    });

  } catch (err) {
    results.push({
      stepId,
      component,
      componentType,
      blocksCount: 0,
      uniqueTypes: [],
      unsupported: [],
      missing: expectedTypes,
      status: '❌',
      error: err.message,
    });
  }
}

// Tabela resumida
console.log('\n📊 RESUMO POR STEP:\n');
console.log('─'.repeat(100));
console.log('Step    │ Componente               │ Blocos │ Status │ Tipos Únicos');
console.log('─'.repeat(100));

for (const r of results) {
  const typesStr = r.uniqueTypes.slice(0, 3).join(', ') + (r.uniqueTypes.length > 3 ? '...' : '');
  console.log(
    `${r.stepId} │ ${r.component.padEnd(24)} │ ${String(r.blocksCount).padStart(6)} │ ${r.status.padEnd(6)} │ ${typesStr}`
  );
}
console.log('─'.repeat(100));

// Detalhamento de problemas
const problems = results.filter(r => r.status !== '✅');

if (problems.length > 0) {
  console.log('\n⚠️ PROBLEMAS DETECTADOS:\n');

  for (const p of problems) {
    console.log(`\n${p.stepId} (${p.component}):`);
    
    if (p.error) {
      console.log(`  ❌ ERRO: ${p.error}`);
      continue;
    }

    if (p.unsupported.length > 0) {
      console.log(`  ⚠️ Tipos NÃO suportados pelo componente:`);
      p.unsupported.forEach(t => console.log(`     - ${t}`));
    }

    if (p.missing.length > 0) {
      console.log(`  ℹ️ Tipos esperados mas ausentes no JSON:`);
      p.missing.forEach(t => console.log(`     - ${t}`));
    }
  }
} else {
  console.log('\n✅ TODOS OS STEPS ESTÃO ALINHADOS!\n');
}

// Análise por componente
console.log('\n📦 ANÁLISE POR COMPONENTE:\n');
console.log('─'.repeat(100));

const byComponent = {};
for (const r of results) {
  if (!byComponent[r.component]) {
    byComponent[r.component] = {
      steps: [],
      allTypes: new Set(),
      issues: 0,
    };
  }
  byComponent[r.component].steps.push(r.stepId);
  r.uniqueTypes.forEach(t => byComponent[r.component].allTypes.add(t));
  if (r.unsupported.length > 0) byComponent[r.component].issues++;
}

for (const [comp, info] of Object.entries(byComponent)) {
  const types = Array.from(info.allTypes).sort();
  const status = info.issues === 0 ? '✅' : '⚠️';
  
  console.log(`\n${status} ${comp}:`);
  console.log(`   Steps: ${info.steps.join(', ')}`);
  console.log(`   Tipos usados (${types.length}):`);
  types.forEach(t => console.log(`     - ${t}`));
  
  if (info.issues > 0) {
    console.log(`   ⚠️ ${info.issues} step(s) com tipos não suportados`);
  }
}

// Sumário final
console.log('\n═'.repeat(100));
console.log('📈 SUMÁRIO FINAL:\n');

const okCount = results.filter(r => r.status === '✅').length;
const warnCount = results.filter(r => r.status === '⚠️').length;
const errorCount = results.filter(r => r.status === '❌').length;

console.log(`✅ Alinhados:       ${okCount}/21`);
console.log(`⚠️ Com problemas:   ${warnCount}/21`);
console.log(`❌ Com erros:       ${errorCount}/21`);

if (okCount === 21) {
  console.log('\n🎉 PERFEITO! Todos os JSONs estão alinhados com os componentes modulares!\n');
} else {
  console.log('\n⚠️ Alguns ajustes podem ser necessários nos JSONs ou componentes.\n');
}

// Exportar resultados
const outputPath = path.join(rootDir, 'diagnostic-json-component-alignment.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`📄 Resultados detalhados salvos em: ${outputPath}\n`);
