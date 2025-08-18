// Script para corrigir erro de sintaxe no arquivo quiz21StepsComplete.ts
const fs = require('fs');
const path = require('path');

// Caminho para o arquivo
const filePath = path.join(__dirname, 'src', 'templates', 'quiz21StepsComplete.ts');

// Ler o conteúdo atual do arquivo
let content = fs.readFileSync(filePath, 'utf8');

// Verificar e corrigir linhas problemáticas
// Dividir o conteúdo em linhas
const lines = content.split('\n');

// Verificar a indentação e estrutura
let insideObject = 0;
let correctedLines = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Contar abertura de chaves
  const openBraces = (line.match(/{/g) || []).length;

  // Contar fechamento de chaves
  const closeBraces = (line.match(/}/g) || []).length;

  insideObject += openBraces - closeBraces;

  // Verificar padrões específicos
  if (line.trim().startsWith('requiredSelections:') && !line.trim().endsWith(',')) {
    console.log(`Corrigindo linha ${i + 1}: ${line}`);
    line = line.trim() + ',';
  }

  // Verificar padrões específicos
  if (line.trim().startsWith('maxSelections:') && !line.trim().endsWith(',')) {
    console.log(`Corrigindo linha ${i + 1}: ${line}`);
    line = line.trim() + ',';
  }

  // Adicionar a linha (possivelmente corrigida) ao resultado
  correctedLines.push(line);
}

// Salvar o conteúdo corrigido de volta no arquivo
fs.writeFileSync(filePath, correctedLines.join('\n'), 'utf8');

console.log('Arquivo corrigido com sucesso!');
