// Script para LIMPAR o arquivo blockDefinitions.ts removendo objetos inválidos

import fs from 'fs';

const filePath = './client/src/config/blockDefinitions.ts';
const content = fs.readFileSync(filePath, 'utf8');

console.log('🧹 LIMPANDO ARQUIVO blockDefinitions.ts');
console.log('='.repeat(60));

// Extrair o início do arquivo (até a linha do array)
const lines = content.split('\n');
const startLine = 170; // linha 171 (index 170)
const endLine = 2467; // linha 2468 (index 2467)

const beforeArray = lines.slice(0, startLine + 1).join('\n');
const afterArray = lines.slice(endLine + 1).join('\n');
const arrayContent = lines.slice(startLine + 1, endLine).join('\n');

// Dividir por objetos e filtrar apenas os válidos
const objects = arrayContent.split(/},\s*(?={)/);
const validBlocks = [];

console.log(`📦 Analisando ${objects.length} objetos...`);

objects.forEach((obj, index) => {
  // Reconstituir o objeto
  let fullObj = obj;
  if (index > 0 && !fullObj.startsWith('{')) fullObj = '{' + fullObj;
  if (index < objects.length - 1 && !fullObj.endsWith('}')) fullObj = fullObj + '}';

  const hasType = /type:\s*['"`]([^'"`]+)['"`]/.test(fullObj);
  const hasName = /name:\s*['"`]([^'"`]+)['"`]/.test(fullObj);

  if (hasType && hasName) {
    // É um bloco válido
    validBlocks.push(fullObj.trim());

    const typeMatch = fullObj.match(/type:\s*['"`]([^'"`]+)['"`]/);
    const nameMatch = fullObj.match(/name:\s*['"`]([^'"`]+)['"`]/);
    console.log(`✅ ${validBlocks.length}. ${typeMatch[1]} - ${nameMatch[1]}`);
  }
});

console.log(`\n🎯 BLOCOS VÁLIDOS ENCONTRADOS: ${validBlocks.length}`);

// Reconstituir o arquivo limpo
const cleanedArrayContent = validBlocks.join(',\n\n  ');
const cleanedFile = beforeArray + '\n  ' + cleanedArrayContent + '\n\n' + afterArray;

// Salvar backup do arquivo original
const backupPath = './client/src/config/blockDefinitions.backup.ts';
fs.writeFileSync(backupPath, content);
console.log(`💾 Backup salvo em: ${backupPath}`);

// Salvar arquivo limpo
fs.writeFileSync(filePath, cleanedFile);
console.log(`✨ Arquivo limpo salvo: ${filePath}`);

console.log('\n' + '='.repeat(60));
console.log(`🎉 LIMPEZA CONCLUÍDA!`);
console.log(`📊 Removidos: ${objects.length - validBlocks.length} objetos inválidos`);
console.log(`✅ Mantidos: ${validBlocks.length} blocos válidos`);
console.log(`📁 Backup: blockDefinitions.backup.ts`);
console.log('\n🚀 Agora o editor terá apenas componentes válidos!');
