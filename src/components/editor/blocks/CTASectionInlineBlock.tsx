import React, { useState } from 'react';
import { InlineEditableText } from './InlineEditableText';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowDown, Lock } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

const CTASectionInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Descubra Como Aplicar Seu Estilo na Prática',
    buttonText = 'Quero meu Guia de Estilo Agora',
    buttonUrl = '#',
    buttonColor = 'linear-gradient(to right, #4CAF50, #45a049)',
    securityText = 'Oferta exclusiva nesta página',
    arrowEnabled = true,
    style = 'green', // green, primary, secondary
  } = block?.properties || {};

  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const handleCTAClick = () => {
    if (buttonUrl && buttonUrl !== '#') {
      window.open(buttonUrl, '_blank');
    }
  };

  const getButtonStyle = () => {
    switch (style) {
      case 'green':
        return {
          background: buttonColor,
          boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)',
        };
      case 'primary':
        return {
          background: 'linear-gradient(to right, #B89B7A, #aa6b5d)',
          boxShadow: '0 4px 14px rgba(184, 155, 122, 0.4)',
        };
      default:
        return {
          background: buttonColor,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
        };
    }
  };

  return (
    <div
      className={`
        w-full
        p-3 rounded-lg transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
            : 'border-2 border-dashed border-transparent hover:border-[#B89B7A]/40 hover:bg-[#B89B7A]/10/30'
        }
        ${className}
      `}
    >
      <div className="text-center my-10">
        <div className="bg-[#f9f4ef] p-6 rounded-lg border border-[#B89B7A]/10 mb-6">
          <h3 className="text-xl font-medium text-center text-[#aa6b5d] mb-4">
            <InlineEditableText
              value={title}
              onChange={value => handlePropertyChange('title', value)}
              placeholder="Título da seção CTA"
              className="text-xl font-medium text-center text-[#aa6b5d]"
            />
          </h3>

          {arrowEnabled && (
            <div className="flex justify-center">
              <ArrowDown className="w-8 h-8 text-[#B89B7A] animate-bounce" />
            </div>
          )}
        </div>

        <Button
          onClick={handleCTAClick}
          className="text-white py-4 px-6 rounded-md transition-all duration-300 hover:scale-105"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          style={getButtonStyle()}
        >
          <span className="flex items-center justify-center gap-2">
            <ShoppingCart
              className={`w-5 h-5 transition-transform duration-300 ${isButtonHovered ? 'scale-110' : ''}`}
            />
            <span
              className="cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                const newText = prompt('Editar texto do botão:', buttonText);
                if (newText !== null) handlePropertyChange('buttonText', newText);
              }}
            >
              {buttonText}
            </span>
          </span>
        </Button>

        <div className="mt-4 space-y-2">
          {/* Security/Trust Element */}
          <p className="text-sm text-[#aa6b5d] flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span
              className="cursor-pointer hover:bg-[#B89B7A]/10/50 rounded px-1"
              onClick={() => {
                const newText = prompt('Editar texto de segurança:', securityText);
                if (newText !== null) handlePropertyChange('securityText', newText);
              }}
            >
              {securityText}
            </span>
          </p>

          {/* URL Configuration */}
          <div className="text-xs text-gray-500 mt-2">
            <span
              className="cursor-pointer hover:bg-[#B89B7A]/10/50 rounded px-1"
              onClick={() => {
                const newUrl = prompt('Editar URL do botão:', buttonUrl);
                if (newUrl !== null) handlePropertyChange('buttonUrl', newUrl);
              }}
            >
              URL: {buttonUrl}
            </span>
          </div>

          {/* Style Configuration */}
          <div className="text-xs text-gray-500 mt-1">
            <span
              className="cursor-pointer hover:bg-[#B89B7A]/10/50 rounded px-1"
              onClick={() => {
                const newStyle = prompt('Estilo do botão (green, primary, secondary):', style);
                if (newStyle !== null && ['green', 'primary', 'secondary'].includes(newStyle)) {
                  handlePropertyChange('style', newStyle);
                }
              }}
            >
              Estilo: {style}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASectionInlineBlock;
