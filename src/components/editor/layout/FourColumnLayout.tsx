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
      <div className={cn('h-full w-full bg-transparent', className)}>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Coluna 1: Etapas do Funil */}
          <ResizablePanel defaultSize={12} minSize={10} maxSize={20} className="min-w-[180px]">
            <div className="h-full flex flex-col border-r border-gray-700/50 bg-gray-900/80 backdrop-blur-sm overflow-hidden">
              <div className="h-full overflow-y-auto">{stagesPanel}</div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-gray-700/30 hover:bg-gray-600/50 transition-colors" />

          {/* Coluna 2: Componentes */}
          <ResizablePanel defaultSize={15} minSize={12} maxSize={25} className="min-w-[220px]">
            <div className="h-full flex flex-col border-r border-gray-700/50 bg-gray-900/60 backdrop-blur-sm overflow-hidden">
              <div className="h-full overflow-y-auto">{componentsPanel}</div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-gray-700/30 hover:bg-gray-600/50 transition-colors" />

          {/* Coluna 3: Canvas Principal */}
          <ResizablePanel defaultSize={55} minSize={45} className="min-w-[480px]">
            <div className="h-full flex flex-col bg-transparent">{canvas}</div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-gray-700/30 hover:bg-gray-600/50 transition-colors" />

          {/* Coluna 4: Painel de Propriedades */}
          <ResizablePanel defaultSize={18} minSize={12} maxSize={25} className="min-w-[260px]">
            <div className="h-full flex flex-col border-l border-gray-700/50 bg-gray-900/60 backdrop-blur-sm overflow-hidden">
              <div className="h-full overflow-y-auto">{propertiesPanel}</div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ScrollSyncProvider>
  );
};
