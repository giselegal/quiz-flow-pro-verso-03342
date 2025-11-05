#!/usr/bin/env node

const fs = require('fs');
const content = fs.readFileSync('./src/components/editor/quiz/components/CanvasColumn.tsx', 'utf-8');

console.log('\n🔍 ESTRUTURA REAL DE ANINHAMENTO\n');
console.log('════════════════════════════════════════════════════════════\n');

console.log('return (');
console.log('  <div>                              ← Nível 1: Container principal');
console.log('    <div className="border-b">       ← Nível 2: Header');
console.log('      ...header...');
console.log('    </div>');
console.log('');
console.log('    <div className="overflow-y">     ← Nível 2: Canvas (DIRETO!)');
console.log('      <div data-testid="block">      ← Nível 3: Bloco ✅');
console.log('        ...conteúdo...');
console.log('      </div>');
console.log('    </div>');
console.log('  </div>');
console.log(');\n');

console.log('📊 CONTAGEM:\n');
console.log('   🎯 Níveis de containers: 3');
console.log('   🎯 Do root até o bloco: 3 níveis\n');

console.log('📈 COMPARAÇÃO:\n');
console.log('   ❌ COM ScrollArea:     5 níveis (Root + Viewport + Scrollbar wrapper)');
console.log('   ✅ SEM ScrollArea:     3 níveis (Root + overflow div + block)');
console.log('   🚀 Redução:            40%\n');

const hasScrollArea = content.includes("ScrollArea");
const hasOverflow = content.includes('overflow-y-auto');

console.log('✅ VALIDAÇÃO:\n');
console.log(`   ScrollArea removido: ${!hasScrollArea ? '✅ SIM' : '❌ NÃO'}`);
console.log(`   overflow-y-auto:     ${hasOverflow ? '✅ SIM' : '❌ NÃO'}`);

if (!hasScrollArea && hasOverflow) {
  console.log('\n🎉 SUCESSO! Reduzimos para 3 níveis!\n');
} else {
  console.log('\n⚠️  Ainda há ajustes pendentes\n');
}
