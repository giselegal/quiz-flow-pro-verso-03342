import React, { useEffect, useState } from 'react';
import type { BlockComponentProps } from '../../../types/blocks';

/**
 * ProgressBarStepBlock - Componente modular de barra de progresso com etapas
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const ProgressBarStepBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div className="bg-red-100 p-2 text-red-600 text-sm rounded">
        ⚠️ Erro: Propriedades do bloco não encontradas
      </div>
    );
  }

  const {
    currentStep = 1,
    totalSteps = 5,
    showLabels = true,
    labels = [],
    showPercentage = true,
    barColor = '#3b82f6',
    barHeight = 8,
    barBgColor = '#e5e7eb',
    animated = true,
    borderRadius = 9999, // rounded-full
    title = 'Seu progresso:',
    showTitle = true,
  } = block.properties;

  // Calcular porcentagem
  const percentage = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);
  
  // Gerar labels padrão se não fornecidas
  const stepLabels = labels.length === totalSteps 
    ? labels 
    : Array.from({ length: totalSteps }, (_, i) => `Etapa ${i + 1}`);

  // Efeito de animação na inicialização
  const [animatedWidth, setAnimatedWidth] = useState(0);
  
  useEffect(() => {
    if (animated) {
      setAnimatedWidth(0);
      const timer = setTimeout(() => {
        setAnimatedWidth(percentage);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setAnimatedWidth(percentage);
    }
  }, [percentage, animated]);

  return (
    <div 
      className={`w-full transition-all duration-200 ${
        isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'
      } ${className}`}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="p-4">
        {showTitle && (
          <div className="text-sm font-medium text-gray-700 mb-2">{title}</div>
        )}
        
        <div className="relative mb-2">
          {/* Barra de progresso - fundo */}
          <div 
            className="w-full overflow-hidden"
            style={{ 
              height: `${barHeight}px`, 
              backgroundColor: barBgColor,
              borderRadius: `${borderRadius}px`
            }}
          >
            {/* Barra de progresso - preenchimento */}
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${animatedWidth}%`, 
                backgroundColor: barColor,
                borderRadius: `${borderRadius}px`,
                transition: animated ? 'width 1s ease-in-out' : 'none'
              }}
            />
          </div>
          
          {/* Marcadores de etapas */}
          <div className="w-full flex justify-between mt-1">
            {Array.from({ length: totalSteps }).map((_, index) => {
              const stepCompleted = index + 1 <= currentStep;
              return (
                <div 
                  key={index} 
                  className={`w-4 h-4 rounded-full ${
                    stepCompleted ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  style={{ 
                    backgroundColor: stepCompleted ? barColor : '#e5e7eb',
                    transform: 'translateX(-50%)',
                    marginLeft: index === 0 ? '0%' : index === totalSteps - 1 ? '100%' : `${(index / (totalSteps - 1)) * 100}%` 
                  }}
                />
              );
            })}
          </div>
        </div>
        
        {/* Labels das etapas */}
        {showLabels && (
          <div className="flex justify-between mt-2">
            {stepLabels.map((label, index) => (
              <div 
                key={index} 
                className={`text-xs ${
                  index + 1 <= currentStep ? 'font-medium text-gray-700' : 'text-gray-400'
                }`}
                style={{ 
                  transform: 'translateX(-50%)',
                  marginLeft: index === 0 ? '0%' : index === totalSteps - 1 ? '100%' : `${(index / (totalSteps - 1)) * 100}%`,
                  width: '70px',
                  textAlign: 'center'
                }}
              >
                {label}
              </div>
            ))}
          </div>
        )}
        
        {/* Porcentagem */}
        {showPercentage && (
          <div className="text-sm font-semibold text-right mt-2">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBarStepBlock;
