import React, { memo, useMemo } from 'react';
import StepSidebar from '@/components/editor/sidebars/StepSidebar';
import ComponentsSidebar from '@/components/editor/sidebars/ComponentsSidebar';
import PropertiesColumn from '@/components/editor/properties/PropertiesColumn';
import type { Block } from '@/types/editor';
import type { ComponentsSidebarProps } from '@/components/editor/sidebars/ComponentsSidebar';

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
  // Dados opcionais para substituir stubs internos
  groupedComponents?: ComponentsSidebarProps['groupedComponents'];
  renderIcon?: ComponentsSidebarProps['renderIcon'];
  getStepAnalysis?: (step: number) => { icon: string; label: string; desc: string };
  stepValidation?: Record<number, boolean>;
}

const EditorLayout: React.FC<EditorLayoutProps> = memo(({
  currentStep,
  blocks,
  selectedBlock,
  onStepChange,
  onBlockSelect,
  onUpdateSelectedBlock,
  onDeleteSelectedBlock,
  children,
  groupedComponents: groupedComponentsProp,
  renderIcon: renderIconProp,
  getStepAnalysis: getStepAnalysisProp,
  stepValidation
}) => {
  // Derivados para Sidebars existentes
  const stepHasBlocks = useMemo(() => {
    const map: Record<number, boolean> = {};
    for (let i = 1; i <= 21; i++) map[i] = (i === currentStep ? blocks.length > 0 : false);
    return map;
  }, [blocks.length, currentStep]);

  const getStepAnalysis = useMemo(() => (
    getStepAnalysisProp || ((step: number) => ({ icon: 'info', label: `Etapa ${step}`, desc: 'Configuração padrão' }))
  ), [getStepAnalysisProp]);

  const groupedComponents = useMemo(
    () => groupedComponentsProp || ({ Geral: [] as any[] }),
    [groupedComponentsProp]
  );
  const renderIcon = useMemo(
    () => renderIconProp || ((_name: string) => null as any),
    [renderIconProp]
  );
  return (
    <div className="flex-1 flex bg-background text-foreground overflow-hidden">
      {/* 📋 SIDEBAR ESQUERDA - ETAPAS */}
      <aside className="w-72 bg-card border-r border-border flex-shrink-0 overflow-hidden">
        <StepSidebar
          currentStep={currentStep}
          stepHasBlocks={stepHasBlocks}
          onSelectStep={onStepChange}
          getStepAnalysis={getStepAnalysis}
          renderIcon={renderIcon}
          stepValidation={stepValidation}
        />
      </aside>

      {/* 🧩 COLUNA CENTRO-ESQUERDA - COMPONENTES */}
      <aside className="w-80 bg-card/50 border-r border-border flex-shrink-0 overflow-hidden">
        <ComponentsSidebar groupedComponents={groupedComponents} renderIcon={renderIcon} />
      </aside>

      {/* 🎨 ÁREA CENTRAL - CANVAS PRINCIPAL */}
      <main className="flex-1 min-h-0 bg-muted/30 flex flex-col overflow-hidden">
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