/**
 * 🔍 ANÁLISE DINÂMICA DE DUPLICIDADES - Step 01 Template
 *
 * Lê os arquivos reais e compara JSON vs TSX
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISE DINÂMICA DE DUPLICIDADES - Step 01 Template\n');

try {
  // Ler JSON Template
  const jsonPath = path.join(__dirname, 'public', 'templates', 'step-01-template.json');
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const jsonTemplate = JSON.parse(jsonContent);

  // Ler TSX Template
  const tsxPath = path.join(__dirname, 'src', 'components', 'steps', 'Step01Template.tsx');
  const tsxContent = fs.readFileSync(tsxPath, 'utf8');

  console.log('📊 ARQUIVOS CARREGADOS:');
  console.log('=======================');
  console.log(`✅ JSON: ${jsonTemplate.blocks.length} blocos`);
  console.log(`✅ TSX:  Arquivo carregado (${tsxContent.length} caracteres)`);

  // Extrair tipos do JSON
  const jsonTypes = jsonTemplate.blocks.map(block => ({
    id: block.id,
    type: block.type,
    position: block.position,
  }));

  // Extrair tipos do TSX (regex simples)
  const tsxTypeMatches = [...tsxContent.matchAll(/type:\s*['"`]([^'"`]+)['"`]/g)];
  const tsxIdMatches = [...tsxContent.matchAll(/id:\s*['"`]([^'"`]+)['"`]/g)];

  const tsxTypes = tsxIdMatches.map((idMatch, index) => ({
    id: idMatch[1],
    type: tsxTypeMatches[index] ? tsxTypeMatches[index][1] : 'unknown',
    position: index,
  }));

  console.log('\n📋 TIPOS EXTRAÍDOS:');
  console.log('===================');

  console.log('\n🔹 JSON Template:');
  jsonTypes.forEach(item => {
    console.log(`   ${item.id}: "${item.type}"`);
  });

  console.log('\n🔹 TSX Template:');
  tsxTypes.forEach(item => {
    console.log(`   ${item.id}: "${item.type}"`);
  });

  // Comparar tipos
  console.log('\n🔄 ANÁLISE DE DIFERENÇAS:');
  console.log('=========================');

  let differences = [];
  let allMatch = true;

  jsonTypes.forEach(jsonItem => {
    const tsxItem = tsxTypes.find(t => t.id === jsonItem.id);
    if (tsxItem) {
      if (jsonItem.type !== tsxItem.type) {
        differences.push({
          id: jsonItem.id,
          json: jsonItem.type,
          tsx: tsxItem.type,
        });
        allMatch = false;
        console.log(`❌ ${jsonItem.id}: JSON="${jsonItem.type}" ≠ TSX="${tsxItem.type}"`);
      } else {
        console.log(`✅ ${jsonItem.id}: "${jsonItem.type}" (consistente)`);
      }
    } else {
      console.log(`⚠️ ${jsonItem.id}: Existe no JSON mas não encontrado no TSX`);
      allMatch = false;
    }
  });

  // Verificar se TSX tem blocos extras
  tsxTypes.forEach(tsxItem => {
    const jsonItem = jsonTypes.find(j => j.id === tsxItem.id);
    if (!jsonItem) {
      console.log(`⚠️ ${tsxItem.id}: Existe no TSX mas não encontrado no JSON`);
      allMatch = false;
    }
  });

  console.log('\n🎯 RESULTADO FINAL:');
  console.log('==================');

  if (allMatch) {
    console.log('🎉 PERFEITO! Templates estão 100% sincronizados');
    console.log('✅ Todos os tipos são consistentes');
    console.log('✅ Todos os IDs coincidem');
    console.log('✅ Não há duplicidades ou conflitos');

    console.log('\n💡 RECOMENDAÇÕES:');
    console.log('   ✅ Sistema está pronto para produção');
    console.log('   ✅ Pode usar qualquer um dos formatos');
    console.log('   ✅ Renderização será consistente');
  } else {
    console.log('⚠️ ATENÇÃO: Templates precisam de sincronização');
    console.log(`❌ Encontradas ${differences.length} diferenças de tipos`);

    console.log('\n🔧 AÇÕES NECESSÁRIAS:');
    if (differences.length > 0) {
      differences.forEach(diff => {
        console.log(`   🔄 Padronizar ${diff.id} como "${diff.tsx}" em ambos os arquivos`);
      });
    }

    console.log('\n⚡ DEPOIS DA CORREÇÃO:');
    console.log('   • Testar renderização no /editor-fixed');
    console.log('   • Testar no sistema de etapas');
    console.log('   • Executar este script novamente para verificar');
  }
} catch (error) {
  console.error('❌ Erro ao analisar arquivos:', error.message);
  console.log('\n🔧 POSSÍVEIS SOLUÇÕES:');
  console.log('   • Verificar se os arquivos existem');
  console.log('   • Verificar sintaxe do JSON');
  console.log('   • Verificar formato do TSX');
}
