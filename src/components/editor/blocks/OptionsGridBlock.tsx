
import React, { useState, useCallback, useEffect } from 'react';
import { Block } from '../../../types/editor';
import { useQuestionValidation } from '../../../hooks/useQuestionValidation';
import { AlertCircle, CheckCircle2, Settings, Eye, Edit3 } from 'lucide-react';

interface Option {
  id: string;
  text: string;
  value: string;
  imageUrl?: string;
  category?: string;
}

interface OptionsGridBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
  isPreview?: boolean;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

const OptionsGridBlock: React.FC<OptionsGridBlockProps> = ({
  block,
  isSelected,
  onSelect,
  isPreview = false,
  onValidationChange
}) => {
  // Acessar propriedades corretas do bloco
  const properties = block.properties || {};
  const content = block.content || {};
  
  const options: Option[] = properties.options || content.options || [];
  const columns = properties.columns || content.columns || 2;
  const showImages = properties.showImages !== undefined ? properties.showImages : true;
  const multipleSelection = properties.multipleSelection || false;
  const maxSelections = properties.maxSelections || 1;
  const minSelections = properties.minSelections || 1;
  const isRequired = properties.isRequired !== undefined ? properties.isRequired : true;
  
  // Estado das seleções
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // Validação
  const validation = useQuestionValidation(selectedOptions, {
    isRequired,
    minSelections,
    maxSelections,
    isMultipleChoice: multipleSelection
  });

  // Notificar mudanças de validação
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validation.canProceed, validation.errors);
    }
  }, [validation, onValidationChange]);

  // Manipular seleção de opção
  const handleOptionSelect = useCallback((optionId: string) => {
    if (isPreview) return; // Não permitir seleção no preview
    
    setSelectedOptions(prev => {
      if (multipleSelection) {
        // Múltipla seleção
        if (prev.includes(optionId)) {
          // Remover se já selecionado
          return prev.filter(id => id !== optionId);
        } else {
          // Adicionar se não exceder o máximo
          if (prev.length < maxSelections) {
            return [...prev, optionId];
          }
          return prev;
        }
      } else {
        // Seleção única
        return prev.includes(optionId) ? [] : [optionId];
      }
    });
  }, [multipleSelection, maxSelections, isPreview]);

  // Grid responsivo baseado no número de colunas
  const getGridClasses = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  // Se não há opções, mostrar placeholder moderno
  if (!options || options.length === 0) {
    return (
      <div 
        className={`p-6 border-2 border-dashed border-gray-300 rounded-xl transition-all ${
          isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7] border-[#B89B7A]' : 'hover:border-gray-400'
        }`}
        onClick={onSelect}
      >
        <div className="text-center text-gray-500 py-8">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Configure as opções</h3>
          <p className="text-sm text-gray-500 mb-4">Adicione as opções de resposta para esta questão</p>
          
          {!isPreview && (
            <div className="inline-flex items-center px-4 py-2 bg-[#B89B7A] text-white rounded-lg text-sm font-medium hover:bg-[#A08A6C] transition-colors">
              <Edit3 className="w-4 h-4 mr-2" />
              Abrir painel de propriedades
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`p-4 ${
        isSelected && !isPreview ? 'ring-2 ring-[#B89B7A] bg-[#FAF9F7]' : ''
      }`}
      onClick={onSelect}
    >
      <div className={`grid ${getGridClasses(columns)} gap-4`}>
        {options.map((option, index) => {
          const isOptionSelected = selectedOptions.includes(option.id);
          
          return (
            <div
              key={option.id || index}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all duration-200
                ${isOptionSelected 
                  ? 'border-[#B89B7A] bg-[#B89B7A]/10 shadow-md' 
                  : 'border-gray-200 hover:border-[#B89B7A]/50 hover:bg-gray-50'
                }
                ${!isPreview ? 'hover:shadow-md' : ''}
              `}
              onClick={() => handleOptionSelect(option.id)}
            >
              {/* Indicador de seleção */}
              {isOptionSelected && (
                <div className="flex justify-end mb-2">
                  <div className="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
              
              {showImages && option.imageUrl && (
                <div className="mb-3">
                  <img 
                    src={option.imageUrl} 
                    alt={option.text}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
              )}
              
              <div className="text-sm font-medium text-gray-900">
                {option.text}
              </div>
              
              {option.category && (
                <div className="text-xs text-gray-500 mt-1">
                  {option.category}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Feedback de validação moderno */}
      {!isPreview && (
        <div className="mt-6 space-y-3">
          {/* Status de seleção */}
          <div className={`flex items-center p-3 rounded-lg border ${
            validation.canProceed 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : selectedOptions.length > 0 
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                : 'bg-gray-50 border-gray-200 text-gray-600'
          }`}>
            {validation.canProceed ? (
              <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            )}
            
            <div className="flex-1">
              {validation.canProceed ? (
                <p className="text-sm font-medium">
                  ✅ Seleção válida ({selectedOptions.length} opç{selectedOptions.length > 1 ? 'ões' : 'ão'})
                </p>
              ) : validation.errors.length > 0 ? (
                <div>
                  <p className="text-sm font-medium mb-1">Atenção necessária:</p>
                  {validation.errors.map((error, index) => (
                    <p key={index} className="text-xs">{error}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm">
                  Selecione {minSelections} opç{minSelections > 1 ? 'ões' : 'ão'} para continuar
                </p>
              )}
            </div>
          </div>

          {/* Informações de configuração */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#B89B7A] rounded-full mr-2"></div>
              {options.length} opções
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              {multipleSelection ? `Múltipla (${maxSelections})` : 'Única'}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              {showImages ? 'Com imagens' : 'Texto'}
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${validation.canProceed ? 'bg-green-400' : 'bg-red-400'}`}></div>
              {validation.canProceed ? 'Válido' : 'Pendente'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsGridBlock;
