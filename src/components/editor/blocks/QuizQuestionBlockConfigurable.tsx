import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Heart, ArrowRight, ArrowLeft, Settings, Star, Tag, Edit, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorQuizContext } from '../../../contexts/EditorQuizContext';

interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory?: string;
  points?: number;
  keywords?: string[];
}

interface QuizQuestionBlockProps {
  question?: string;
  options?: Array<QuestionOption>;
  allowMultiple?: boolean;
  showImages?: boolean;
  maxSelections?: number;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  onNext?: () => void;
  onBack?: () => void;
  progressPercent?: number;
  logoUrl?: string;
  className?: string;
  block?: any;
  isSelected?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
  isEditing?: boolean;
  showPropertiesPanel?: boolean;
}

const QuizQuestionBlock = ({
  question = 'Etapa 1: Qual dessas opções representa melhor seu estilo predominante?',
  options = [
    { 
      id: '1', 
      text: 'Clássico e elegante', 
      imageUrl: 'https://res.cloudinary.com/dtx0k4ue6/image/upload/v1710847234/estilo-classico_urkpfx.jpg',
      styleCategory: 'Clássico',
      points: 2,
      keywords: ['elegante', 'sofisticado', 'atemporal']
    },
    { 
      id: '2', 
      text: 'Moderno e descolado', 
      imageUrl: 'https://res.cloudinary.com/dtx0k4ue6/image/upload/v1710847235/estilo-moderno_hqxmzv.jpg',
      styleCategory: 'Contemporâneo',
      points: 3,
      keywords: ['moderno', 'descolado', 'inovador']
    },
    { 
      id: '3', 
      text: 'Natural e autêntico', 
      imageUrl: 'https://res.cloudinary.com/dtx0k4ue6/image/upload/v1710847236/estilo-natural_wnxkdi.jpg',
      styleCategory: 'Natural',
      points: 1,
      keywords: ['natural', 'autêntico', 'orgânico']
    },
    { 
      id: '4', 
      text: 'Casual e descontraído',
      styleCategory: 'Natural',
      points: 1,
      keywords: ['casual', 'descontraído', 'relaxado']
    }
  ],
  allowMultiple = true,
  showImages = true,
  maxSelections = 3,
  autoAdvance = true,
  autoAdvanceDelay = 1500,
  onNext,
  onBack,
  progressPercent = 0,
  logoUrl = 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
  className,
  block,
  isSelected = false,
  onPropertyChange,
  isEditing = false,
  showPropertiesPanel = false
}: QuizQuestionBlockProps) => {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [showProperties, setShowProperties] = useState(showPropertiesPanel);

  // Cores das categorias
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Natural': '#8B7355',
      'Clássico': '#4A4A4A',
      'Contemporâneo': '#2563EB',
      'Elegante': '#7C3AED',
      'Romântico': '#EC4899',
      'Sexy': '#EF4444',
      'Dramático': '#1F2937',
      'Criativo': '#F59E0B',
    };
    return colors[category || ''] || '#6B7280';
  };

  // Tentar usar context do editor, mas não falhar se não estiver disponível
  const editorQuizContext = (() => {
    try {
      return useEditorQuizContext();
    } catch {
      return null; // Editor em modo preview
    }
  })();

  // Auto-avanço quando atingir máximo de seleções
  useEffect(() => {
    if (autoAdvance && allowMultiple && selectedOptions.size === maxSelections) {
      setIsAutoAdvancing(true);
      const timer = setTimeout(() => {
        onNext?.();
        setIsAutoAdvancing(false);
      }, autoAdvanceDelay);
      
      return () => clearTimeout(timer);
    }
  }, [selectedOptions.size, autoAdvance, allowMultiple, maxSelections, autoAdvanceDelay, onNext]);

  const handleOptionClick = (optionId: string) => {
    const newSelected = new Set(selectedOptions);
    
    if (allowMultiple) {
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId);
      } else if (newSelected.size < maxSelections) {
        newSelected.add(optionId);
      }
    } else {
      newSelected.clear();
      newSelected.add(optionId);
      // Auto-avanço imediato para seleção única
      if (autoAdvance) {
        setTimeout(() => onNext?.(), autoAdvanceDelay);
      }
    }
    
    setSelectedOptions(newSelected);

    // ✅ INTEGRAÇÃO COM LÓGICA REAL DE CÁLCULO
    if (editorQuizContext && block?.id) {
      const selectedArray = Array.from(newSelected);
      editorQuizContext.handleAnswer(block.id, selectedArray);
    }
  };

  const getGridCols = () => {
    const count = options.length;
    if (count <= 2) return 'grid-cols-1 md:grid-cols-2';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-4';
  };

  const handlePropertyChange = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const OptionCard = ({ option, index }: { option: QuestionOption; index: number }) => {
    const isSelected = selectedOptions.has(option.id);
    const hasImage = showImages && option.imageUrl;

    return (
      <div
        key={option.id}
        className={cn(
          'relative group cursor-pointer rounded-xl border-2 transition-all duration-300',
          'hover:shadow-lg hover:scale-105',
          isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-gray-200 bg-white hover:border-gray-300',
          isAutoAdvancing && 'pointer-events-none opacity-70'
        )}
        onClick={() => handleOptionClick(option.id)}
      >
        {/* Indicador de configuração no modo edição */}
        {isEditing && (
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            {option.styleCategory && (
              <div 
                className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: getCategoryColor(option.styleCategory) }}
                title={`Categoria: ${option.styleCategory}`}
              />
            )}
            {option.points && (
              <div className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded font-bold shadow-sm">
                {option.points}pt
              </div>
            )}
          </div>
        )}

        {/* Checkbox de seleção */}
        <div className="absolute top-3 left-3 z-10">
          {isSelected ? (
            <CheckCircle className="w-6 h-6 text-blue-500 bg-white rounded-full" />
          ) : (
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full bg-white group-hover:border-blue-300" />
          )}
        </div>

        {/* Imagem da opção */}
        {hasImage ? (
          <div className="aspect-video w-full rounded-t-xl overflow-hidden">
            <img
              src={option.imageUrl}
              alt={option.text}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : showImages ? (
          <div className="aspect-video w-full rounded-t-xl bg-gray-100 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        ) : null}

        {/* Conteúdo do cartão */}
        <div className={cn(
          'p-4',
          hasImage ? 'pt-3' : 'pt-12'
        )}>
          <p className="font-medium text-gray-900 text-center leading-tight">
            {option.text}
          </p>
          
          {/* Informações extras no modo edição */}
          {isEditing && (
            <div className="mt-2 space-y-1">
              {option.styleCategory && (
                <div className="flex items-center gap-1 text-xs">
                  <Tag className="w-3 h-3" />
                  <span className="text-gray-600">{option.styleCategory}</span>
                </div>
              )}
              
              {option.keywords && option.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {option.keywords.slice(0, 2).map(keyword => (
                    <span 
                      key={keyword}
                      className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                  {option.keywords.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{option.keywords.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* Header com configurações */}
      {isEditing && (
        <div className="absolute top-0 right-0 z-20 flex gap-2 p-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowProperties(!showProperties)}
            className="bg-white shadow-sm"
          >
            <Settings className="w-4 h-4 mr-1" />
            Configurar
          </Button>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:px-8">
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="h-8 md:h-10"
          />
          <div className="text-sm text-gray-600">
            {progressPercent}% concluído
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-8 py-8">
          <div className="max-w-4xl mx-auto w-full">
            {/* Pergunta */}
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {question}
              </h2>
              
              {allowMultiple && (
                <p className="text-gray-600">
                  Selecione até {maxSelections} opções
                </p>
              )}
            </div>

            {/* Grid de opções */}
            <div className={cn(
              'grid gap-4 md:gap-6 mb-8',
              getGridCols()
            )}>
              {options.map((option, index) => (
                <OptionCard key={option.id} option={option} index={index} />
              ))}
            </div>

            {/* Controles de navegação */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
                disabled={isAutoAdvancing}
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>

              <div className="flex items-center gap-4">
                {isAutoAdvancing && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Avançando...</span>
                  </div>
                )}
                
                <Button
                  onClick={onNext}
                  disabled={selectedOptions.size === 0 || isAutoAdvancing}
                  className="flex items-center gap-2"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Painel de propriedades */}
      {showProperties && isEditing && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Configurar Questão</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProperties(false)}
              >
                ×
              </Button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Configuração básica da pergunta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pergunta
              </label>
              <textarea
                value={question}
                onChange={(e) => handlePropertyChange('question', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows={3}
              />
            </div>

            {/* Configurações das opções */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opções ({options.length})
              </label>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {options.map((option, index) => (
                  <div key={option.id} className="border border-gray-200 rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Opção {index + 1}</span>
                      <div className="flex items-center gap-1">
                        {option.styleCategory && (
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(option.styleCategory) }}
                          />
                        )}
                        {option.points && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                            {option.points}pt
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <input
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = { ...option, text: e.target.value };
                        handlePropertyChange('options', newOptions);
                      }}
                      className="w-full p-1 border border-gray-300 rounded text-sm"
                      placeholder="Texto da opção..."
                    />
                    
                    {showImages && (
                      <input
                        value={option.imageUrl || ''}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = { ...option, imageUrl: e.target.value };
                          handlePropertyChange('options', newOptions);
                        }}
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                        placeholder="URL da imagem..."
                      />
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={option.styleCategory || ''}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = { ...option, styleCategory: e.target.value };
                          handlePropertyChange('options', newOptions);
                        }}
                        className="p-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="">Categoria...</option>
                        <option value="Natural">Natural</option>
                        <option value="Clássico">Clássico</option>
                        <option value="Contemporâneo">Contemporâneo</option>
                        <option value="Elegante">Elegante</option>
                        <option value="Romântico">Romântico</option>
                        <option value="Sexy">Sexy</option>
                        <option value="Dramático">Dramático</option>
                        <option value="Criativo">Criativo</option>
                      </select>
                      
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={option.points || 1}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = { ...option, points: parseInt(e.target.value) || 1 };
                          handlePropertyChange('options', newOptions);
                        }}
                        className="p-1 border border-gray-300 rounded text-xs"
                        placeholder="Pontos"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configurações gerais */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Múltiplas seleções
                </label>
                <input
                  type="checkbox"
                  checked={allowMultiple}
                  onChange={(e) => handlePropertyChange('allowMultiple', e.target.checked)}
                  className="rounded"
                />
              </div>
              
              {allowMultiple && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Máximo de seleções
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxSelections}
                    onChange={(e) => handlePropertyChange('maxSelections', parseInt(e.target.value) || 1)}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Mostrar imagens
                </label>
                <input
                  type="checkbox"
                  checked={showImages}
                  onChange={(e) => handlePropertyChange('showImages', e.target.checked)}
                  className="rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Auto-avanço
                </label>
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => handlePropertyChange('autoAdvance', e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionBlock;
