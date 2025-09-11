import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollSyncProvider } from '@/context/ScrollSyncContext';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isMobile, setIsMobile] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile Layout - Overlay Panels
  if (isMobile) {
    return (
      <ScrollSyncProvider>
        <div className={cn('h-full w-full bg-transparent relative', className)}>
          {/* Mobile Header */}
          <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="text-gray-300 hover:text-white"
            >
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </Button>
            
            <div className="text-sm text-gray-300">Editor</div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="text-gray-300 hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Props
            </Button>
          </div>

          {/* Main Canvas Area */}
          <div className="h-[calc(100%-3rem)] lg:h-full w-full bg-transparent">
            {canvas}
          </div>

          {/* Left Panel Overlay (Stages + Components) */}
          {leftPanelOpen && (
            <div className="absolute inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setLeftPanelOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
                <div className="h-12 border-b border-gray-700 flex items-center justify-between px-4">
                  <span className="text-white font-medium">Navegação</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLeftPanelOpen(false)}
                    className="text-gray-300 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="h-1/2 border-b border-gray-700 overflow-y-auto">
                    <div className="p-2 bg-gray-800 text-xs text-gray-300 border-b border-gray-700">
                      ETAPAS DO FUNIL
                    </div>
                    {stagesPanel}
                  </div>
                  <div className="h-1/2 overflow-y-auto">
                    <div className="p-2 bg-gray-800 text-xs text-gray-300 border-b border-gray-700">
                      COMPONENTES
                    </div>
                    {componentsPanel}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Panel Overlay (Properties) */}
          {rightPanelOpen && (
            <div className="absolute inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setRightPanelOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
                <div className="h-12 border-b border-gray-700 flex items-center justify-between px-4">
                  <span className="text-white font-medium">Propriedades</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRightPanelOpen(false)}
                    className="text-gray-300 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {propertiesPanel}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollSyncProvider>
    );
  }

  // Desktop Layout - Original Resizable Panels
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
