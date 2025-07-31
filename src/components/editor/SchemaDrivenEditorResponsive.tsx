/**
 * EDITOR RESPONSIVO COM INTEGRAÇÃO DE FUNIL
 * Editor que se adapta a diferentes telas e se conecta com um funil de dados
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Plus, Copy, Trash2, ChevronDown, ChevronRight, Zap } from 'lucide-react';
import {
  BlockRenderer,
  ComponentsPanel,
  StepsPanel
} from './';
import {
  QuizComponentData,
  QuizStage
} from '@/types/quizBuilder';
import {
  DEFAULT_STAGE,
  DEFAULT_COMPONENT_DATA
} from '@/constants';
import { useQuizBuilder } from '@/hooks/useQuizBuilder';
import { useTypeformQuizBuilder } from '@/hooks/useTypeformQuizBuilder';
import { generateInitialStages } from '@/services/quizBuilderService';
import { schemaDrivenFunnelService } from '@/services/schemaDrivenFunnelService';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
  onSave?: (project: any) => void;
  initialBlocks?: any[];
}

interface Step {
  id: string;
  name: string;
  blocks: any[];
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({ 
  funnelId,
  className,
  onSave,
  initialBlocks = []
}) => {
  const [leftPanelTab, setLeftPanelTab] = useState<"steps" | "blocks">("steps");
  const { toast } = useToast();
  
  const {
    components,
    stages,
    activeStageId,
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    addStage,
    updateStage,
    deleteStage,
    moveStage,
    setActiveStage,
    saveCurrentState,
    initializeStages,
    initializeComponents,
    loading
  } = useQuizBuilder();

  const [blocks, setBlocks] = useState<any[]>(initialBlocks);
  const [steps, setSteps] = useState<Step[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [isLoadingFunnel, setIsLoadingFunnel] = useState(false);

  // Load funnel data on component mount
  useEffect(() => {
    const loadFunnelData = async () => {
      if (!funnelId) {
        console.warn('Funnel ID is missing. Using default state.');
        return;
      }

      setIsLoadingFunnel(true);
      try {
        // Check if the funnel exists
        const funnelExists = await schemaDrivenFunnelService.funnelExists(funnelId);
        
        if (!funnelExists) {
          console.log(`Funnel with ID "${funnelId}" does not exist. Creating a new one.`);
          
          // Create the funnel if it doesn't exist
          const newFunnel = await schemaDrivenFunnelService.createFunnel(funnelId);
          
          if (newFunnel) {
            toast({
              title: "Funil Criado!",
              description: `Funil "${funnelId}" criado com template padrão`,
              duration: 3000,
            });
          } else {
            toast({
              title: "Erro ao criar funil",
              description: `Não foi possível criar o funil "${funnelId}"`,
              variant: "destructive",
            });
            return;
          }
        }
        
        // Load the funnel data
        const funnelData = await schemaDrivenFunnelService.getFunnel(funnelId);
        
        if (funnelData && funnelData.pages) {
          console.log(`Funnel data loaded successfully for ID: ${funnelId}`);
          
          // Convert pages to steps
          const initialSteps = funnelData.pages.map((page, index) => ({
            id: page.id || `step-${index + 1}`,
            name: page.name || `Etapa ${index + 1}`,
            blocks: page.blocks || [],
          }));
          
          setSteps(initialSteps);
          setBlocks(initialSteps.flatMap(step => step.blocks));
          
          // Set the first step as active
          if (initialSteps.length > 0) {
            setActiveStepId(initialSteps[0].id);
          }
          
          toast({
            title: "Funil Carregado!",
            description: `Funil "${funnelId}" carregado com ${initialSteps.length} etapas`,
            duration: 3000,
          });
        } else {
          console.warn(`Funnel data is empty or has no pages for ID: ${funnelId}`);
          
          // Initialize with default steps if funnel data is empty
          const defaultSteps = generateInitialSteps();
          setSteps(defaultSteps);
          setBlocks(defaultSteps.flatMap(step => step.blocks));
          
          if (defaultSteps.length > 0) {
            setActiveStepId(defaultSteps[0].id);
          }
          
          toast({
            title: "Funil Vazio",
            description: `Funil "${funnelId}" está vazio. Usando template padrão`,
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error loading funnel data:', error);
        toast({
          title: "Erro ao carregar funil",
          description: `Não foi possível carregar o funil "${funnelId}"`,
          variant: "destructive",
        });
      } finally {
        setIsLoadingFunnel(false);
      }
    };

    loadFunnelData();
  }, [funnelId, toast]);

  // Update document title with funnel ID
  useEffect(() => {
    document.title = funnelId ? `Editor - ${funnelId}` : 'Editor';
  }, [funnelId]);

  // Function to generate initial steps
  const generateInitialSteps = (): Step[] => {
    return [
      {
        id: 'step-1',
        name: 'Etapa 1',
        blocks: [
          {
            id: uuidv4(),
            type: 'text',
            content: { text: 'Bem-vindo!' }
          }
        ]
      }
    ];
  };

  const handleAddBlock = (type: string) => {
    if (!activeStepId) {
      toast({
        title: "Erro",
        description: "Selecione uma etapa para adicionar o bloco.",
        variant: "destructive",
      });
      return;
    }

    const newBlock = {
      id: uuidv4(),
      type: type,
      content: { text: `Novo bloco de ${type}` }
    };

    setBlocks([...blocks, newBlock]);
    setSteps(steps.map(step =>
      step.id === activeStepId ? { ...step, blocks: [...step.blocks, newBlock] } : step
    ));
  };

  const handleUpdateBlock = (blockId: string, newContent: any) => {
    setBlocks(blocks.map(block =>
      block.id === blockId ? { ...block, content: newContent } : block
    ));

    setSteps(steps.map(step => ({
      ...step,
      blocks: step.blocks.map(block =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
    })));
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    setSteps(steps.map(step => ({
      ...step,
      blocks: step.blocks.filter(block => block.id !== blockId)
    })));
  };

  const handleAddStep = () => {
    const newStepId = uuidv4();
    const newStep = {
      id: newStepId,
      name: `Etapa ${steps.length + 1}`,
      blocks: []
    };

    setSteps([...steps, newStep]);
    setActiveStepId(newStepId);
  };

  const handleDuplicateStep = (stepId: string) => {
    const stepToDuplicate = steps.find(step => step.id === stepId);
    if (!stepToDuplicate) return;

    const newStepId = uuidv4();
    const newStep = {
      id: newStepId,
      name: `${stepToDuplicate.name} (Cópia)`,
      blocks: stepToDuplicate.blocks.map(block => ({ ...block, id: uuidv4() }))
    };

    setSteps([...steps, newStep]);
    setActiveStepId(newStepId);
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
    setBlocks(blocks.filter(block => !steps.find(step => step.id === stepId)?.blocks.find(b => b.id === block.id)));
    setActiveStepId(null);
  };

  const handleSelectStep = (stepId: string) => {
    setActiveStepId(stepId);
  };

  const handleAddBlocksToStep = useCallback((stepId: string, newBlocks: any[]) => {
    setSteps(prevSteps => {
      return prevSteps.map(step => {
        if (step.id === stepId) {
          const updatedBlocks = [...step.blocks, ...newBlocks];
          return { ...step, blocks: updatedBlocks };
        }
        return step;
      });
    });
    
    setBlocks(prevBlocks => [...prevBlocks, ...newBlocks]);
  }, []);

  // Função otimizada para popular etapa com template correto
  const handlePopulateStep = useCallback((stepId: string) => {
    console.log(`🎯 Populando etapa ${stepId} com template correspondente`);
    
    try {
      // Extrair número da etapa do stepId
      const stepMatch = stepId.match(/(\d+)/);
      if (!stepMatch) {
        console.error(`❌ Não foi possível extrair número da etapa de: ${stepId}`);
        return;
      }
      
      const stepNumber = parseInt(stepMatch[0]);
      console.log(`📋 Extraído número da etapa: ${stepNumber}`);
      
      // Importar e usar o template correto
      import('../steps').then(stepsModule => {
        const template = stepsModule.getStepTemplate(stepNumber);
        
        if (!template) {
          console.error(`❌ Template não encontrado para etapa ${stepNumber}`);
          return;
        }
        
        console.log(`✅ Template carregado para etapa ${stepNumber}:`, template);
        
        // Adicionar os blocos do template à etapa
        handleAddBlocksToStep(stepId, template);
        
        // Feedback visual para o usuário
        toast({
          title: "Etapa populada!",
          description: `Etapa ${stepNumber} foi populada com ${template.length} componentes`,
          duration: 3000,
        });
        
      }).catch(error => {
        console.error(`❌ Erro ao carregar template da etapa ${stepNumber}:`, error);
        toast({
          title: "Erro",
          description: `Não foi possível carregar o template da etapa ${stepNumber}`,
          variant: "destructive",
        });
      });
      
    } catch (error) {
      console.error('❌ Erro geral ao popular etapa:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao popular a etapa",
        variant: "destructive",
      });
    }
  }, [handleAddBlocksToStep]);

  // Função para popular todas as etapas vazias
  const handlePopulateAllEmptySteps = useCallback(() => {
    console.log('🚀 Iniciando população de todas as etapas vazias...');
    
    let populatedCount = 0;
    
    steps.forEach(step => {
      const stepBlocks = blocks.filter(block => block.stepId === step.id);
      
      // Se a etapa está vazia, popular ela
      if (stepBlocks.length === 0) {
        console.log(`📋 Populando etapa vazia: ${step.id}`);
        handlePopulateStep(step.id);
        populatedCount++;
      }
    });
    
    if (populatedCount > 0) {
      toast({
        title: "Etapas populadas!",
        description: `${populatedCount} etapas vazias foram populadas com templates padrão`,
        duration: 4000,
      });
    } else {
      toast({
        title: "Nenhuma etapa vazia",
        description: "Todas as etapas já possuem conteúdo",
        duration: 3000,
      });
    }
  }, [steps, blocks, handlePopulateStep]);

  return (
    <div className={cn("w-full h-full flex flex-col bg-gray-50", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-lg font-semibold">
          {isLoadingFunnel ? 'Carregando...' : `Editor - ${funnelId || 'Novo Funil'}`}
        </h1>
        <Button onClick={saveCurrentState}>Salvar</Button>
      </div>

      {/* Loading State */}
      {isLoadingFunnel && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Carregando funil...</p>
        </div>
      )}

      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* Left Panel - Steps and Components */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full flex flex-col border-r border-gray-200 bg-white">
            <Tabs value={leftPanelTab} onValueChange={setLeftPanelTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-2">
                <TabsTrigger value="steps">Etapas Quiz</TabsTrigger>
                <TabsTrigger value="blocks">Blocos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="steps" className="flex-1 m-2 mt-0">
                <StepsPanel
                  steps={steps}
                  activeStepId={activeStepId}
                  onStepSelect={setActiveStepId}
                  onStepAdd={handleAddStep}
                  onStepDelete={handleDeleteStep}
                  onStepDuplicate={handleDuplicateStep}
                  onPopulateStep={handlePopulateStep} // ✅ FUNÇÃO CONECTADA
                  onPopulateAllEmptySteps={handlePopulateAllEmptySteps} // ✅ NOVA FUNCIONALIDADE
                />
              </TabsContent>
              
              <TabsContent value="blocks" className="flex-1 m-2 mt-0">
                <ComponentsPanel onAddBlock={handleAddBlock} />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-gray-100 border-r border-gray-200" />

        {/* Central Panel - Editor Canvas */}
        <ResizablePanel defaultSize={60}>
          <div className="h-full p-4">
            {activeStepId ? (
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  {steps.find(step => step.id === activeStepId)?.name || 'Editor Canvas'}
                </h2>
                {blocks.filter(block => steps.find(step => step.id === activeStepId)?.blocks.find(b => b.id === block.id)).map(block => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    onUpdate={newContent => handleUpdateBlock(block.id, newContent)}
                    onDelete={() => handleDeleteBlock(block.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center">
                Selecione uma etapa para começar a editar.
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-gray-100 border-r border-gray-200" />

        {/* Right Panel - Properties */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full p-4 border-l border-gray-200 bg-white">
            {activeStepId && (
              <div>
                <h2 className="text-sm font-semibold mb-2">Propriedades da Etapa</h2>
                <p className="text-gray-500">
                  Edite as propriedades da etapa selecionada aqui.
                </p>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
