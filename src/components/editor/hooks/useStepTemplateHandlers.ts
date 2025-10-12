import { useCallback } from 'react';
import { stepTemplateService } from '@/services/stepTemplateService';

// 🎯 FUNÇÃO PARA OBTER TEMPLATE DE ETAPA USANDO STEPTEMPLATE SERVICE
export const getStepTemplate = (stepId: string) => {
  try {
    console.log(`🔍 Obtendo template da etapa "${stepId}" via stepTemplateService...`);

    // Converter stepId para número (etapa-1 → 1, ou "1" → 1)
    const stepNumber =
      typeof stepId === 'string'
        ? parseInt(stepId.replace(/\D/g, '')) // Remove tudo que não é dígito
        : stepId;

    console.log(`🔧 Convertido "${stepId}" para número: ${stepNumber}`);

    // Usar o novo serviço que acessa os templates individuais
    const template = stepTemplateService.getStepTemplate(stepNumber);

    if (template && template.length > 0) {
      console.log(`✅ Template encontrado para etapa ${stepNumber}: ${template.length} blocos`);
      console.log(
        `🧱 Tipos de blocos:`,
        template.map(b => b.type)
      );

      return template.map((block: any) => ({
        type: block.type,
        properties: block.properties,
      }));
    }

    console.warn(`⚠️ Nenhum template encontrado para etapa ${stepNumber}`);
    return [];
  } catch (error) {
    console.error('❌ Erro ao obter template da etapa:', error);
    return [];
  }
};

// Hook para handlers de template
export const useStepTemplateHandlers = (
  addBlock: (type: any) => string,
  updateBlock: (id: string, properties: any) => void,
  deleteBlock: (id: string) => void,
  setSteps: (updater: (prev: any[]) => any[]) => void,
  blocks: any[]
) => {
  // Função para adicionar múltiplos blocos a uma etapa específica
  const handleAddBlocksToStep = useCallback(
    (stepId: string, blocksToAdd: any[]) => {
      console.log(`🎯 Adicionando ${blocksToAdd.length} blocos à etapa ${stepId}`);

      blocksToAdd.forEach((block, index) => {
        setTimeout(() => {
          try {
            const newBlockId = addBlock(block.type as any);
            if (newBlockId) {
              // 🎯 CORREÇÃO: Adicionar stepId ao bloco para filtrar por etapa
              const blockProperties = {
                ...block.properties,
                stepId: stepId, // Associar bloco à etapa
              };
              updateBlock(newBlockId, blockProperties);

              // Também atualizar o bloco diretamente para ter stepId
              const blockToUpdate = blocks.find(b => b.id === newBlockId);
              if (blockToUpdate) {
                blockToUpdate.stepId = stepId;
              }
            }
            console.log(
              `✅ Bloco ${index + 1}/${blocksToAdd.length} adicionado à etapa ${stepId}: ${block.type}`
            );
          } catch (error) {
            console.error(`❌ Erro ao adicionar bloco ${block.type}:`, error);
          }
        }, 100 * index); // Delay entre cada bloco
      });

      // Atualizar contador de blocos da etapa
      setSteps(prev =>
        prev.map(step =>
          step.id === stepId
            ? { ...step, blocksCount: step.blocksCount + blocksToAdd.length }
            : step
        )
      );
    },
    [addBlock, updateBlock, blocks, setSteps]
  );

  // Handler para popular uma etapa com blocos padrão - TODAS AS 21 ETAPAS
  const handlePopulateStep = useCallback(
    (stepId: string) => {
      console.log(`🎯 [NOVO SISTEMA] Populando etapa ${stepId} com template modular`);

      // 🧹 LIMPEZA: Remover blocos existentes antes de carregar novos
      console.log(`🧹 Limpando blocos existentes antes de carregar template...`);
      blocks.forEach(block => {
        if (block.type === 'guarantee' || block.type === 'Garantia') {
          console.log(`🗑️ Removendo bloco corrompido: ${block.type} (${block.id})`);
          deleteBlock(block.id);
        }
      });

      // Extrair número da step (etapa-1 → 1, etapa-2 → 2, etc.)
      const stepNumber = parseInt(stepId.replace('etapa-', ''));
      if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 21) {
        console.error(`❌ Step ID inválido: ${stepId}`);
        return;
      }

      console.log(`🔧 [NOVO SISTEMA] Carregando template da Step ${stepNumber}...`);

      try {
        // 🎯 Usar novo sistema de templates das steps
        const stepTemplate = getStepTemplate(stepNumber.toString());

        console.log(`🧪 [DEBUG] Template retornado:`, stepTemplate);
        console.log(`🧪 [DEBUG] Template é array?`, Array.isArray(stepTemplate));
        console.log(`🧪 [DEBUG] Template length:`, stepTemplate?.length);

        if (!stepTemplate || stepTemplate.length === 0) {
          console.warn(`⚠️ Template vazio para Step ${stepNumber}, usando fallback`);
          // Fallback simples
          const fallbackBlocks = [
            {
              type: 'heading-inline',
              properties: {
                content: `Etapa ${stepNumber}`,
                level: 'h2',
                fontSize: 'text-2xl',
                fontWeight: 'font-bold',
                textAlign: 'text-center',
                color: '#432818',
                marginBottom: 16,
              },
            },
            {
              type: 'text-inline',
              properties: {
                content: `Template da etapa ${stepNumber} em desenvolvimento`,
                fontSize: 'text-lg',
                textAlign: 'text-center',
                color: '#6B7280',
                marginBottom: 32,
              },
            },
          ];

          console.log(`🔄 Aplicando ${fallbackBlocks.length} blocos fallback...`);
          fallbackBlocks.forEach((blockData, index) => {
            const newBlockId = addBlock(blockData.type as any);

            setTimeout(() => {
              updateBlock(newBlockId, blockData.properties);
              console.log(`✅ Bloco fallback ${index + 1} aplicado:`, blockData.type);
            }, index * 100);
          });
          return;
        }

        console.log(`Template encontrado! ${stepTemplate.length} blocos para carregar`);
        console.log(
          `🧱 Tipos de blocos:`,
          stepTemplate.map(b => b.type)
        );

        // 🔄 Aplicar todos os blocos do template
        stepTemplate.forEach((blockData, index) => {
          console.log(`🧱 Adicionando bloco ${index + 1}/${stepTemplate.length}:`, blockData.type);
          console.log(`🧪 [DEBUG] Dados do bloco:`, blockData);

          // 🛡️ VALIDAÇÃO: Garantir que não é um bloco 'guarantee' indesejado
          if (blockData.type === 'guarantee' || blockData.type === 'Garantia') {
            console.warn(
              `⚠️ Bloco 'guarantee' detectado no template - pulando para evitar problema`
            );
            return;
          }

          const newBlockId = addBlock(blockData.type as any);

          // Aplicar propriedades com delay para evitar problemas de timing
          setTimeout(() => {
            updateBlock(newBlockId, blockData.properties);
            console.log(`✅ Propriedades aplicadas para bloco ${index + 1}:`, blockData.type);
          }, index * 100);
        });

        // 📊 Atualizar contador de blocos da step
        const updatedBlocksCount = stepTemplate.filter(
          b => b.type !== 'guarantee' && b.type !== 'Garantia'
        ).length;
        setSteps(prevSteps =>
          prevSteps.map(step =>
            step.id === stepId ? { ...step, blocksCount: updatedBlocksCount, isActive: true } : step
          )
        );

        console.log(
          `✅ Template da Step ${stepNumber} aplicado com sucesso! ${updatedBlocksCount} blocos adicionados`
        );
      } catch (error) {
        console.error(`❌ Erro ao aplicar template da Step ${stepNumber}:`, error);

        // 🚨 Fallback de emergência
        const emergencyBlocks = [
          {
            type: 'text-inline',
            properties: {
              content: `Erro ao carregar template da Etapa ${stepNumber}`,
              fontSize: 'text-lg',
              textAlign: 'text-center',
              color: '#aa6b5d',
              marginBottom: 16,
            },
          },
        ];

        emergencyBlocks.forEach((blockData, index) => {
          const newBlockId = addBlock(blockData.type as any);
          setTimeout(() => {
            updateBlock(newBlockId, blockData.properties);
          }, index * 100);
        });
      }
    },
    [addBlock, updateBlock, deleteBlock, setSteps, blocks]
  );

  return {
    handleAddBlocksToStep,
    handlePopulateStep,
  };
};
