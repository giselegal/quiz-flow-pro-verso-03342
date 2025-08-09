import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollSyncProvider } from "@/context/ScrollSyncContext";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface FiveColumnLayoutProps {
  stagesPanel: React.ReactNode;
  componentsPanel: React.ReactNode;
  canvas: React.ReactNode;
  propertiesPanel: React.ReactNode;
  quizStepsPanel: React.ReactNode | null;
  className?: string;
}

export const FiveColumnLayout: React.FC<FiveColumnLayoutProps> = ({
  stagesPanel,
  componentsPanel,
  canvas,
  propertiesPanel,
  quizStepsPanel,
  className,
}) => {
  const [collapsedPanels, setCollapsedPanels] = useState({
    stages: false,
    components: false,
    properties: false,
    quizSteps: false,
  });

  return (
    <ScrollSyncProvider>
      <div className={cn("h-full w-full bg-background", className)}>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Coluna 1: Etapas do Funil */}
          <ResizablePanel
            defaultSize={quizStepsPanel ? 12 : 15}
            minSize={10}
            maxSize={20}
            className="min-w-[180px]"
          >
            <div className="h-full border-r border-border/50 bg-card/50">{stagesPanel}</div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Coluna 2: Componentes */}
          <ResizablePanel
            defaultSize={quizStepsPanel ? 15 : 20}
            minSize={12}
            maxSize={25}
            className="min-w-[200px]"
          >
            <div className="h-full border-r border-border/50 bg-card/30">{componentsPanel}</div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Coluna 3: Canvas Principal */}
          <ResizablePanel
            defaultSize={quizStepsPanel ? 35 : 40}
            minSize={25}
            className="min-w-[350px]"
          >
            <div className="h-full bg-background">{canvas}</div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Coluna 4: Etapas do Quiz (condicional) */}
          {quizStepsPanel && (
            <>
              <ResizablePanel defaultSize={18} minSize={15} maxSize={30} className="min-w-[250px]">
                <div className="h-full border-r border-border/50 bg-gradient-to-b from-purple-50/30 to-blue-50/30 dark:from-purple-950/20 dark:to-blue-950/20">
                  {quizStepsPanel}
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />
            </>
          )}

          {/* Coluna 5: Painel de Propriedades */}
          <ResizablePanel
            defaultSize={quizStepsPanel ? 20 : 25}
            minSize={15}
            maxSize={30}
            className="min-w-[250px]"
          >
            <div className="h-full border-l border-border/50 bg-card/30">{propertiesPanel}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ScrollSyncProvider>
  );
};
