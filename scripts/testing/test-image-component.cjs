// Teste específico para verificar o ImageDisplayInlineBlockClean
console.log('🔍 TESTE ESPECÍFICO - ImageDisplayInlineBlockClean');
console.log('='.repeat(50));

try {
  // 1. Verificar se o arquivo existe
  const fs = require('fs');
  const path =
    '/workspaces/quiz-quest-challenge-verse/src/components/blocks/inline/ImageDisplayInlineBlock.clean.tsx';

  if (fs.existsSync(path)) {
    console.log('✅ Arquivo existe:', path);

    const content = fs.readFileSync(path, 'utf8');

    // 2. Verificar estrutura básica
    const hasExport = content.includes('export default');
    const hasImageDisplayInlineBlockClean = content.includes('ImageDisplayInlineBlockClean');
    const hasReactImport = content.includes('import React');
    const hasBlockProps = content.includes('BlockComponentProps');

    console.log('📋 Análise do conteúdo:');
    console.log(`   ${hasExport ? '✅' : '❌'} Export default: ${hasExport}`);
    console.log(
      `   ${hasImageDisplayInlineBlockClean ? '✅' : '❌'} Nome do componente: ${hasImageDisplayInlineBlockClean}`
    );
    console.log(`   ${hasReactImport ? '✅' : '❌'} Import React: ${hasReactImport}`);
    console.log(`   ${hasBlockProps ? '✅' : '❌'} BlockComponentProps: ${hasBlockProps}`);

    // 3. Verificar tipos de props usadas
    const propMatches = content.match(/const\s+\{([^}]+)\}/);
    if (propMatches) {
      console.log('📦 Props extraídas:', propMatches[1].trim());
    }
  } else {
    console.log('❌ Arquivo não encontrado:', path);
  }

  // 4. Verificar enhanced registry
  const registryPath = '/workspaces/quiz-quest-challenge-verse/src/config/enhancedBlockRegistry.ts';
  if (fs.existsSync(registryPath)) {
    const registryContent = fs.readFileSync(registryPath, 'utf8');

    const hasImport = registryContent.includes('import ImageDisplayInlineBlockClean');
    const hasUsage = registryContent.includes("'image': ImageDisplayInlineBlockClean");

    console.log('\n🔧 Registry analysis:');
    console.log(`   ${hasImport ? '✅' : '❌'} Import no registry: ${hasImport}`);
    console.log(`   ${hasUsage ? '✅' : '❌'} Uso no registry: ${hasUsage}`);

    // Procurar por todas as ocorrências
    const imageMatches = registryContent.match(/'image[^']*':\s*[^,]+/g) || [];
    console.log('🖼️ Todas as entradas de image:', imageMatches);
  }
} catch (error) {
  console.log('❌ Erro durante análise:', error.message);
}

console.log('\n' + '='.repeat(50));
console.log('🎯 TESTE CONCLUÍDO');
