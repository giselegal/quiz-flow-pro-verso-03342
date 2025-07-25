// =============================================================================
// EDITOR DE PERGUNTAS COMPLETO
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Move, 
  Image, 
  Video, 
  Volume2,
  Eye,
  EyeOff,
  Check,
  X,
  Clock,
  HelpCircle,
  Settings
} from 'lucide-react';
import { Question, QuestionType } from '@/shared/types/supabase';

// =============================================================================
// INTERFACES
// =============================================================================

interface QuestionEditorProps {
  question: Question;
  questionIndex: number;
  onUpdate: (questionId: string, updates: Partial<Question>) => void;
  onDelete: (questionId: string) => void;
  onDuplicate: (questionId: string) => void;
  onMove: (questionId: string, direction: 'up' | 'down') => void;
}

interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

// =============================================================================
// TIPOS DE PERGUNTA DISPONÍVEIS
// =============================================================================

const QUESTION_TYPES: Array<{
  type: QuestionType;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    type: 'multiple_choice',
    label: 'Múltipla Escolha',
    description: 'Uma única resposta correta',
    icon: '🔘'
  },
  {
    type: 'multiple_answer',
    label: 'Múltiplas Respostas',
    description: 'Uma ou mais respostas corretas',
    icon: '☑️'
  },
  {
    type: 'true_false',
    label: 'Verdadeiro/Falso',
    description: 'Pergunta de verdadeiro ou falso',
    icon: '✅'
  },
  {
    type: 'text',
    label: 'Texto Livre',
    description: 'Resposta em texto livre',
    icon: '📝'
  },
  {
    type: 'ordering',
    label: 'Ordenação',
    description: 'Colocar itens em ordem',
    icon: '🔢'
  },
  {
    type: 'matching',
    label: 'Correspondência',
    description: 'Combinar itens relacionados',
    icon: '🔗'
  },
  {
    type: 'scale',
    label: 'Escala',
    description: 'Avaliação em escala numérica',
    icon: '📊'
  },
  {
    type: 'dropdown',
    label: 'Lista Suspensa',
    description: 'Selecionar de uma lista',
    icon: '📋'
  }
];

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  questionIndex,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // =============================================================================
  // EFEITOS
  // =============================================================================

  useEffect(() => {
    // Converter opções do formato do banco para o formato local
    if (question.options && Array.isArray(question.options)) {
      const formattedOptions = question.options.map((opt: any, index: number) => ({
        id: opt.id || `option_${index}`,
        text: opt.text || opt.label || '',
        is_correct: question.correct_answers.includes(opt.id || index.toString())
      }));
      setOptions(formattedOptions);
    } else {
      // Criar opções padrão baseado no tipo
      createDefaultOptions();
    }
  }, [question.question_type, question.id]);

  // =============================================================================
  // FUNÇÕES AUXILIARES
  // =============================================================================

  const createDefaultOptions = () => {
    switch (question.question_type) {
      case 'multiple_choice':
      case 'multiple_answer':
      case 'dropdown':
        setOptions([
          { id: '1', text: 'Opção 1', is_correct: false },
          { id: '2', text: 'Opção 2', is_correct: false },
          { id: '3', text: 'Opção 3', is_correct: false },
          { id: '4', text: 'Opção 4', is_correct: false }
        ]);
        break;
      case 'true_false':
        setOptions([
          { id: 'true', text: 'Verdadeiro', is_correct: false },
          { id: 'false', text: 'Falso', is_correct: false }
        ]);
        break;
      case 'scale':
        setOptions([
          { id: '1', text: '1', is_correct: false },
          { id: '2', text: '2', is_correct: false },
          { id: '3', text: '3', is_correct: false },
          { id: '4', text: '4', is_correct: false },
          { id: '5', text: '5', is_correct: false }
        ]);
        break;
      default:
        setOptions([]);
    }
  };

  const updateQuestion = (updates: Partial<Question>) => {
    onUpdate(question.id, updates);
  };

  const updateOptions = (newOptions: QuestionOption[]) => {
    setOptions(newOptions);
    
    // Converter para o formato do banco
    const formattedOptions = newOptions.map(opt => ({
      id: opt.id,
      text: opt.text,
      label: opt.text
    }));
    
    const correctAnswers = newOptions
      .filter(opt => opt.is_correct)
      .map(opt => opt.id);
    
    updateQuestion({
      options: formattedOptions,
      correct_answers: correctAnswers
    });
  };

  const addOption = () => {
    const newOption: QuestionOption = {
      id: `option_${Date.now()}`,
      text: `Opção ${options.length + 1}`,
      is_correct: false
    };
    updateOptions([...options, newOption]);
  };

  const removeOption = (optionId: string) => {
    if (options.length > 2) {
      updateOptions(options.filter(opt => opt.id !== optionId));
    }
  };

  const updateOption = (optionId: string, text: string) => {
    updateOptions(options.map(opt => 
      opt.id === optionId ? { ...opt, text } : opt
    ));
  };

  const toggleCorrectAnswer = (optionId: string) => {
    const updatedOptions = options.map(opt => {
      if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        // Apenas uma resposta correta
        return {
          ...opt,
          is_correct: opt.id === optionId
        };
      } else {
        // Múltiplas respostas corretas permitidas
        return opt.id === optionId 
          ? { ...opt, is_correct: !opt.is_correct }
          : opt;
      }
    });
    updateOptions(updatedOptions);
  };

  // =============================================================================
  // RENDERIZAÇÃO DOS TIPOS DE PERGUNTA
  // =============================================================================

  const renderQuestionTypeSelector = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tipo de Pergunta
      </label>
      <div className="grid grid-cols-2 gap-2">
        {QUESTION_TYPES.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => updateQuestion({ question_type: type })}
            className={`p-2 text-left border rounded-lg hover:bg-gray-50 transition-colors ${
              question.question_type === type 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderOptionsEditor = () => {
    if (!['multiple_choice', 'multiple_answer', 'true_false', 'dropdown', 'scale'].includes(question.question_type)) {
      return null;
    }

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Opções de Resposta
          </label>
          {!['true_false', 'scale'].includes(question.question_type) && (
            <button
              onClick={addOption}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          )}
        </div>
        
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center space-x-2 group">
              <button
                onClick={() => toggleCorrectAnswer(option.id)}
                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                  option.is_correct 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {option.is_correct && <Check className="w-4 h-4 text-white" />}
              </button>
              
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
                placeholder={`Opção ${index + 1}`}
              />
              
              {!['true_false', 'scale'].includes(question.question_type) && options.length > 2 && (
                <button
                  onClick={() => removeOption(option.id)}
                  className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTextAnswer = () => {
    if (question.question_type !== 'text') return null;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resposta Esperada
        </label>
        <textarea
          value={question.correct_answers[0] || ''}
          onChange={(e) => updateQuestion({ correct_answers: [e.target.value] })}
          className="w-full px-3 py-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
          rows={3}
          placeholder="Digite a resposta esperada..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Para texto livre, a comparação será case-insensitive
        </p>
      </div>
    );
  };

  const renderOrderingEditor = () => {
    if (question.question_type !== 'ordering') return null;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Itens para Ordenar
        </label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs rounded">
                {index + 1}
              </div>
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
                placeholder={`Item ${index + 1}`}
              />
              <button
                onClick={() => removeOption(option.id)}
                className="p-1 text-red-500 hover:text-red-700"
                disabled={options.length <= 2}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addOption}
          className="mt-2 flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Item</span>
        </button>
      </div>
    );
  };

  // =============================================================================
  // RENDERIZAÇÃO PRINCIPAL
  // =============================================================================

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4">
      {/* Header da Pergunta */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 hover:bg-gray-50"
          >
            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          <div>
            <h3 className="font-medium text-gray-900">
              Pergunta {questionIndex + 1}
            </h3>
            <p className="text-sm text-gray-500">
              {QUESTION_TYPES.find(t => t.type === question.question_type)?.label || 'Tipo não definido'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMove(question.id, 'up')}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="Mover para cima"
          >
            <Move className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="Configurações"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDuplicate(question.id)}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="Duplicar"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(question.id)}
            className="p-1 text-red-500 hover:text-red-700"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conteúdo da Pergunta */}
      {isExpanded && (
        <div className="p-4">
          {/* Texto da Pergunta */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pergunta *
            </label>
            <textarea
              value={question.question_text}
              onChange={(e) => updateQuestion({ question_text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="Digite sua pergunta aqui..."
              required
            />
          </div>

          {/* Seletor de Tipo */}
          {renderQuestionTypeSelector()}

          {/* Editor de Opções */}
          {renderOptionsEditor()}
          {renderTextAnswer()}
          {renderOrderingEditor()}

          {/* Configurações Avançadas */}
          {showSettings && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-3">Configurações Avançadas</h4>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Pontuação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pontuação
                  </label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) => updateQuestion({ points: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
                    min="1"
                    max="100"
                  />
                </div>

                {/* Tempo Limite */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempo Limite (segundos)
                  </label>
                  <input
                    type="number"
                    value={question.time_limit || ''}
                    onChange={(e) => updateQuestion({ time_limit: parseInt(e.target.value) || null })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              {/* Explicação */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explicação (opcional)
                </label>
                <textarea
                  value={question.explanation || ''}
                  onChange={(e) => updateQuestion({ explanation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
                  rows={2}
                  placeholder="Explicação que aparecerá após a resposta..."
                />
              </div>

              {/* Dica */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dica (opcional)
                </label>
                <input
                  type="text"
                  value={question.hint || ''}
                  onChange={(e) => updateQuestion({ hint: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="Dica para ajudar o usuário..."
                />
              </div>

              {/* Tags */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={question.tags?.join(', ') || ''}
                  onChange={(e) => updateQuestion({ 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="tag1, tag2, tag3..."
                />
              </div>

              {/* Mídia */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mídia (opcional)
                </label>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded hover:bg-gray-50">
                    <Image className="w-4 h-4" />
                    <span>Imagem</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded hover:bg-gray-50">
                    <Video className="w-4 h-4" />
                    <span>Vídeo</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded hover:bg-gray-50">
                    <Volume2 className="w-4 h-4" />
                    <span>Áudio</span>
                  </button>
                </div>
              </div>

              {/* Obrigatória */}
              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => updateQuestion({ required: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Pergunta obrigatória
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionEditor;
