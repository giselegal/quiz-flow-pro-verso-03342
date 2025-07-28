import { useEffect } from 'react';
import { EDITOR_BLOCKS_MAP } from '../../config/editorBlocksMapping21Steps';

interface SimpleBlockDebugProps {
  blocks: any[];
  currentPageId?: string;
}

export const SimpleBlockDebug = ({ blocks, currentPageId }: SimpleBlockDebugProps) => {
  useEffect(() => {
    console.log('🔍 SIMPLE BLOCK DEBUG');
    console.log('═'.repeat(50));
    console.log(`📄 Página atual: ${currentPageId || 'Nenhuma'}`);
    console.log(`📦 Total de blocos recebidos: ${blocks.length}`);
    console.log(`🗺️  Tipos mapeados disponíveis: ${Object.keys(EDITOR_BLOCKS_MAP).length}`);
    
    console.log('\n📋 MAPEAMENTO DISPONÍVEL:');
    Object.keys(EDITOR_BLOCKS_MAP).forEach(type => {
      console.log(`  ✅ ${type}`);
    });
    
    console.log('\n🧱 BLOCOS RECEBIDOS:');
    blocks.forEach((block, index) => {
      const hasMapping = !!EDITOR_BLOCKS_MAP[block.type];
      const icon = hasMapping ? '✅' : '❌';
      console.log(`  ${icon} ${index + 1}. ${block.type} (ID: ${block.id})`);
      
      if (!hasMapping) {
        console.log(`     ⚠️  TIPO NÃO MAPEADO: ${block.type}`);
      }
    });
    
    console.log('═'.repeat(50));
  }, [blocks, currentPageId]);

  return null; // Componente invisível, apenas para logs
};
