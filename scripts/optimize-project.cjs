#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando otimização do projeto...\n');

// 1. Identificar arquivos duplicados
console.log('🔍 Verificando arquivos duplicados...');

const fileHashes = new Map();
const duplicates = [];

function checkDuplicates(dir, basePath = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach(item => {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.join(basePath, item.name);

    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      checkDuplicates(fullPath, relativePath);
    } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const contentHash = content.slice(0, 200); // Hash simples

        if (fileHashes.has(contentHash)) {
          duplicates.push({
            original: fileHashes.get(contentHash),
            duplicate: relativePath,
          });
        } else {
          fileHashes.set(contentHash, relativePath);
        }
      } catch (error) {
        // Ignorar erros de leitura
      }
    }
  });
}

if (fs.existsSync('src')) {
  checkDuplicates('src', 'src');
}

if (duplicates.length > 0) {
  console.log(`⚠️  Encontrados ${duplicates.length} possíveis arquivos duplicados:`);
  duplicates.slice(0, 5).forEach(dup => {
    console.log(`   - ${dup.duplicate} (similar a ${dup.original})`);
  });
} else {
  console.log('✅ Nenhum arquivo duplicado encontrado');
}

// 2. Verificar imports não utilizados
console.log('\n🔍 Verificando estrutura de imports...');

let totalImports = 0;
let unusedImports = 0;

function checkImports(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach(item => {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      checkImports(fullPath);
    } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const imports = content.match(/^import .* from .*/gm) || [];
        totalImports += imports.length;

        // Verificação simples de imports não utilizados
        imports.forEach(importLine => {
          const match = importLine.match(/import\s+{([^}]+)}/);
          if (match) {
            const importedItems = match[1].split(',').map(item => item.trim());
            importedItems.forEach(item => {
              if (!content.includes(item.replace(/\s+as\s+\w+/, ''))) {
                unusedImports++;
              }
            });
          }
        });
      } catch (error) {
        // Ignorar erros de leitura
      }
    }
  });
}

if (fs.existsSync('src')) {
  checkImports('src');
}

console.log(`📊 Total de imports: ${totalImports}`);
console.log(`⚠️  Possíveis imports não utilizados: ${unusedImports}`);

// 3. Criar recomendações
const recommendations = [
  '🔧 Execute `npm audit` para verificar vulnerabilidades',
  '📦 Considere usar `npm-check-updates` para atualizar dependências',
  '🧹 Use `npx depcheck` para encontrar dependências não utilizadas',
  '🏗️ Considere implementar tree-shaking para reduzir bundle size',
  '🧪 Implemente testes automatizados (cobertura atual < 1%)',
  '📝 Adicione documentação para componentes principais',
];

console.log('\n💡 Recomendações de otimização:');
recommendations.forEach(rec => console.log(`   ${rec}`));

console.log('\n✅ Análise de otimização concluída');
