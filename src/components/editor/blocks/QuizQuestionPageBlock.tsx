import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Edit3, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import type { BlockComponentProps } from '../../../types/blocks';
import { InlineEditText } from './InlineEditText';

/**
 * QuizQuestionPageBlock - Etapas 2-11 do funil (Questões)
 * Página de questão individual com opções e navegação
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const QuizQuestionPageBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  // SAFETY CHECK (OBRIGATÓRIO)
  if (!block || !block.properties) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">Erro: Bloco QuizQuestionPage não encontrado ou propriedades indefinidas</p>
        <p className="text-red-500 text-sm mt-2">Verifique se o bloco foi configurado corretamente</p>
      </div>
    );
  }

  // DESTRUCTURING DE PROPRIEDADES COM VALORES PADRÃO
  const {
    question = 'Qual destas opções mais descreve seu estilo?',
    options = [
      { id: '1', text: 'Clássico e elegante', value: 'classico' },
      { id: '2', text: 'Moderno e minimalista', value: 'moderno' },
      { id: '3', text: 'Bohemio e criativo', value: 'bohemio' },
      { id: '4', text: 'Casual e confortável', value: 'casual' }
    ],
    questionNumber = 1,
    totalQuestions = 10,
    allowMultiple = false,
    maxSelections = 1,
    backgroundColor = '#fffaf7',
    textColor = '#432818',
    showProgress = true,
    buttonText = 'Próxima Pergunta',
    showBackButton = true,
    imageUrl = ''
  } = block.properties;

  // ESTADOS LOCAIS
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  // HANDLERS
  const handlePropertyChange = useCallback((key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  }, [onPropertyChange]);

  const handleOptionSelect = useCallback((optionId: string) => {
    if (allowMultiple) {
      setSelectedOptions(prev => {
        const isSelected = prev.includes(optionId);
        if (isSelected) {
          return prev.filter(id => id !== optionId);
        } else if (prev.length < maxSelections) {
          return [...prev, optionId];
        }
        return prev;
      });
    } else {
      setSelectedOptions([optionId]);
    }
  }, [allowMultiple, maxSelections]);

  const handleContinue = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedOptions.length > 0) {
      console.log('📊 Resposta registrada:', { questionNumber, selectedOptions });
      // Lógica para próxima pergunta
    }
  }, [selectedOptions, questionNumber]);

  const handleBack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('⬅️ Voltando para pergunta anterior');
  }, []);

  // EFFECTS
  useEffect(() => {
    console.log(`📝 QuizQuestionPageBlock ${questionNumber} carregado`);
  }, [questionNumber]);

  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível
        'flex-shrink-0 flex-grow-0 relative group w-full',
        // Base container
        'min-h-screen flex items-center justify-center p-4',
        // Estados
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        // Animações
        'transition-all duration-300',
        className
      )}
      style={{ backgroundColor }}
      onClick={onClick}
    >
      {/* Container principal */}
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Header com progresso */}
        <div className="space-y-4">
          {/* Badge de progresso */}
          {showProgress && (
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Badge variant="secondary" className="text-sm">
                Pergunta {questionNumber} de {totalQuestions}
              </Badge>
              <div className="flex-1 max-w-md mx-auto bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Pergunta principal */}
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            style={{ color: textColor }}
          >
            <InlineEditText
              value={question}
              onSave={(value) => handlePropertyChange('question', value)}
              placeholder="Digite sua pergunta aqui"
              className="font-bold"
            />
          </h1>

          {/* Imagem da pergunta (se fornecida) */}
          {imageUrl && (
            <div className="my-6">
              <img 
                src={imageUrl} 
                alt="Question illustration" 
                className="mx-auto max-w-sm w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Opções de resposta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {options.map((option, index) => {
            const isSelected = selectedOptions.includes(option.id);
            const isHovering = isHovered === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                onMouseEnter={() => setIsHovered(option.id)}
                onMouseLeave={() => setIsHovered(null)}
                className={cn(
                  // Base styles
                  'p-4 rounded-xl border-2 transition-all duration-200',
                  'text-left min-h-[80px] flex items-center justify-between',
                  // Estados
                  isSelected 
                    ? 'border-[#B89B7A] bg-[#B89B7A]/10 text-[#432818]' 
                    : 'border-gray-200 bg-white hover:border-[#B89B7A]/50',
                  // Hover
                  isHovering && !isSelected && 'transform scale-105 shadow-md',
                  // Focus
                  'focus:outline-none focus:ring-2 focus:ring-[#B89B7A]/30'
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                    isSelected 
                      ? 'border-[#B89B7A] bg-[#B89B7A]' 
                      : 'border-gray-300'
                  )}>
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className="font-medium text-base md:text-lg">
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Botões de navegação */}
        <div className="flex items-center justify-between max-w-lg mx-auto pt-6">
          {/* Botão Voltar */}
          {showBackButton && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2 px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
          )}

          {/* Espaçador */}
          <div className="flex-1" />

          {/* Botão Continuar */}
          <Button
            onClick={handleContinue}
            disabled={selectedOptions.length === 0}
            className={cn(
              "flex items-center space-x-2 px-8 py-3 font-semibold rounded-xl",
              "bg-[#B89B7A] hover:bg-[#aa6b5d] text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transform transition-all duration-200 hover:scale-105",
              "shadow-lg hover:shadow-xl focus:ring-4 focus:ring-[#B89B7A]/30"
            )}
          >
            <InlineEditText
              value={buttonText}
              onSave={(value) => handlePropertyChange('buttonText', value)}
              placeholder="Texto do botão"
              className="text-white font-semibold"
            />
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Instruções */}
        <p className="text-sm text-gray-500 mt-4">
          {allowMultiple 
            ? `Selecione até ${maxSelections} opção${maxSelections > 1 ? 'ões' : ''}` 
            : 'Selecione uma opção para continuar'
          }
        </p>
      </div>

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-2 z-10">
          <Edit3 className="w-4 h-4" />
        </div>
      )}

      {/* Empty state para edição */}
      {!question && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-lg text-gray-500">
          <div className="text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-lg font-medium">Quiz Question Page</p>
            <p className="text-sm">Clique para selecionar e editar no painel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionPageBlock;
