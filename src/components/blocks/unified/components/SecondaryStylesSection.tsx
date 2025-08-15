import React from 'react';
import { Progress } from '@/components/ui/progress';
import { StyleResultForHeader } from '@/hooks/useStyleResultsForHeader';

interface SecondaryStylesSectionProps {
  secondaryStyle: StyleResultForHeader;
  thirdStyle: StyleResultForHeader;
  showSecondaryName: boolean;
  showSecondaryProgress: boolean;
  showThirdName: boolean;
  showThirdProgress: boolean;
  stepId?: string;
}

export const SecondaryStylesSection: React.FC<SecondaryStylesSectionProps> = ({
  secondaryStyle,
  thirdStyle,
  showSecondaryName,
  showSecondaryProgress,
  showThirdName,
  showThirdProgress,
  stepId
}) => {
  // Gerar prefixo dos IDs baseado no stepId
  const idPrefix = stepId ? `${stepId}-` : 'header-';
  
  // Se nenhum elemento estiver ativo, não renderizar nada
  const hasSecondaryElements = showSecondaryName || showSecondaryProgress;
  const hasThirdElements = showThirdName || showThirdProgress;
  
  if (!hasSecondaryElements && !hasThirdElements) {
    return null;
  }

  return (
    <div id={`${idPrefix}secondary-styles-section`} className="mt-6 space-y-4">
      {/* Título da seção */}
      <div className="text-center">
        <h3 id={`${idPrefix}secondary-styles-title`} className="text-base font-medium text-muted-foreground">Estilos Complementares</h3>
      </div>

      {/* Grid de estilos secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {/* Segundo estilo */}
        {hasSecondaryElements && (
          <div id={`${idPrefix}secondary-style-card`} className="space-y-2 p-3 rounded-lg bg-muted/30">
            {showSecondaryName && (
              <div className="text-center">
                <h4 
                  id={`${idPrefix}secondary-style-name`}
                  className="text-sm font-semibold"
                  style={{ color: secondaryStyle.color }}
                >
                  2º • {secondaryStyle.name}
                </h4>
              </div>
            )}
            
            {showSecondaryProgress && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Compatibilidade</span>
                  <span>{secondaryStyle.percentage}%</span>
                </div>
                <Progress
                  id={`${idPrefix}secondary-style-progress`}
                  value={secondaryStyle.percentage}
                  className="h-1.5"
                  indicatorClassName="transition-all duration-300"
                  style={{
                    '--progress-indicator-bg': secondaryStyle.color
                  } as React.CSSProperties}
                />
              </div>
            )}
          </div>
        )}

        {/* Terceiro estilo */}
        {hasThirdElements && (
          <div id={`${idPrefix}third-style-card`} className="space-y-2 p-3 rounded-lg bg-muted/30">
            {showThirdName && (
              <div className="text-center">
                <h4 
                  id={`${idPrefix}third-style-name`}
                  className="text-sm font-semibold"
                  style={{ color: thirdStyle.color }}
                >
                  3º • {thirdStyle.name}
                </h4>
              </div>
            )}
            
            {showThirdProgress && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Compatibilidade</span>
                  <span>{thirdStyle.percentage}%</span>
                </div>
                <Progress
                  id={`${idPrefix}third-style-progress`}
                  value={thirdStyle.percentage}
                  className="h-1.5"
                  indicatorClassName="transition-all duration-300"
                  style={{
                    '--progress-indicator-bg': thirdStyle.color
                  } as React.CSSProperties}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};