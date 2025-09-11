# 💡 Exemplos Práticos de Componentes - Quiz Quest Challenge Verse

## 📋 Índice
1. [Editor Components](#editor-components)
2. [Block Components](#block-components)
3. [Context Usage](#context-usage)
4. [Custom Hooks](#custom-hooks)
5. [Property Panels](#property-panels)
6. [Stage Navigation](#stage-navigation)
7. [Template System](#template-system)
8. [Performance Patterns](#performance-patterns)

---

## ✏️ Editor Components

### **1. Criando um Editor Personalizado**

```typescript
// src/components/editor/MyCustomEditor.tsx
import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useUnifiedFunnel } from '@/context/UnifiedFunnelContext';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface MyCustomEditorProps {
  templateId?: string;
  funnelId?: string;
  onSave?: (data: any) => void;
  className?: string;
}

export const MyCustomEditor: React.FC<MyCustomEditorProps> = ({
  templateId,
  funnelId,
  onSave,
  className = ''
}) => {
  // 🎯 Estados locais
  const [isInitialized, setIsInitialized] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // 🔗 Contextos
  const {
    stepBlocks,
    activeStageId,
    selectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    setActiveStage,
    exportProject,
    isLoading: editorLoading
  } = useEditor();

  const {
    funnel,
    saveFunnel,
    isLoading: funnelLoading
  } = useUnifiedFunnel();

  // 🎯 Estados derivados
  const isLoading = editorLoading || funnelLoading;
  const currentBlocks = stepBlocks[activeStageId] || [];
  const selectedBlock = currentBlocks.find(block => block.id === selectedBlockId);

  // 🚀 Inicialização
  useEffect(() => {
    const initializeEditor = async () => {
      try {
        console.log('🚀 Inicializando MyCustomEditor...');
        
        // Carregar template se especificado
        if (templateId) {
          await loadTemplate(templateId);
        }

        // Configurar etapa inicial
        if (!activeStageId) {
          setActiveStage('step-1');
        }

        setIsInitialized(true);
        console.log('✅ MyCustomEditor inicializado');
      } catch (error) {
        console.error('❌ Erro na inicialização:', error);
      }
    };

    initializeEditor();
  }, [templateId, activeStageId, setActiveStage]);

  // 💾 Auto-save
  useEffect(() => {
    if (!isInitialized) return;

    const autoSaveTimer = setTimeout(async () => {
      if (saveStatus === 'idle') {
        await handleAutoSave();
      }
    }, 3000); // Auto-save a cada 3 segundos

    return () => clearTimeout(autoSaveTimer);
  }, [stepBlocks, isInitialized, saveStatus]);

  // 📥 Carregar template
  const loadTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`);
      const template = await response.json();
      
      // Aplicar dados do template
      Object.entries(template.stages).forEach(([stageId, stageData]: [string, any]) => {
        stageData.blocks.forEach((blockData: any) => {
          addBlock(blockData.type, stageId, blockData.properties);
        });
      });
      
      console.log(`✅ Template ${templateId} carregado`);
    } catch (error) {
      console.error(`❌ Erro ao carregar template ${templateId}:`, error);
    }
  };

  // 💾 Auto-save
  const handleAutoSave = async () => {
    setSaveStatus('saving');
    
    try {
      const projectData = exportProject();
      
      // Salvar localmente
      localStorage.setItem('editor-autosave', JSON.stringify({
        data: projectData,
        timestamp: Date.now(),
        funnelId
      }));

      // Salvar no servidor se disponível
      if (saveFunnel) {
        await saveFunnel();
      }

      // Callback personalizado
      if (onSave) {
        onSave(projectData);
      }

      setSaveStatus('saved');
      
      // Reset status após 2 segundos
      setTimeout(() => setSaveStatus('idle'), 2000);
      
    } catch (error) {
      console.error('❌ Erro no auto-save:', error);
      setSaveStatus('error');
      
      // Reset status após 5 segundos
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  // 🎨 Adicionar bloco personalizado
  const handleAddCustomBlock = (blockType: string) => {
    const customProperties = getDefaultPropertiesForType(blockType);
    
    addBlock(blockType, activeStageId, customProperties);
    
    // Analytics
    trackBlockAdded(blockType, activeStageId);
  };

  // 🎯 Propriedades padrão por tipo
  const getDefaultPropertiesForType = (type: string): Record<string, any> => {
    const defaults: Record<string, any> = {
      'text': {
        content: 'Digite seu texto aqui...',
        fontSize: 16,
        color: '#000000',
        textAlign: 'left'
      },
      'button': {
        text: 'Clique aqui',
        style: 'primary',
        action: 'next',
        size: 'medium'
      },
      'quiz-question': {
        question: 'Digite sua pergunta...',
        options: ['Opção 1', 'Opção 2'],
        correctAnswer: 0,
        points: 1
      },
      'image': {
        src: '',
        alt: 'Descrição da imagem',
        width: '100%',
        height: 'auto'
      }
    };

    return defaults[type] || {};
  };

  // 📊 Analytics
  const trackBlockAdded = (blockType: string, stageId: string) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'block_added', {
        block_type: blockType,
        stage_id: stageId,
        editor_type: 'custom'
      });
    }
  };

  // 🎨 Render loading
  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Carregando editor personalizado...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={<div>Erro no editor personalizado</div>}
      onError={(error) => console.error('Editor error:', error)}
    >
      <div className={`custom-editor-container ${className}`}>
        {/* 📊 Status Bar */}
        <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Etapa: {activeStageId}
            </span>
            <span className="text-sm text-gray-600">
              Blocos: {currentBlocks.length}
            </span>
            {selectedBlock && (
              <span className="text-sm text-blue-600">
                Selecionado: {selectedBlock.type}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Status de save */}
            <div className="flex items-center gap-1 text-sm">
              {saveStatus === 'saving' && (
                <>
                  <LoadingSpinner size="xs" />
                  <span className="text-blue-600">Salvando...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <span className="text-green-600">✅ Salvo</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-600">❌ Erro ao salvar</span>
              )}
            </div>
          </div>
        </div>

        {/* 🎛️ Toolbar */}
        <div className="border-b bg-white px-4 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddCustomBlock('text')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              📝 Texto
            </button>
            <button
              onClick={() => handleAddCustomBlock('button')}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              🔘 Botão
            </button>
            <button
              onClick={() => handleAddCustomBlock('quiz-question')}
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
            >
              ❓ Pergunta
            </button>
            <button
              onClick={() => handleAddCustomBlock('image')}
              className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
            >
              🖼️ Imagem
            </button>
          </div>
        </div>

        {/* 🎨 Canvas Principal */}
        <div className="flex-1 p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow min-h-96 p-4">
            {currentBlocks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">Canvas vazio</p>
                <p className="text-sm">Adicione blocos usando a toolbar acima</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentBlocks.map(block => (
                  <CustomBlockRenderer
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onUpdate={(updates) => updateBlock(block.id, updates)}
                    onDelete={() => deleteBlock(block.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// 🎨 Renderer de blocos personalizado
const CustomBlockRenderer: React.FC<{
  block: any;
  isSelected: boolean;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onUpdate, onDelete }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Selecionar bloco (implementar via context)
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div 
            className="prose"
            style={{
              fontSize: block.properties.fontSize,
              color: block.properties.color,
              textAlign: block.properties.textAlign
            }}
          >
            {block.properties.content}
          </div>
        );

      case 'button':
        return (
          <button 
            className={`px-4 py-2 rounded ${
              block.properties.style === 'primary' ? 'bg-blue-500 text-white' :
              block.properties.style === 'secondary' ? 'bg-gray-500 text-white' :
              'border border-gray-300 text-gray-700'
            }`}
          >
            {block.properties.text}
          </button>
        );

      case 'quiz-question':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {block.properties.question}
            </h3>
            <div className="space-y-2">
              {block.properties.options.map((option: string, index: number) => (
                <label key={index} className="flex items-center gap-2">
                  <input type="radio" name={`question-${block.id}`} />
                  <span>{option}</span>
                  {index === block.properties.correctAnswer && (
                    <span className="text-green-600">✓</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="text-center">
            {block.properties.src ? (
              <img
                src={block.properties.src}
                alt={block.properties.alt}
                className="max-w-full h-auto"
                style={{
                  width: block.properties.width,
                  height: block.properties.height
                }}
              />
            ) : (
              <div className="bg-gray-200 p-8 rounded">
                <span className="text-gray-500">🖼️ Imagem não definida</span>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 p-4 rounded">
            Tipo desconhecido: {block.type}
          </div>
        );
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative p-4 border-2 rounded cursor-pointer transition-colors ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {renderBlockContent()}
      
      {/* 🎛️ Controles do bloco */}
      {isSelected && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Abrir painel de propriedades
            }}
            className="w-6 h-6 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            title="Deletar"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCustomEditor;
```

---

## 🧩 Block Components

### **2. Criando um Componente de Bloco Personalizado**

```typescript
// src/components/blocks/CustomQuizBlock.tsx
import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';

interface CustomQuizBlockProps {
  blockId: string;
  data: {
    question: string;
    options: string[];
    correctAnswer: number;
    points: number;
    explanation?: string;
    timeLimit?: number;
  };
  isPreview?: boolean;
  onAnswer?: (answerIndex: number, isCorrect: boolean) => void;
}

export const CustomQuizBlock: React.FC<CustomQuizBlockProps> = ({
  blockId,
  data,
  isPreview = false,
  onAnswer
}) => {
  // 📊 Estados
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(data.timeLimit || 0);
  const [isAnswered, setIsAnswered] = useState(false);

  // 🔗 Context
  const { updateBlock } = useEditor();

  // ⏰ Timer para pergunta com tempo limite
  useEffect(() => {
    if (data.timeLimit && timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && data.timeLimit && !isAnswered) {
      // Tempo esgotado
      handleTimeUp();
    }
  }, [timeLeft, isAnswered, data.timeLimit]);

  // ⏰ Tempo esgotado
  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowExplanation(true);
    
    if (onAnswer) {
      onAnswer(-1, false); // -1 indica tempo esgotado
    }
  };

  // ✅ Resposta selecionada
  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const isCorrect = answerIndex === data.correctAnswer;
    
    // Mostrar explicação após um delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);

    // Callback para o parent
    if (onAnswer) {
      onAnswer(answerIndex, isCorrect);
    }

    // Atualizar estatísticas do bloco
    updateBlockStats(answerIndex, isCorrect);
  };

  // 📊 Atualizar estatísticas
  const updateBlockStats = (answerIndex: number, isCorrect: boolean) => {
    const stats = {
      totalAnswers: (data.stats?.totalAnswers || 0) + 1,
      correctAnswers: (data.stats?.correctAnswers || 0) + (isCorrect ? 1 : 0),
      answerDistribution: {
        ...(data.stats?.answerDistribution || {}),
        [answerIndex]: (data.stats?.answerDistribution?.[answerIndex] || 0) + 1
      },
      averageTimeToAnswer: calculateAverageTime(data.timeLimit ? data.timeLimit - timeLeft : 0)
    };

    updateBlock(blockId, {
      properties: {
        ...data,
        stats
      }
    });
  };

  // 📊 Calcular tempo médio
  const calculateAverageTime = (currentTime: number): number => {
    const previousAverage = data.stats?.averageTimeToAnswer || 0;
    const totalAnswers = data.stats?.totalAnswers || 0;
    
    return totalAnswers === 0 
      ? currentTime 
      : (previousAverage * totalAnswers + currentTime) / (totalAnswers + 1);
  };

  // 🎨 Render no modo de edição
  if (!isPreview) {
    return (
      <div className="quiz-block-editor p-4 border border-gray-300 rounded">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pergunta
          </label>
          <input
            type="text"
            value={data.question}
            onChange={(e) => updateBlock(blockId, {
              properties: { ...data, question: e.target.value }
            })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Digite sua pergunta..."
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opções de Resposta
          </label>
          {data.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name={`correct-${blockId}`}
                checked={data.correctAnswer === index}
                onChange={() => updateBlock(blockId, {
                  properties: { ...data, correctAnswer: index }
                })}
              />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...data.options];
                  newOptions[index] = e.target.value;
                  updateBlock(blockId, {
                    properties: { ...data, options: newOptions }
                  });
                }}
                className="flex-1 p-2 border border-gray-300 rounded"
                placeholder={`Opção ${index + 1}`}
              />
              {data.options.length > 2 && (
                <button
                  onClick={() => {
                    const newOptions = data.options.filter((_, i) => i !== index);
                    updateBlock(blockId, {
                      properties: { 
                        ...data, 
                        options: newOptions,
                        correctAnswer: data.correctAnswer > index ? data.correctAnswer - 1 : data.correctAnswer
                      }
                    });
                  }}
                  className="w-8 h-8 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={() => updateBlock(blockId, {
              properties: { 
                ...data, 
                options: [...data.options, `Nova opção ${data.options.length + 1}`]
              }
            })}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            + Adicionar Opção
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pontuação
            </label>
            <input
              type="number"
              value={data.points}
              onChange={(e) => updateBlock(blockId, {
                properties: { ...data, points: parseInt(e.target.value) || 0 }
              })}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tempo Limite (segundos)
            </label>
            <input
              type="number"
              value={data.timeLimit || ''}
              onChange={(e) => updateBlock(blockId, {
                properties: { ...data, timeLimit: e.target.value ? parseInt(e.target.value) : undefined }
              })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Sem limite"
              min="1"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Explicação (opcional)
          </label>
          <textarea
            value={data.explanation || ''}
            onChange={(e) => updateBlock(blockId, {
              properties: { ...data, explanation: e.target.value }
            })}
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
            placeholder="Explicação da resposta correta..."
          />
        </div>
      </div>
    );
  }

  // 🎨 Render no modo preview/interativo
  return (
    <div className="quiz-block-preview bg-white p-6 rounded-lg shadow">
      {/* ⏰ Timer */}
      {data.timeLimit && !isAnswered && (
        <div className="mb-4 text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded ${
            timeLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            ⏱️ {timeLeft}s
          </div>
        </div>
      )}

      {/* ❓ Pergunta */}
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        {data.question}
      </h3>

      {/* 📝 Opções */}
      <div className="space-y-3 mb-6">
        {data.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === data.correctAnswer;
          
          let buttonClass = 'w-full p-4 text-left border-2 rounded-lg transition-colors ';
          
          if (!isAnswered) {
            buttonClass += 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer';
          } else if (isSelected && isCorrect) {
            buttonClass += 'border-green-500 bg-green-50 text-green-800';
          } else if (isSelected && !isCorrect) {
            buttonClass += 'border-red-500 bg-red-50 text-red-800';
          } else if (isCorrect) {
            buttonClass += 'border-green-500 bg-green-50 text-green-800';
          } else {
            buttonClass += 'border-gray-300 bg-gray-50 text-gray-600';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isAnswered && (
                  <span className="text-lg">
                    {isSelected && isCorrect && '✅'}
                    {isSelected && !isCorrect && '❌'}
                    {!isSelected && isCorrect && '✅'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 📊 Feedback */}
      {isAnswered && (
        <div className="border-t pt-4">
          <div className={`p-3 rounded ${
            selectedAnswer === data.correctAnswer
              ? 'bg-green-100 text-green-800'
              : selectedAnswer === -1
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {selectedAnswer === data.correctAnswer && (
              <span>🎉 Correto! +{data.points} pontos</span>
            )}
            {selectedAnswer === -1 && (
              <span>⏰ Tempo esgotado!</span>
            )}
            {selectedAnswer !== data.correctAnswer && selectedAnswer !== -1 && (
              <span>❌ Incorreto. A resposta correta era: {data.options[data.correctAnswer]}</span>
            )}
          </div>
          
          {/* 💡 Explicação */}
          {showExplanation && data.explanation && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-semibold text-blue-900 mb-1">💡 Explicação:</h4>
              <p className="text-blue-800">{data.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 🏭 Factory para criar blocos de quiz
export const createQuizBlock = (question: string, options: string[]): any => {
  return {
    id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'custom-quiz',
    properties: {
      question,
      options,
      correctAnswer: 0,
      points: 1,
      explanation: '',
      timeLimit: undefined,
      stats: {
        totalAnswers: 0,
        correctAnswers: 0,
        answerDistribution: {},
        averageTimeToAnswer: 0
      }
    }
  };
};

export default CustomQuizBlock;
```

---

## 🔗 Context Usage

### **3. Hook Personalizado para Múltiplos Contextos**

```typescript
// src/hooks/useEditorState.ts
import { useContext, useMemo, useCallback } from 'react';
import { EditorContext } from '@/context/EditorContext';
import { UnifiedFunnelContext } from '@/context/UnifiedFunnelContext';
import { Quiz21StepsContext } from '@/context/Quiz21StepsContext';

/**
 * Hook unificado que combina múltiplos contextos do editor
 * Fornece uma interface simplificada e tipada para usar o editor
 */
export const useEditorState = () => {
  // 🔗 Contextos
  const editorContext = useContext(EditorContext);
  const funnelContext = useContext(UnifiedFunnelContext);
  const stepsContext = useContext(Quiz21StepsContext);

  // ✅ Validação de contextos
  if (!editorContext) {
    throw new Error('useEditorState deve ser usado dentro de EditorProvider');
  }

  // 🎯 Estado combinado
  const combinedState = useMemo(() => {
    const {
      stepBlocks,
      activeStageId,
      selectedBlockId,
      isLoading: editorLoading,
      isDirty,
      lastSaved
    } = editorContext;

    const currentStage = activeStageId;
    const currentBlocks = stepBlocks[activeStageId] || [];
    const selectedBlock = currentBlocks.find(block => block.id === selectedBlockId);
    
    // 📊 Estatísticas derivadas
    const stats = {
      totalBlocks: Object.values(stepBlocks).flat().length,
      blocksInCurrentStage: currentBlocks.length,
      stagesWithContent: Object.keys(stepBlocks).filter(
        stageId => stepBlocks[stageId].length > 0
      ).length,
      completionPercentage: calculateCompletionPercentage(stepBlocks)
    };

    return {
      // Estados básicos
      currentStage,
      currentBlocks,
      selectedBlock,
      isLoading: editorLoading || funnelContext?.isLoading || false,
      isDirty,
      lastSaved,
      
      // Estado do funil
      funnel: funnelContext?.funnel || null,
      canEdit: funnelContext?.canEdit ?? true,
      
      // Estado das etapas
      currentStep: stepsContext?.currentStep || 1,
      totalSteps: stepsContext?.totalSteps || 21,
      
      // Estatísticas
      stats,
      
      // Estados derivados
      hasUnsavedChanges: isDirty,
      canNavigateToStage: (stageId: string) => canNavigateToStage(stageId, stepBlocks),
      isStageComplete: (stageId: string) => isStageComplete(stageId, stepBlocks),
    };
  }, [editorContext, funnelContext, stepsContext]);

  // 🎯 Ações combinadas
  const actions = useMemo(() => {
    const {
      addBlock: addBlockToEditor,
      updateBlock: updateBlockInEditor,
      deleteBlock: deleteBlockFromEditor,
      setActiveStage: setActiveStageInEditor,
      exportProject,
      importProject
    } = editorContext;

    return {
      // Ações de bloco com validação
      addBlock: (type: string, stageId?: string, properties?: any) => {
        const targetStage = stageId || combinedState.currentStage;
        if (!canEditStage(targetStage)) {
          throw new Error(`Não é possível editar a etapa: ${targetStage}`);
        }
        return addBlockToEditor(type, targetStage, properties);
      },

      updateBlock: (blockId: string, updates: any) => {
        if (!combinedState.canEdit) {
          throw new Error('Usuário não tem permissão para editar');
        }
        return updateBlockInEditor(blockId, updates);
      },

      deleteBlock: (blockId: string) => {
        if (!combinedState.canEdit) {
          throw new Error('Usuário não tem permissão para editar');
        }
        return deleteBlockFromEditor(blockId);
      },

      // Navegação de etapas com validação
      navigateToStage: (stageId: string) => {
        if (!combinedState.canNavigateToStage(stageId)) {
          console.warn(`Navegação bloqueada para etapa: ${stageId}`);
          return false;
        }
        
        setActiveStageInEditor(stageId);
        
        // Sincronizar com contexto de steps se disponível
        if (stepsContext?.goToStep) {
          const stepNumber = parseInt(stageId.replace('step-', ''));
          stepsContext.goToStep(stepNumber);
        }
        
        return true;
      },

      // Ações de projeto
      exportProject: () => {
        const project = exportProject();
        return {
          ...project,
          metadata: {
            ...project.metadata,
            exportedAt: new Date().toISOString(),
            stats: combinedState.stats
          }
        };
      },

      importProject: (project: any) => {
        if (!combinedState.canEdit) {
          throw new Error('Usuário não tem permissão para editar');
        }
        
        return importProject(project);
      },

      // Ações de salvamento
      saveProject: async () => {
        if (funnelContext?.saveFunnel) {
          return await funnelContext.saveFunnel();
        }
        
        // Fallback para salvamento local
        const project = exportProject();
        localStorage.setItem('editor-project', JSON.stringify(project));
        return true;
      },

      // Ações de validação
      validateProject: () => validateProject(combinedState),
      
      // Reset de estado
      resetEditor: () => {
        if (window.confirm('Tem certeza que deseja resetar o editor? Todas as alterações não salvas serão perdidas.')) {
          // Implementar reset
          localStorage.removeItem('editor-project');
          window.location.reload();
        }
      }
    };
  }, [editorContext, funnelContext, stepsContext, combinedState]);

  // 🔍 Seletores úteis
  const selectors = useMemo(() => ({
    // Buscar blocos por tipo
    getBlocksByType: (type: string) => {
      return Object.values(combinedState.stepBlocks || {})
        .flat()
        .filter((block: any) => block.type === type);
    },

    // Buscar blocos por etapa
    getBlocksByStage: (stageId: string) => {
      return combinedState.stepBlocks?.[stageId] || [];
    },

    // Etapas vazias
    getEmptyStages: () => {
      const allStages = Array.from({ length: 21 }, (_, i) => `step-${i + 1}`);
      return allStages.filter(stageId => {
        const blocks = combinedState.stepBlocks?.[stageId] || [];
        return blocks.length === 0;
      });
    },

    // Próxima etapa disponível
    getNextStage: () => {
      const currentStepNum = parseInt(combinedState.currentStage.replace('step-', ''));
      const nextStepNum = currentStepNum + 1;
      return nextStepNum <= 21 ? `step-${nextStepNum}` : null;
    },

    // Etapa anterior disponível
    getPreviousStage: () => {
      const currentStepNum = parseInt(combinedState.currentStage.replace('step-', ''));
      const prevStepNum = currentStepNum - 1;
      return prevStepNum >= 1 ? `step-${prevStepNum}` : null;
    }
  }), [combinedState]);

  return {
    ...combinedState,
    actions,
    selectors
  };
};

// 🧮 Funções utilitárias
const calculateCompletionPercentage = (stepBlocks: Record<string, any[]>): number => {
  const totalStages = 21;
  const stagesWithContent = Object.keys(stepBlocks).filter(
    stageId => stepBlocks[stageId].length > 0
  ).length;
  
  return Math.round((stagesWithContent / totalStages) * 100);
};

const canNavigateToStage = (stageId: string, stepBlocks: Record<string, any[]>): boolean => {
  // Implementar lógica de navegação (ex: etapas sequenciais)
  return true; // Por enquanto, permite navegar para qualquer etapa
};

const isStageComplete = (stageId: string, stepBlocks: Record<string, any[]>): boolean => {
  const blocks = stepBlocks[stageId] || [];
  return blocks.length > 0;
};

const canEditStage = (stageId: string): boolean => {
  // Implementar lógica de permissões por etapa
  return true; // Por enquanto, permite editar qualquer etapa
};

const validateProject = (state: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validações básicas
  if (state.stats.totalBlocks === 0) {
    errors.push('Projeto não possui blocos');
  }

  if (state.stats.stagesWithContent === 0) {
    errors.push('Nenhuma etapa possui conteúdo');
  }

  // Validações específicas por etapa
  // ... implementar validações mais específicas

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 🎯 Hook para casos simples (apenas leitura)
export const useEditorStateReadOnly = () => {
  const { actions, ...state } = useEditorState();
  return state;
};

// 🎯 Hook para ações específicas
export const useEditorActions = () => {
  const { actions } = useEditorState();
  return actions;
};
```

---

Este documento continua fornecendo exemplos práticos e padrões para desenvolver componentes robustos no sistema Quiz Quest Challenge Verse! 🚀
