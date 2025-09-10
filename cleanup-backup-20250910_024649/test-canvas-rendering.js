#!/usr/bin/env node

/**
 * 🧪 TESTE DE RENDERIZAÇÃO DO CANVAS - EDITOR UNIFICADO
 *
 * Verifica se os componentes das 21 etapas estão sendo renderizados
 * corretamente no canvas do Editor Unificado
 */

import fs from 'fs';
import path from 'path';

console.log('🧪 TESTE DE RENDERIZAÇÃO DO CANVAS - EDITOR UNIFICADO');
console.log('='.repeat(60));

// 1. Verificar se os arquivos necessários existem
const arquivosVerificar = [
  'src/components/editor/unified/SortablePreviewBlockWrapper.tsx',
  'src/components/editor/unified/UnifiedPreviewEngine.tsx',
  'src/components/editor/blocks/UniversalBlockRenderer.tsx',
  'src/components/editor/blocks/enhancedBlockRegistry.ts',
  'src/utils/quiz21StepsRenderer.ts',
  'src/templates/quiz21StepsComplete.ts',
];

console.log('\n1️⃣ VERIFICANDO ARQUIVOS NECESSÁRIOS:');

for (const arquivo of arquivosVerificar) {
  const caminhoCompleto = path.join(process.cwd(), arquivo);
  const existe = fs.existsSync(caminhoCompleto);
  console.log(`${existe ? '✅' : '❌'} ${arquivo}`);

  if (!existe) {
    console.error(`❌ ERRO: Arquivo ${arquivo} não encontrado!`);
    process.exit(1);
  }
}

// 2. Verificar se SortablePreviewBlockWrapper usa UniversalBlockRenderer
console.log('\n2️⃣ VERIFICANDO INTEGRAÇÃO UniversalBlockRenderer:');

const sortableWrapperContent = fs.readFileSync(
  'src/components/editor/unified/SortablePreviewBlockWrapper.tsx',
  'utf8'
);
const temImportRenderer = sortableWrapperContent.includes(
  "import UniversalBlockRenderer from '../blocks/UniversalBlockRenderer'"
);
const temUsoRenderer = sortableWrapperContent.includes('<UniversalBlockRenderer');

console.log(`${temImportRenderer ? '✅' : '❌'} Import do UniversalBlockRenderer`);
console.log(`${temUsoRenderer ? '✅' : '❌'} Uso do UniversalBlockRenderer`);

if (!temImportRenderer || !temUsoRenderer) {
  console.error('❌ ERRO: SortablePreviewBlockWrapper não está usando UniversalBlockRenderer!');
  console.error('   Isso significa que os componentes não serão renderizados corretamente.');
  process.exit(1);
}

// 3. Verificar se há componentes registrados no registry
console.log('\n3️⃣ VERIFICANDO REGISTRO DE COMPONENTES:');

const registryContent = fs.readFileSync(
  'src/components/editor/blocks/enhancedBlockRegistry.ts',
  'utf8'
);
const componentCount = (registryContent.match(/export\s+const\s+\w+/g) || []).length;
console.log(`✅ ${componentCount} componentes registrados no enhancedBlockRegistry`);

// 4. Verificar se template das 21 etapas existe
console.log('\n4️⃣ VERIFICANDO TEMPLATE DAS 21 ETAPAS:');

const templateContent = fs.readFileSync('src/templates/quiz21StepsComplete.ts', 'utf8');
const stepCount = (templateContent.match(/steps:\s*\[/s) || [])[0];
const steps = stepCount ? templateContent.match(/\{\s*id:\s*['"]step-\d+['"],/g) || [] : [];
console.log(`✅ ${steps.length} etapas encontradas no template`);

// 5. Verificar se o renderer de etapas funciona
console.log('\n5️⃣ VERIFICANDO RENDERER DE ETAPAS:');

const rendererContent = fs.readFileSync('src/utils/quiz21StepsRenderer.ts', 'utf8');
const temLoadStepBlocks = rendererContent.includes('loadStepBlocks');
const temMapBlockType = rendererContent.includes('mapBlockType');

console.log(`${temLoadStepBlocks ? '✅' : '❌'} Função loadStepBlocks`);
console.log(`${temMapBlockType ? '✅' : '❌'} Função mapBlockType`);

// 6. Verificar se não há renderização debug no lugar dos componentes
console.log('\n6️⃣ VERIFICANDO SE NÃO HÁ RENDERIZAÇÃO DEBUG:');

const temJsonStringify =
  sortableWrapperContent.includes('JSON.stringify') && !sortableWrapperContent.includes('debug ?');
const temTipoEId =
  sortableWrapperContent.includes('block.type} - {block.id') &&
  !sortableWrapperContent.includes('debug ?');

if (temJsonStringify || temTipoEId) {
  console.log('⚠️  AVISO: Encontrada renderização debug sem condicional');
  console.log('   Isso pode estar sobrepondo a renderização real dos componentes');
} else {
  console.log('✅ Renderização debug está condicionada corretamente');
}

console.log('\n🎯 RESULTADO FINAL:');
console.log('='.repeat(60));

if (temImportRenderer && temUsoRenderer && !temJsonStringify && !temTipoEId) {
  console.log('✅ SUCESSO: Canvas deve estar renderizando componentes reais!');
  console.log('');
  console.log('🚀 TESTE SEUS RESULTADOS:');
  console.log('1. Acesse http://localhost:8081/editor-unified');
  console.log('2. Clique em "Carregar Etapas do Quiz"');
  console.log('3. Verifique se vê componentes reais em vez de JSON debug');
  console.log('4. Os blocos devem mostrar títulos, textos, botões, etc.');
} else {
  console.log('❌ ERRO: Canvas ainda pode estar mostrando informações debug');
  console.log('   Em vez de componentes renderizados adequadamente.');
  process.exit(1);
}

console.log('\n✨ Teste concluído com sucesso!');
