import React, { Suspense } from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';

// Import the enhanced properties panel with 100% coverage
const EnhancedPropertiesPanel = React.lazy(
  () => import('@/components/editor/properties/EnhancedPropertiesPanel')
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
}

export const PropertiesColumn: React.FC<PropertiesColumnProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete,
  onDuplicate,
  onReset: _onReset,
  previewMode: _previewMode,
  onPreviewModeChange: _onPreviewModeChange,
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
          <div className="p-4 text-sm text-gray-600 animate-pulse flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Carregando painel aprimorado…
          </div>
        }>
          {/* Enhanced Properties Panel with 100% Coverage */}
          <div className="flex-1">
            <EnhancedPropertiesPanel
              selectedBlock={selectedBlock as any}
              onUpdate={onUpdate}
              onClose={onClose}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          </div>
        </Suspense>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="space-y-4 text-gray-500">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl mx-auto flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-emerald-700 mb-2">🚀 Painel Aprimorado</h3>
              <p className="text-sm max-w-xs leading-relaxed mb-3">
                Selecione qualquer componente para editar suas propriedades com <strong>100% de cobertura</strong>
              </p>
              <div className="space-y-2">
                <div className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                  ✅ 136+ Blocos Suportados
                </div>
                <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                  🎛️ Interface Profissional
                </div>
                <div className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block">
                  ⚡ Schema Dinâmico
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesColumn;
