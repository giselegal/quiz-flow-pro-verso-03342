import React from 'react';
import { cn } from '@/lib/utils';

export interface LayoutShellProps {
  header: React.ReactNode;
  stepsPanel: React.ReactNode;
  libraryPanel: React.ReactNode;
  canvasPanel: React.ReactNode;
  propsPanel: React.ReactNode;
  duplicateDialog?: React.ReactNode;
  dragOverlay?: React.ReactNode;
  navOverlay?: React.ReactNode;
  panelWidths: { steps: number; library: number; props: number };
  Resizer: React.ComponentType<{ panel: 'steps' | 'library' | 'props'; side: 'right' | 'left' }>;
}

/**
 * LayoutShell
 * Primeira extração modular do editor gigante. Contém apenas estrutura visual e slots.
 * Mantém neutralidade: não contém lógica de estado; tudo vem via props.
 */
export const LayoutShell: React.FC<LayoutShellProps> = ({
  header,
  stepsPanel,
  libraryPanel,
  canvasPanel,
  propsPanel,
  duplicateDialog,
  dragOverlay,
  navOverlay,
  panelWidths,
  Resizer,
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {navOverlay}
      {dragOverlay}
      {/* Header */}
      {header}
      {/* 4 colunas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Steps */}
        <div className="bg-white border-r flex flex-col overflow-y-auto" style={{ width: panelWidths.steps }}>
          {stepsPanel}
        </div>
        <Resizer panel="steps" side="right" />
        {/* Library */}
        <div className="bg-white border-r flex flex-col overflow-y-auto" style={{ width: panelWidths.library }}>
          {libraryPanel}
        </div>
        {/* Canvas */}
        {canvasPanel}
        <Resizer panel="library" side="right" />
        {/* Propriedades */}
        <div className="bg-white border-l flex flex-col overflow-y-auto" style={{ width: panelWidths.props }}>
          {propsPanel}
        </div>
        <Resizer panel="props" side="left" />
      </div>
      {duplicateDialog}
    </div>
  );
};

export default LayoutShell;
