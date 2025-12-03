/**
 * 🎛️ NOCODE PROPERTIES PANEL - VERSÃO LIMPA E FUNCIONAL
 * 
 * Painel simplificado focado no essencial para o sistema NOCODE
 */

import React from 'react';
// DEPRECATED: UniversalNoCodePanel foi removido - usar SinglePropertiesPanel
// import { default as UniversalNoCodePanel } from '@/archive/legacy-panels/UniversalNoCodePanel';
import type { Block } from '@/types/editor';

interface NoCodePropertiesPanelCleanProps {
  selectedBlock?: Block | null;
  activeStageId: string;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onDuplicate?: (blockId: string) => void;
  onDelete?: (blockId: string) => void;
  onReset?: (blockId: string) => void;
}

// DEPRECATED: Componente desabilitado - depende de UniversalNoCodePanel que foi removido
// Use SinglePropertiesPanel diretamente
export const NoCodePropertiesPanelClean: React.FC<NoCodePropertiesPanelCleanProps> = ({
  selectedBlock,
  activeStageId,
  onUpdate,
  onDuplicate,
  onDelete,
  onReset,
}) => {
  return (
    <div className="h-full w-full">
      <UniversalNoCodePanel
        selectedBlock={selectedBlock}
        activeStageId={activeStageId}
        onUpdate={onUpdate}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onReset={onReset}
      />
    </div>
  );
};

export default NoCodePropertiesPanelClean;