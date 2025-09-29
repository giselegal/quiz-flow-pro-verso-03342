import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone.simple';
import { Quiz21StepsNavigation } from '@/components/quiz/Quiz21StepsNavigation';
import { QuizOptimizedRenderer } from '@/components/quiz/QuizOptimizedRenderer';
import { FunnelMasterProvider, useQuiz21Steps } from '@/providers/FunnelMasterProvider';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { EditorProvider } from '@/components/editor/EditorProvider';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';

/**
 * 🎯 COMPONENTE PRINCIPAL DO QUIZ INTEGRADO COM BACKEND COMPLETO
 *
 * Características:
 * - Navegação completa das 21 etapas
 * - Renderização via template system
 * - Backend integration (monitoring, AI, analytics)
 * - Experiência idêntica ao editor
 * - Persistência de dados em tempo real
 */
const QuizIntegratedRenderer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'standard' | 'optimized'>('optimized');
  // Hooks devem estar dentro dos providers corretos
  const editorContext = React.useMemo(() => {
    try {
      return useEditor();
    } catch (error) {
      console.warn('EditorContext não disponível:', error);
      return {
        state: { stepBlocks: { 'step-1': [] } },
        actions: {
          setSelectedBlockId: () => { },
          updateBlock: () => Promise.resolve(),
          deleteBlock: () => { },
        },
        computed: { currentBlocks: [] },
        blockActions: {
          setSelectedBlockId: () => { },
          updateBlock: () => Promise.resolve(),
          deleteBlock: () => { },
        },
      };
    }
  }, []);

  const quizContext = React.useMemo(() => {
    try {
      return useQuiz21Steps();
    } catch (error) {
      console.warn('Quiz21StepsContext não disponível:', error);
      return { currentStep: 1 };
    }
  }, []);

  const computed = (editorContext as any)?.computed || { currentBlocks: [] };
  const blockActions = (editorContext as any)?.blockActions || { 
    setSelectedBlockId: () => {}, 
    updateBlock: () => Promise.resolve(), 
    deleteBlock: () => {} 
  };

  const { currentStep } = quizContext;

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este bloco?')) {
      if (blockActions?.deleteBlock) blockActions.deleteBlock(blockId);
      if (blockActions?.setSelectedBlockId) blockActions.setSelectedBlockId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
      {/* 🎯 NAVEGAÇÃO DAS 21 ETAPAS */}
      <Quiz21StepsNavigation
        position="sticky"
        variant="full"
        showProgress={true}
        showControls={true}
        showBackendStatus={true}
        funnelId="quiz-21-steps-integrated"
      />

      {/* 🎨 ÁREA DE RENDERIZAÇÃO DO QUIZ */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 📋 HEADER COM SELETOR DE MODO */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-sm text-stone-500 mb-2">Etapa {currentStep} de 21</div>
              <h1 className="text-2xl font-bold text-stone-800 mb-2">Quiz de Estilo Pessoal</h1>
              <p className="text-stone-600">
                Responda com sinceridade para descobrir seu estilo predominante
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setViewMode('standard')} 
                variant={viewMode === 'standard' ? 'default' : 'outline'}
                size="sm"
              >
                Standard
              </Button>
              <Button 
                onClick={() => setViewMode('optimized')} 
                variant={viewMode === 'optimized' ? 'default' : 'outline'}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              >
                Backend Integrated
              </Button>
            </div>
          </div>

          {/* 🎨 RENDERIZAÇÃO BASEADA NO MODO */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'standard' | 'optimized')}>
            <TabsContent value="standard">
              {/* MODO PADRÃO - Canvas Simples */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20 min-h-[600px] p-8">
                <CanvasDropZone
                  blocks={computed?.currentBlocks || []}
                  onSelectBlock={(id: string) => blockActions?.setSelectedBlockId && blockActions.setSelectedBlockId(id)}
                  selectedBlockId={null}
                  onUpdateBlock={blockActions?.updateBlock || (() => Promise.resolve())}
                  onDeleteBlock={handleDeleteBlock}
                  scopeId={currentStep}
                />
              </div>
              
              {/* 📊 FOOTER BÁSICO */}
              <div className="text-center mt-8 text-sm text-stone-500">
                <div className="flex justify-center items-center space-x-6">
                  <div>🎯 Etapa: {currentStep}/21</div>
                  <div>📊 Progresso: {Math.round((currentStep / 21) * 100)}%</div>
                  <div>🎨 Blocos: {computed?.currentBlocks?.length || 0}</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="optimized">
              {/* MODO OTIMIZADO - Backend Integration */}
              <QuizOptimizedRenderer
                funnelId="quiz-21-steps-integrated"
                showBackendPanel={true}
                showAnalytics={true}
                className="w-full"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

/**
 * 🎯 PÁGINA PRINCIPAL DO QUIZ COM PROVIDERS CONSOLIDADOS
 *
 * Estrutura de Providers (SIMPLIFICADA):
 * 1. FunnelMasterProvider - Consolida todas as funcionalidades (funis, quiz, steps)
 * 2. EditorProvider - Sistema de blocos (mantido)
 */
const QuizPage: React.FC = () => {
  return (
    <FunnelMasterProvider
      debugMode={true}
      enableCache={true}
    >
      <EditorProvider>
        <QuizIntegratedRenderer />
      </EditorProvider>
    </FunnelMasterProvider>
  );
};

export default QuizPage;
