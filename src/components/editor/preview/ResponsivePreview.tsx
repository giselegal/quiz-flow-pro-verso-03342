import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { BlockData } from '@/types/blocks';
import { Clock, Eye, Monitor, RefreshCw, Smartphone, Tablet, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ResponsivePreviewProps {
  blocks?: BlockData[];
  selectedBlockId?: string;
  onBlockSelect?: (blockId: string) => void;
  className?: string;
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

const PREVIEW_DIMENSIONS = {
  desktop: { width: '100%', height: 'auto', maxWidth: '1200px' },
  tablet: { width: '768px', height: 'auto', maxWidth: '768px' },
  mobile: { width: '375px', height: 'auto', maxWidth: '375px' },
};

const DEVICE_FRAMES = {
  desktop: {
    className: 'bg-gray-100 border rounded-lg shadow-lg',
    paddingClass: 'p-4',
  },
  tablet: {
    className: 'bg-gray-900 border-2 border-gray-800 rounded-[2rem] shadow-2xl relative',
    paddingClass: 'p-8 pt-16 pb-16',
  },
  mobile: {
    className: 'bg-gray-900 border-2 border-gray-800 rounded-[3rem] shadow-2xl relative',
    paddingClass: 'p-6 pt-16 pb-20',
  },
};

const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  blocks = [],
  selectedBlockId,
  onBlockSelect,
  className,
}) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadTime, setLoadTime] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const endTime = Date.now();
    setLoadTime(endTime - startTimeRef.current);
  }, [blocks]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    startTimeRef.current = Date.now();

    // Simular refresh
    await new Promise(resolve => setTimeout(resolve, 300));

    setIsRefreshing(false);
    const endTime = Date.now();
    setLoadTime(endTime - startTimeRef.current);
  };

  const getPreviewStyles = () => {
    const dimensions = PREVIEW_DIMENSIONS[previewMode];
    return {
      width: dimensions.width,
      maxWidth: dimensions.maxWidth,
      minHeight: '400px',
      margin: '0 auto',
      transition: 'all 0.3s ease-in-out',
      transform: previewMode === 'mobile' ? 'scale(0.9)' : 'scale(1)',
    };
  };

  const renderDeviceFrame = (children: React.ReactNode) => {
    const frame = DEVICE_FRAMES[previewMode];

    return (
      <div
        className={cn(frame.className, 'transition-all duration-300')}
        style={getPreviewStyles()}
      >
        {/* Device-specific decorations */}
        {previewMode === 'tablet' && (
          <>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-gray-700 rounded-full" />
          </>
        )}

        {previewMode === 'mobile' && (
          <>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full" />
            <div className="absolute top-6 right-6 w-2 h-2 bg-gray-700 rounded-full" />
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full" />
          </>
        )}

        <div className={cn(frame.paddingClass, 'bg-white rounded-lg overflow-auto h-full')}>
          {children}
        </div>
      </div>
    );
  };

  const renderBlock = (block: BlockData) => {
    const isSelected = block.id === selectedBlockId;

    return (
      <div
        key={block.id}
        className={cn(
          'relative transition-all duration-200 cursor-pointer group',
          isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2'
        )}
        onClick={() => onBlockSelect?.(block.id)}
      >
        {/* Preview do bloco */}
        <div style={{ borderColor: '#E5DDD5' }}>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {block.type}
            </Badge>
            {isSelected && <Badge className="bg-[#B89B7A] text-white text-xs">Selecionado</Badge>}
          </div>

          {/* Simulação do conteúdo do bloco */}
          <div className="space-y-2">
            {block.properties?.content && (
              <p style={{ color: '#432818' }}>{block.properties.content}</p>
            )}
            {block.properties?.title && (
              <h3 style={{ color: '#432818' }}>{block.properties.title}</h3>
            )}
            {block.properties?.imageUrl && (
              <div style={{ borderColor: '#E5DDD5' }}>
                <span style={{ color: '#8B7355' }}>Imagem</span>
              </div>
            )}
          </div>
        </div>

        {/* Overlay de hover */}
        <div
          className={cn(
            'absolute inset-0 bg-[#B89B7A]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none',
            isSelected && 'opacity-20'
          )}
        />
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Card className={cn('h-full flex flex-col', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-[#432818] flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview Responsivo
            </CardTitle>

            <div className="flex items-center gap-2">
              {/* Métricas de performance */}
              <div style={{ color: '#6B4F43' }}>
                <Clock className="w-3 h-3" />
                {loadTime}ms
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Controles de preview */}
              <div style={{ backgroundColor: '#E5DDD5' }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className="px-2"
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Desktop (1200px+)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('tablet')}
                      className="px-2"
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tablet (768px)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className="px-2"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mobile (375px)</TooltipContent>
                </Tooltip>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                    <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Atualizar Preview</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Informações do modo atual */}
          <div style={{ color: '#6B4F43' }}>
            <Badge variant="secondary" className="bg-[#B89B7A]/10 text-[#432818]">
              {previewMode === 'desktop'
                ? 'Desktop'
                : previewMode === 'tablet'
                  ? 'Tablet'
                  : 'Mobile'}
            </Badge>
            <span>•</span>
            <span>{PREVIEW_DIMENSIONS[previewMode].maxWidth}</span>
            <span>•</span>
            <span>{blocks.length} blocos</span>
          </div>
        </CardHeader>

        <CardContent style={{ backgroundColor: '#FAF9F7' }}>
          <div ref={previewRef} className="min-h-full p-4">
            {blocks.length > 0 ? (
              renderDeviceFrame(
                <div className="space-y-4">{blocks.map(block => renderBlock(block))}</div>
              )
            ) : (
              <div style={{ color: '#8B7355' }}>
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Nenhum bloco para preview</p>
                  <p className="text-sm">Adicione blocos para ver o preview</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* Performance indicator */}
        <div style={{ backgroundColor: '#FAF9F7' }}>
          <div style={{ color: '#6B4F43' }}>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3" />
              <span>Tempo de renderização: {loadTime}ms</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  loadTime < 100 ? 'bg-green-500' : loadTime < 300 ? 'bg-yellow-500' : 'bg-red-500'
                )}
              />
              <span>{loadTime < 100 ? 'Excelente' : loadTime < 300 ? 'Bom' : 'Lento'}</span>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default ResponsivePreview;
