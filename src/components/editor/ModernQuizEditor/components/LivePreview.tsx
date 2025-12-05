/**
 * 👁️ LivePreview - Preview em tempo real do quiz
 * 
 * Renderiza o quiz atual como seria visto pelo usuário final.
 * 
 * ✅ REFATORADO: Agora usa LazyBlockRenderer para 100% de cobertura
 * de todos os tipos de blocos registrados no UnifiedBlockRegistry.
 */

import React, { memo, useMemo, Suspense } from 'react';
import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';
import { cn } from '@/lib/utils';
import { LazyBlockRenderer } from '@/components/editor/blocks/LazyBlockRenderer';
import type { Block } from '@/types/editor';

interface LivePreviewProps {
  deviceWidth?: string;
  className?: string;
}

const LivePreview = memo(function LivePreview({ 
  deviceWidth = '100%',
  className = '' 
}: LivePreviewProps) {
  const quiz = useQuizStore((s) => s.quiz);
  const selectedStepId = useEditorStore((s) => s.selectedStepId);

  // Encontrar o step selecionado ou usar o primeiro
  const currentStep = useMemo(() => {
    if (!quiz?.steps) return null;
    return quiz.steps.find(s => s.id === selectedStepId) || quiz.steps[0];
  }, [quiz?.steps, selectedStepId]);

  if (!quiz || !currentStep) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">📋</p>
          <p className="text-sm">Nenhum quiz carregado</p>
        </div>
      </div>
    );
  }

  const primaryColor = quiz.theme?.colors?.primary || '#3b82f6';

  return (
    <div 
      className={cn("min-h-[500px] p-4", className)}
      style={{ 
        fontFamily: quiz.theme?.fonts?.body || 'system-ui',
        backgroundColor: quiz.theme?.colors?.background || '#ffffff',
        color: quiz.theme?.colors?.text || '#1a1a1a',
      }}
    >
      {/* Progress indicator */}
      {quiz.settings?.navigation?.showProgress && (
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1 opacity-60">
            <span>Pergunta {currentStep.order || 1}</span>
            <span>{quiz.steps.length} perguntas</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${((currentStep.order || 1) / quiz.steps.length) * 100}%`,
                backgroundColor: primaryColor,
              }}
            />
          </div>
        </div>
      )}

      {/* Blocks - usando LazyBlockRenderer para 100% de cobertura */}
      <div className="space-y-4">
        {currentStep.blocks?.map((block: any) => (
          <PreviewBlockWrapper 
            key={block.id} 
            block={block} 
            theme={quiz.theme}
            totalSteps={quiz.steps.length}
            currentStepOrder={currentStep.order || 1}
          />
        ))}
      </div>
    </div>
  );
});

/**
 * Wrapper que converte QuizBlock para Block e renderiza via LazyBlockRenderer
 * Garante 100% de cobertura de todos os tipos registrados no UnifiedBlockRegistry
 */
interface PreviewBlockWrapperProps {
  block: any;
  theme?: any;
  totalSteps?: number;
  currentStepOrder?: number;
}

const PreviewBlockWrapper = memo(function PreviewBlockWrapper({ 
  block, 
  theme,
  totalSteps = 21,
  currentStepOrder = 1
}: PreviewBlockWrapperProps) {
  // Converter para formato Block compatível com LazyBlockRenderer
  const editorBlock = useMemo((): Block => ({
    id: block.id,
    type: block.type as any,
    properties: {
      ...block.properties,
      // Injetar dados de contexto para blocos que precisam
      _previewContext: {
        theme,
        totalSteps,
        currentStepOrder,
        primaryColor: theme?.colors?.primary || '#3b82f6',
        textColor: theme?.colors?.text || '#1a1a1a',
      },
    },
    content: block.content || {},
    order: block.order ?? 0,
  }), [block, theme, totalSteps, currentStepOrder]);

  return (
    <div 
      className="preview-block-wrapper"
      style={{
        // Aplicar cores do tema ao wrapper
        '--preview-primary': theme?.colors?.primary || '#3b82f6',
        '--preview-text': theme?.colors?.text || '#1a1a1a',
        '--preview-background': theme?.colors?.background || '#ffffff',
      } as React.CSSProperties}
    >
      <Suspense 
        fallback={
          <div className="animate-pulse h-12 bg-muted/50 rounded-lg" />
        }
      >
        <LazyBlockRenderer
          block={editorBlock}
          isSelected={false}
          isEditable={false}
        />
      </Suspense>
    </div>
  );
});

export default LivePreview;
