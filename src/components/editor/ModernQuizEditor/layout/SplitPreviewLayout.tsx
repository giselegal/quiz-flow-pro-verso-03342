/**
 * 🔀 Split Preview Layout - Canvas + Preview lado a lado
 * 
 * Layout redimensionável com:
 * - Steps panel (fixo)
 * - Canvas (redimensionável)
 * - Preview (redimensionável)
 * - Properties panel (fixo)
 */

import React, { memo, Suspense, lazy, useState, useCallback } from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { StepPanel } from './StepPanel';
import { BlockLibrary } from './BlockLibrary';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { useDndHandlers } from '../hooks/useDndHandlers';
import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';
import { Eye, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Lazy load preview component
const LivePreview = lazy(() => import('../components/LivePreview'));

type DevicePreview = 'mobile' | 'tablet' | 'desktop';

const deviceWidths: Record<DevicePreview, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
};

export const SplitPreviewLayout = memo(function SplitPreviewLayout() {
  const [devicePreview, setDevicePreview] = useState<DevicePreview>('mobile');
  
  // DnD setup
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );
  const { handleDragStart, handleDragEnd } = useDndHandlers();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full w-full overflow-hidden">
        {/* Steps Panel - Fixo */}
        <StepPanel />

        {/* Block Library - Fixo */}
        <BlockLibrary />

        {/* Área redimensionável: Canvas + Preview */}
        <ResizablePanelGroup 
          direction="horizontal" 
          className="flex-1"
        >
          {/* Canvas Panel */}
          <ResizablePanel 
            defaultSize={55} 
            minSize={30}
            className="bg-muted/30"
          >
            <Canvas />
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle 
            withHandle 
            className="w-2 bg-border hover:bg-primary/20 transition-colors"
          />

          {/* Preview Panel */}
          <ResizablePanel 
            defaultSize={45} 
            minSize={25}
            className="bg-background border-l border-border"
          >
            <div className="h-full flex flex-col">
              {/* Preview Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Preview</span>
                </div>
                
                {/* Device Selector */}
                <TooltipProvider>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={devicePreview === 'mobile' ? 'secondary' : 'ghost'}
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setDevicePreview('mobile')}
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Mobile (375px)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={devicePreview === 'tablet' ? 'secondary' : 'ghost'}
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setDevicePreview('tablet')}
                        >
                          <Tablet className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Tablet (768px)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={devicePreview === 'desktop' ? 'secondary' : 'ghost'}
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setDevicePreview('desktop')}
                        >
                          <Monitor className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Desktop (100%)</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-auto p-4 bg-[#1a1a2e] flex items-start justify-center">
                <div 
                  className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
                  style={{ 
                    width: deviceWidths[devicePreview],
                    maxWidth: '100%',
                    minHeight: '500px',
                  }}
                >
                  <Suspense fallback={
                    <div className="h-full min-h-[500px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin text-3xl mb-2">⏳</div>
                        <p className="text-sm text-muted-foreground">Carregando preview...</p>
                      </div>
                    </div>
                  }>
                    <LivePreview deviceWidth={deviceWidths[devicePreview]} />
                  </Suspense>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Properties Panel - Fixo */}
        <PropertiesPanel />
      </div>
    </DndContext>
  );
});

export default SplitPreviewLayout;
