import React, { memo, useMemo } from 'react';
import StepSidebar from '@/components/editor/sidebars/StepSidebar';
import ComponentsSidebar from '@/components/editor/sidebars/ComponentsSidebar';
import PropertiesColumn from '@/components/editor/properties/PropertiesColumn';
import type { Block } from '@/types/editor';

interface EditorLayoutProps {
  currentStep: number;
  blocks: Block[];
  selectedBlock: Block | null;
  onStepChange: (step: number) => void;
  onComponentSelect: (type: string) => void;
  onBlockSelect: (id: string) => void;
  onUpdateSelectedBlock?: (updates: Record<string, any>) => void;
  onDeleteSelectedBlock?: () => void;
  children: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = memo(({
  currentStep,
  blocks,
  selectedBlock,
  onStepChange,
  onBlockSelect,
  onUpdateSelectedBlock,
  onDeleteSelectedBlock,
  children
}) => {
  // Derivados para Sidebars existentes
  const stepHasBlocks = useMemo(() => {
    const map: Record<number, boolean> = {};
    for (let i = 1; i <= 21; i++) map[i] = (i === currentStep ? blocks.length > 0 : false);
    return map;
  }, [blocks.length, currentStep]);

  const getStepAnalysis = useMemo(() => (
    (step: number) => ({ icon: 'info', label: `Etapa ${step}`, desc: 'Configuração padrão' })
  ), []);

  const groupedComponents = useMemo(() => ({ Geral: [] as any[] }), []);
  const renderIcon = useMemo(() => ((_name: string) => null as any), []);
  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      {/* 📋 SIDEBAR ESQUERDA - ETAPAS */}
      <aside className="w-72 bg-card border-r border-border flex-shrink-0 overflow-hidden">
        <StepSidebar
          currentStep={currentStep}
          stepHasBlocks={stepHasBlocks}
          onSelectStep={onStepChange}
          getStepAnalysis={getStepAnalysis}
          renderIcon={renderIcon}
        />
      </aside>

      {/* 🧩 COLUNA CENTRO-ESQUERDA - COMPONENTES */}
      <aside className="w-80 bg-card/50 border-r border-border flex-shrink-0 overflow-hidden">
        <ComponentsSidebar groupedComponents={groupedComponents} renderIcon={renderIcon} />
      </aside>

      {/* 🎨 ÁREA CENTRAL - CANVAS PRINCIPAL */}
      <main className="flex-1 bg-muted/30 flex flex-col overflow-hidden">
        {children}
      </main>

      {/* ⚙️ SIDEBAR DIREITA - PROPRIEDADES */}
      <aside className="w-80 bg-card border-l border-border flex-shrink-0 overflow-hidden">
        <PropertiesColumn
          selectedBlock={selectedBlock || undefined}
          onUpdate={(updates) => onUpdateSelectedBlock?.(updates)}
          onClose={() => onBlockSelect('')}
          onDelete={() => onDeleteSelectedBlock?.()}
        />
      </aside>
    </div>
  );
});

EditorLayout.displayName = 'EditorLayout';

export default EditorLayout;