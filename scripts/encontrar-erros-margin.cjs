#!/usr/bin/env node

/**
 * 🔍 ENCONTRAR COMPONENTES COM PROBLEMA DE marginTop NÃO DEFINIDO
 *
 * Este script vai identificar arquivos que usam getMarginClass(marginTop, "top")
 * mas não têm marginTop definido nas suas props/destructuring
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 PROCURANDO COMPONENTES COM PROBLEMA marginTop...\n');

// Função para verificar se um arquivo tem o problema
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Verifica se usa getMarginClass com marginTop
    const usesMarginClass = content.includes('getMarginClass(marginTop');
    if (!usesMarginClass) return null;

    // Verifica se define marginTop
    const definesMarginTop =
      content.includes('marginTop =') ||
      content.includes('marginTop:') ||
      content.includes('const marginTop');

    if (!definesMarginTop) {
      return {
        file: filePath,
        problem: 'Usa getMarginClass(marginTop) mas não define marginTop',
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Encontrar todos os arquivos .tsx nos components
const componentDirs = [
  './src/components/blocks/inline/',
  './src/components/editor/blocks/',
  './src/components/blocks/',
];

const problematicFiles = [];

componentDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files
      .filter(f => f.endsWith('.tsx'))
      .forEach(file => {
        const filePath = path.join(dir, file);
        const problem = checkFile(filePath);
        if (problem) {
          problematicFiles.push(problem);
        }
      });
  }
});

console.log('🚨 COMPONENTES COM PROBLEMA ENCONTRADOS:\n');

if (problematicFiles.length === 0) {
  console.log('✅ NENHUM PROBLEMA ENCONTRADO!');
  console.log('   Todos os componentes que usam getMarginClass definem marginTop corretamente.');
} else {
  problematicFiles.forEach((problem, index) => {
    console.log(`${index + 1}. ❌ ${problem.file}`);
    console.log(`   ${problem.problem}\n`);
  });

  console.log(`\n📊 TOTAL DE ARQUIVOS PROBLEMÁTICOS: ${problematicFiles.length}`);
}

console.log('\n🔧 SOLUÇÃO:');
console.log('   Para cada arquivo problemático, adicionar na destructuring do style:');
console.log(
  '   const { ..., marginTop = 0, marginBottom = 0, marginLeft = 0, marginRight = 0 } = style;'
);

console.log('\n✅ ARQUIVO JÁ CORRIGIDO:');
console.log('   src/components/blocks/inline/CountdownInlineBlock.tsx');
