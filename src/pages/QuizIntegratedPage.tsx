import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import { Quiz21StepsNavigation } from '@/components/quiz/Quiz21StepsNavigation';
import { Quiz21StepsProvider, useQuiz21Steps } from '@/components/quiz/Quiz21StepsProvider';
import { EditorProvider, useEditor } from '@/context/EditorContext';
import { EditorQuizProvider } from '@/context/EditorQuizContext';
import { FunnelsProvider } from '@/context/FunnelsContext';
import React from 'react';

/**
 * 🎯 COMPONENTE PRINCIPAL DO QUIZ INTEGRADO
 *
 * Características:
 * - Navegação completa das 21 etapas
 * - Renderização via template system
 * - Experiência idêntica ao editor
 * - Persistência de dados
 */
const QuizIntegratedRenderer: React.FC = () => {
  // Hooks devem estar dentro dos providers corretos
  const editorContext = React.useMemo(() => {
    try {
      return useEditor();
    } catch (error) {
      console.warn('EditorContext não disponível:', error);
      return {
        computed: { currentBlocks: [] },
        blockActions: {
          setSelectedBlockId: () => {},
          updateBlock: () => Promise.resolve(),
          deleteBlock: () => {},
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

  const {
    computed: { currentBlocks },
    blockActions: { setSelectedBlockId, updateBlock, deleteBlock },
  } = editorContext;

  const { currentStep } = quizContext;

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este bloco?')) {
      deleteBlock(blockId);
      setSelectedBlockId(null);
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
      />

      {/* 🎨 ÁREA DE RENDERIZAÇÃO DO QUIZ */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 📋 HEADER COM INFORMAÇÕES DA ETAPA */}
          <div className="text-center mb-8">
            <div className="text-sm text-stone-500 mb-2">Etapa {currentStep} de 21</div>
            <h1 className="text-2xl font-bold text-stone-800 mb-4">Quiz de Estilo Pessoal</h1>
            <p className="text-stone-600">
              Responda com sinceridade para descobrir seu estilo predominante
            </p>
          </div>

          {/* 🎨 CANVAS DE RENDERIZAÇÃO */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20 min-h-[600px] p-8">
            <CanvasDropZone
              blocks={currentBlocks}
              onSelectBlock={id => setSelectedBlockId(id)}
              selectedBlockId={null}
              onUpdateBlock={updateBlock}
              onDeleteBlock={handleDeleteBlock}
            />
          </div>

          {/* 📊 FOOTER COM ESTATÍSTICAS */}
          <div className="text-center mt-8 text-sm text-stone-500">
            <div className="flex justify-center items-center space-x-6">
              <div>🎯 Etapa: {currentStep}/21</div>
              <div>📊 Progresso: {Math.round((currentStep / 21) * 100)}%</div>
              <div>🎨 Blocos: {currentBlocks.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 🎯 PÁGINA PRINCIPAL DO QUIZ COM PROVIDERS
 *
 * Estrutura de Providers:
 * 1. FunnelsProvider - Dados das 21 etapas
 * 2. EditorProvider - Sistema de blocos
 * 3. EditorQuizProvider - Lógica de quiz
 * 4. Quiz21StepsProvider - Navegação integrada
 */
const QuizPage: React.FC = () => {
  return (
    <FunnelsProvider debug={true}>
      <EditorProvider>
        <EditorQuizProvider>
          <Quiz21StepsProvider debug={true} initialStep={1}>
            <QuizIntegratedRenderer />
          </Quiz21StepsProvider>
        </EditorQuizProvider>
      </EditorProvider>
    </FunnelsProvider>
  );
};

export default QuizPage;
