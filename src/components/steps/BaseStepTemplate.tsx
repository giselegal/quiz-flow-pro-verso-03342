import React from 'react';
import { ConsolidatedBlockRenderer } from '@/components/unified';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';

export interface BaseStepTemplateProps {
  stepNumber: number;
  stepConfig: StepConfig;
  selectedBlockId?: string;
  onBlockSelect?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: any) => void;
  className?: string;
}

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  blocks: Block[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  spacing?: 'sm' | 'md' | 'lg';
  background?: string;
  padding?: string;
}

/**
 * BASE STEP TEMPLATE - Template base para todos os steps
 * ✅ Sistema modular e reutilizável
 * ✅ Configuração via JSON
 * ✅ Usa ConsolidatedBlockRenderer
 * ✅ Layout responsivo automático
 */

const BaseStepTemplate: React.FC<BaseStepTemplateProps> = ({
  stepNumber,
  stepConfig,
  selectedBlockId,
  onBlockSelect,
  onBlockUpdate,
  className,
}) => {
  const {
    blocks = [],
    layout = 'vertical',
    spacing = 'md',
    background,
    padding = 'p-6',
  } = stepConfig;

  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
  };

  const layoutClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row flex-wrap gap-4',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  };

  return (
    <div
      className={cn(
        'step-template w-full min-h-screen',
        padding,
        layoutClasses[layout],
        layout === 'vertical' && spacingClasses[spacing],
        background && `bg-${background}`,
        className
      )}
      data-step={stepNumber}
      data-step-id={stepConfig.id}
    >
      {/* Header do Step (opcional) */}
      {stepConfig.title && (
        <div className="step-header mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Etapa {stepNumber}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {stepConfig.title}
          </h1>
          {stepConfig.description && (
            <p className="text-muted-foreground mt-2">
              {stepConfig.description}
            </p>
          )}
        </div>
      )}

      {/* Renderização dos Blocos */}
      <div className={cn(
        'step-content flex-1',
        layout === 'vertical' && spacingClasses[spacing],
        layout === 'horizontal' && 'flex flex-wrap gap-4',
        layout === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      )}>
        {blocks.map((block) => (
          <div
            key={block.id}
            className={cn(
              'block-container transition-all duration-200',
              selectedBlockId === block.id && 'ring-2 ring-primary ring-offset-2'
            )}
          >
            <ConsolidatedBlockRenderer
              block={block}
              isSelected={selectedBlockId === block.id}
              onClick={() => onBlockSelect?.(block.id)}
              onPropertyChange={(key, value) => 
                onBlockUpdate?.(block.id, { 
                  properties: { ...block.properties, [key]: value } 
                })
              }
            />
          </div>
        ))}
      </div>

      {/* Footer do Step (opcional) */}
      {blocks.length === 0 && (
        <div className="step-empty flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">
                {stepNumber}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Step {stepNumber} Template</h3>
              <p className="text-sm text-muted-foreground">
                Adicione blocos para começar a construir este step
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseStepTemplate;