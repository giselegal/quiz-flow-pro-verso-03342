
import React from 'react';
import { cn } from '@/lib/utils';
import { Award, TrendingUp } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';
import { safeGetBlockProperties, logBlockDebug } from '@/utils/blockUtils';

/**
 * QuizResultInlineBlock - Componente inline para exibir resultado do quiz
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const QuizResultInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = ''
}) => {
  // Debug e validação do bloco
  logBlockDebug('QuizResultInlineBlock', block);
  
  // Extração segura das propriedades
  const properties = safeGetBlockProperties(block);
  
  const {
    title = 'Seu Resultado',
    description = 'Baseado nas suas respostas, descobrimos seu estilo único.',
    styleName = 'Elegante',
    percentage = 85,
    showPrimaryStyle = true,
    showSecondaryStyles = true,
    showOfferSection = false,
    backgroundColor = '#FAF9F7',
    accentColor = '#B89B7A',
    textColor = '#432818'
  } = properties;

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Container flexível
        'w-full max-w-2xl mx-auto',
        // Layout responsivo
        'p-6 rounded-lg transition-all duration-300',
        // Estados do editor
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        'cursor-pointer hover:shadow-lg',
        className
      )}
      style={{ 
        backgroundColor,
        color: textColor
      }}
      onClick={onClick}
    >
      {/* Cabeçalho do Resultado */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {title}
        </h2>
        
        {showPrimaryStyle && (
          <div className="space-y-3">
            <div 
              className="text-3xl md:text-4xl font-bold"
              style={{ color: accentColor }}
            >
              {styleName}
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Award 
                className="w-5 h-5"
                style={{ color: accentColor }}
              />
              <span className="font-medium">{percentage}% de compatibilidade</span>
            </div>
          </div>
        )}
      </div>

      {/* Descrição */}
      <div className="text-center mb-6">
        <p className="text-lg leading-relaxed opacity-80">
          {description}
        </p>
      </div>

      {/* Estilos Secundários */}
      {showSecondaryStyles && (
        <div className="bg-white/50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-center">
            Seus Estilos Secundários
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {['Clássico', 'Natural'].map((style, index) => (
              <div key={style} className="flex items-center justify-between p-2 rounded bg-white/30">
                <span className="font-medium">{style}</span>
                <span className="text-sm opacity-70">{25 - index * 5}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seção de Oferta (Opcional) */}
      {showOfferSection && (
        <div 
          className="bg-white/70 rounded-lg p-4 text-center border-2"
          style={{ borderColor: accentColor }}
        >
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 mr-2" style={{ color: accentColor }} />
            <span className="font-semibold">Oferta Especial</span>
          </div>
          <p className="text-sm opacity-80">
            Descubra como aplicar seu estilo na prática
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizResultInlineBlock;
