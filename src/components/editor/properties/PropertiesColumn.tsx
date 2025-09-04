import React, { Suspense, useState } from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Import the enhanced NOCODE properties panel
const EnhancedNocodePropertiesPanel = React.lazy(
  () => import('@/components/editor/properties/EnhancedNoCodePropertiesPanel').then(module => ({
    default: module.EnhancedNoCodePropertiesPanel
  }))
);

// Import the specialized Multiple Choice Options Panel
const MultipleChoiceOptionsPanel = React.lazy(
  () => import('@/components/editor/properties/MultipleChoiceOptionsPanel')
);

// Import the modern LEVA panel
const ModernLevaPropertiesPanel = React.lazy(
  () => import('@/components/editor/properties/ModernLevaPropertiesPanel')
);

// Fallback to original panel if needed
const PropertiesPanel = React.lazy(
  () => import('@/components/editor/properties/PropertiesPanel')
);

export interface PropertiesColumnProps {
  selectedBlock: Block | undefined;
  onUpdate: (updates: Record<string, any>) => void;
  onClose: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onReset?: () => void;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
  onPreviewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  className?: string;
  currentStep?: number;
  totalSteps?: number;
  onStepChange?: (step: number) => void;
  useEnhancedPanel?: boolean; // Feature flag to enable new NOCODE panel
}

export const PropertiesColumn: React.FC<PropertiesColumnProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete,
  onDuplicate,
  onReset,
  previewMode,
  onPreviewModeChange,
  currentStep = 1,
  totalSteps = 21,
  useEnhancedPanel = true, // Enable by default
  className = '',
}) => {
  // State para alternar entre diferentes tipos de painel
  const [panelType, setPanelType] = useState<'traditional' | 'specialized' | 'modern-leva'>('specialized');

  return (
    <div
      className={cn(
        'flex-shrink-0 h-screen sticky top-0 overflow-y-auto bg-white border-l border-gray-200 flex flex-col',
        'w-[24rem] min-w-[24rem] max-w-[24rem]', // Slightly wider for better UX
        className
      )}
    >
      {/* Panel Type Switcher */}
      {selectedBlock && (
        <div className="p-3 border-b bg-gray-50">
          <div className="text-xs text-gray-600 mb-2">🎛️ Tipo de Painel:</div>
          <div className="flex gap-1 text-xs">
            <Button
              size="sm"
              variant={panelType === 'specialized' ? 'default' : 'outline'}
              onClick={() => setPanelType('specialized')}
              className="text-xs py-1 px-2 h-auto"
            >
              📋 Especializado
            </Button>
            <Button
              size="sm"
              variant={panelType === 'modern-leva' ? 'default' : 'outline'}
              onClick={() => setPanelType('modern-leva')}
              className="text-xs py-1 px-2 h-auto"
            >
              🎯 LEVA Moderno
            </Button>
            <Button
              size="sm"
              variant={panelType === 'traditional' ? 'default' : 'outline'}
              onClick={() => setPanelType('traditional')}
              className="text-xs py-1 px-2 h-auto"
            >
              ⚙️ Tradicional
            </Button>
          </div>
        </div>
      )}

      {selectedBlock ? (
        <Suspense fallback={
          <div className="p-4 text-sm text-gray-600 animate-pulse">
            Carregando painel…
          </div>
        }>
          {/* Render different panels based on selection */}
          {panelType === 'modern-leva' ? (
            <div className="flex-1">
              <div className="p-4 bg-green-50 border-b border-green-200">
                <div className="text-sm font-medium text-green-800">🎯 Painel LEVA Moderno</div>
                <div className="text-xs text-green-600 mt-1">
                  Painel profissional estilo Chrome DevTools - auto-organizador por categorias
                </div>
              </div>
              <ModernLevaPropertiesPanel
                selectedBlock={selectedBlock as any}
                onUpdate={onUpdate}
                onClose={onClose}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            </div>
          ) : panelType === 'specialized' && selectedBlock.type === 'options-grid' ? (
            <MultipleChoiceOptionsPanel
              selectedBlock={selectedBlock as any}
              onUpdate={onUpdate}
              onClose={onClose}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ) : panelType === 'specialized' && useEnhancedPanel ? (
            <EnhancedNocodePropertiesPanel
              selectedBlock={selectedBlock as any}
              onUpdate={onUpdate}
              onClose={onClose}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          ) : (
            <PropertiesPanel
              selectedBlock={selectedBlock as any}
              onUpdate={onUpdate}
              onClose={onClose}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onReset={onReset}
              previewMode={previewMode}
              onPreviewModeChange={onPreviewModeChange}
            />
          )}
        </Suspense>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="space-y-3 text-gray-500">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Painel NOCODE Ativo</h3>
            <p className="text-sm max-w-xs leading-relaxed">
              Clique em qualquer componente no canvas para editar <strong>todas</strong> as suas propriedades através da interface visual moderna
            </p>
            <div className="mt-4 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-full">
              ✨ Sistema NOCODE Completo
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesColumn;
