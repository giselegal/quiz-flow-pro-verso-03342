// Script para contar EXATAMENTE quantos blocos existem no array

import fs from 'fs';

const filePath = './client/src/config/blockDefinitions.ts';
const content = fs.readFileSync(filePath, 'utf8');

console.log('🔍 CONTAGEM PRECISA DOS BLOCOS NO ARRAY blockDefinitions');
console.log('='.repeat(60));

// Extrair apenas o conteúdo do array (linha 171 até linha 2468)
const lines = content.split('\n');
const startLine = 170; // linha 171 (index 170)
const endLine = 2467; // linha 2468 (index 2467)

const arrayContent = lines.slice(startLine + 1, endLine).join('\n');

// Contar objetos que começam com '  {' (2 espaços + chave)
const objectMatches = arrayContent.match(/^\s*{/gm);

console.log(`📊 OBJETOS NO ARRAY: ${objectMatches ? objectMatches.length : 0}`);

// Agora vamos analisar cada objeto para ver se é um bloco válido
let validBlocks = 0;
let invalidObjects = 0;
const categories = new Map();

// Dividir por objetos (usar }, seguido de espaços e {)
const objects = arrayContent.split(/},\s*(?={)/);

console.log(`\n📦 TOTAL DE OBJETOS SEPARADOS: ${objects.length}`);

objects.forEach((obj, index) => {
  // Reconstituir o objeto
  let fullObj = obj;
  if (index > 0 && !fullObj.startsWith('{')) fullObj = '{' + fullObj;
  if (index < objects.length - 1 && !fullObj.endsWith('}')) fullObj = fullObj + '}';

  const hasType = /type:\s*['"`]([^'"`]+)['"`]/.test(fullObj);
  const hasName = /name:\s*['"`]([^'"`]+)['"`]/.test(fullObj);

  if (hasType && hasName) {
    validBlocks++;

    const categoryMatch = fullObj.match(/category:\s*['"`]([^'"`]+)['"`]/);
    const category = categoryMatch ? categoryMatch[1] : 'Sem Categoria';

    if (categories.has(category)) {
      categories.set(category, categories.get(category) + 1);
    } else {
      categories.set(category, 1);
    }
  } else {
    invalidObjects++;
    if (index < 5) {
      // Mostrar os primeiros objetos inválidos
      console.log(`\n❌ Objeto inválido ${index + 1}:`);
      console.log(fullObj.substring(0, 200) + '...');
    }
  }
});

console.log(`\n✅ BLOCOS VÁLIDOS: ${validBlocks}`);
console.log(`❌ OBJETOS INVÁLIDOS: ${invalidObjects}`);

console.log(`\n🏷️ CATEGORIAS ENCONTRADAS: ${categories.size}`);
const sortedCategories = Array.from(categories.entries()).sort((a, b) => b[1] - a[1]);

sortedCategories.forEach(([category, count]) => {
  console.log(`📁 ${category}: ${count} componentes`);
});

console.log('\n' + '='.repeat(60));
console.log(`🎯 RESULTADO: ${validBlocks} componentes válidos de ${objects.length} objetos total`);
