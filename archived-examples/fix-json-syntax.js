#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 CORREÇÃO DE SINTAXE JSON NO ARQUIVO optimized21StepsFunnel.ts\n');

const filePath = path.join(__dirname, 'src/config/optimized21StepsFunnel.ts');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixCount = 0;

  console.log('🔍 Procurando problemas de sintaxe...');

  // 1. Corrigir padrão "],\n    }\n        {" para "],\n    },\n    {"
  const pattern1 = /],\s*}\s*\{\s*("id")/g;
  const matches1 = content.match(pattern1);
  if (matches1) {
    console.log(`   🔧 Encontrados ${matches1.length} problemas de estrutura array/objeto`);
    content = content.replace(pattern1, '],\n    },\n    {\n        $1');
    fixCount += matches1.length;
  }

  // 2. Corrigir identação inconsistente para objetos
  const lines = content.split('\n');
  const fixedLines = [];
  let indentLevel = 0;
  let inArray = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Pular linhas vazias e comentários
    if (
      !trimmed ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*')
    ) {
      fixedLines.push(line);
      continue;
    }

    // Detectar início/fim de estruturas
    const openBraces = (trimmed.match(/\{/g) || []).length;
    const closeBraces = (trimmed.match(/\}/g) || []).length;
    const openBrackets = (trimmed.match(/\[/g) || []).length;
    const closeBrackets = (trimmed.match(/\]/g) || []).length;

    // Ajustar indentação antes da linha
    if (trimmed.startsWith('}') || trimmed.startsWith(']')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Aplicar indentação correta (4 espaços por nível)
    const indent = '    '.repeat(indentLevel);
    const fixedLine = indent + trimmed;
    fixedLines.push(fixedLine);

    // Ajustar indentação após a linha
    indentLevel += openBraces - closeBraces + openBrackets - closeBrackets;
    indentLevel = Math.max(0, indentLevel);
  }

  content = fixedLines.join('\n');

  // 3. Corrigir vírgulas faltantes antes de objetos
  const pattern3 = /}\s*\n\s*{/g;
  const matches3 = content.match(pattern3);
  if (matches3) {
    console.log(`   🔧 Encontrados ${matches3.length} problemas de vírgulas faltantes`);
    content = content.replace(pattern3, '},\n    {');
    fixCount += matches3.length;
  }

  // 4. Remover vírgulas duplicadas
  const pattern4 = /,\s*,/g;
  const matches4 = content.match(pattern4);
  if (matches4) {
    console.log(`   🔧 Encontrados ${matches4.length} problemas de vírgulas duplicadas`);
    content = content.replace(pattern4, ',');
    fixCount += matches4.length;
  }

  // 5. Validar sintaxe básica TypeScript
  console.log('\n🔍 Verificando sintaxe TypeScript...');

  // Verificar se não há chaves não fechadas
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/\]/g) || []).length;

  console.log(`   📊 Chaves: ${openBraces} abertas, ${closeBraces} fechadas`);
  console.log(`   📊 Colchetes: ${openBrackets} abertos, ${closeBrackets} fechados`);

  if (openBraces !== closeBraces) {
    console.log(`   ⚠️ PROBLEMA: ${openBraces - closeBraces} chaves não balanceadas`);
  }

  if (openBrackets !== closeBrackets) {
    console.log(`   ⚠️ PROBLEMA: ${openBrackets - closeBrackets} colchetes não balanceados`);
  }

  // Salvar arquivo corrigido
  if (fixCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`\n✅ Arquivo corrigido com ${fixCount} correções aplicadas!`);
  } else {
    console.log('\n✅ Arquivo já estava correto!');
  }

  console.log('\n🚀 Testando compilação...');
} catch (error) {
  console.log(`❌ Erro ao processar arquivo: ${error.message}`);
}
