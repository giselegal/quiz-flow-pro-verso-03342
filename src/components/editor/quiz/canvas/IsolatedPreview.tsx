/**
 * 🎯 TK-CANVAS-05: ISOLATED PREVIEW
 * 
 * Preview completamente isolado do contexto do editor.
 * - Usa apenas PreviewProvider + QuizFlowProvider
 * - ZERO acesso a EditorProvider
 * - Carrega apenas runtime de produção
 * - Bundle otimizado sem dependências de edição
 */

import React, { Suspense, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { PreviewProvider } from '@/contexts/ui/PreviewContext';
import { QuizFlowProvider } from '@/contexts/quiz/QuizFlowProvider';
import { PreviewBlock } from './PreviewBlock';
import { Block } from '@/types/editor';
import { Skeleton } from '@/components/ui/skeleton';
import { usePreviewDevice } from '@/contexts/editor/EditorModeContext';

export interface IsolatedPreviewProps {
  blocks: Block[];
  funnelId?: string;
  className?: string;
}

/**
 * Skeleton de carregamento para preview
 */
const PreviewSkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-16 w-full" />
  </div>
);

/**
 * Container de preview com dimensões responsivas
 */
const PreviewContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const previewDevice = usePreviewDevice();
  
  const containerClasses = useMemo(() => {
    return cn(
      'preview-container bg-white overflow-auto transition-all duration-200',
      {
        'w-full': previewDevice === 'desktop',
        'max-w-[375px] mx-auto border-x': previewDevice === 'mobile',
        'max-w-[768px] mx-auto border-x': previewDevice === 'tablet',
      }
    );
  }, [previewDevice]);
  
  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

/**
 * 🎯 ISOLATED PREVIEW COMPONENT
 * Preview isolado que funciona independente do editor
 */
export const IsolatedPreview: React.FC<IsolatedPreviewProps> = ({ 
  blocks, 
  funnelId,
  className 
}) => {
  console.log('🔍 IsolatedPreview render:', {
    blocksCount: blocks.length,
    funnelId,
  });

  // Memoizar sessionData para evitar re-renders
  const sessionData = useMemo(() => ({
    funnelId: funnelId || 'preview',
    startedAt: new Date().toISOString(),
    answers: [],
  }), [funnelId]);

  // Memoizar blocks sorted
  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((a, b) => a.order - b.order);
  }, [blocks]);

  return (
    <div className={cn('isolated-preview h-full', className)}>
      <Suspense fallback={<PreviewSkeleton />}>
        {/* 🎯 PROVIDERS ISOLADOS - Sem EditorProvider */}
        <PreviewProvider>
          <QuizFlowProvider>
            <PreviewContainer>
              <div className="preview-blocks-container">
                {sortedBlocks.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <p className="text-sm">Nenhum bloco para preview</p>
                      <p className="text-xs mt-1">Adicione blocos no editor</p>
                    </div>
                  </div>
                ) : (
                  sortedBlocks.map((block) => (
                    <PreviewBlock
                      key={block.id}
                      block={block}
                      sessionData={sessionData}
                    />
                  ))
                )}
              </div>
            </PreviewContainer>
          </QuizFlowProvider>
        </PreviewProvider>
      </Suspense>
    </div>
  );
};

/**
 * Lazy-loaded version do IsolatedPreview
 */
export const LazyIsolatedPreview = React.lazy(() => 
  Promise.resolve({ default: IsolatedPreview })
);

export default IsolatedPreview;
