#!/usr/bin/env node

/**
 * Script para extrair e analisar uma questão específica
 * Mostra exatamente como uma questão deve aparecer no editor
 */

console.log('🎯 ANÁLISE DE UMA QUESTÃO ESPECÍFICA\n');

// Simular dados da primeira questão
const firstQuestion = {
  "id": "q1",
  "title": "QUAL O SEU TIPO DE ROUPA FAVORITA?",
  "type": "both",
  "multiSelect": 3,
  "options": [
    {
      "id": "1a",
      "text": "Conforto, leveza e praticidade no vestir",
      "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
      "styleCategory": "Natural",
      "points": 1
    },
    {
      "id": "1b",
      "text": "Discrição, caimento clássico e sobriedade",
      "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
      "styleCategory": "Clássico",
      "points": 1
    },
    {
      "id": "1c",
      "text": "Praticidade com um toque de estilo atual",
      "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
      "styleCategory": "Contemporâneo",
      "points": 1
    },
    {
      "id": "1d",
      "text": "Sofisticação em looks estruturados e refinados",
      "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_mjrfcl.webp",
      "styleCategory": "Elegante",
      "points": 1
    }
  ]
};

console.log('📋 DADOS DA QUESTÃO 1:');
console.log(`   Título: ${firstQuestion.title}`);
console.log(`   Tipo: ${firstQuestion.type}`);
console.log(`   Múltipla seleção: ${firstQuestion.multiSelect}`);
console.log(`   Número de opções: ${firstQuestion.options.length}`);

console.log('\n🎨 OPÇÕES DA QUESTÃO:');
firstQuestion.options.forEach((option, index) => {
  console.log(`   ${index + 1}. ${option.text}`);
  console.log(`      Imagem: ${option.imageUrl ? '✅' : '❌'}`);
  console.log(`      Categoria: ${option.styleCategory}`);
  console.log('');
});

// Simular como os dados são processados no serviço
console.log('🔧 COMO OS DADOS SÃO PROCESSADOS NO SERVIÇO:');

const processedOptions = firstQuestion.options.map(opt => ({
  id: opt.id,
  text: opt.text,
  value: opt.value || opt.id,
  imageUrl: opt.imageUrl || undefined,
  category: opt.category || opt.value || opt.id
}));

console.log('   Opções processadas:');
processedOptions.forEach((option, index) => {
  console.log(`   ${index + 1}. ID: ${option.id}`);
  console.log(`      Texto: ${option.text}`);
  console.log(`      Valor: ${option.value}`);
  console.log(`      Imagem: ${option.imageUrl ? 'SIM' : 'NÃO'}`);
  console.log(`      Categoria: ${option.category}`);
  console.log('');
});

// Simular propriedades do bloco options-grid
console.log('🧩 PROPRIEDADES DO BLOCO OPTIONS-GRID:');
const blockProperties = {
  options: processedOptions,
  columns: firstQuestion.type === 'both' ? 2 : 1,
  showImages: firstQuestion.type === 'both' || firstQuestion.type === undefined,
  imageSize: 'large',
  multipleSelection: firstQuestion.multipleSelection || false,
  maxSelections: firstQuestion.maxSelections || 1,
  minSelections: 1,
  validationMessage: `Selecione ${firstQuestion.maxSelections || 1} opç${(firstQuestion.maxSelections || 1) > 1 ? 'ões' : 'ão'}`,
  gridGap: 16,
  responsiveColumns: true
};

console.log(JSON.stringify(blockProperties, null, 2));

console.log('\n' + '='.repeat(60));
console.log('🎯 RESUMO DO QUE O EDITOR DEVE MOSTRAR:');
console.log(`   ✅ Cabeçalho com logo e progresso (10%)`);
console.log(`   ✅ Título: "${firstQuestion.title}"`);
console.log(`   ✅ Indicador: "Questão 1 de 10"`);
console.log(`   ✅ Grid 2x2 com ${firstQuestion.options.length} opções`);
console.log(`   ✅ Cada opção com imagem + texto`);
console.log(`   ✅ Seleção múltipla (até ${firstQuestion.multiSelect} opções)`);
console.log(`   ✅ Botão "Continuar" (desabilitado até seleção)`);
console.log('='.repeat(60));
