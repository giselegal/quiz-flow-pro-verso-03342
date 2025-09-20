import React from 'react';
import { useSimpleBuilder } from '@/components/editor/SimpleBuilderProviderFixed';

interface ModularEditorProSimpleProps {
  showProFeatures?: boolean;
}

const ModularEditorProSimple: React.FC<ModularEditorProSimpleProps> = ({ showProFeatures = true }) => {
  const { state, actions } = useSimpleBuilder();

  return (
    <div className="flex-1 flex bg-gray-50">
      {/* Left Sidebar - Steps */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Etapas</h2>
          <p className="text-sm text-gray-600">Total: {state.totalSteps}</p>
        </div>

        <div className="p-2">
          {Array.from({ length: state.totalSteps }, (_, i) => i + 1).map((step) => (
            <button
              key={step}
              onClick={() => actions.goToStep(step)}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${state.currentStep === step
                  ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-900'
                  : 'hover:bg-gray-50 text-gray-700'
                }`}
            >
              <div className="font-medium">Etapa {step}</div>
              <div className="text-xs text-gray-500">
                {state.steps[`step-${step}`]?.length || 0} componentes
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Etapa {state.currentStep}
              </h1>
              <p className="text-sm text-gray-600">
                {state.steps[`step-${state.currentStep}`]?.length || 0} componentes nesta etapa
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => actions.goToPreviousStep()}
                disabled={state.currentStep === 1}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              <button
                onClick={() => actions.goToNextStep()}
                disabled={state.currentStep === state.totalSteps}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo →
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {state.isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Componentes da Etapa {state.currentStep}
                  </h2>

                  {state.steps[`step-${state.currentStep}`]?.length > 0 ? (
                    <div className="space-y-4">
                      {state.steps[`step-${state.currentStep}`].map((block, index) => (
                        <div
                          key={block.id}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {block.type === 'multiple-choice' ? 'Múltipla Escolha' :
                                  block.type === 'single-choice' ? 'Escolha Única' :
                                    block.type === 'text-input' ? 'Entrada de Texto' :
                                      block.type === 'info-card' ? 'Card de Informação' :
                                        block.type === 'result-card' ? 'Card de Resultado' :
                                          block.type === 'offer-cta' ? 'Oferta CTA' :
                                            block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {block.content?.title || `Componente ${index + 1}`}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {block.type}
                              </span>
                              <button
                                onClick={() => actions.removeBlock(`step-${state.currentStep}`, block.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remover
                              </button>
                            </div>
                          </div>

                          {block.content && (
                            <div className="mt-2 text-sm text-gray-700">
                              {block.content.description && (
                                <p>{block.content.description}</p>
                              )}
                              {block.content.options?.length > 0 && (
                                <div className="mt-2">
                                  <p className="font-medium">Opções:</p>
                                  <ul className="list-disc list-inside text-gray-600">
                                    {block.content.options.map((option: any, i: number) => (
                                      <li key={i}>{option.text}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-5xl mb-4">📋</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum componente nesta etapa
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Esta etapa ainda não possui componentes. Use o painel de componentes para adicionar elementos.
                      </p>
                      {showProFeatures && (
                        <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                          💡 <strong>Editor Pro:</strong> Use os painéis laterais para adicionar componentes inteligentes com IA
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Components */}
      <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Componentes</h2>
          <p className="text-sm text-gray-600">Adicione à etapa atual</p>
        </div>

        <div className="p-2">
          {[
            { type: 'multiple-choice', title: 'Múltipla Escolha', icon: '☑️' },
            { type: 'single-choice', title: 'Escolha Única', icon: '🔘' },
            { type: 'text-input', title: 'Entrada de Texto', icon: '📝' },
            { type: 'info-card', title: 'Card de Info', icon: 'ℹ️' },
            { type: 'result-card', title: 'Card de Resultado', icon: '🎯' },
            { type: 'offer-cta', title: 'Oferta CTA', icon: '🚀' }
          ].map((component) => (
            <button
              key={component.type}
              onClick={() => {
                const newBlock = {
                  id: `block-${Date.now()}`,
                  type: component.type as any,
                  content: {
                    title: component.title,
                    description: `Novo ${component.title}`,
                  },
                  properties: {},
                  order: state.steps[`step-${state.currentStep}`]?.length || 0
                };

                actions.addBlock(`step-${state.currentStep}`, newBlock);
              }}
              className="w-full text-left p-3 rounded-lg mb-1 hover:bg-gray-50 text-gray-700 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{component.icon}</span>
                <div>
                  <div className="font-medium">{component.title}</div>
                  <div className="text-xs text-gray-500">{component.type}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModularEditorProSimple;