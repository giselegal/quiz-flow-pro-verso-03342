import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface QuizQuestionInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de questão
}

/**
 * Componente inline para questões do quiz (Etapa 2)
 * Sistema de edição inline com opções configuráveis
 */
export const QuizQuestionInlineBlock: React.FC<QuizQuestionInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  
  const {
    properties,
    handlePropertyChange,
    commonProps
  } = useInlineBlock({
    block,
    isSelected,
    onClick,
    onPropertyChange,
    className
  });

  const question = properties.question || 'Qual é sua pergunta?';
  const options = properties.options || [
    { id: '1', text: 'Opção 1', imageUrl: '' },
    { id: '2', text: 'Opção 2', imageUrl: '' },
    { id: '3', text: 'Opção 3', imageUrl: '' }
  ];
  const multipleSelection = properties.multipleSelection || false;
  const showImages = properties.showImages || false;
  const progressPercent = properties.progressPercent || 0;
  const showBackButton = properties.showBackButton || true;

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleAddOption = () => {
    const newOption = {
      id: Date.now().toString(),
      text: 'Nova opção',
      imageUrl: ''
    };
    const updatedOptions = [...options, newOption];
    handlePropertyChange('options', updatedOptions);
  };

  const handleRemoveOption = (optionId: string) => {
    if (options.length <= 1) return; // Manter pelo menos uma opção
    const updatedOptions = options.filter((opt: any) => opt.id !== optionId);
    handlePropertyChange('options', updatedOptions);
  };

  const handleOptionTextChange = (optionId: string, newText: string) => {
    const updatedOptions = options.map((opt: any) =>
      opt.id === optionId ? { ...opt, text: newText } : opt
    );
    handlePropertyChange('options', updatedOptions);
  };

  const handleOptionImageChange = (optionId: string, imageUrl: string) => {
    const updatedOptions = options.map((opt: any) =>
      opt.id === optionId ? { ...opt, imageUrl } : opt
    );
    handlePropertyChange('options', updatedOptions);
  };

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[300px] p-4',
        'bg-gradient-to-br from-blue-50 to-indigo-50',
        'border border-blue-200 rounded-lg',
        'transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 border-blue-400',
        className
      )}
    >
      {/* Botão de Edição */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              toggleEditMode();
            }}
          >
            {isEditMode ? 'Salvar' : 'Editar'}
          </Button>
        </div>
      )}

      {/* Cabeçalho da Questão */}
      <div className="mb-6">
        {/* Barra de Progresso */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Pergunta Principal */}
        {isEditMode ? (
          <textarea
            value={question}
            onChange={(e) => handlePropertyChange('question', e.target.value)}
            placeholder="Digite sua pergunta..."
            className="w-full text-xl font-semibold text-gray-800 mb-4 p-2 border border-gray-300 rounded resize-none"
            rows={2}
          />
        ) : (
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {question}
          </h2>
        )}

        {/* Controles de Configuração */}
        {isEditMode && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant={multipleSelection ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('multipleSelection', !multipleSelection)}
            >
              {multipleSelection ? 'Múltipla Escolha' : 'Escolha Única'}
            </Badge>
            
            <Badge
              variant={showImages ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showImages', !showImages)}
            >
              {showImages ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              Imagens
            </Badge>

            <Badge
              variant={showBackButton ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showBackButton', !showBackButton)}
            >
              Botão Voltar
            </Badge>
          </div>
        )}
      </div>

      {/* Opções de Resposta */}
      <div className="space-y-3 mb-6">
        {options.map((option: any, index: number) => (
          <div
            key={option.id}
            className={cn(
              'p-3 rounded-lg border-2 transition-all',
              'bg-white hover:bg-gray-50',
              'border-gray-200 hover:border-blue-300'
            )}
          >
            <div className="flex items-center gap-3">
              {/* Indicador de Opção */}
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                'border-gray-300 bg-white'
              )}>
                <span className="text-sm font-medium text-gray-600">
                  {String.fromCharCode(65 + index)}
                </span>
              </div>

              {/* Texto da Opção */}
              <div className="flex-1">
                {isEditMode ? (
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                    placeholder={`Opção ${index + 1}`}
                    className="w-full font-medium p-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span className="font-medium">{option.text}</span>
                )}
              </div>

              {/* Controles de Opção */}
              {isEditMode && (
                <div className="flex items-center gap-2">
                  {options.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveOption(option.id)}
                      className="p-1 h-8 w-8"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Campo de Imagem (se habilitado) */}
            {showImages && isEditMode && (
              <div className="mt-2 ml-9">
                <input
                  type="text"
                  value={option.imageUrl || ''}
                  onChange={(e) => handleOptionImageChange(option.id, e.target.value)}
                  placeholder="URL da imagem (opcional)"
                  className="w-full text-sm text-gray-600 p-1 border border-gray-300 rounded"
                />
              </div>
            )}

            {/* Preview da Imagem */}
            {showImages && option.imageUrl && !isEditMode && (
              <div className="mt-2 ml-9">
                <img
                  src={option.imageUrl}
                  alt={option.text}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
            )}
          </div>
        ))}

        {/* Botão Adicionar Opção */}
        {isEditMode && (
          <Button
            variant="outline"
            onClick={handleAddOption}
            className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Opção
          </Button>
        )}
      </div>

      {/* Botões de Navegação (Preview) */}
      {!isEditMode && (
        <div className="flex justify-between">
          {showBackButton && (
            <Button variant="outline">
              Voltar
            </Button>
          )}
          
          <Button className="ml-auto">
            Próxima
          </Button>
        </div>
      )}

      {/* Configurações Avançadas (Modo de Edição) */}
      {isEditMode && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progresso (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={progressPercent}
                onChange={(e) => handlePropertyChange('progressPercent', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionInlineBlock;
