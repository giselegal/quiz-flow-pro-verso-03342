#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE AUDITORIA DE COMPONENTES DE BOTÃO
 *
 * Este script realiza uma análise completa dos componentes de botão no projeto:
 * - Lista todos os componentes
 * - Verifica formatação Prettier
 * - Analisa padrões de implementação
 * - Identifica inconsistências
 * - Gera relatório detalhado
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 INICIANDO AUDITORIA COMPLETA DE COMPONENTES DE BOTÃO');
console.log('='.repeat(60));

// 1. Encontrar todos os componentes de botão
console.log('\n📂 1. IDENTIFICANDO COMPONENTES DE BOTÃO...');
const findButtonComponents = () => {
  try {
    const result = execSync(
      'find src/components -name "*Button*.tsx" -o -name "*button*.tsx" 2>/dev/null',
      { encoding: 'utf8' }
    );
    return result
      .trim()
      .split('\n')
      .filter(line => line.length > 0);
  } catch (error) {
    console.error('❌ Erro ao buscar componentes:', error.message);
    return [];
  }
};

const buttonComponents = findButtonComponents();
console.log(`✅ Encontrados ${buttonComponents.length} componentes de botão:`);
buttonComponents.forEach((comp, index) => {
  console.log(`   ${(index + 1).toString().padStart(2, '0')}. ${comp}`);
});

// 2. Analisar cada componente
console.log('\n🔍 2. ANALISANDO COMPONENTES...');

const analysisResults = {
  total: buttonComponents.length,
  formatted: 0,
  needsFormatting: 0,
  errors: 0,
  patterns: {
    importButton: 0,
    useForwardRef: 0,
    hasVariants: 0,
    hasTypeScript: 0,
    exportDefault: 0,
    exportNamed: 0,
  },
  issues: [],
  summary: [],
};

buttonComponents.forEach((componentPath, index) => {
  console.log(`\n   📄 ${index + 1}/${buttonComponents.length}: ${componentPath}`);

  try {
    // Verificar se o arquivo existe
    if (!fs.existsSync(componentPath)) {
      analysisResults.issues.push(`❌ Arquivo não encontrado: ${componentPath}`);
      return;
    }

    const content = fs.readFileSync(componentPath, 'utf8');
    const lines = content.split('\n');

    // Análise de padrões
    const patterns = {
      importButton: content.includes("from '@/components/ui/button'"),
      importReact: content.includes('import React') || content.includes('import { '),
      hasInterface: content.includes('interface ') || content.includes('type '),
      hasExport: content.includes('export '),
      hasForwardRef: content.includes('forwardRef'),
      hasVariants: content.includes('variant') && content.includes('size'),
      hasClassName: content.includes('className'),
      hasOnClick: content.includes('onClick'),
    };

    // Contar padrões
    if (patterns.importButton) analysisResults.patterns.importButton++;
    if (patterns.hasForwardRef) analysisResults.patterns.useForwardRef++;
    if (patterns.hasVariants) analysisResults.patterns.hasVariants++;
    if (patterns.hasInterface) analysisResults.patterns.hasTypeScript++;

    // Verificar formatação com Prettier
    let isPrettierFormatted = true;
    try {
      execSync(`npx prettier --check "${componentPath}"`, { stdio: 'pipe' });
      analysisResults.formatted++;
      console.log('      ✅ Prettier: Formatado');
    } catch (error) {
      isPrettierFormatted = false;
      analysisResults.needsFormatting++;
      console.log('      ⚠️  Prettier: Precisa formatação');
    }

    // Análise de qualidade
    const quality = {
      hasTypeDefinitions: patterns.hasInterface,
      importsCorrect: patterns.importButton,
      hasProperExport: patterns.hasExport,
      isFormatted: isPrettierFormatted,
      score: 0,
    };

    quality.score = Object.values(quality).filter(Boolean).length - 1; // -1 para não contar o score

    analysisResults.summary.push({
      path: componentPath,
      patterns,
      quality,
      lines: lines.length,
      size: content.length,
    });

    console.log(`      📊 Qualidade: ${quality.score}/4 pontos`);
  } catch (error) {
    analysisResults.errors++;
    analysisResults.issues.push(`❌ Erro ao analisar ${componentPath}: ${error.message}`);
    console.log(`      ❌ Erro: ${error.message}`);
  }
});

// 3. Gerar relatório
console.log('\n📊 3. RELATÓRIO DE AUDITORIA');
console.log('='.repeat(60));

console.log('\n🎯 RESUMO GERAL:');
console.log(`   Total de componentes: ${analysisResults.total}`);
console.log(`   Formatados corretamente: ${analysisResults.formatted}`);
console.log(`   Precisam de formatação: ${analysisResults.needsFormatting}`);
console.log(`   Erros durante análise: ${analysisResults.errors}`);

console.log('\n🔍 PADRÕES ENCONTRADOS:');
console.log(
  `   Importam Button UI: ${analysisResults.patterns.importButton}/${analysisResults.total}`
);
console.log(
  `   Usam forwardRef: ${analysisResults.patterns.useForwardRef}/${analysisResults.total}`
);
console.log(`   Têm variantes: ${analysisResults.patterns.hasVariants}/${analysisResults.total}`);
console.log(
  `   TypeScript completo: ${analysisResults.patterns.hasTypeScript}/${analysisResults.total}`
);

if (analysisResults.issues.length > 0) {
  console.log('\n⚠️  PROBLEMAS IDENTIFICADOS:');
  analysisResults.issues.forEach(issue => console.log(`   ${issue}`));
}

console.log('\n🏆 TOP 5 COMPONENTES (por qualidade):');
analysisResults.summary
  .sort((a, b) => b.quality.score - a.quality.score)
  .slice(0, 5)
  .forEach((comp, index) => {
    console.log(`   ${index + 1}. ${comp.path} (${comp.quality.score}/4 pontos)`);
  });

console.log('\n⚡ RECOMENDAÇÕES:');
if (analysisResults.needsFormatting > 0) {
  console.log(`   🔧 Executar Prettier em ${analysisResults.needsFormatting} componentes`);
}
if (analysisResults.patterns.hasTypeScript < analysisResults.total) {
  console.log(
    `   📝 Adicionar interfaces TypeScript em ${analysisResults.total - analysisResults.patterns.hasTypeScript} componentes`
  );
}
if (analysisResults.patterns.importButton < analysisResults.total) {
  console.log(
    `   🔄 Padronizar imports do Button UI em ${analysisResults.total - analysisResults.patterns.importButton} componentes`
  );
}

console.log('\n✅ AUDITORIA CONCLUÍDA!');
console.log('='.repeat(60));
