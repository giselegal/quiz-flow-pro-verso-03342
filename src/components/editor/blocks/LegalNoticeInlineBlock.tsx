import React from 'react';
import { cn } from '../../../lib/utils';
import { Shield, Info } from 'lucide-react';
import type { BlockComponentProps } from '../../../types/blocks';

/**
 * LegalNoticeInlineBlock - Componente para avisos legais e privacidade
 * 
 * 🎯 CARACTERÍSTICAS:
 * 1. ✅ REUTILIZÁVEL: Props flexíveis para diferentes textos legais
 * 2. ✅ RESPONSIVO: Adapta-se a diferentes tamanhos de tela
 * 3. ✅ INLINE: Funciona perfeitamente em layouts flex
 * 4. ✅ ACESSÍVEL: Texto claro e legível
 * 5. ✅ MODULAR: Componente independente
 */
const LegalNoticeInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">Erro: Bloco não encontrado ou propriedades indefinidas</p>
      </div>
    );
  }

  const {
    privacyText = 'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade',
    copyrightText = '© 2025 Gisele Galvão - Todos os direitos reservados',
    showIcon = true,
    iconType = 'shield', // shield, info
    textAlign = 'text-center',
    textSize = 'text-sm',
    textColor = '#6B7280',
    linkColor = '#B89B7A',
    marginTop = 24,
    marginBottom = 0,
    backgroundColor = 'transparent',
    borderRadius = 'rounded-lg',
    padding = 'p-4'
  } = block.properties;

  const iconMap = {
    shield: Shield,
    info: Info
  };

  const IconComponent = iconMap[iconType as keyof typeof iconMap] || Shield;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={cn(
        'transition-all duration-200',
        isSelected ? 'ring-2 ring-blue-400 ring-offset-2' : '',
        'cursor-pointer hover:bg-gray-50/50',
        borderRadius,
        padding,
        className
      )}
      onClick={onClick}
      style={{
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined
      }}
    >
      <div className={cn('space-y-3', textAlign)}>
        {/* Privacy Notice */}
        <div className="flex items-start gap-2 justify-center">
          {showIcon && (
            <IconComponent 
              className="w-4 h-4 mt-0.5 flex-shrink-0" 
              style={{ color: linkColor }} 
            />
          )}
          <p 
            className={cn(textSize, 'leading-relaxed max-w-md')}
            style={{ color: textColor }}
          >
            {privacyText.split('política de privacidade').map((part, index) => (
              <span key={index}>
                {part}
                {index === 0 && privacyText.includes('política de privacidade') && (
                  <span 
                    className="underline cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ color: linkColor }}
                  >
                    política de privacidade
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-3">
          <p 
            className={cn(textSize, 'opacity-75')}
            style={{ color: textColor }}
          >
            {copyrightText}
          </p>
        </div>
      </div>

      {/* Editor Controls */}
      {isSelected && (
        <div className="mt-4 flex gap-2 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePropertyChange('showIcon', !showIcon);
            }}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            {showIcon ? 'Ocultar Ícone' : 'Mostrar Ícone'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePropertyChange('iconType', iconType === 'shield' ? 'info' : 'shield');
            }}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Alterar Ícone
          </button>
        </div>
      )}
    </div>
  );
};

export default LegalNoticeInlineBlock;
