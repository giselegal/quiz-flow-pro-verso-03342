import React, { useState, useEffect } from 'react';
import { TextCursorInput } from 'lucide-react';
import type { BlockComponentProps, BlockData } from '../../../types/blocks';
import { userResponseService } from '../../../services/userResponseService';

interface FormInputBlockProps {
  block: BlockData;
  isSelected?: boolean;
  isEditing?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
  funnelId?: string;
  onValueChange?: (value: string) => void;
}

const FormInputBlock: React.FC<FormInputBlockProps> = ({ 
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
  funnelId = 'default-quiz-funnel-21-steps',
  onValueChange
}) => {
  const { 
    label = 'Campo de Input',
    placeholder = 'Digite aqui...',
    inputType = 'text',
    required = false,
    fullWidth = true,
    name = 'input'
  } = block.properties;

  const [value, setValue] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  // Carregar valor salvo se existir
  useEffect(() => {
    const savedValue = userResponseService.getResponse(block.id);
    if (savedValue) {
      setValue(savedValue);
      setIsValid(true);
    }
  }, [block.id]);

  const handleInputChange = async (newValue: string) => {
    setValue(newValue);
    const valid = !required || newValue.trim().length > 0;
    setIsValid(valid);

    // Salvar automaticamente se válido
    if (valid && newValue.trim()) {
      try {
        // Salvar resposta específica
        await userResponseService.saveStepResponse(
          1, // Etapa 1
          block.id,
          'form-input',
          newValue.trim(),
          funnelId
        );

        // Se for o campo de nome, salvar também como nome do usuário
        if (name === 'userName' || block.id === 'intro-name-input') {
          await userResponseService.saveUserName(newValue.trim(), funnelId);
          console.log('✅ Nome do usuário salvo:', newValue.trim());
        }

        // Notificar componente pai
        if (onValueChange) {
          onValueChange(newValue.trim());
        }

        // Disparar evento customizado para outros componentes
        window.dispatchEvent(new CustomEvent('quiz-input-change', {
          detail: { blockId: block.id, value: newValue.trim(), valid }
        }));
      } catch (error) {
        console.error('❌ Erro ao salvar resposta:', error);
      }
    }
  };

  return (
    <div 
      className={`
        p-4 rounded-lg transition-all duration-200
        ${isSelected 
          ? 'border-2 border-blue-500 bg-blue-50 cursor-pointer' 
          : 'border-2 border-transparent hover:bg-[#FAF9F7]'
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className={`space-y-3 ${fullWidth ? 'w-full' : 'w-auto'}`}>
        <div className="flex items-center gap-2">
          <TextCursorInput className="w-4 h-4 text-[#B89B7A]" />
          <label className="text-sm font-medium text-[#432818]">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
        
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`
            w-full px-4 py-3 border-2 rounded-lg 
            focus:ring-2 focus:ring-[#B89B7A] focus:border-[#B89B7A] 
            transition-all outline-none
            ${isValid 
              ? 'border-green-300 bg-green-50' 
              : value && !isValid 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 bg-white hover:border-[#B89B7A]/50'
            }
          `}
        />
      </div>
    </div>
  );
};

export default FormInputBlock;