import React, { Suspense } from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UniversalNoCodePanel } from './UniversalNoCodePanel';

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
  // Debug logs
  React.useEffect(() => {
    console.log('🏗️  PropertiesColumn renderizado:', {
      hasSelectedBlock: !!selectedBlock,
      selectedBlockType: selectedBlock?.type,
      selectedBlockId: selectedBlock?.id
    });
  }, [selectedBlock]);

  return (
    <div
      className={cn(
        'h-full bg-gray-900/80 backdrop-blur-sm border-l border-gray-700/50 flex flex-col',
        'w-full', // Use full width within its container
        className
      )}
    >
      <ScrollArea className="h-full w-full">
        {selectedBlock ? (
          <Suspense fallback={
            <div className="p-4 text-sm text-gray-300 animate-pulse flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Carregando painel NOCODE avançado…
            </div>
          }>
            {/* UniversalNoCodePanel - Painel completo com todas as configurações */}
            <UniversalNoCodePanel
              selectedBlock={selectedBlock}
              activeStageId="current-step"
              onUpdate={(blockId: string, updates: Record<string, any>) => {
                console.log('🔄 PropertiesColumn -> UniversalNoCodePanel update:', { blockId, updates });
                console.log('🔄 Chamando onUpdate com:', updates);
                onUpdate(updates);
              }}
              onDelete={onDelete}
            />
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
            {/* UniversalNoCodePanel - Estado vazio quando nenhum bloco selecionado */}
            <UniversalNoCodePanel
              selectedBlock={null}
              activeStageId="current-step"
              onUpdate={() => { }}
              onDelete={() => { }}
            />
          </Suspense>
        )}
      </ScrollArea>
    </div>
  );
};

export default PropertiesColumn;
