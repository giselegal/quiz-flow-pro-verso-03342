import React, { Suspense } from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
// MIGRADO: Usar SinglePropertiesPanel unificado para resolver IDs duplicados
import { SinglePropertiesPanel } from '@/components/editor/properties/SinglePropertiesPanel';

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
  onDelete,
  onDuplicate: _onDuplicate,
  onReset: _onReset,
  previewMode: _previewMode,
  onPreviewModeChange: _onPreviewModeChange,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex-shrink-0 h-full bg-gray-900/80 backdrop-blur-sm border-l border-gray-700/50 flex flex-col overflow-hidden',
        'w-full', // Use full width within the ResizablePanel container
        className
      )}
    >
      {selectedBlock ? (
        <Suspense fallback={
          <div className="p-4 text-sm text-gray-300 animate-pulse flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Carregando painel aprimorado…
          </div>
        }>
          {/* SinglePropertiesPanel - Painel Unificado com IDs únicos */}
          <div className="flex-1 overflow-hidden">
            <div className="properties-panel h-full max-w-full overflow-x-hidden">
              <SinglePropertiesPanel
                selectedBlock={selectedBlock}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </div>
          </div>
        </Suspense>
      ) : (
        <Suspense fallback={
          <div className="p-4 text-sm text-gray-300 animate-pulse flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Carregando configurações do canvas…
          </div>
        }>
          {/* SinglePropertiesPanel - Estado vazio quando nenhum bloco selecionado */}
          <div className="flex-1 overflow-hidden">
            <div className="properties-panel h-full max-w-full overflow-x-hidden">
              <SinglePropertiesPanel
                selectedBlock={null}
                onUpdate={() => { }}
                onDelete={() => { }}
              />
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default PropertiesColumn;
