import { schemaDrivenFunnelService } from '../services/schemaDrivenFunnelService';

console.log('🧪 Testando criação do funil com 21 etapas...');

try {
  const funnel = schemaDrivenFunnelService.createDefaultFunnel();
  console.log('✅ Funil criado com sucesso!');
  console.log(`📊 Total de páginas: ${funnel.pages?.length || 0}`);
  
  if (funnel.pages) {
    console.log('📄 Lista das 21 etapas:');
    funnel.pages.forEach((page, index) => {
      console.log(`  ${index + 1}. ${page.title || page.name || 'Sem título'}`);
      console.log(`      ID: ${page.id}`);
      console.log(`      Blocos: ${page.blocks?.length || 0}`);
    });
  }

  // Verificar se temos exatamente 21 etapas
  if (funnel.pages?.length === 21) {
    console.log('🎉 SUCESSO: 21 etapas criadas corretamente!');
  } else {
    console.warn(`⚠️ AVISO: Esperado 21 etapas, mas foram criadas ${funnel.pages?.length || 0}`);
  }

} catch (error) {
  console.error('❌ Erro ao testar criação do funil:', error);
}
