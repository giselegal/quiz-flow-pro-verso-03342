// Script para identificar todos os tipos de blocos usados nas 21 etapas
const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISE DE TIPOS DE BLOCOS - 21 ETAPAS');
console.log('='.repeat(60));

// Coletar tipos de blocos de todas as etapas
const blockTypes = new Set();
const componentImports = new Set();

// 1. Analisar JSON examples
console.log('\n📁 1. ANALISANDO ARQUIVOS JSON:');
const jsonFiles = ['examples/step01-blocks.json', 'examples/step01-blocks-corrigido.json'];

jsonFiles.forEach(file => {
  const fullPath = path.join('/workspaces/quiz-quest-challenge-verse', file);
  if (fs.existsSync(fullPath)) {
    try {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      if (Array.isArray(content)) {
        content.forEach(block => {
          if (block.type) {
            blockTypes.add(block.type);
            console.log(`   📦 ${file}: ${block.type}`);
          }
        });
      }
    } catch (e) {
      console.log(`❌ Erro ao ler ${file}: ${e.message}`);
    }
  }
});

// 2. Analisar templates TypeScript
console.log('\n📁 2. ANALISANDO TEMPLATES TYPESCRIPT:');
const templateDir = '/workspaces/quiz-quest-challenge-verse/src/components/steps';

if (fs.existsSync(templateDir)) {
  const files = fs.readdirSync(templateDir);

  files.forEach(file => {
    if (file.endsWith('Template.tsx')) {
      const filePath = path.join(templateDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Procurar por tipos de blocos em templates
        const typeMatches = content.match(/type:\s*['"`]([^'"`]+)['"`]/g) || [];
        typeMatches.forEach(match => {
          const type = match.match(/['"`]([^'"`]+)['"`]/)[1];
          blockTypes.add(type);
          console.log(`   🔧 ${file}: ${type}`);
        });

        // Procurar por imports de componentes
        const importMatches = content.match(/import\s+\{\s*([^}]+)\s*\}/g) || [];
        importMatches.forEach(match => {
          const imports = match.match(/\{\s*([^}]+)\s*\}/)[1];
          imports.split(',').forEach(imp => {
            const cleanImport = imp.trim();
            if (cleanImport.includes('Block') || cleanImport.includes('Component')) {
              componentImports.add(cleanImport);
            }
          });
        });
      } catch (e) {
        console.log(`❌ Erro ao ler ${file}: ${e.message}`);
      }
    }
  });
}

// 3. Analisar registry atual
console.log('\n📁 3. ANALISANDO REGISTRY ATUAL:');
const registryPath = '/workspaces/quiz-quest-challenge-verse/src/config/enhancedBlockRegistry.ts';
if (fs.existsSync(registryPath)) {
  try {
    const content = fs.readFileSync(registryPath, 'utf8');
    const matches = content.match(/'([^']+)':\s*\w+/g) || [];
    console.log(`   📋 Registry atual: ${matches.length} tipos`);
    matches.forEach(match => {
      const type = match.split("'")[1];
      console.log(`   ✅ Já no registry: ${type}`);
    });
  } catch (e) {
    console.log(`❌ Erro ao ler registry: ${e.message}`);
  }
}

// 4. Resumo final
console.log('\n' + '='.repeat(60));
console.log(`🎯 TIPOS DE BLOCOS ENCONTRADOS: ${blockTypes.size}`);
console.log('📋 Lista completa:');
Array.from(blockTypes)
  .sort()
  .forEach(type => {
    console.log(`   - ${type}`);
  });

console.log(`\n🧩 COMPONENTES IMPORTADOS: ${componentImports.size}`);
Array.from(componentImports)
  .sort()
  .forEach(comp => {
    console.log(`   - ${comp}`);
  });

console.log('\n🎯 ANÁLISE COMPLETA - Expandir registry com estes tipos!');
