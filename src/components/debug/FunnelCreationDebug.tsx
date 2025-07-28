import { useEffect } from 'react';

interface FunnelCreationDebugProps {
  funnel: any;
}

export const FunnelCreationDebug = ({ funnel }: FunnelCreationDebugProps) => {
  useEffect(() => {
    console.log('🚀 FUNNEL CREATION DEBUG');
    console.log('═'.repeat(60));
    
    if (!funnel) {
      console.log('❌ PROBLEMA: Funil não foi criado!');
      return;
    }
    
    console.log('✅ Funil foi criado com sucesso!');
    console.log(`📄 Total de páginas: ${funnel.pages?.length || 0}`);
    
    if (funnel.pages && funnel.pages.length > 0) {
      console.log('\n📋 PÁGINAS DO FUNIL:');
      funnel.pages.forEach((page: any, index: number) => {
        console.log(`  ${index + 1}. Página "${page.name}" (ID: ${page.id})`);
        console.log(`     📦 Blocos: ${page.blocks?.length || 0}`);
        
        if (page.blocks && page.blocks.length > 0) {
          page.blocks.forEach((block: any, blockIndex: number) => {
            console.log(`       ${blockIndex + 1}. ${block.type} (${block.id})`);
          });
        }
      });
    } else {
      console.log('⚠️  Funil criado mas sem páginas!');
    }
    
    console.log('═'.repeat(60));
  }, [funnel]);

  return null;
};
