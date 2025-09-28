#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 CORREÇÃO DE IMPORTS QUEBRADOS NO enhancedBlockRegistry.ts\n');

const registryPath = path.join(__dirname, 'src/config/enhancedBlockRegistry.ts');
const inlineDir = path.join(__dirname, 'src/components/blocks/inline');

// 1. Verificar quais arquivos realmente existem
console.log('🔍 Verificando arquivos inline existentes...');
const existingFiles = fs
  .readdirSync(inlineDir)
  .filter(file => file.endsWith('.tsx'))
  .map(file => file.replace('.tsx', ''));

console.log(`   📁 Encontrados ${existingFiles.length} arquivos:`);
existingFiles.forEach(file => console.log(`      - ${file}.tsx`));

// 2. Ler o arquivo atual
let content = fs.readFileSync(registryPath, 'utf8');

// 3. Encontrar imports problemáticos
const importLines = content
  .split('\n')
  .filter(line => line.includes('import') && line.includes('inline/'));

console.log(`\n🔍 Verificando ${importLines.length} imports inline...`);

let fixedImports = [];
let removedImports = [];

for (const line of importLines) {
  // Extrair nome do arquivo do import
  const match = line.match(/import\s+(\w+)\s+from\s+"[^"]*\/([^"]+)"/);
  if (match) {
    const [, importName, fileName] = match;

    if (existingFiles.includes(fileName)) {
      console.log(`   ✅ ${fileName} - OK`);
      fixedImports.push(line);
    } else {
      console.log(`   ❌ ${fileName} - ARQUIVO NÃO EXISTE`);
      removedImports.push({ importName, fileName, line });
    }
  }
}

// 4. Remover imports quebrados
console.log(`\n🔧 Removendo ${removedImports.length} imports quebrados...`);

for (const { importName, fileName, line } of removedImports) {
  console.log(`   🗑️ Removendo import de ${fileName}`);

  // Remover a linha de import
  content = content.replace(line + '\n', '');

  // Remover referências ao componente no registry
  const componentRegex = new RegExp(
    `\\s*"[^"]*":\\s*{[^}]*component:\\s*${importName}[^}]*},?\\s*`,
    'g'
  );
  content = content.replace(componentRegex, '');

  // Remover referências em arrays ou objetos
  const refRegex = new RegExp(`\\s*${importName},?\\s*`, 'g');
  content = content.replace(refRegex, '');
}

// 5. Limpar linhas vazias extras
content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

// 6. Adicionar imports para componentes que existem mas podem estar faltando
console.log('\n🔍 Verificando imports necessários...');

const neededComponents = [
  'ButtonInline',
  'TextInline',
  'HeadingInline',
  'ImageDisplayInline',
  'DecorativeBarInline',
  'LegalNoticeInline',
];

for (const component of neededComponents) {
  if (existingFiles.includes(component) && !content.includes(`import ${component}`)) {
    console.log(`   ➕ Adicionando import para ${component}`);
    const importLine = `import ${component} from "../components/blocks/inline/${component}";`;
    // Adicionar após os outros imports inline
    const insertPoint = content.indexOf('// Componentes Inline mais usados');
    if (insertPoint !== -1) {
      const endOfImports = content.indexOf('\n\n', insertPoint);
      content = content.slice(0, endOfImports) + '\n' + importLine + content.slice(endOfImports);
    }
  }
}

// 7. Salvar arquivo corrigido
fs.writeFileSync(registryPath, content, 'utf8');

console.log(`\n✅ enhancedBlockRegistry.ts corrigido!`);
console.log(`   🗑️ ${removedImports.length} imports removidos`);
console.log(`   ✅ ${fixedImports.length} imports válidos mantidos`);

console.log('\n🚀 Testando build...');
