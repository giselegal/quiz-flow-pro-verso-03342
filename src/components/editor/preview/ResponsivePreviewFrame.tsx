/**
 * 🎯 FASE 8.2: Responsive Preview Frame
 * 
 * Wrapper do iframe com controles de viewport e zoom
 */

import { useState } from 'react';
import { IsolatedPreviewIframe } from './IsolatedPreviewIframe';
import { PreviewControls, ViewportSize } from './PreviewControls';

export interface ResponsivePreviewFrameProps {
  quizContent: any;
  currentStepId: string | null;
  onStepChange?: (stepId: string) => void;
  onBlockSelect?: (blockId: string) => void;
}

const VIEWPORT_DIMENSIONS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
  custom: { width: 1440, height: 900 },
};

export function ResponsivePreviewFrame({
  quizContent,
  currentStepId,
  onStepChange,
  onBlockSelect,
}: ResponsivePreviewFrameProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [zoom, setZoom] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const dimensions = VIEWPORT_DIMENSIONS[viewport];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full">
      <PreviewControls
        viewport={viewport}
        onViewportChange={setViewport}
        zoom={zoom}
        onZoomChange={setZoom}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        onRefresh={handleRefresh}
      />

      <div className="flex-1 overflow-auto bg-muted/20 p-8">
        <div
          className="mx-auto transition-all duration-300 ease-out bg-background shadow-2xl rounded-lg overflow-hidden"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
        >
          <div className={isDarkMode ? 'dark' : ''}>
            <IsolatedPreviewIframe
              key={refreshKey}
              quizContent={quizContent}
              currentStepId={currentStepId || undefined}
              onStepChange={onStepChange}
              onBlockSelect={onBlockSelect}
              darkMode={isDarkMode}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Device Frame Overlay (opcional) */}
      {viewport === 'mobile' && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center">
          <div
            className="relative border-[14px] border-gray-800 rounded-[3rem] shadow-xl"
            style={{
              width: dimensions.width + 28,
              height: dimensions.height + 28,
              transform: `scale(${zoom})`,
            }}
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
