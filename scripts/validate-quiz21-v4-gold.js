#!/usr/bin/env node
/**
 * Validador rápido do quiz21-v4-gold.json
 * Executa verificações básicas sem depender de testes completos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const goldPath = path.join(__dirname, '../public/templates/quiz21-v4-gold.json');

console.log('🔍 Validando quiz21-v4-gold.json...\n');

try {
  // Ler e parsear
  const content = fs.readFileSync(goldPath, 'utf8');
  const json = JSON.parse(content);
  
  let errors = 0;
  let warnings = 0;
  
  // Verificação 1: Metadata
  console.log('✓ Checklist de Validação:');
  
  const checks = [
    { name: 'version semver', test: () => /^\d+\.\d+\.\d+$/.test(json.version), value: json.version },
    { name: 'schemaVersion', test: () => /^\d+\.\d+$/.test(json.schemaVersion), value: json.schemaVersion },
    { name: 'metadata.id', test: () => json.metadata.id?.length > 0, value: json.metadata.id },
    { name: 'metadata.createdAt ISO8601', test: () => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(json.metadata.createdAt), value: json.metadata.createdAt },
    { name: 'theme.colors.primary hex', test: () => /^#[0-9A-F]{6}$/i.test(json.theme.colors.primary), value: json.theme.colors.primary },
    { name: 'theme.colors.secondary hex', test: () => /^#[0-9A-F]{6}$/i.test(json.theme.colors.secondary), value: json.theme.colors.secondary },
    { name: 'settings.scoring.method', test: () => ['category-points', 'weighted-sum'].includes(json.settings.scoring.method), value: json.settings.scoring.method },
    { name: 'steps array length', test: () => json.steps.length === 21, value: json.steps.length },
  ];
  
  checks.forEach(check => {
    const passed = check.test();
    const icon = passed ? '✅' : '❌';
    console.log(`   ${icon} ${check.name}: ${check.value}`);
    if (!passed) errors++;
  });
  
  // Verificação 2: Placeholders
  console.log('\n✓ Verificação de Placeholders:');
  const templateStr = JSON.stringify(json);
  const placeholders = templateStr.match(/\{\{[^}]+\}\}/g);
  
  if (placeholders && placeholders.length > 0) {
    console.log(`   ❌ ${placeholders.length} placeholders encontrados:`);
    const unique = [...new Set(placeholders)].slice(0, 5);
    unique.forEach(p => console.log(`      - ${p}`));
    if (placeholders.length > 5) {
      console.log(`      ... e mais ${placeholders.length - 5}`);
    }
    errors += placeholders.length;
  } else {
    console.log('   ✅ Nenhum placeholder encontrado');
  }
  
  // Verificação 3: Steps
  console.log('\n✓ Verificação de Steps:');
  json.steps.forEach((step, index) => {
    const stepId = step.id;
    const expectedId = `step-${String(index + 1).padStart(2, '0')}`;
    
    if (stepId !== expectedId) {
      console.log(`   ❌ Step ${index + 1}: ID incorreto (${stepId} vs ${expectedId})`);
      errors++;
    }
    
    if (step.blocks.length === 0) {
      console.log(`   ❌ Step ${stepId}: sem blocos`);
      errors++;
    }
    
    // Verificar validation.required
    if (step.validation && Array.isArray(step.validation.required)) {
      console.log(`   ⚠️  Step ${stepId}: validation.required é array (deveria ser boolean)`);
      warnings++;
    }
    
    // Verificar content nos blocks
    step.blocks.forEach((block, bIndex) => {
      if (!block.content) {
        console.log(`   ❌ Step ${stepId}, Block ${bIndex}: falta content`);
        errors++;
      }
    });
  });
  
  if (errors === 0 && warnings === 0) {
    console.log('   ✅ Todos os steps válidos');
  }
  
  // Verificação 4: Block types
  console.log('\n✓ Verificação de Block Types:');
  const blockTypes = new Set();
  json.steps.forEach(step => {
    step.blocks.forEach(block => {
      blockTypes.add(block.type);
    });
  });
  console.log(`   ✅ ${blockTypes.size} tipos de blocos únicos encontrados`);
  
  // Verificação 5: Navigation
  console.log('\n✓ Verificação de Navigation:');
  const lastStep = json.steps[json.steps.length - 1];
  if (lastStep.navigation?.nextStep === null) {
    console.log('   ✅ Último step tem nextStep: null');
  } else {
    console.log(`   ⚠️  Último step tem nextStep: ${lastStep.navigation?.nextStep}`);
    warnings++;
  }
  
  // Resumo
  console.log('\n📊 Resumo:');
  console.log(`   Tamanho: ${(content.length / 1024).toFixed(2)} KB`);
  console.log(`   Steps: ${json.steps.length}`);
  console.log(`   Blocos totais: ${json.steps.reduce((sum, s) => sum + s.blocks.length, 0)}`);
  console.log(`   Tipos de blocos: ${blockTypes.size}`);
  
  if (errors === 0 && warnings === 0) {
    console.log('\n✅ Template GOLD STANDARD válido! 🎯');
    process.exit(0);
  } else if (errors === 0) {
    console.log(`\n⚠️  Template válido com ${warnings} warnings`);
    process.exit(0);
  } else {
    console.log(`\n❌ Template inválido: ${errors} erros, ${warnings} warnings`);
    process.exit(1);
  }
  
} catch (error) {
  console.error('\n❌ Erro ao validar:', error.message);
  process.exit(1);
}
