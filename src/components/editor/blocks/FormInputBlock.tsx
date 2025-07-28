import React from 'react';
import { TextCursorInput } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

const FormInputBlock: React.FC<BlockComponentProps> = ({ 
  block,
  isSelected = false,
  onClick,
  className = ''
}) => {
  const { 
    label = 'Campo de Input',
    placeholder = 'Digite aqui...',
    inputType = 'text',
    required = false,
    fullWidth = true
  } = block.properties;

  return (
    <div 
      className={`
        p-4 rounded-lg cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-2 border-blue-500 bg-blue-50' 
          : 'border-2 border-dashed border-[#B89B7A]/40 hover:bg-[#FAF9F7]'
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className={`space-y-2 ${fullWidth ? 'w-full' : 'w-auto'}`}>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent transition-all"
          readOnly
        />
      </div>
    </div>
  );
};

export default FormInputBlock;