/**
 * 👁️ LivePreview - Preview em tempo real do quiz
 * 
 * Renderiza o quiz atual como seria visto pelo usuário final.
 */

import React, { memo, useMemo } from 'react';
import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';
import { cn } from '@/lib/utils';

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
                backgroundColor: quiz.theme?.colors?.primary || '#3b82f6',
              }}
            />
          </div>
        </div>
      )}

      {/* Blocks */}
      <div className="space-y-4">
        {currentStep.blocks?.map((block) => (
          <PreviewBlock 
            key={block.id} 
            block={block} 
            theme={quiz.theme}
          />
        ))}
      </div>
    </div>
  );
});

// Preview de cada tipo de bloco
interface PreviewBlockProps {
  block: any;
  theme?: any;
}

const PreviewBlock = memo(function PreviewBlock({ block, theme }: PreviewBlockProps) {
  const primaryColor = theme?.colors?.primary || '#3b82f6';
  const textColor = theme?.colors?.text || '#1a1a1a';

  const renderBlock = () => {
    switch (block.type) {
      case 'intro-title':
      case 'question-title':
      case 'transition-title':
      case 'result-title':
        return (
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ 
              color: textColor,
              fontFamily: theme?.fonts?.heading || 'system-ui',
            }}
          >
            {block.properties?.text || block.content?.text || 'Título'}
          </h1>
        );

      case 'intro-subtitle':
      case 'intro-description':
      case 'question-description':
      case 'transition-text':
      case 'result-description':
        return (
          <p 
            className="text-base opacity-80"
            style={{ color: textColor }}
          >
            {block.properties?.text || block.content?.text || 'Descrição'}
          </p>
        );

      case 'intro-image':
      case 'transition-image':
      case 'result-image':
        const imageUrl = block.properties?.src || block.content?.src;
        if (!imageUrl) return null;
        return (
          <img 
            src={imageUrl} 
            alt={block.properties?.alt || 'Imagem'} 
            className="w-full rounded-lg object-cover max-h-[200px]"
          />
        );

      case 'intro-button':
      case 'transition-button':
      case 'CTAButton':
        return (
          <button
            className="w-full py-3 px-6 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {block.properties?.text || block.content?.text || 'Continuar'}
          </button>
        );

      case 'options-grid':
        const options = block.properties?.options || block.content?.options || [];
        return (
          <div className="grid gap-3">
            {options.length > 0 ? options.map((option: any, idx: number) => (
              <button
                key={option.id || idx}
                className="p-4 border-2 rounded-lg text-left transition-all hover:border-primary/50"
                style={{ borderColor: theme?.colors?.border || '#e5e7eb' }}
              >
                <span className="font-medium">{option.label || option.text || `Opção ${idx + 1}`}</span>
                {option.description && (
                  <span className="block text-sm opacity-70 mt-1">{option.description}</span>
                )}
              </button>
            )) : (
              <div className="text-center text-muted-foreground py-4 border-2 border-dashed rounded-lg">
                Nenhuma opção configurada
              </div>
            )}
          </div>
        );

      case 'form-input':
        return (
          <div className="space-y-2">
            {block.properties?.label && (
              <label className="text-sm font-medium">{block.properties.label}</label>
            )}
            <input
              type={block.properties?.type || 'text'}
              placeholder={block.properties?.placeholder || 'Digite aqui...'}
              className="w-full p-3 border rounded-lg"
              style={{ borderColor: theme?.colors?.border || '#e5e7eb' }}
              disabled
            />
          </div>
        );

      case 'intro-logo':
      case 'intro-logo-header':
        const logoUrl = block.properties?.logoUrl || block.content?.logoUrl;
        return (
          <div className="flex justify-center mb-4">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-12 object-contain" />
            ) : (
              <div className="h-12 w-32 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                Logo
              </div>
            )}
          </div>
        );

      case 'question-progress':
        return (
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full"
              style={{ 
                width: `${block.properties?.progress || 50}%`,
                backgroundColor: primaryColor,
              }}
            />
          </div>
        );

      default:
        return (
          <div className="p-3 border border-dashed border-muted-foreground/30 rounded-lg text-center text-sm text-muted-foreground">
            <span className="opacity-60">[{block.type}]</span>
          </div>
        );
    }
  };

  return (
    <div className="preview-block">
      {renderBlock()}
    </div>
  );
});

export default LivePreview;
