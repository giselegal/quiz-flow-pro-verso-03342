/**
 * 🎯 MAIN EDITOR UNIFIED - CLEAN ARCHITECTURE
 * 
 * Editor principal migrado para Clean Architecture  const handleBlockSelect = (blockId: string) => {
    // Note: selectBlock removed as EditorProvider doesn't expose this function
    // TODO: Implement block selection when needed
    if (debugMode) {
      console.log('🎯 Bloco selecionado:', blockId);
    }
  };m fallback automático para legacy
 */

import React, { Suspense, useState, useEffect } from 'react';
import { CleanArchitectureProvider, useFeatureFlags } from '@/providers/CleanArchitectureProvider';
import { useQuiz, useFunnel } from '@/application';
import { useEditor } from '@/components/editor/EditorProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import { Block } from '@/core/domains';

// 🏗️ INTERFACES
interface MainEditorUnifiedProps {
  className?: string;
  stepNumber?: number;
  funnelId?: string;
  onStepChange?: (stepId: string) => void;
  onSave?: (stepId: string, data: any) => void;
  debugMode?: boolean;
}

/**
 * 🎯 COMPONENTE INTERNO (com Clean Architecture)
 */
const MainEditorUnifiedInternal: React.FC<MainEditorUnifiedProps> = ({
  className,
  stepNumber = 1,
  funnelId = 'quiz-style-21-steps',
  onStepChange,
  debugMode = false
}) => {
  // 🚩 FEATURE FLAGS
  const featureFlags = useFeatureFlags();

  // 🔧 HOOKS DA CLEAN ARCHITECTURE
  const {
    state: { isLoading: editorLoading },
    actions: { addBlock }
  } = useEditor(); const {
    isLoading: quizLoading
  } = useQuiz();

  const {
    funnel,
    blocks,
    isLoading: funnelLoading
  } = useFunnel(funnelId);

  // 🎯 ESTADO LOCAL
  const [isInitialized, setIsInitialized] = useState(false);

  // 🔄 INICIALIZAÇÃO
  useEffect(() => {
    const initialize = async () => {
      try {
        if (debugMode) {
          console.log('🎯 MainEditorUnified: Inicializando com Clean Architecture');
        }

        // Sincronizar step atual (implementação futura)
        // TODO: Implementar lógica de step quando necessário

        setIsInitialized(true);
      } catch (error) {
        console.error('❌ Erro na inicialização:', error);
      }
    };

    initialize();
  }, [stepNumber, debugMode]);

  // 📊 LOADING STATE
  const isLoading = editorLoading || quizLoading || funnelLoading || !isInitialized;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <div className="text-sm text-muted-foreground">
            Carregando Editor Unificado (Clean Architecture)...
          </div>
        </div>
      </div>
    );
  }

  // Note: Error state handling removed as EditorProvider doesn't expose error in interface
  // TODO: Add error handling when needed

  // 🎯 HANDLERS
  const handleBlockAdd = async (blockType: string, content: any) => {
    try {
      await addBlock(blockType, content);
      if (debugMode) {
        console.log('✅ Bloco adicionado:', blockType);
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar bloco:', error);
    }
  };

  const handleBlockSelect = (blockId: string) => {
    selectBlock(blockId);
    if (debugMode) {
      console.log('✅ Bloco selecionado:', blockId);
    }
  };

  const handleStepChange = async (newStep: number) => {
    try {
      // TODO: Implementar lógica de navegação entre steps
      onStepChange?.(newStep.toString());
      if (debugMode) {
        console.log('✅ Step alterado:', newStep);
      }
    } catch (error) {
      console.error('❌ Erro ao alterar step:', error);
    }
  };

  return (
    <div className={cn('h-full w-full flex flex-col', className)}>
      {/* 🎯 HEADER COM STATUS */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Editor Unificado</h1>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Clean Architecture
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Step {stepNumber}/21</span>
          <span>•</span>
          <span>{blocks?.length || 0} blocos</span>
          {selectedBlocks.length > 0 && (
            <>
              <span>•</span>
              <span className="text-primary">Selecionados: {selectedBlocks.length}</span>
            </>
          )}
        </div>
      </div>

      {/* 🎯 CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex">
        {/* 📝 SIDEBAR DE COMPONENTES */}
        <div className="w-64 border-r bg-muted/20 p-4">
          <h3 className="font-medium mb-4">Componentes</h3>
          <div className="space-y-2">
            {['text', 'button', 'image', 'form'].map((type) => (
              <button
                key={type}
                onClick={() => handleBlockAdd(type, {})}
                className="w-full p-2 text-left hover:bg-muted rounded-lg transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 🎨 CANVAS PRINCIPAL */}
        <div className="flex-1 p-4">
          <div className="h-full border border-dashed border-muted-foreground/20 rounded-lg p-4">
            {!blocks || blocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">Canvas vazio</div>
                  <div className="text-sm">Adicione componentes da sidebar</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block: Block) => (
                  <div
                    key={block.id}
                    onClick={() => handleBlockSelect(block.id)}
                    className={cn(
                      'p-4 border rounded-lg cursor-pointer transition-colors',
                      selectedBlocks.includes(block.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/40'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{block.type}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ⚙️ PROPERTIES PANEL */}
        <div className="w-64 border-l bg-muted/20 p-4">
          <h3 className="font-medium mb-4">Propriedades</h3>
          {selectedBlocks.length > 0 ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Selecionados</label>
                <div className="text-sm text-muted-foreground">{selectedBlocks.length} bloco(s)</div>
              </div>
              {selectedBlocks.length === 1 && (
                <div>
                  <label className="text-sm font-medium">ID</label>
                  <div className="text-xs text-muted-foreground">{selectedBlocks[0]}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Selecione um bloco para ver suas propriedades
            </div>
          )}
        </div>
      </div>

      {/* 🎯 FOOTER COM CONTROLES DE STEP */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleStepChange(Math.max(1, stepNumber - 1))}
            disabled={stepNumber <= 1}
            className="px-4 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 rounded-lg"
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: 21 }, (_, i) => i + 1).map((step) => (
              <button
                key={step}
                onClick={() => handleStepChange(step)}
                className={cn(
                  'w-8 h-8 rounded-full text-sm',
                  step === stepNumber
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                )}
              >
                {step}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleStepChange(Math.min(21, stepNumber + 1))}
            disabled={stepNumber >= 21}
            className="px-4 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 rounded-lg"
          >
            Próximo →
          </button>
        </div>
      </div>

      {/* 🐛 DEBUG INFO */}
      {debugMode && (
        <div className="fixed bottom-4 right-4 p-3 bg-black/80 text-white text-xs rounded-lg max-w-sm">
          <div>Clean Architecture: ✅</div>
          <div>Step: {stepNumber}/21</div>
          <div>Blocks: {blocks?.length || 0}</div>
          <div>Funnel: {funnel?.id || 'N/A'}</div>
          {featureFlags.useCleanArchitecture && <div>🚩 New Architecture</div>}
        </div>
      )}
    </div>
  );
};

/**
 * 🏗️ COMPONENTE PRINCIPAL COM PROVIDER
 */
export const MainEditorUnified: React.FC<MainEditorUnifiedProps> = (props) => {
  return (
    <CleanArchitectureProvider
      enableCleanArchitecture={true}
      debugMode={props.debugMode}
      fallbackToLegacy={true}
    >
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <MainEditorUnifiedInternal {...props} />
      </Suspense>
    </CleanArchitectureProvider>
  );
};

export default MainEditorUnified;