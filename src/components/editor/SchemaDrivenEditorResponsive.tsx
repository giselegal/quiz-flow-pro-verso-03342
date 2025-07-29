
import React, { useState, useCallback, useMemo } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Plus, Eye, EyeOff, Download, Upload, Trash2, Monitor, Tablet, Smartphone, PlayCircle, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEditor } from '../../hooks/useEditor';
import { UniversalBlockRenderer } from './blocks/UniversalBlockRenderer';
import type { BlockData } from '../../types/blocks';
import { getInitialQuiz21EtapasTemplate } from '../../templates/quiz21EtapasTemplate';
import { AdvancedPropertyPanel } from './AdvancedPropertyPanel';
import { EditorStatus } from './components/EditorStatus';
import { StepsPanel } from './StepsPanel';
import { ComponentsPanel } from './ComponentsPanel';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

const PREVIEW_DIMENSIONS = {
  desktop: { width: '100%', maxWidth: '1200px' },
  tablet: { width: '768px', maxWidth: '768px' },
  mobile: { width: '375px', maxWidth: '375px' }
};

const AVAILABLE_BLOCKS = [
  // === COMPONENTES BÁSICOS ===
  { type: 'heading', name: 'Título', icon: '📝', category: 'text' },
  { type: 'text', name: 'Texto', icon: '📄', category: 'text' },
  { type: 'image', name: 'Imagem', icon: '🖼️', category: 'media' },
  { type: 'button', name: 'Botão', icon: '🔘', category: 'interactive' },
  { type: 'cta', name: 'Call to Action', icon: '🎯', category: 'interactive' },
  { type: 'spacer', name: 'Espaçador', icon: '➖', category: 'layout' },
  { type: 'form-input', name: 'Campo de Entrada', icon: '📝', category: 'form' },
  { type: 'list', name: 'Lista', icon: '📋', category: 'text' },

  // === COMPONENTES QUIZ PRINCIPAIS ===
  { type: 'options-grid', name: 'Grade de Opções', icon: '⚏', category: 'quiz' },
  { type: 'vertical-canvas-header', name: 'Cabeçalho Quiz', icon: '🏷️', category: 'quiz' },
  { type: 'quiz-question', name: 'Questão do Quiz', icon: '❓', category: 'quiz' },
  { type: 'quiz-progress', name: 'Progresso', icon: '📊', category: 'quiz' },
  { type: 'quiz-transition', name: 'Transição', icon: '🔄', category: 'quiz' },

  // === COMPONENTES INLINE ESSENCIAIS ===
  { type: 'text-inline', name: 'Texto Inline', icon: '📝', category: 'inline' },
  { type: 'heading-inline', name: 'Título Inline', icon: '📰', category: 'inline' },
  { type: 'button-inline', name: 'Botão Inline', icon: '🔘', category: 'inline' },
  { type: 'badge-inline', name: 'Badge Inline', icon: '🏷️', category: 'inline' },
  { type: 'progress-inline', name: 'Progresso Inline', icon: '📈', category: 'inline' },
  { type: 'image-display-inline', name: 'Imagem Inline', icon: '🖼️', category: 'inline' },
  { type: 'style-card-inline', name: 'Card de Estilo', icon: '🎨', category: 'inline' },
  { type: 'result-card-inline', name: 'Card de Resultado', icon: '🏆', category: 'inline' },
  { type: 'countdown-inline', name: 'Countdown', icon: '⏱️', category: 'inline' },
  { type: 'stat-inline', name: 'Estatística', icon: '📊', category: 'inline' },
  { type: 'pricing-card-inline', name: 'Card de Preço', icon: '💰', category: 'inline' },

  // === COMPONENTES DAS 21 ETAPAS DO QUIZ ===
  { type: 'quiz-start-page-inline', name: 'Página Inicial do Quiz', icon: '🚀', category: '21-etapas' },
  { type: 'quiz-personal-info-inline', name: 'Informações Pessoais', icon: '👤', category: '21-etapas' },
  { type: 'quiz-experience-inline', name: 'Experiência', icon: '📚', category: '21-etapas' },
  { type: 'quiz-certificate-inline', name: 'Certificado', icon: '🏅', category: '21-etapas' },
  { type: 'quiz-leaderboard-inline', name: 'Ranking', icon: '🏆', category: '21-etapas' },
  { type: 'quiz-badges-inline', name: 'Badges', icon: '🎖️', category: '21-etapas' },
  { type: 'quiz-evolution-inline', name: 'Evolução', icon: '📈', category: '21-etapas' },
  { type: 'quiz-networking-inline', name: 'Networking', icon: '🤝', category: '21-etapas' },
  { type: 'quiz-development-plan-inline', name: 'Plano de Desenvolvimento', icon: '📋', category: '21-etapas' },
  { type: 'quiz-goals-dashboard-inline', name: 'Dashboard de Metas', icon: '🎯', category: '21-etapas' },
  { type: 'quiz-final-results-inline', name: 'Resultados Finais', icon: '🏁', category: '21-etapas' },
  { type: 'quiz-offer-cta-inline', name: 'CTA de Oferta', icon: '💎', category: '21-etapas' },

  // === COMPONENTES DE RESULTADO (ETAPA 20) ===
  { type: 'result-header-inline', name: 'Cabeçalho do Resultado', icon: '🎊', category: 'resultado' },
  { type: 'before-after-inline', name: 'Antes e Depois', icon: '🔄', category: 'resultado' },
  { type: 'bonus-list-inline', name: 'Lista de Bônus', icon: '🎁', category: 'resultado' },
  { type: 'step-header-inline', name: 'Cabeçalho de Etapa', icon: '📌', category: 'resultado' },
  { type: 'testimonial-card-inline', name: 'Card de Depoimento', icon: '💭', category: 'resultado' },
  { type: 'testimonials-inline', name: 'Depoimentos', icon: '🗣️', category: 'resultado' },

  // === COMPONENTES DE OFERTA (ETAPA 21) ===
  { type: 'quiz-offer-pricing-inline', name: 'Preço da Oferta', icon: '💰', category: 'oferta' },
  { type: 'loading-animation', name: 'Animação de Carregamento', icon: '⏳', category: 'oferta' },

  // === COMPONENTES MODERNOS ===
  { type: 'video-player', name: 'Player de Vídeo', icon: '🎬', category: 'media' },
  { type: 'faq-section', name: 'Seção de FAQ', icon: '❓', category: 'content' },
  { type: 'testimonials', name: 'Grade de Depoimentos', icon: '🌟', category: 'content' },
  { type: 'guarantee', name: 'Garantia', icon: '✅', category: 'content' },

  // === COMPONENTES ESTRATÉGICOS ===
  { type: 'strategic-question-image', name: 'Questão Estratégica com Imagem', icon: '🎯', category: 'strategic' },
  { type: 'strategic-question-main', name: 'Questão Estratégica Principal', icon: '🎪', category: 'strategic' },
  { type: 'strategic-question-inline', name: 'Questão Estratégica Inline', icon: '🎲', category: 'strategic' },
];

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className
}) => {
  const { config, addBlock, updateBlock, deleteBlock, saveConfig } = useEditor();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Safe access to blocks with fallback
  const blocks = config?.blocks || [];

  // Steps state
  const [steps, setSteps] = useState([
    { id: 'step-1', name: 'Etapa 1', order: 1, blocksCount: 0, isActive: true },
    { id: 'step-2', name: 'Etapa 2', order: 2, blocksCount: 0, isActive: false },
    { id: 'step-3', name: 'Etapa 3', order: 3, blocksCount: 0, isActive: false },
  ]);
  const [selectedStepId, setSelectedStepId] = useState<string>('step-1');

  const handleAddBlock = useCallback((blockType: string) => {
    const newBlockId = addBlock(blockType as any);
    setSelectedBlockId(newBlockId);
  }, [addBlock]);

  // Steps management functions
  const handleStepSelect = useCallback((stepId: string) => {
    setSelectedStepId(stepId);
    setSelectedBlockId(null); // Clear block selection when changing steps
  }, []);

  const handleStepAdd = useCallback(() => {
    const newStep = {
      id: `step-${Date.now()}`,
      name: `Etapa ${steps.length + 1}`,
      order: steps.length + 1,
      blocksCount: 0,
      isActive: false
    };
    setSteps(prev => [...prev, newStep]);
  }, [steps.length]);

  const handleStepUpdate = useCallback((stepId: string, updates: any) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  const handleStepDelete = useCallback((stepId: string) => {
    if (steps.length <= 1) {
      alert('Não é possível excluir a última etapa');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta etapa?')) {
      setSteps(prev => prev.filter(step => step.id !== stepId));
      if (selectedStepId === stepId) {
        setSelectedStepId(steps[0]?.id || '');
      }
    }
  }, [steps, selectedStepId]);

  const handleStepDuplicate = useCallback((stepId: string) => {
    const stepToDuplicate = steps.find(step => step.id === stepId);
    if (stepToDuplicate) {
      const newStep = {
        ...stepToDuplicate,
        id: `step-${Date.now()}`,
        name: `${stepToDuplicate.name} (Cópia)`,
        order: steps.length + 1
      };
      setSteps(prev => [...prev, newStep]);
    }
  }, [steps]);

  const handleStepReorder = useCallback((draggedId: string, targetId: string) => {
    // TODO: Implement drag and drop reordering
    console.log('Reorder step', draggedId, 'to', targetId);
  }, []);

  // Component selection handler
  const handleComponentSelect = useCallback((componentId: string) => {
    handleAddBlock(componentId);
  }, [handleAddBlock]);

  const handleLoadTemplate = useCallback(async () => {
    try {
      setSelectedBlockId(null);
      
      // Teste simples primeiro - adicionar alguns blocos básicos
      console.log('🔄 Carregando blocos de teste...');
      
      // Blocos de teste simples que sabemos que existem
      const testBlocks = [
        { type: 'heading', content: { text: 'Etapa 1: Introdução' } },
        { type: 'text', content: { text: 'Bem-vindo ao quiz de estilo pessoal' } },
        { type: 'button', content: { text: 'Começar Quiz' } },
        { type: 'heading', content: { text: 'Questão 1' } },
        { type: 'text', content: { text: 'Qual seu estilo preferido?' } }
      ];
      
      let addedCount = 0;
      for (const block of testBlocks) {
        try {
          console.log(`📦 Adicionando bloco ${addedCount + 1}: ${block.type}`);
          const newBlockId = addBlock(block.type as any);
          addedCount++;
          
          // Atualizar com conteúdo após pequeno delay
          setTimeout(() => {
            updateBlock(newBlockId, block.content);
          }, 50);
          
        } catch (blockError) {
          console.warn(`⚠️ Erro ao adicionar bloco ${block.type}:`, blockError);
        }
      }
      
      console.log(`✅ Blocos de teste carregados! ${addedCount} blocos adicionados.`);
      alert(`✅ Blocos de teste carregados!\n${addedCount} componentes adicionados ao canvas.`);
      
    } catch (error) {
      console.error('❌ Erro ao carregar blocos:', error);
      alert(`❌ Erro ao carregar blocos: ${error.message}`);
    }
  }, [addBlock, updateBlock]);

  const handleClearAll = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar todos os blocos?')) {
      // Limpar todos os blocos
      blocks.forEach(block => {
        deleteBlock(block.id);
      });
      setSelectedBlockId(null);
      console.log('🗑️ Todos os blocos foram removidos');
    }
  }, [blocks, deleteBlock]);

  const handleSaveInline = useCallback((blockId: string, updates: Partial<BlockData>) => {
    updateBlock(blockId, updates.properties || {});
  }, [updateBlock]);

  const handleBlockClick = useCallback((blockId: string) => {
    if (!isPreviewing) {
      setSelectedBlockId(blockId);
    }
  }, [isPreviewing]);

  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [blocks]);

  // Filtrar blocos por categoria e termo de busca
  const filteredBlocks = useMemo(() => {
    return AVAILABLE_BLOCKS.filter(block => {
      const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           block.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Obter categorias únicas
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(AVAILABLE_BLOCKS.map(block => block.category))];
    return cats.map(cat => ({
      value: cat,
      label: cat === 'all' ? 'Todos' : 
             cat === '21-etapas' ? '21 Etapas' :
             cat === 'resultado' ? 'Resultado' :
             cat === 'oferta' ? 'Oferta' :
             cat === 'strategic' ? 'Estratégicos' :
             cat === 'inline' ? 'Inline' :
             cat === 'quiz' ? 'Quiz' :
             cat === 'text' ? 'Texto' :
             cat === 'media' ? 'Mídia' :
             cat === 'interactive' ? 'Interativo' :
             cat === 'layout' ? 'Layout' :
             cat === 'form' ? 'Formulário' :
             cat === 'content' ? 'Conteúdo' : cat
    }));
  }, []);

  return (
    // <DndProvider backend={HTML5Backend}>
      <div className={cn('h-full flex flex-col bg-gray-50', className)}>
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Editor Visual das 21 Etapas</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/demo', '_blank')}
                className="flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                Demo Interativo
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Carregar Blocos de Teste
              </Button>
              
              {/* Preview Mode Buttons */}
              <div className="flex items-center gap-1 border border-gray-200 rounded-md p-1">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="h-8 px-2"
                  title="Preview Desktop"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                  className="h-8 px-2"
                  title="Preview Tablet"
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="h-8 px-2"
                  title="Preview Mobile"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
              
              {blocks.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Tudo
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewing(!isPreviewing)}
                className="flex items-center gap-2"
              >
                {isPreviewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isPreviewing ? 'Editar' : 'Visualizar'}
              </Button>
              <Button onClick={saveConfig} size="sm">
                Salvar
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {isMobile ? (
          /* Mobile Layout - Vertical Stack */
          <div className="flex-1 flex flex-col">
            {/* Mobile Components Panel - Horizontal */}
            <div className="flex-shrink-0 border-b border-gray-200">
              <ComponentsPanel
                onComponentSelect={handleComponentSelect}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                layout="horizontal"
                className="h-auto"
              />
            </div>

            {/* Mobile Steps Panel - Horizontal */}
            <div className="flex-shrink-0 border-b border-gray-200 p-2">
              <div className="flex space-x-2 overflow-x-auto">
                {steps.map((step) => (
                  <Button
                    key={step.id}
                    variant={selectedStepId === step.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStepSelect(step.id)}
                    className="whitespace-nowrap"
                  >
                    {step.name}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStepAdd}
                  className="whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Canvas */}
            <div className="flex-1 bg-gray-50 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <div className="bg-white rounded-lg shadow-sm min-h-96 p-6">
                  {sortedBlocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <div className="text-center space-y-4 max-w-md">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                          <Plus className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Editor das 21 Etapas do Quiz
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Selecione componentes acima para começar a construir sua etapa
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedBlocks.map((block) => (
                        <div
                          key={block.id}
                          onClick={() => setSelectedBlockId(block.id)}
                          className={cn(
                            'relative p-4 rounded-lg border-2 transition-all cursor-pointer',
                            selectedBlockId === block.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <UniversalBlockRenderer
                            block={block}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          /* Desktop Layout - Horizontal Panels */
          <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Steps Panel */}
          <ResizablePanel defaultSize={18} minSize={15} maxSize={25}>
            <StepsPanel
              steps={steps}
              selectedStepId={selectedStepId}
              onStepSelect={handleStepSelect}
              onStepAdd={handleStepAdd}
              onStepUpdate={handleStepUpdate}
              onStepDelete={handleStepDelete}
              onStepDuplicate={handleStepDuplicate}
              onStepReorder={handleStepReorder}
              className="h-full border-r border-gray-200"
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Components Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <ComponentsPanel
              onComponentSelect={handleComponentSelect}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              className="h-full border-r border-gray-200"
              layout="vertical"
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Canvas */}
          <ResizablePanel defaultSize={42}>
            <div className="h-full bg-gray-50 overflow-hidden">
              <ScrollArea className="h-full p-6">
                {/* Preview Mode Indicator */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-white rounded-md px-3 py-1 text-sm text-gray-600 shadow-sm border">
                    {previewMode === 'desktop' && <><Monitor className="w-4 h-4" /> Desktop (1200px)</>}
                    {previewMode === 'tablet' && <><Tablet className="w-4 h-4" /> Tablet (768px)</>}
                    {previewMode === 'mobile' && <><Smartphone className="w-4 h-4" /> Mobile (375px)</>}
                  </div>
                </div>
                
                {/* Responsive Canvas Container */}
                <div className="flex justify-center">
                  <div 
                    className="bg-white rounded-lg shadow-sm min-h-96 transition-all duration-300"
                    style={{
                      width: PREVIEW_DIMENSIONS[previewMode].width,
                      maxWidth: PREVIEW_DIMENSIONS[previewMode].maxWidth,
                      minWidth: previewMode === 'mobile' ? '375px' : 'auto'
                    }}
                  >
                  <div className="p-6">
                    {sortedBlocks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <div className="text-center space-y-4 max-w-md">
                          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Editor das 21 Etapas do Quiz
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Crie um funil completo de quiz de estilo pessoal com 21 etapas otimizadas para conversão
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Button
                              onClick={handleLoadTemplate}
                              className="w-full mb-2"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Carregar Blocos de Teste
                            </Button>
                            <p className="text-sm text-gray-500">
                              Ou arraste componentes da barra lateral
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                            <div className="text-left">
                              <p className="font-medium">✨ Inclui:</p>
                              <ul className="space-y-1">
                                <li>• 10 questões principais</li>
                                <li>• 6 questões estratégicas</li>
                                <li>• Página de resultado</li>
                                <li>• Página de oferta</li>
                              </ul>
                            </div>
                            <div className="text-left">
                              <p className="font-medium">🎯 Recursos:</p>
                              <ul className="space-y-1">
                                <li>• Cálculos automáticos</li>
                                <li>• Progress tracking</li>
                                <li>• Transições suaves</li>
                                <li>• Sistema completo</li>
                              </ul>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700">
                              <strong>📊 Status:</strong> {AVAILABLE_BLOCKS.length} componentes disponíveis
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sortedBlocks.map((block) => {
                          const blockData: BlockData = {
                            id: block.id,
                            type: block.type,
                            properties: { ...block.content || {}, order: block.order || 0 }
                          };

                          return (
                            <div
                              key={block.id}
                              className={cn(
                                'transition-all duration-200',
                                selectedBlockId === block.id && !isPreviewing && 
                                'ring-2 ring-blue-500 rounded-lg'
                              )}
                            >
                              <UniversalBlockRenderer
                                block={blockData}
                                isSelected={selectedBlockId === block.id}
                                onClick={() => handleBlockClick(block.id)}
                                onSaveInline={handleSaveInline}
                                disabled={isPreviewing}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Properties Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <AdvancedPropertyPanel
              selectedBlockId={selectedBlockId}
              properties={selectedBlockId ? blocks.find(b => b.id === selectedBlockId)?.properties || {} : {}}
              onPropertyChange={(key, value) => {
                if (selectedBlockId) {
                  const block = blocks.find(b => b.id === selectedBlockId);
                  if (block) {
                    updateBlock(selectedBlockId, { 
                      ...block, 
                      properties: { ...block.properties, [key]: value } 
                    });
                  }
                }
              }}
              onDeleteBlock={selectedBlockId ? () => {
                deleteBlock(selectedBlockId);
                setSelectedBlockId(null);
              } : undefined}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
        )}
        
        {/* Editor Status Bar */}
        <div className="flex-shrink-0">
          <EditorStatus
            selectedBlockId={selectedBlockId || undefined}
            historyCount={10} // TODO: Get from property history
            currentHistoryIndex={5} // TODO: Get from property history
            canUndo={true} // TODO: Get from property history
            canRedo={false} // TODO: Get from property history
            lastAction="Propriedade alterada" // TODO: Get from property history
            totalBlocks={blocks.length}
            previewMode={previewMode}
          />
        </div>
      </div>
    // </DndProvider>
  );
};

export default SchemaDrivenEditorResponsive;
