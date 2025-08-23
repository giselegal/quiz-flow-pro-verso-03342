import { QuizRenderer } from '@/components/core/QuizRenderer';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import React, { useCallback, useState } from 'react';

interface QuizEditorCompleteProps {
  className?: string;
}

/**
 * 🎯 EDITOR COMPLETO COM TEMPLATE 21 ETAPAS
 *
 * Integra o template completo de 1931 linhas com:
 * - Sistema de blocos Block com cálculo de resultados
 * - Componentes: quiz-intro-header, options-grid, form-container, text, quiz-offer-cta-inline
 * - Lógica de funil com etapas estratégicas (13-18) e resultado personalizado (20)
 * - Preview 100% idêntico à produção
 */
export const QuizEditorComplete: React.FC<QuizEditorCompleteProps> = ({ className = '' }) => {
  const [mode, setMode] = useState<'editor' | 'preview'>('preview');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Dados do template completo
  const templateData = QUIZ_STYLE_21_STEPS_TEMPLATE;
  const currentStepData = templateData[`step-${currentStep}`] || [];

  const toggleMode = () => {
    setMode(mode === 'editor' ? 'preview' : 'editor');
  };

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
    setSelectedBlockId(null); // Reset seleção ao mudar etapa
    console.log(`Editor Completo - Etapa ${step}`);
  }, []);

  const handleBlockClick = useCallback(
    (blockId: string) => {
      if (mode === 'editor') {
        setSelectedBlockId(blockId);
        console.log('Block selecionado:', blockId);
      }
    },
    [mode]
  );

  // Propriedades do bloco selecionado
  const selectedBlock = currentStepData.find((block: Block) => block.id === selectedBlockId);

  // Tipos de componentes disponíveis no template
  const availableComponents = [
    {
      type: 'quiz-intro-header',
      name: 'Header do Quiz',
      description: 'Cabeçalho com título e descrição',
    },
    {
      type: 'options-grid',
      name: 'Grade de Opções',
      description: 'Grid de opções para questões',
    },
    {
      type: 'form-container',
      name: 'Container de Formulário',
      description: 'Campo de entrada de nome',
    },
    {
      type: 'text',
      name: 'Texto',
      description: 'Bloco de texto simples',
    },
    {
      type: 'quiz-offer-cta-inline',
      name: 'CTA da Oferta',
      description: 'Call-to-action inline',
    },
    {
      type: 'button',
      name: 'Botão',
      description: 'Botão de ação',
    },
    {
      type: 'testimonials',
      name: 'Depoimentos',
      description: 'Lista de depoimentos',
    },
    {
      type: 'guarantee',
      name: 'Garantia',
      description: 'Selo de garantia',
    },
  ];

  // Análise da lógica de cálculo
  const getStepAnalysis = (step: number) => {
    if (step === 1) return '📝 Captura de nome (form-container)';
    if (step >= 2 && step <= 11)
      return '🎯 Questões de pontuação (options-grid com lógica de estilo)';
    if (step === 12) return '🔄 Transição para questões estratégicas';
    if (step >= 13 && step <= 18) return '📊 Questões estratégicas (tracking sem pontuação)';
    if (step === 19) return '⏳ Calculando resultado (loading)';
    if (step === 20) return '🎉 Resultado personalizado (baseado no cálculo q1-q10)';
    if (step === 21) return '💰 Oferta direta (quiz-offer-cta-inline)';
    return '❓ Etapa não identificada';
  };

  return (
    <div className={`quiz-editor-complete min-h-screen bg-gray-50 ${className}`}>
      {/* Header do Editor */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz Editor Completo</h1>
              <p className="text-sm text-gray-600 mt-1">
                Template 21 etapas • {Object.keys(templateData).length} etapas configuradas •
                Sistema de cálculo integrado
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Navegação de etapas */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStepChange(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  ← Anterior
                </button>

                <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded">
                  {currentStep} / 21
                </span>

                <button
                  onClick={() => handleStepChange(Math.min(21, currentStep + 1))}
                  disabled={currentStep === 21}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Próxima →
                </button>
              </div>

              {/* Toggle de modo */}
              <button
                onClick={toggleMode}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'preview' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {mode === 'preview' ? '👁️ Preview' : '✏️ Editor'}
              </button>

              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
                💾 Salvar
              </button>
            </div>
          </div>

          {/* Análise da etapa atual */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-blue-900">Etapa {currentStep}:</strong>
                <span className="text-blue-800 ml-2">{getStepAnalysis(currentStep)}</span>
              </div>
              <div className="text-sm text-blue-700">
                {currentStepData.length} blocos configurados
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Painel Lateral - Apenas no modo editor */}
        {mode === 'editor' && (
          <aside className="w-80 bg-white border-r overflow-y-auto">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-4">Componentes do Template</h3>

              {/* Lista de componentes disponíveis */}
              <div className="space-y-2 mb-8">
                {availableComponents.map(component => (
                  <div
                    key={component.type}
                    className="p-3 bg-gray-50 rounded-lg border hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <div className="font-medium text-gray-900">{component.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{component.description}</div>
                    <div className="text-xs text-blue-600 mt-1 font-mono">{component.type}</div>
                  </div>
                ))}
              </div>

              {/* Blocos da etapa atual */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-3">Blocos da Etapa {currentStep}</h4>
                <div className="space-y-2">
                  {currentStepData.map((block: Block, index: number) => (
                    <div
                      key={block.id || index}
                      onClick={() => handleBlockClick(block.id || `block-${index}`)}
                      className={`p-3 rounded border cursor-pointer transition-colors ${
                        selectedBlockId === block.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{block.type}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Ordem: {block.order || index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Propriedades do bloco selecionado */}
              {selectedBlock && (
                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold mb-3">Propriedades</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo</label>
                      <input
                        type="text"
                        value={selectedBlock.type}
                        readOnly
                        className="w-full px-3 py-2 border rounded bg-gray-50 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">ID</label>
                      <input
                        type="text"
                        value={selectedBlock.id}
                        readOnly
                        className="w-full px-3 py-2 border rounded bg-gray-50 text-sm"
                      />
                    </div>

                    {selectedBlock.properties && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Propriedades</label>
                        <textarea
                          value={JSON.stringify(selectedBlock.properties, null, 2)}
                          readOnly
                          className="w-full px-3 py-2 border rounded bg-gray-50 text-xs font-mono"
                          rows={6}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Área Principal */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Modo Preview - Renderer funcional */}
            {mode === 'preview' && (
              <div className="preview-container">
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-medium">🎯 Preview Funcional</p>
                      <p className="text-green-700 text-sm mt-1">
                        Visualização idêntica à produção com lógica de cálculo integrada
                      </p>
                    </div>
                    <div className="text-sm text-green-700">
                      Template completo • {currentStepData.length} blocos
                    </div>
                  </div>
                </div>

                <QuizRenderer
                  mode="preview"
                  onStepChange={handleStepChange}
                  initialStep={currentStep}
                />
              </div>
            )}

            {/* Modo Editor - Com controles de edição */}
            {mode === 'editor' && (
              <div className="editor-container">
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-800 font-medium">✏️ Modo de Edição</p>
                      <p className="text-blue-700 text-sm mt-1">
                        Clique nos blocos para editar • Template com lógica de funil integrada
                      </p>
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedBlockId
                        ? `Selecionado: ${selectedBlockId}`
                        : 'Nenhum bloco selecionado'}
                    </div>
                  </div>
                </div>

                {/* Informações da lógica de cálculo */}
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">
                    🧮 Lógica de Cálculo do Quiz
                  </h4>
                  <div className="text-sm text-amber-800 space-y-1">
                    <p>
                      <strong>• Etapas 2-11:</strong> Questões de pontuação (q1-q10) → Cálculo do
                      estilo principal
                    </p>
                    <p>
                      <strong>• Etapas 13-18:</strong> Questões estratégicas → Tracking sem
                      pontuação
                    </p>
                    <p>
                      <strong>• Etapa 20:</strong> Resultado personalizado baseado no cálculo das
                      etapas 2-11
                    </p>
                    <p>
                      <strong>• Etapa 21:</strong> Oferta direcionada com base no resultado
                    </p>
                  </div>
                </div>

                <QuizRenderer
                  mode="editor"
                  onStepChange={handleStepChange}
                  initialStep={currentStep}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <footer className="bg-white border-t px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>
              Modo:{' '}
              <strong className={mode === 'preview' ? 'text-green-700' : 'text-blue-700'}>
                {mode === 'preview' ? 'Preview' : 'Edição'}
              </strong>
            </span>
            <span>
              Template: <strong>21 Etapas Completo</strong>
            </span>
            <span>
              Blocos: <strong>{currentStepData.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>
              Etapa: <strong>{currentStep}/21</strong>
            </span>
            <span className="text-green-600">✅ Template carregado</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuizEditorComplete;
