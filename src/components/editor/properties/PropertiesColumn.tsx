import React, { Suspense } from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';

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
  return (
    <div
      className={cn(
        'flex-shrink-0 h-screen sticky top-0 overflow-y-auto bg-white border-l border-gray-200 flex flex-col',
        'w-[24rem] min-w-[24rem] max-w-[24rem]', // Slightly wider for better UX
        className
      )}
    >
      {selectedBlock ? (
        <Suspense fallback={
          <div className="p-4 text-sm text-gray-600 animate-pulse">
            Carregando painel NOCODE…
          </div>
        }>
          {/* Use specialized panel for options-grid blocks */}
          {selectedBlock.type === 'options-grid' ? (
            <MultipleChoiceOptionsPanel
              selectedBlock={selectedBlock as any}
              onUpdate={onUpdate}
              onClose={onClose}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ) : useEnhancedPanel ? (
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
