/**
 * ⚠️ ⚠️ ⚠️ DEPRECATED - NÃO USAR ⚠️ ⚠️ ⚠️
 * 
 * @deprecated Use UniversalBlockRenderer - Ver ANALISE_RENDERERS.md
 * 
 * Este renderer será removido em Sprint 4 (21/out/2025)
 * 
 * Migração:
 * ```tsx
 * // ANTES:
 * import ComponentRenderer from '@/components/quiz/builder/ComponentRenderer';
 * 
 * // DEPOIS:
 * import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
 * ```
 * 
 * Motivo da deprecação:
 * - Funcionalidade duplicada de UniversalBlockRenderer
 * - Específico para quiz builder (descontinuado)
 * - UniversalBlockRenderer suporta todos os tipos de componentes
 * 
 * ---
 */

import React, { useEffect } from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ComponentRendererProps {
  component: QuizComponentData;
  isSelected?: boolean;
  onClick?: () => void;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected = false,
  onClick,
}) => {
  // ⚠️ DEPRECATION WARNING
  useEffect(() => {
    console.warn(
      '⚠️ DEPRECATED: ComponentRenderer (quiz/builder) será removido em 21/out/2025. ' +
      'Migre para UniversalBlockRenderer. Ver ANALISE_RENDERERS.md'
    );
  }, []);

  const data = component.data || {};

  const renderComponent = () => {
    switch (component.type) {
      case 'header':
        return (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{data.title || 'Título'}</h2>
            <p className="text-lg">{data.subtitle || 'Subtítulo'}</p>
          </div>
        );

      case 'text':
        return <div className="prose max-w-none">{data.text || 'Texto padrão'}</div>;

      case 'headline':
        return (
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{data.title || 'Título'}</h1>
            {data.subtitle && <p className="text-xl">{data.subtitle}</p>}
          </div>
        );

      case 'image':
        return data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.alt || 'Imagem'}
            className="max-w-full h-auto rounded"
          />
        ) : (
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <p style={{ color: '#8B7355' }}>Imagem não definida</p>
          </div>
        );

      case 'multipleChoice':
        return (
          <div className="space-y-2">
            <h3 className="font-medium">{data.question || 'Pergunta'}</h3>
            {data.options && data.options.length > 0 ? (
              data.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="checkbox" id={`opt-${component.id}-${index}`} />
                  <label htmlFor={`opt-${component.id}-${index}`}>{option}</label>
                </div>
              ))
            ) : (
              <div style={{ color: '#8B7355' }}>Opções não definidas</div>
            )}
          </div>
        );

      case 'singleChoice':
        return (
          <div className="space-y-2">
            <h3 className="font-medium">{data.question || 'Pergunta'}</h3>
            {data.options && data.options.length > 0 ? (
              data.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`opt-${component.id}`}
                    id={`opt-${component.id}-${index}`}
                  />
                  <label htmlFor={`opt-${component.id}-${index}`}>{option}</label>
                </div>
              ))
            ) : (
              <div style={{ color: '#8B7355' }}>Opções não definidas</div>
            )}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">{data.question || 'Pergunta'}</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm">{data.minLabel || 'Mínimo'}</span>
              <div className="flex space-x-2">
                {Array.from(
                  { length: (data.maxValue || 10) - (data.minValue || 1) + 1 },
                  (_, i) => (
                    <button key={i} style={{ backgroundColor: '#E5DDD5' }}>
                      {(data.minValue || 1) + i}
                    </button>
                  )
                )}
              </div>
              <span className="text-sm">{data.maxLabel || 'Máximo'}</span>
            </div>
          </div>
        );

      default:
        return (
          <div style={{ borderColor: '#E5DDD5' }}>
            <p style={{ color: '#8B7355' }}>Tipo de componente desconhecido: {component.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn('transition-all cursor-pointer', isSelected ? 'ring-2 ring-[#B89B7A]' : '')}
    >
      <Card className="p-4">{renderComponent()}</Card>
    </div>
  );
};

export default ComponentRenderer;
