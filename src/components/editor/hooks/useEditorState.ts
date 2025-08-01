import { useState, useCallback, useMemo, useEffect } from 'react';
import { useEditor } from '../../../hooks/useEditor';
import { useToast } from '../../../hooks/use-toast';
import { stepTemplateService } from '../../../services/stepTemplateService';
import { schemaDrivenFunnelService } from '../../../services/schemaDrivenFunnelService';
import type { EditorBlock } from '../../../types/editor';
import type { BlockData } from '../../../types/blocks';

// 🎯 INTERFACES
interface QuizStep {
  id: string;
  name: string;
  order: number;
  blocksCount: number;
  isActive: boolean;
  type: string;
  description: string;
  multiSelect?: number;
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

// 🎯 HOOK UNIFICADO DO EDITOR
export const useEditorState = (funnelId?: string) => {
  const { config, addBlock, updateBlock, deleteBlock, saveConfig, setConfig } = useEditor();
  const { toast } = useToast();
  
  // 🎯 ESTADOS
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingFunnel, setIsLoadingFunnel] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // 🎯 ETAPAS DO QUIZ
  const getStepsFromService = useCallback(() => {
    try {
      const allSteps = stepTemplateService.getAllSteps();
      if (allSteps && allSteps.length > 0) {
        return allSteps.map((stepInfo, index) => ({
          id: stepInfo.id,
          name: stepInfo.name,
          order: stepInfo.order,
          blocksCount: stepInfo.blocksCount || 0,
          isActive: index === 0,
          type: stepInfo.type,
          description: stepInfo.description,
          multiSelect: stepInfo.multiSelect
        }));
      }
      return [];
    } catch (error) {
      console.error('❌ Erro ao obter etapas:', error);
      return [];
    }
  }, []);

  const initialSteps = useMemo(() => {
    const savedSteps = localStorage.getItem('quiz-steps');
    const existingSteps = savedSteps ? JSON.parse(savedSteps) : [];
    const serviceSteps = getStepsFromService();
    
    if (serviceSteps.length === 0) {
      return Array.from({ length: 21 }, (_, i) => ({
        id: `etapa-${i + 1}`,
        name: `Etapa ${i + 1}`,
        order: i + 1,
        blocksCount: 0,
        isActive: i === 0,
        type: 'custom',
        description: `Etapa ${i + 1} do quiz`
      }));
    }

    return serviceSteps.map(serviceStep => {
      const existingStep = existingSteps.find(step => step.id === serviceStep.id);
      return {
        ...serviceStep,
        blocksCount: existingStep?.blocksCount || serviceStep.blocksCount,
        isActive: existingStep?.isActive || serviceStep.isActive,
        name: existingStep?.name || serviceStep.name
      };
    });
  }, [getStepsFromService]);

  const [steps, setSteps] = useState(initialSteps);
  const [selectedStepId, setSelectedStepId] = useState<string>('etapa-1');

  // 🎯 TEMPLATE HELPERS
  const getStepTemplate = useCallback((stepId: string) => {
    try {
      const stepNumber = typeof stepId === 'string' 
        ? parseInt(stepId.replace(/\D/g, ''))
        : stepId;
      
      const template = stepTemplateService.getStepTemplate(stepNumber);
      
      if (template && template.length > 0) {
        return template.map((block: any) => ({
          type: block.type,
          properties: block.properties
        }));
      }
      
      return [];
    } catch (error) {
      console.error('❌ Erro ao obter template:', error);
      return [];
    }
  }, []);

  // 🎯 STEP HANDLERS
  const handleStepSelect = useCallback((stepId: string) => {
    setSelectedStepId(stepId);
    setSelectedBlockId(null);
    
    const selectedStep = steps.find(step => step.id === stepId);
    if (selectedStep && selectedStep.blocksCount === 0) {
      setTimeout(() => {
        handlePopulateStep(stepId);
      }, 100);
    }
  }, [steps]);

  const handlePopulateStep = useCallback((stepId: string) => {
    const stepNumber = parseInt(stepId.replace('etapa-', ''));
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 21) {
      console.error(`❌ Step ID inválido: ${stepId}`);
      return;
    }
    
    try {
      const stepTemplate = getStepTemplate(stepNumber.toString());
      
      if (!stepTemplate || stepTemplate.length === 0) {
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
              marginBottom: 16
            }
          }
        ];
        
        fallbackBlocks.forEach((blockData, index) => {
          const newBlockId = addBlock(blockData.type as any);
          setTimeout(() => {
            updateBlock(newBlockId, blockData.properties);
            updateBlock(newBlockId, { stepId: stepId });
          }, index * 100);
        });
        return;
      }
      
      stepTemplate.forEach((blockData, index) => {
        if (blockData.type === 'guarantee' || blockData.type === 'Garantia') {
          return;
        }
        
        const newBlockId = addBlock(blockData.type as any);
        setTimeout(() => {
          updateBlock(newBlockId, blockData.properties);
          updateBlock(newBlockId, { stepId: stepId });
        }, index * 100);
      });
      
      const updatedBlocksCount = stepTemplate.filter(b => 
        b.type !== 'guarantee' && b.type !== 'Garantia'
      ).length;
      
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.id === stepId 
            ? { ...step, blocksCount: updatedBlocksCount, isActive: true }
            : step
        )
      );
      
    } catch (error) {
      console.error(`❌ Erro ao aplicar template da Step ${stepNumber}:`, error);
    }
  }, [getStepTemplate, addBlock, updateBlock, setSteps]);

  // 🎯 BLOCK HANDLERS
  const handleAddBlock = useCallback((blockType: string) => {
    const newBlockId = addBlock(blockType as any);
    setSelectedBlockId(newBlockId);
    
    if (newBlockId) {
      setTimeout(() => {
        updateBlock(newBlockId, { stepId: selectedStepId });
      }, 50);
    }
  }, [addBlock, selectedStepId, updateBlock]);

  const handleBlockClick = useCallback((blockId: string) => {
    if (!isPreviewing) {
      setSelectedBlockId(blockId);
    }
  }, [isPreviewing]);

  // 🎯 FILTROS
  const blocks = config?.blocks || [];
  
  const sortedBlocks = useMemo(() => {
    const stepBlocks = blocks.filter(block => {
      if (block.stepId) {
        return block.stepId === selectedStepId;
      }
      return !block.stepId;
    });
    
    return [...stepBlocks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [blocks, selectedStepId]);

  // 🎯 CLEANUP FUNCTIONS
  const handleClearGuaranteeBlocks = useCallback(() => {
    let removedCount = 0;
    blocks.forEach(block => {
      if (block.type === 'guarantee' || block.type === 'Garantia') {
        deleteBlock(block.id);
        removedCount++;
      }
    });
    
    if (removedCount > 0) {
      toast({
        title: 'Blocos corrompidos removidos',
        description: `${removedCount} blocos "guarantee" foram removidos.`,
      });
    }
  }, [blocks, deleteBlock, toast]);

  // 🎯 EFFECTS
  useEffect(() => {
    localStorage.setItem('quiz-steps', JSON.stringify(steps));
  }, [steps]);

  useEffect(() => {
    if (blocks.length > 0) {
      setSteps(prev => prev.map(step => {
        if (step.id === selectedStepId) {
          return { ...step, blocksCount: blocks.length };
        }
        return step;
      }));
    }
  }, [blocks.length, selectedStepId]);

  return {
    // States
    selectedBlockId,
    setSelectedBlockId,
    isPreviewing,
    setIsPreviewing,
    previewMode,
    setPreviewMode,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isMobile,
    setIsMobile,
    isLoadingFunnel,
    setIsLoadingFunnel,
    steps,
    setSteps,
    selectedStepId,
    setSelectedStepId,
    
    // Data
    blocks,
    sortedBlocks,
    
    // Handlers
    handleStepSelect,
    handlePopulateStep,
    handleAddBlock,
    handleBlockClick,
    handleClearGuaranteeBlocks,
    
    // Editor functions
    addBlock,
    updateBlock,
    deleteBlock,
    saveConfig,
    setConfig,
    
    // Utils
    getStepTemplate,
    toast
  };
};
