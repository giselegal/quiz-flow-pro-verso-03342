// @ts-nocheck
import { useCallback } from 'react';
import type { BlockData } from '@/types/blocks';
import { useToast } from '@/hooks/use-toast';

export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const useBlockHandlers = (
  addBlock: (type: any) => string,
  updateBlock: (id: string, properties: any) => void,
  deleteBlock: (id: string) => void,
  blocks: any[],
  selectedStepId: string,
  setSelectedBlockId: (blockId: string | null) => void,
  isPreviewing: boolean
) => {
  const { toast } = useToast();

  const handleAddBlock = useCallback(
    (blockType: string) => {
      const newBlockId = addBlock(blockType as any);
      setSelectedBlockId(newBlockId);

      // 🎯 CORREÇÃO: Associar bloco à etapa atual
      if (newBlockId) {
        setTimeout(() => {
          const blockToUpdate = blocks.find(b => b.id === newBlockId);
          if (blockToUpdate) {
            blockToUpdate.stepId = selectedStepId;
            updateBlock(newBlockId, {
              ...blockToUpdate.properties,
              stepId: selectedStepId,
            });
            console.log(`✅ Bloco ${blockType} adicionado à etapa ${selectedStepId}`);
          }
        }, 50);
      }
    },
    [addBlock, selectedStepId, blocks, updateBlock, setSelectedBlockId]
  );

  const handleLoadTemplate = useCallback(async () => {
    try {
      setSelectedBlockId(null);

      console.log('🔄 Carregando blocos de teste básicos...');

      // Blocos de teste extremamente simples para garantir funcionamento
      const testBlocks = [
        {
          id: 'test-1',
          type: 'heading',
          properties: {
            content: 'Bem-vindo ao Editor Visual das 21 Etapas',
            level: 'h1',
            textAlign: 'center',
            color: '#1f2937',
          },
        },
        {
          id: 'test-2',
          type: 'text',
          properties: {
            content:
              'Este é um exemplo de texto editável. Clique neste bloco para configurar suas propriedades.',
            textAlign: 'left',
          },
        },
        {
          id: 'test-3',
          type: 'button',
          properties: {
            content: 'Botão de Exemplo',
            backgroundColor: '#3b82f6',
            textColor: '#ffffff',
            size: 'medium',
          },
        },
        {
          id: 'test-4',
          type: 'text-inline',
          properties: {
            content: 'Componente de texto inline - totalmente responsivo e editável',
          },
        },
        {
          id: 'test-5',
          type: 'heading-inline',
          properties: {
            content: 'Título Responsivo',
            level: 'h2',
            color: '#059669',
          },
        },
      ];

      // Normalizar e adicionar blocos um por vez
      let addedCount = 0;
      for (const block of testBlocks) {
        try {
          const newBlockId = addBlock(block.type);
          if (newBlockId) {
            // Aplicar propriedades com delay
            setTimeout(() => {
              updateBlock(newBlockId, {
                ...block.properties,
                stepId: selectedStepId, // Associar à etapa atual
              });
            }, addedCount * 100);
            addedCount++;
          }
        } catch (blockError) {
          console.error(`❌ Erro ao adicionar bloco ${block.type}:`, blockError);
        }
      }

      console.log(`✅ ${addedCount} blocos de teste adicionados com sucesso!`);
    } catch (error) {
      console.error('❌ Erro ao carregar template:', error);
    }
  }, [addBlock, updateBlock, selectedStepId, setSelectedBlockId]);

  const handleClearAll = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar todos os blocos?')) {
      // Limpar todos os blocos
      blocks.forEach(block => {
        deleteBlock(block.id);
      });
      setSelectedBlockId(null);

      // 🧹 LIMPEZA ADICIONAL: Remover dados corrompidos do localStorage
      try {
        localStorage.removeItem('editorConfig');
        localStorage.removeItem('quiz-blocks');
        console.log('🗑️ Cache local limpo');
      } catch (error) {
        console.warn('⚠️ Erro ao limpar cache local:', error);
      }

      console.log('🗑️ Todos os blocos foram removidos');
    }
  }, [blocks, deleteBlock, setSelectedBlockId]);

  // 🧹 FUNÇÃO ESPECIAL: Limpar apenas blocos 'guarantee' corrompidos
  const handleClearGuaranteeBlocks = useCallback(() => {
    console.log('🧹 Procurando blocos "guarantee" corrompidos...');

    let removedCount = 0;
    blocks.forEach(block => {
      if (block.type === 'guarantee' || block.type === 'Garantia') {
        console.log(`🗑️ Removendo bloco corrompido: ${block.type} (${block.id})`);
        deleteBlock(block.id);
        removedCount++;
      }
    });

    if (removedCount > 0) {
      console.log(`✅ ${removedCount} blocos "guarantee" removidos`);
      toast({
        title: 'Blocos corrompidos removidos',
        description: `${removedCount} blocos "guarantee" foram removidos do editor.`,
      });
    } else {
      console.log('✅ Nenhum bloco "guarantee" encontrado');
    }
  }, [blocks, deleteBlock, toast]);

  const handleSaveInline = useCallback(
    (blockId: string, updates: Partial<BlockData>) => {
      updateBlock(blockId, updates.properties || {});
    },
    [updateBlock]
  );

  const handleBlockClick = useCallback(
    (blockId: string) => {
      if (!isPreviewing) {
        setSelectedBlockId(blockId);
      }
    },
    [isPreviewing, setSelectedBlockId]
  );

  const handleComponentSelect = useCallback(
    (componentId: string) => {
      handleAddBlock(componentId);
    },
    [handleAddBlock]
  );

  return {
    handleAddBlock,
    handleLoadTemplate,
    handleClearAll,
    handleClearGuaranteeBlocks,
    handleSaveInline,
    handleBlockClick,
    handleComponentSelect,
  };
};
