import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollSyncProvider } from '@/context/ScrollSyncContext';
import { cn } from '@/lib/utils';

interface FourColumnLayoutProps {
  stagesPanel: React.ReactNode;
  componentsPanel: React.ReactNode;
  canvas: React.ReactNode;
  propertiesPanel: React.ReactNode;
  className?: string;
}

export const FourColumnLayout: React.FC<FourColumnLayoutProps> = ({
  stagesPanel,
  componentsPanel,
  canvas,
  propertiesPanel,
  className,
}) => {
  return (
    <ScrollSyncProvider>
      <div className={cn('h-full w-full bg-background', className)}>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Coluna 1: Etapas do Funil */}
          <ResizablePanel defaultSize={15} minSize={12} maxSize={25} className="min-w-[200px]">
            <div className="h-full flex flex-col border-r border-border/50 bg-card/50 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {stagesPanel}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Coluna 2: Componentes */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="min-w-[250px]">
            <div className="h-full flex flex-col border-r border-border/50 bg-card/30 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {componentsPanel}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Coluna 3: Canvas Principal */}
          <ResizablePanel defaultSize={40} minSize={30} className="min-w-[400px]">
            <div className="h-full flex flex-col bg-background">{canvas}</div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Coluna 4: Painel de Propriedades */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="min-w-[300px]">
            <div className="h-full flex flex-col border-l border-border/50 bg-card/30 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {propertiesPanel}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ScrollSyncProvider>
  );
};
