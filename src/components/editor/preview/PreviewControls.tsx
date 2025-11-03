/**
 * 🎯 FASE 8.2: Preview Controls
 * 
 * Controles avançados para o preview:
 * - Seleção de viewport (mobile, tablet, desktop)
 * - Controles de zoom
 * - Toggle dark/light mode
 * - Refresh e fullscreen
 */

import { Monitor, Smartphone, Tablet, ZoomIn, ZoomOut, RotateCcw, Maximize2, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';

export type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'custom';

export interface PreviewControlsProps {
  viewport: ViewportSize;
  onViewportChange: (viewport: ViewportSize) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onRefresh: () => void;
  onFullscreen?: () => void;
}

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5];

export function PreviewControls({
  viewport,
  onViewportChange,
  zoom,
  onZoomChange,
  isDarkMode,
  onDarkModeToggle,
  onRefresh,
  onFullscreen,
}: PreviewControlsProps) {
  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      onZoomChange(ZOOM_LEVELS[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex > 0) {
      onZoomChange(ZOOM_LEVELS[currentIndex - 1]);
    }
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Viewport Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant={viewport === 'mobile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewportChange('mobile')}
          className="h-8 w-8 p-0"
          title="Mobile (375px)"
        >
          <Smartphone className="h-4 w-4" />
        </Button>
        <Button
          variant={viewport === 'tablet' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewportChange('tablet')}
          className="h-8 w-8 p-0"
          title="Tablet (768px)"
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button
          variant={viewport === 'desktop' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewportChange('desktop')}
          className="h-8 w-8 p-0"
          title="Desktop (1440px)"
        >
          <Monitor className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= ZOOM_LEVELS[0]}
          className="h-8 w-8 p-0"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <Select value={zoom.toString()} onValueChange={(v) => onZoomChange(parseFloat(v))}>
          <SelectTrigger className="h-8 w-20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ZOOM_LEVELS.map((level) => (
              <SelectItem key={level} value={level.toString()}>
                {Math.round(level * 100)}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
          className="h-8 w-8 p-0"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {zoom !== 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomReset}
            className="h-8 px-2 text-xs"
            title="Reset Zoom"
          >
            Reset
          </Button>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Theme Toggle */}
      <Toggle
        pressed={isDarkMode}
        onPressedChange={onDarkModeToggle}
        className="h-8 w-8 p-0"
        title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
      >
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Toggle>

      <Separator orientation="vertical" className="h-6" />

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="h-8 w-8 p-0"
          title="Refresh Preview"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        {onFullscreen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFullscreen}
            className="h-8 w-8 p-0"
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Viewport Info */}
      <div className="ml-auto text-xs text-muted-foreground">
        {viewport === 'mobile' && '375 × 667'}
        {viewport === 'tablet' && '768 × 1024'}
        {viewport === 'desktop' && '1440 × 900'}
      </div>
    </div>
  );
}
