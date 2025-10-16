/**
 * 🎯 ISOLATED PREVIEW - Simplificado com UnifiedCanvas
 * 
 * Preview que usa UnifiedCanvas em modo 'preview'.
 * - Usa PreviewProvider + QuizFlowProvider
 * - Conecta ao EditorContext apenas para sincronização
 * - Renderiza componentes finais 100% produção
 */

import React, { Suspense, useMemo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { PreviewProvider } from '@/contexts/ui/PreviewContext';
import { QuizFlowProvider } from '@/contexts/quiz/QuizFlowProvider';
import { Block } from '@/types/editor';
import { Skeleton } from '@/components/ui/skeleton';
import { usePreviewDevice } from '@/contexts/editor/EditorModeContext';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { UnifiedCanvas } from '../components/UnifiedCanvas';

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
 * Preview isolado usando UnifiedCanvas em modo 'preview'
 */
export const IsolatedPreview: React.FC<IsolatedPreviewProps> = ({ 
  blocks, 
  funnelId,
  className 
}) => {
  // 🎯 Conectar ao editor context para sincronização
  const editorCtx = useEditor({ optional: true } as any);
  const selectedBlockId = editorCtx?.state?.selectedBlockId;
  
  // 🎯 Estado local de preview (session data)
  const [sessionData, setSessionData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(1);
  
  console.log('🔍 IsolatedPreview render:', {
    blocksCount: blocks.length,
    funnelId,
    selectedBlockId,
    hasEditorContext: !!editorCtx
  });

  // 🎯 Reagir a mudanças nos blocos
  useEffect(() => {
    console.log('⚡ Preview atualizado:', {
      blocksCount: blocks.length,
      selectedBlock: selectedBlockId,
      timestamp: Date.now()
    });
  }, [blocks, selectedBlockId]);

  // Atualizar session data
  const handleUpdateSessionData = (key: string, value: any) => {
    setSessionData(prev => ({ ...prev, [key]: value }));
  };

  // Criar step fake para UnifiedCanvas
  const previewStep = useMemo(() => ({
    id: 'preview-step',
    type: 'question' as any,
    order: 1,
    blocks: blocks.map(block => ({
      ...block,
      properties: block.properties || {}
    })) as any,
    nextStep: undefined
  }), [blocks]);

  return (
    <div className={cn('isolated-preview h-full', className)}>
      <Suspense fallback={<PreviewSkeleton />}>
        {/* 🎯 PROVIDERS ISOLADOS */}
        <PreviewProvider>
          <QuizFlowProvider>
            <PreviewContainer>
              {/* 🎯 USAR UNIFIED CANVAS EM MODO PREVIEW */}
              <UnifiedCanvas
                steps={[previewStep]}
                selectedStep={previewStep}
                mode="preview"
                sessionData={sessionData}
                onUpdateSessionData={handleUpdateSessionData}
                onStepChange={setCurrentStep}
              />
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
