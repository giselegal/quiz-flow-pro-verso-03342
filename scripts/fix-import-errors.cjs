#!/usr/bin/env node

/**
 * 🔧 SCRIPT: Corrigir imports incorretos de getStepXXTemplate
 */

const fs = require('fs');
const path = require('path');

// Função para encontrar e corrigir arquivos
function fixImports() {
  const filesToFix = [
    // Debug files
    'src/components/debug/DebugStep02.tsx',

    // Config files
    'src/config/stepTemplatesMapping.ts',
    'src/config/stepTemplatesMappingClean.ts',

    // Context files
    'src/context/EditorContext.simple.tsx',

    // Hook files
    'src/hooks/useTemplateCache.ts',
  ];

  filesToFix.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
      return;
    }

    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Remove imports de getStepXXTemplate
      const importRegex =
        /import\s*\{\s*[^}]*getStep\d+Template[^}]*\}\s*from\s*['"]\@?\/components\/steps\/Step\d+Template['"]\s*;?\n?/g;
      if (content.match(importRegex)) {
        content = content.replace(importRegex, '');
        changed = true;
        console.log(`✅ Removido import getStepXXTemplate de: ${filePath}`);
      }

      // Remove chamadas para getStepXXTemplate() - substituir por comentário
      const callRegex = /const\s+\w+\s*=\s*getStep\d+Template\([^)]*\)\s*;?/g;
      if (content.match(callRegex)) {
        content = content.replace(
          callRegex,
          '// TODO: Substituir por TemplateRenderer ou template JSON'
        );
        changed = true;
        console.log(`✅ Comentado chamada getStepXXTemplate em: ${filePath}`);
      }

      // Remove uso de funções getStepXXTemplate
      const usageRegex = /getStep\d+Template\([^)]*\)/g;
      if (content.match(usageRegex)) {
        content = content.replace(usageRegex, '[]');
        changed = true;
        console.log(`✅ Substituído uso getStepXXTemplate por [] em: ${filePath}`);
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`💾 Arquivo salvo: ${filePath}`);
      } else {
        console.log(`⏭️  Arquivo já está correto: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    }
  });
}

// Executa o script
console.log('🔧 CORRIGINDO IMPORTS INCORRETOS DE getStepXXTemplate');
console.log('');

fixImports();

console.log('');
console.log('✅ Correção concluída!');
console.log('📋 PRÓXIMOS PASSOS:');
console.log('   1. Verificar se há erros de compilação');
console.log('   2. Testar o build');
console.log('   3. Atualizar arquivos que dependem dessas funções');
