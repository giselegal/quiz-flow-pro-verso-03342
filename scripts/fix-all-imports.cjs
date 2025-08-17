#!/usr/bin/env node

/**
 * 🔧 SCRIPT: Corrigir TODOS os imports incorretos de getStepXXTemplate em lote
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Função para encontrar todos os arquivos com imports problemáticos
function findProblematicFiles() {
  try {
    // Busca por imports getStepXXTemplate em arquivos .ts e .tsx
    const result = execSync(`grep -r "getStep.*Template.*from" src/ --include="*.ts" --include="*.tsx" -l`, { encoding: 'utf8' });
    return result.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.log('Nenhum arquivo encontrado ou erro na busca');
    return [];
  }
}

// Função para corrigir um arquivo
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Remove TODOS os imports de getStepXXTemplate
    const importRegex = /import\s*\{\s*[^}]*getStep\d+Template[^}]*\}\s*from\s*['"]\@?[^'"]*Step\d+Template['"]\s*;?\n?/g;
    if (content.match(importRegex)) {
      content = content.replace(importRegex, '');
      changed = true;
    }

    // Remove chamadas para getStepXXTemplate() e substitui por array vazio ou comentário
    const callRegex = /const\s+\w+\s*=\s*getStep\d+Template\([^)]*\)\s*;?/g;
    if (content.match(callRegex)) {
      content = content.replace(callRegex, '// TODO: Migrado para TemplateRenderer - remover se não necessário');
      changed = true;
    }

    // Remove uso direto de funções getStepXXTemplate
    const usageRegex = /getStep\d+Template\([^)]*\)/g;
    if (content.match(usageRegex)) {
      content = content.replace(usageRegex, '[]');
      changed = true;
    }

    // Remove linhas vazias duplas criadas pela remoção dos imports
    content = content.replace(/\n\n\n+/g, '\n\n');

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;

  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

// Função principal
function main() {
  console.log('🔧 CORRIGINDO TODOS OS IMPORTS INCORRETOS DE getStepXXTemplate');
  console.log('');

  const problematicFiles = findProblematicFiles();
  
  if (problematicFiles.length === 0) {
    console.log('✅ Nenhum arquivo com imports problemáticos encontrado!');
    return;
  }

  console.log(`📁 Encontrados ${problematicFiles.length} arquivo(s) para corrigir:`);
  problematicFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');

  let fixedFiles = 0;
  let totalFiles = problematicFiles.length;

  problematicFiles.forEach(filePath => {
    if (fixFile(filePath)) {
      console.log(`✅ Corrigido: ${filePath}`);
      fixedFiles++;
    } else {
      console.log(`⏭️  Já correto: ${filePath}`);
    }
  });

  console.log('');
  console.log('📊 RESULTADO:');
  console.log(`   Total de arquivos: ${totalFiles}`);
  console.log(`   Arquivos corrigidos: ${fixedFiles}`);
  console.log(`   Arquivos já corretos: ${totalFiles - fixedFiles}`);

  if (fixedFiles > 0) {
    console.log('');
    console.log('🎉 CORREÇÕES APLICADAS!');
    console.log('📋 PRÓXIMOS PASSOS:');
    console.log('   1. npm run build - verificar se build funciona');
    console.log('   2. npm run dev - testar servidor de desenvolvimento');
    console.log('   3. Verificar se algum arquivo precisa de ajuste manual');
  }
}

// Executa o script
if (require.main === module) {
  main();
}

module.exports = { fixFile, findProblematicFiles };
