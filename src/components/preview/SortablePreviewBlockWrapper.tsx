import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Block } from "@/types/editor";
import { StyleResult } from "@/types/quiz";

/**
 * Nota:
 * - Substitua `any` por tipos específicos do seu projeto quando disponível.
 * - Mantive PreviewState e FunnelConfig como `any` para evitar erro por tipos não importados.
 */

type PreviewState = any;
type FunnelConfig = any;

interface SortablePreviewBlockWrapperProps {
  id?: string;
  block?: Block;
  children?: React.ReactNode;
  className?: string;
  isSelected?: boolean;
  isPreviewing?: boolean;
  disabled?: boolean;
  enableProductionMode?: boolean;
  primaryStyle?: StyleResult | null;
  previewState?: PreviewState;
  funnelConfig?: FunnelConfig | null;
  quizProgress?: number;
  onClick?: () => void;
  onUpdate?: (updates: any) => void;
  onSelect?: (blockId: string) => void;
  onAnswerSubmit?: (answer: any) => void;
  onFormSubmit?: (formData: any) => void;
}

/** Componente principal */
const SortablePreviewBlockWrapper: React.FC<SortablePreviewBlockWrapperProps> = ({
  id,
  block,
  children,
  className,
  isSelected = false,
  disabled = false,
  enableProductionMode = false,
  primaryStyle = null,
  previewState,
  quizProgress = 0,
  onClick,
  onAnswerSubmit,
  onFormSubmit,
}) => {
  const blockId = id || block?.id || "unknown";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: blockId,
    disabled: disabled || enableProductionMode, // desativa drag em modo produção
  });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  // handlers simples para modo produção
  const handleQuestionAnswer = (answer: any) => {
    if (enableProductionMode && onAnswerSubmit) onAnswerSubmit(answer);
  };

  const handleFormSubmission = (data: Record<string, any>) => {
    if (enableProductionMode && onFormSubmit) onFormSubmit(data);
  };

  // renderiza conteúdo por tipo de bloco
  const renderBlockContent = () => {
    if (!block) return null;
    const blockType = (block.type || "").toString().toLowerCase();
    const content = (block.content ?? {}) as any;
    const appliedStyle = primaryStyle || previewState?.calculatedResults;

    switch (blockType) {
      case "header":
      case "title":
        return (
          <div className="block-header">
            <h1
              className="text-2xl font-bold mb-4"
              style={{
                color: appliedStyle?.primary
                  ? `var(--${appliedStyle.primary}-primary)`
                  : undefined,
              }}
            >
              {content.title || content.text || "Título"}
            </h1>
            {content.subtitle && (
              <p className="text-lg text-gray-600 mb-4">{content.subtitle}</p>
            )}
          </div>
        );

      case "question":
      case "quiz_question":
        return (
          <div className="block-question">
            <div className="question-header mb-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.title || content.question || "Pergunta do Quiz"}
              </h3>
              {content.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {content.description}
                </p>
              )}
            </div>

            {enableProductionMode && Array.isArray(content.options) ? (
              <div className="question-options space-y-2">
                {content.options.map((option: any, idx: number) => {
                  const selected =
                    previewState?.userAnswers?.[blockId] === option.value;
                  return (
                    <button
                      key={idx}
                      className={cn(
                        "w-full p-3 text-left border rounded-lg transition-colors hover:bg-gray-50",
                        selected && "bg-primary text-white"
                      )}
                      onClick={() => handleQuestionAnswer(option.value)}
                    >
                      {option.label || option.text || `Opção ${idx + 1}`}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                [{content.options?.length || 0} opções]
              </div>
            )}
          </div>
        );

      case "form":
      case "lead_form":
        return enableProductionMode ? (
          <form
            className="block-form"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const data = Object.fromEntries(fd.entries());
              handleFormSubmission(data);
            }}
          >
            <h3 className="text-lg font-semibold mb-2">
              {content.title || "Formulário"}
            </h3>
            {content.description && (
              <p className="text-sm text-gray-600 mb-4">{content.description}</p>
            )}
            <div className="space-y-3">
              <input
                name="name"
                type="text"
                placeholder="Nome"
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg"
                required
              />
              {content.includePhone && (
                <input
                  name="phone"
                  type="tel"
                  placeholder="Telefone"
                  className="w-full p-3 border rounded-lg"
                />
              )}
              <button
                type="submit"
                className="w-full p-3 bg-primary text-white rounded"
              >
                {content.submitText || "Enviar"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-sm text-gray-500 p-4 border-2 border-dashed rounded">
            Formulário interativo (pré-visualização)
          </div>
        );

      case "result":
      case "quiz_result": {
        const result = previewState?.calculatedResults || appliedStyle;
        if (!result) {
          return (
            <div className="result-placeholder text-sm text-gray-500 p-4 border-2 border-dashed rounded">
              Resultado será exibido após completar o quiz
            </div>
          );
        }
        return (
          <div className="block-result">
            <h3 className="text-xl font-bold mb-2">
              {content.title || "Resultado do Quiz"}
            </h3>
            <div className="p-4 border rounded">
              <h4 className="text-lg font-semibold mb-2">
                Seu estilo: {result.primary}
              </h4>
              {result.description && (
                <p className="text-sm text-gray-600">{result.description}</p>
              )}
              {result.percentage != null && (
                <div className="text-sm text-gray-500 mt-2">
                  Compatibilidade: {result.percentage}%
                </div>
              )}
            </div>
          </div>
        );
      }

      case "image":
        return content.src ? (
          <div className="block-image">
            <img
              src={content.src}
              alt={content.alt || "Imagem"}
              className="w-full h-auto rounded-lg"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            📷 Imagem
          </div>
        );

      case "button":
      case "cta":
        return (
          <div className="block-button">
            <button
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-colors w-full",
                enableProductionMode
                  ? "bg-primary text-white hover:bg-primary/90 cursor-pointer"
                  : "bg-gray-200 text-gray-700 cursor-default"
              )}
              style={{
                backgroundColor:
                  enableProductionMode && appliedStyle?.primary
                    ? `var(--${appliedStyle.primary}-primary)`
                    : undefined,
              }}
              onClick={() => {
                if (enableProductionMode && content.action) {
                  console.log("🔘 Button action:", content.action);
                }
              }}
            >
              {content.label || content.text || content.submitText || "Botão"}
            </button>
          </div>
        );

      case "text":
      case "paragraph":
        return (
          <div className="block-text">
            <p className="text-base leading-relaxed">
              {content.text || content.paragraph || "Texto do parágrafo"}
            </p>
          </div>
        );

      case "progress":
      case "progress_bar":
        return (
          <div className="block-progress">
            <div className="progress-header mb-2">
              <span className="text-sm text-gray-600">
                Progresso: {Math.round(quizProgress || 0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${quizProgress || 0}%`,
                  backgroundColor: appliedStyle?.primary
                    ? `var(--${appliedStyle.primary}-primary)`
                    : undefined,
                }}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            <div className="text-sm font-medium mb-1">
              {block.type || "Bloco Desconhecido"}
            </div>
            {block.content?.text && (
              <div className="text-xs mt-1">{block.content.text}</div>
            )}
          </div>
        );
    }
  };

  // wrapper com sortable (se houver block, renderiza com preview; se não, retorna children dentro do wrapper)
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative block-preview-wrapper",
        isSelected && "selected",
        isDragging && "z-50 opacity-50",
        enableProductionMode && "production-mode",
        className
      )}
      onClick={onClick}
      {...(!enableProductionMode ? attributes : {})}
      {...(!enableProductionMode ? listeners : {})}
    >
      <div className="preview-block-content">
        {!enableProductionMode && (
          <div className="block-type-indicator text-xs text-gray-500 mb-1">
            {block?.type || "Unknown Block"}
          </div>
        )}

        <div className="block-content">{block ? renderBlockContent() : children}</div>
      </div>
    </div>
  );
};

export default SortablePreviewBlockWrapper;
