/**
 * 🧪 TESTE: Validar carregamento via block registry normalizado (v4)
 */
import { loadStepFromJson } from '../jsonStepLoader';

async function testNormalizedLoading() {
  console.log('\n🧪 TESTE: CARREGAMENTO V4 NORMALIZADO\n');

  try {
    // Tentar carregar step-01 (deve usar v4 se disponível)
    console.log('📥 Carregando step-01...');
    const blocks = await loadStepFromJson('step-01');

    if (!blocks) {
      console.error('❌ FALHA: Nenhum bloco retornado');
      return;
    }

    console.log(`✅ Sucesso: ${blocks.length} blocos carregados\n`);
    
    // Validar estrutura
    console.log('🔍 Validando estrutura dos blocos:');
    blocks.forEach((block, index) => {
      const hasId = typeof block.id === 'string';
      const hasType = typeof block.type === 'string';
      const hasOrder = typeof block.order === 'number';
      
      const status = hasId && hasType ? '✅' : '❌';
      console.log(`  ${status} Bloco ${index + 1}: ${block.type} (id: ${block.id?.slice(0, 20)}...)`);
      
      // Verificar se tokens foram resolvidos
      const content = JSON.stringify(block.content || {});
      const props = JSON.stringify(block.properties || {});
      const hasUnresolvedTokens = content.includes('{{') || props.includes('{{');
      
      if (hasUnresolvedTokens) {
        console.warn(`    ⚠️ Tokens não resolvidos detectados`);
      }
    });

    // Verificar tokens resolvidos
    console.log('\n✨ Verificando resolução de tokens:');
    const firstBlock = blocks[0];
    const serialized = JSON.stringify(firstBlock);
    
    console.log(`  - Contém #B89B7A: ${serialized.includes('#B89B7A') ? '✅' : '⊘'}`);
    console.log(`  - Contém cloudinary: ${serialized.includes('cloudinary') ? '✅' : '⊘'}`);
    console.log(`  - Contém {{theme: ${serialized.includes('{{theme') ? '❌ não resolvido' : '✅ resolvido'}`);
    console.log(`  - Contém {{asset: ${serialized.includes('{{asset') ? '❌ não resolvido' : '✅ resolvido'}`);

    console.log('\n📊 Resumo:');
    console.log(`  Total de blocos: ${blocks.length}`);
    console.log(`  Tipos únicos: ${new Set(blocks.map(b => b.type)).size}`);
    console.log(`  Blocos válidos: ${blocks.filter(b => b.id && b.type).length}`);

    console.log('\n✅ TESTE COMPLETO\n');
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error);
  }
}

testNormalizedLoading();
