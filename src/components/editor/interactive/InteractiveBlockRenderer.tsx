import { Block } from '@/types/editor';
import { ValidationResult } from '@/types/validation';
import React, { memo } from 'react';

interface QuizContext {
  userName?: string;
  currentStep: number;
  scores: Record<string, number>;
  totalAnswers: number;
}

interface InteractiveBlockRendererProps {
  block: Block;
  onAnswer: (answer: {
    questionId: string;
    selectedOptions: string[];
    validation: ValidationResult;
    scoreValues?: Record<string, number>;
  }) => void;
  selectedAnswers: string[];
  isLiveMode: boolean;
  quizContext: QuizContext;
}

/**
 * 🎯 RENDERIZADOR DE BLOCOS INTERATIVO
 *
 * Renderiza blocos do editor como componentes interativos baseado no tipo:
 * - options-grid: Grade de opções clicáveis
 * - input-field: Campo de input funcional
 * - text/headline: Conteúdo estático com contexto
 */
export const InteractiveBlockRenderer: React.FC<InteractiveBlockRendererProps> = memo(
  ({ block, onAnswer, selectedAnswers, isLiveMode, quizContext }) => {
    console.log('🎨 Rendering interactive block:', {
      type: block.type,
      id: block.id,
      isLiveMode,
      hasProperties: !!block.properties,
    });

    // Renderizar baseado no tipo do bloco
    switch (block.type) {
      case 'quiz-question-inline':
        // Temporário: renderizar como opções por enquanto
        return (
          <div className="interactive-question-grid p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {block.content?.question || 'Pergunta não definida'}
            </h3>

            {block.content?.options && Array.isArray(block.content.options) ? (
              <div className="grid gap-3">
                {block.content.options.map((option: any, index: number) => (
                  <button
                    key={option.id || index}
                    className={`p-3 text-left border rounded-lg transition-colors ${
                      selectedAnswers.includes(option.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => {
                      if (!isLiveMode) return;

                      const newSelection = selectedAnswers.includes(option.id)
                        ? selectedAnswers.filter(id => id !== option.id)
                        : [...selectedAnswers, option.id];

                      onAnswer({
                        questionId: block.properties?.questionId || block.id,
                        selectedOptions: newSelection,
                        validation: { success: newSelection.length > 0, errors: [] },
                      });
                    }}
                  >
                    {option.text || option.label || `Opção ${index + 1}`}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma opção configurada</p>
            )}
          </div>
        );

      case 'input-field':
      case 'form-input':
        return (
          <div className="interactive-input-field p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {block.content?.label || block.properties?.label || 'Campo de entrada'}
            </label>
            <input
              type="text"
              value={selectedAnswers[0] || ''}
              onChange={e => {
                if (!isLiveMode) return;

                onAnswer({
                  questionId: block.properties?.questionId || block.id,
                  selectedOptions: [e.target.value],
                  validation: {
                    isValid: e.target.value.trim().length > 0,
                    errors: [],
                    warnings: [],
                  },
                });
              }}
              placeholder={
                block.content?.placeholder ||
                block.properties?.placeholder ||
                'Digite sua resposta...'
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isLiveMode}
            />
          </div>
        );

      case 'headline':
      case 'text':
        return (
          <div className="static-content">
            {block.type === 'headline' && (
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {block.content?.text || block.content?.title || 'Título'}
              </h2>
            )}
            {block.type === 'text' && (
              <p className="text-gray-700 leading-relaxed">
                {block.content?.text || 'Texto não definido'}
              </p>
            )}
          </div>
        );

      case 'image':
      case 'image-inline':
        return (
          <div className="interactive-image">
            <img
              src={block.content?.imageUrl || block.content?.src || block.properties?.src}
              alt={block.content?.alt || 'Quiz image'}
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
            {block.content?.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center">{block.content.caption}</p>
            )}
          </div>
        );

      case 'spacer':
      case 'spacer-inline':
        return (
          <div
            className="spacer"
            style={{
              height: block.properties?.height || 20,
              width: '100%',
            }}
          />
        );

      case 'button':
      case 'button-inline':
        return (
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!isLiveMode}
            onClick={() => {
              if (isLiveMode) {
                console.log('Button clicked:', block.content?.text);
              }
            }}
          >
            {block.content?.text || block.properties?.text || 'Botão'}
          </button>
        );

      default:
        // Renderizador genérico para tipos não reconhecidos
        return (
          <div className="unknown-block p-4 border border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <h4 className="font-semibold mb-2">Bloco: {block.type}</h4>
              <p className="text-sm mb-3">Tipo não implementado para modo interativo</p>

              {/* Mostrar conteúdo disponível */}
              {block.content && (
                <div className="text-left bg-gray-50 p-3 rounded text-xs">
                  <strong>Conteúdo:</strong>
                  <pre className="mt-1 whitespace-pre-wrap">
                    {JSON.stringify(block.content, null, 2)}
                  </pre>
                </div>
              )}

              {/* Mostrar propriedades */}
              {block.properties && Object.keys(block.properties).length > 0 && (
                <div className="text-left bg-gray-50 p-3 rounded text-xs mt-2">
                  <strong>Propriedades:</strong>
                  <pre className="mt-1 whitespace-pre-wrap">
                    {JSON.stringify(block.properties, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        );
    }
  }
);
