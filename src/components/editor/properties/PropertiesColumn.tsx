import React, { Suspense, useEffect } from 'react';
import { appLogger } from '@/utils/logger';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import { SinglePropertiesPanel } from './SinglePropertiesPanel';
import { loadDefaultSchemas } from '@/core/schema/loadDefaultSchemas';

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
  onDuplicate,
  className = '',
}) => {
  // ✅ CRÍTICO: Garantir que schemas estão carregados
  useEffect(() => {
    loadDefaultSchemas();
    appLogger.debug('🔧 [PropertiesColumn] Schemas carregados');
  }, []);

  // Debug logs
  React.useEffect(() => {
    appLogger.debug('🏗️  PropertiesColumn renderizado:', {
      hasSelectedBlock: !!selectedBlock,
      selectedBlockType: selectedBlock?.type,
      selectedBlockId: selectedBlock?.id,
      hasProperties: !!selectedBlock?.properties,
      hasContent: !!selectedBlock?.content,
      propertiesKeys: selectedBlock?.properties ? Object.keys(selectedBlock.properties) : [],
      contentKeys: selectedBlock?.content ? Object.keys(selectedBlock.content) : [],
    });
  }, [selectedBlock]);

  const handleUpdate = React.useCallback((updates: Record<string, any>) => {
    appLogger.debug('🔄 PropertiesColumn -> SinglePropertiesPanel update:', updates);
    onUpdate(updates);
  }, [onUpdate]);

  const handleDelete = React.useCallback(() => {
    appLogger.debug('🗑️  PropertiesColumn -> Delete selected block');
    onDelete();
  }, [onDelete]);

  const handleDuplicate = React.useCallback(() => {
    appLogger.debug('📋 PropertiesColumn -> Duplicate selected block');
    onDuplicate?.();
  }, [onDuplicate]);

  return (
    <div
      className={cn(
        'h-full bg-background border-l border-border flex flex-col',
        'w-full',
        className,
      )}
    >
      <Suspense fallback={
        <div className="p-4 text-sm text-muted-foreground animate-pulse flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Carregando painel otimizado...
        </div>
      }>
        <SinglePropertiesPanel
          selectedBlock={selectedBlock || null}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      </Suspense>
    </div>
  );
};

export default PropertiesColumn;
