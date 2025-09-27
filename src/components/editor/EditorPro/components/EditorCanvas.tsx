import React, { memo, useMemo } from 'react';
import { Block } from '@/types/editor';
import ScalableQuizRenderer from '@/components/core/ScalableQuizRenderer';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import { useStepSelection } from '@/hooks/useStepSelection';
import { UnifiedPreviewEngine } from '@/components/editor/unified/UnifiedPreviewEngine';
import { Plus, MousePointer2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Componente que renderiza o canvas vazio quando não há funnelId
 */
const EmptyCanvas: React.FC<{
  onAddFirstBlock?: () => void;
}> = ({ onAddFirstBlock }) => {
  return (
    <div className="flex-1 min-h-0 relative bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate flex items-center justify-center">
      <div className="text-center p-8 max-w-lg">
        {/* Ícone principal */}
        <div className="mb-6 relative">
          <div className="w-24 h-24 mx-auto bg-white/50 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-gray-200/20">
            <Plus className="w-12 h-12 text-[#687ef7]" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#d85dfb] rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Título e descrição */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Crie seu Funil do Zero
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Comece criando um novo funil arrastando componentes da sidebar para o canvas.
          Cada passo que você criar será automaticamente organizado e salvo.
        </p>

        {/* Dicas de uso */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center text-sm text-gray-700 bg-white/30 rounded-lg p-3 backdrop-blur-sm">
            <MousePointer2 className="w-4 h-4 mr-3 text-[#687ef7]" />
            <span>Arraste componentes da <strong>sidebar esquerda</strong> para o canvas</span>
          </div>
          <div className="flex items-center text-sm text-gray-700 bg-white/30 rounded-lg p-3 backdrop-blur-sm">
            <Plus className="w-4 h-4 mr-3 text-[#d85dfb]" />
            <span>Use o botão <strong>+ Adicionar Componente</strong> para começar</span>
          </div>
        </div>

        {/* Botão de ação */}
        {onAddFirstBlock && (
          <Button
            onClick={onAddFirstBlock}
            className="bg-[#687ef7] hover:bg-[#5a6fd8] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Primeiro Componente
          </Button>
        )}
      </div>

      {/* Padrão de fundo sutil */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#687ef7] rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#d85dfb] rounded-full" />
        <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-[#dee5ff] rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-[#687ef7] rounded-full" />
      </div>
    </div>
  );
};

/**
 * 🎨 CANVAS DO EDITOR OTIMIZADO
 * 
 * Agora usa ScalableQuizRenderer para preview escalável!
 */

interface EditorCanvasProps {
  blocks: Block[];
  selectedBlock: Block | null;
  currentStep: number;
  funnelId?: string; // ID do funil sendo editado
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void;
  onDeleteBlock: (blockId: string) => void;
  isPreviewMode: boolean;
  onStepChange?: (step: number) => void;
  realExperienceMode?: boolean; // Nova prop para ativar QuizOrchestrator
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  blocks,
  selectedBlock,
  currentStep,
  funnelId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  isPreviewMode,
  onStepChange,
  realExperienceMode = false // Nova prop para ativar QuizOrchestrator
}) => {
  // Sistema de seleção otimizado
  const { handleBlockSelection } = useStepSelection({
    stepNumber: currentStep,
    onSelectBlock,
    debounceMs: 50
  });

  // Key estável que NÃO força remount desnecessário
  const canvasKey = useMemo(() => {
    // Usar uma chave estável baseada apenas no step, não regenerar constantemente
    return `editor-canvas-step-${currentStep}`;
  }, [currentStep]);

  // 🆕 DETECTAR CANVAS VAZIO - Quando não há funnelId e não há blocos
  const isEmptyCanvas = useMemo(() => {
    return !funnelId && (!blocks || blocks.length === 0) && !isPreviewMode && !realExperienceMode;
  }, [funnelId, blocks, isPreviewMode, realExperienceMode]);

  // 🎯 MODO CANVAS VAZIO - Para criação de funis do zero
  if (isEmptyCanvas) {
    console.log('🆕 [DEBUG] Renderizando canvas vazio para criação de funil');
    return (
      <EmptyCanvas
        onAddFirstBlock={() => {
          console.log('🎯 Usuário clicou para adicionar primeiro componente');
          // Trigger para abrir sidebar de componentes ou adicionar bloco padrão
        }}
      />
    );
  }

  if (isPreviewMode) {
    // Usar funnelId dinâmico ou fallback para o template padrão
    const previewFunnelId = funnelId || 'quiz21StepsComplete';

    return (
      <div data-testid="preview-container" className="flex-1 min-h-0 bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate">
        <div className="h-full w-full overflow-y-auto relative z-0">
          {/* Indicador do funil sendo visualizado */}
          {funnelId && (
            <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              📋 Preview: {funnelId}
            </div>
          )}
          <ScalableQuizRenderer
            funnelId={previewFunnelId}
            mode="preview"
            debugMode={true}
            className="preview-mode-canvas w-full h-full"
            onStepChange={(step, data) => {
              if (onStepChange) onStepChange(step);
              console.log(`📍 Preview step change [${previewFunnelId}]:`, step, data);
            }}
          />
        </div>
      </div>
    );
  }

  // 🎯 NOVA FUNCIONALIDADE: Experiência Real com QuizOrchestrator
  if (realExperienceMode) {
    const realFunnelId = funnelId || 'quiz21StepsComplete';
    console.log(`🎯 [DEBUG] EditorCanvas renderizando em modo Real Experience [${realFunnelId}]`);

    return (
      <div className="flex-1 min-h-0 bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate">
        <div className="h-full w-full overflow-y-auto relative z-0">
          {/* Indicador visual de modo real ativo com funil */}
          <div className="absolute top-4 right-4 z-10 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
            🎯 REAL: {realFunnelId}
          </div>

          <UnifiedPreviewEngine
            blocks={blocks}
            selectedBlockId={selectedBlock?.id}
            isPreviewing={false}
            viewportSize="desktop"
            onBlockSelect={onSelectBlock}
            onBlockUpdate={onUpdateBlock}
            onBlocksReordered={() => { }}
            funnelId={realFunnelId}
            currentStep={currentStep}
            enableInteractions={true}
            mode="editor"
            enableProductionMode={realExperienceMode} // 🎯 CORREÇÃO: Usar realExperienceMode diretamente
          />
        </div>
      </div>
    );
  }

  return (
    <div
      key={canvasKey}
      data-testid="canvas-editor"
      className="flex-1 min-h-0 relative bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] isolate"
    >
      <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* ✅ CORREÇÃO: Usar CanvasDropZone sem SortableContext aninhado */}
        <CanvasDropZone
          blocks={blocks}
          selectedBlockId={selectedBlock?.id || null}
          onSelectBlock={handleBlockSelection}
          onUpdateBlock={onUpdateBlock}
          onDeleteBlock={onDeleteBlock}
          scopeId={currentStep}
        />
      </div>
    </div>
  );
};

// 🚀 OTIMIZAÇÃO AVANÇADA: Comparação profunda para eliminar re-renders desnecessários
const arePropsEqual = (prevProps: EditorCanvasProps, nextProps: EditorCanvasProps): boolean => {
  // 1. Comparações rápidas primeiro (early returns)
  if (prevProps.currentStep !== nextProps.currentStep ||
    prevProps.isPreviewMode !== nextProps.isPreviewMode ||
    prevProps.realExperienceMode !== nextProps.realExperienceMode ||
    prevProps.funnelId !== nextProps.funnelId) { // Incluir funnelId na comparação
    return false;
  }

  // 🆕 2. Comparar estado de canvas vazio
  const prevIsEmpty = !prevProps.funnelId && (!prevProps.blocks || prevProps.blocks.length === 0);
  const nextIsEmpty = !nextProps.funnelId && (!nextProps.blocks || nextProps.blocks.length === 0);
  if (prevIsEmpty !== nextIsEmpty) {
    return false;
  }

  // 3. Comparar selectedBlock
  if (prevProps.selectedBlock?.id !== nextProps.selectedBlock?.id) {
    return false;
  }

  // 4. Comparar handlers (referência de função pode mudar)
  if (prevProps.onSelectBlock !== nextProps.onSelectBlock ||
    prevProps.onUpdateBlock !== nextProps.onUpdateBlock ||
    prevProps.onDeleteBlock !== nextProps.onDeleteBlock ||
    prevProps.onStepChange !== nextProps.onStepChange) {
    return false;
  }

  // 5. Comparação inteligente de blocos
  if (prevProps.blocks.length !== nextProps.blocks.length) {
    return false;
  }

  // 6. ✅ NOVA OTIMIZAÇÃO: Comparação profunda de conteúdo dos blocos
  for (let i = 0; i < prevProps.blocks.length; i++) {
    const prevBlock: Block = prevProps.blocks[i];
    const nextBlock: Block = nextProps.blocks[i];

    // Comparar ID, type e propriedades essenciais
    if (prevBlock.id !== nextBlock.id ||
      prevBlock.type !== nextBlock.type ||
      prevBlock.position !== nextBlock.position) {
      return false;
    }

    // ✅ Comparação shallow de propriedades críticas (sem deep comparison custosa)
    const prevBlockProps = prevBlock.properties || {};
    const nextBlockProps = nextBlock.properties || {};

    if (Object.keys(prevBlockProps).length !== Object.keys(nextBlockProps).length) {
      return false;
    }

    // Comparar apenas propriedades visuais que afetam renderização
    const visualProps = ['text', 'content', 'backgroundColor', 'textColor', 'fontSize', 'padding', 'margin', 'visible'];
    for (const prop of visualProps) {
      if (prevBlockProps[prop] !== nextBlockProps[prop]) {
        return false;
      }
    }

    // Comparação shallow de content
    const prevContent = prevBlock.content || {};
    const nextContent = nextBlock.content || {};

    if (JSON.stringify(prevContent) !== JSON.stringify(nextContent)) {
      return false;
    }
  }

  return true; // Props são realmente equivalentes, evitar re-render
};

EditorCanvas.displayName = 'EditorCanvas';

export default memo(EditorCanvas, arePropsEqual);