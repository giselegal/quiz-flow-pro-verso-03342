/**
 * 👁️ LivePreview - Preview em tempo real do quiz
 * 
 * Renderiza o quiz atual como seria visto pelo usuário final.
 * Suporta TODOS os 32+ tipos de blocos do template v4.
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
            totalSteps={quiz.steps.length}
            currentStepOrder={currentStep.order || 1}
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
  totalSteps?: number;
  currentStepOrder?: number;
}

const PreviewBlock = memo(function PreviewBlock({ 
  block, 
  theme,
  totalSteps = 21,
  currentStepOrder = 1
}: PreviewBlockProps) {
  const primaryColor = theme?.colors?.primary || '#3b82f6';
  const textColor = theme?.colors?.text || '#1a1a1a';
  const content = block.content || {};
  const properties = block.properties || {};

  const renderBlock = () => {
    switch (block.type) {
      // =====================================================
      // INTRO BLOCKS (Step 1)
      // =====================================================
      case 'intro-logo-header':
        return (
          <div className="text-center py-6">
            {(properties.logoUrl || content.logoUrl) && (
              <img 
                src={properties.logoUrl || content.logoUrl} 
                alt={properties.title || content.title || 'Logo'} 
                className="h-16 mx-auto mb-4" 
              />
            )}
            <h1 
              className="text-3xl font-bold"
              style={{ color: textColor, fontFamily: theme?.fonts?.heading || 'system-ui' }}
            >
              {properties.title || content.title || 'Quiz de Estilo'}
            </h1>
            {(properties.subtitle || content.subtitle) && (
              <p className="text-lg opacity-80 mt-2">{properties.subtitle || content.subtitle}</p>
            )}
          </div>
        );

      case 'intro-description':
        return (
          <p className="text-center text-lg leading-relaxed opacity-80" style={{ color: textColor }}>
            {properties.text || content.text || content.description || 'Descrição'}
          </p>
        );

      case 'intro-button':
      case 'cta-button':
        return (
          <div className="text-center py-2">
            <button
              className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all shadow-lg hover:shadow-xl hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              {properties.text || content.text || 'Começar Quiz'}
            </button>
          </div>
        );

      // =====================================================
      // QUESTION BLOCKS (Steps 2-18)
      // =====================================================
      case 'question-progress':
        const progress = ((currentStepOrder) / totalSteps) * 100;
        return (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1 opacity-60">
              <span>Etapa {currentStepOrder} de {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: primaryColor }}
              />
            </div>
          </div>
        );

      case 'question-title':
      case 'intro-title':
      case 'transition-title':
      case 'result-title':
      case 'result-header':
        return (
          <h2 
            className="text-2xl font-bold text-center"
            style={{ color: textColor, fontFamily: theme?.fonts?.heading || 'system-ui' }}
          >
            {properties.text || content.text || content.title || 'Título'}
          </h2>
        );

      case 'options-grid':
        const options = properties.options || content.options || [];
        const cols = properties.gridColumns || content.columns || 2;
        const colsClass = cols === 4 ? 'grid-cols-4' : cols === 3 ? 'grid-cols-3' : cols === 1 ? 'grid-cols-1' : 'grid-cols-2';
        return (
          <div className={`grid gap-3 ${colsClass}`}>
            {options.length > 0 ? options.map((option: any, idx: number) => (
              <button
                key={option.id || idx}
                className="p-4 border-2 rounded-xl text-left transition-all hover:border-primary/50"
                style={{ borderColor: theme?.colors?.border || '#e5e7eb' }}
              >
                {option.imageUrl && (
                  <img src={option.imageUrl} alt={option.text || ''} className="w-full h-24 object-cover rounded-lg mb-2" />
                )}
                <span className="font-medium">{option.label || option.text || `Opção ${idx + 1}`}</span>
                {option.description && (
                  <span className="block text-sm opacity-70 mt-1">{option.description}</span>
                )}
              </button>
            )) : (
              <div className="col-span-full text-center text-muted-foreground py-4 border-2 border-dashed rounded-lg">
                Nenhuma opção configurada
              </div>
            )}
          </div>
        );

      // =====================================================
      // TRANSITION BLOCKS (Step 19)
      // =====================================================
      case 'transition-text':
      case 'intro-subtitle':
      case 'question-description':
      case 'result-description':
        return (
          <p className="text-base opacity-80 text-center" style={{ color: textColor }}>
            {properties.text || content.text || content.description || 'Descrição'}
          </p>
        );

      case 'urgency-timer':
        return (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 rounded-full font-semibold">
              <span className="animate-pulse">⏰</span>
              <span>{properties.text || content.text || 'Oferta expira em breve!'}</span>
            </div>
          </div>
        );

      // =====================================================
      // RESULT BLOCKS (Step 20)
      // =====================================================
      case 'result-image':
      case 'intro-image':
      case 'transition-image':
        const imageUrl = properties.src || content.src || properties.url || content.url || content.imageUrl;
        if (!imageUrl) {
          return (
            <div className="flex justify-center py-4">
              <div className="w-full max-w-md h-48 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                📷 Imagem
              </div>
            </div>
          );
        }
        return (
          <div className="flex justify-center py-4">
            <img 
              src={imageUrl} 
              alt={properties.alt || content.alt || 'Resultado'} 
              className="max-w-md w-full rounded-xl shadow-lg object-cover"
            />
          </div>
        );

      case 'result-share':
        return (
          <div className="flex justify-center gap-3 py-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
              📘 Facebook
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm">
              📲 WhatsApp
            </button>
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm">
              📸 Instagram
            </button>
          </div>
        );

      case 'result-display':
        return (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">{content.icon || '🎯'}</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
              {content.title || properties.title || 'Seu Perfil'}
            </h3>
            <p className="opacity-70">{content.description || properties.description || ''}</p>
          </div>
        );

      // =====================================================
      // OFFER BLOCKS (Step 21)
      // =====================================================
      case 'offer-hero':
        return (
          <div 
            className="rounded-2xl p-8 text-center"
            style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}05)` }}
          >
            <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>
              {properties.title || content.title || 'Oferta Especial'}
            </h2>
            <p className="text-xl opacity-80">{properties.subtitle || content.subtitle || ''}</p>
            {(properties.price || content.price) && (
              <div className="mt-4">
                <span className="text-4xl font-bold" style={{ color: primaryColor }}>
                  {properties.price || content.price}
                </span>
              </div>
            )}
          </div>
        );

      case 'benefits-list':
        const items = properties.items || content.items || properties.benefits || content.benefits || [];
        return (
          <ul className="space-y-3 py-4">
            {items.length > 0 ? items.map((item: any, idx: number) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span style={{ color: textColor }}>{typeof item === 'string' ? item : item.text}</span>
              </li>
            )) : (
              <li className="text-center text-muted-foreground py-2 border-2 border-dashed rounded-lg">
                Nenhum benefício configurado
              </li>
            )}
          </ul>
        );

      case 'guarantee':
        return (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <span className="text-2xl mb-2 block">🛡️</span>
            <p className="text-green-700 font-medium">
              {properties.text || content.text || 'Garantia de 7 dias ou seu dinheiro de volta'}
            </p>
          </div>
        );

      // =====================================================
      // LEGACY/GENERIC BLOCKS
      // =====================================================
      case 'text':
      case 'headline':
        return (
          <p className="text-lg" style={{ color: textColor }}>
            {properties.text || content.text || ''}
          </p>
        );

      case 'image':
        const imgSrc = properties.src || content.src || properties.url || content.url;
        if (!imgSrc) return null;
        return (
          <img 
            src={imgSrc} 
            alt={properties.alt || content.alt || 'Imagem'} 
            className="w-full rounded-lg object-cover max-h-[200px]"
          />
        );

      case 'button':
      case 'transition-button':
      case 'CTAButton':
        return (
          <button
            className="w-full py-3 px-6 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {properties.text || content.text || 'Continuar'}
          </button>
        );

      case 'intro-logo':
        const logoUrl = properties.logoUrl || content.logoUrl;
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

      case 'form-input':
        return (
          <div className="space-y-2">
            {properties.label && (
              <label className="text-sm font-medium">{properties.label}</label>
            )}
            <input
              type={properties.type || 'text'}
              placeholder={properties.placeholder || 'Digite aqui...'}
              className="w-full p-3 border rounded-lg"
              style={{ borderColor: theme?.colors?.border || '#e5e7eb' }}
              disabled
            />
          </div>
        );

      default:
        return (
          <div className="p-3 border border-dashed border-muted-foreground/30 rounded-lg text-center text-sm text-muted-foreground bg-muted/50">
            <code className="text-xs">{block.type}</code>
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
