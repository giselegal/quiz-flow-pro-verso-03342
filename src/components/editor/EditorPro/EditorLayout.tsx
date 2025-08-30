import React, { memo } from 'react';
import StepSidebar from '@/components/editor/sidebars/StepSidebar';
import ComponentsSidebar from '@/components/editor/sidebars/ComponentsSidebar';
import PropertiesColumn from '@/components/editor/properties/PropertiesColumn';

interface EditorLayoutProps {
  currentStep: number;
  blocks: any[];
  selectedBlock: any;
  onStepChange: (step: number) => void;
  onComponentSelect: (type: string) => void;
  onBlockSelect: (block: any) => void;
  children: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = memo(({
  currentStep,
  blocks,
  selectedBlock,
  onStepChange,
  onComponentSelect,
  onBlockSelect,
  children
}) => {
  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      {/* 📋 SIDEBAR ESQUERDA - ETAPAS */}
      <aside className="w-72 bg-card border-r border-border flex-shrink-0 overflow-hidden">
        <StepSidebar 
          currentStep={currentStep}
        />
      </aside>

      {/* 🧩 COLUNA CENTRO-ESQUERDA - COMPONENTES */}
      <aside className="w-80 bg-card/50 border-r border-border flex-shrink-0 overflow-hidden">
        <ComponentsSidebar />
      </aside>

      {/* 🎨 ÁREA CENTRAL - CANVAS PRINCIPAL */}
      <main className="flex-1 bg-muted/30 flex flex-col overflow-hidden">
        {children}
      </main>

      {/* ⚙️ SIDEBAR DIREITA - PROPRIEDADES */}
      <aside className="w-80 bg-card border-l border-border flex-shrink-0 overflow-hidden">
        <PropertiesColumn 
          selectedBlock={selectedBlock}
        />
      </aside>
    </div>
  );
});

EditorLayout.displayName = 'EditorLayout';

export default EditorLayout;