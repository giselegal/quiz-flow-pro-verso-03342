import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { ScrollSyncProvider } from '@/context/ScrollSyncContext';

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
            <div className="h-full border-r border-border/50 bg-card/50">{stagesPanel}</div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Coluna 2: Componentes */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="min-w-[250px]">
            <div className="h-full border-r border-border/50 bg-card/30">{componentsPanel}</div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Coluna 3: Canvas Principal */}
          <ResizablePanel defaultSize={40} minSize={30} className="min-w-[400px]">
            <div className="h-full bg-background">{canvas}</div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Coluna 4: Painel de Propriedades */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="min-w-[300px]">
            <div className="h-full border-l border-border/50 bg-card/30">{propertiesPanel}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ScrollSyncProvider>
  );
};
