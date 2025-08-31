import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * TextInlineBlock - Componente modular inline horizontal
 * Texto responsivo e configurável
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 * Utiliza funcionalidades modernas do ES7+: destructuring, optional chaining, nullish coalescing
 */
const TextInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange, // 🎯 Adicionando suporte a edição de propriedades
  className = '',
}) => {
  // ES7+ Destructuring com default values e optional chaining
  const {
    content = 'Texto exemplo',
    fontSize = 'medium',
    fontWeight = 'normal',
    fontFamily = 'inherit',
    textAlign = 'left',
    color = '#374151',
    backgroundColor = 'transparent',
    maxWidth = 'auto',
    useUsername = false,
    usernamePattern = '{userName}',
    // Propriedades do grid system
    gridColumns = 'full', // 'auto', 'half', 'full'
    spacing = 'normal',
    // Propriedades de espaçamento
    marginTop = 8,
    marginBottom = 8,
    marginLeft = 0,
    marginRight = 0,
    lineHeight = 'leading-normal',
  } = block?.properties ?? {};

  // ES7+ Object property shorthand e computed property names
  const fontSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    medium: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    // Suporte direto para classes Tailwind vindas do template
    'text-xs': 'text-xs',
    'text-sm': 'text-sm',
    'text-base': 'text-base',
    'text-lg': 'text-lg',
    'text-xl': 'text-xl',
    'text-2xl': 'text-2xl',
    'text-3xl': 'text-3xl',
  } as const;

  // ES7+ Object spread com type assertion
  const fontWeightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    // Suporte direto para classes Tailwind vindas do template
    'font-light': 'font-light',
    'font-normal': 'font-normal',
    'font-medium': 'font-medium',
    'font-semibold': 'font-semibold',
    'font-bold': 'font-bold',
  } as const;

  // ES7+ Template literals implícitos nas keys
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
    // Suporte direto para classes Tailwind vindas do template
    'text-left': 'text-left',
    'text-center': 'text-center',
    'text-right': 'text-right',
    'text-justify': 'text-justify',
  } as const;

  // ES7+ Arrow functions e object shorthand
  const gridClasses = {
    auto: 'w-full md:w-[calc(50%-0.5rem)]', // Máximo 2 colunas em MD+
    half: 'w-full md:w-[calc(50%-0.5rem)]', // Força 2 colunas
    full: 'w-full', // Largura total
  } as const;

  const spacingClasses = {
    tight: 'py-0', // 🎯 Zero padding vertical
    normal: 'py-0', // 🎯 Zero padding vertical
    loose: 'py-0', // 🎯 Zero padding vertical
  } as const;

  // Função para converter valores numéricos de margem em classes Tailwind
  const getMarginClass = (value: number | string, type: 'top' | 'bottom' | 'left' | 'right') => {
    if (typeof value === 'number' && value !== 0) {
      const prefix =
        type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

      if (value < 0) {
        // Margens negativas - agora suportadas para todas as direções
        if (value >= -4) return `-${prefix}-1`;
        if (value >= -8) return `-${prefix}-2`;
        if (value >= -12) return `-${prefix}-3`;
        if (value >= -16) return `-${prefix}-4`;
        if (value >= -20) return `-${prefix}-5`;
        if (value >= -24) return `-${prefix}-6`;
        if (value >= -32) return `-${prefix}-8`;
        if (value >= -40) return `-${prefix}-10`;
        return `-${prefix}-12`;
      } else {
        // Margens positivas - expandido para suportar até 100px
        if (value <= 4) return `${prefix}-1`;
        if (value <= 8) return `${prefix}-2`;
        if (value <= 12) return `${prefix}-3`;
        if (value <= 16) return `${prefix}-4`;
        if (value <= 20) return `${prefix}-5`;
        if (value <= 24) return `${prefix}-6`;
        if (value <= 32) return `${prefix}-8`;
        if (value <= 40) return `${prefix}-10`;
        if (value <= 48) return `${prefix}-12`;
        if (value <= 56) return `${prefix}-14`;
        if (value <= 64) return `${prefix}-16`;
        if (value <= 80) return `${prefix}-20`;
        if (value <= 96) return `${prefix}-24`;
        return `${prefix}-28`; // Para valores acima de 96px
      }
    }
    return '';
  };

  // ES7+ useMemo para otimização de performance
  const personalizedContent = useMemo(() => {
    // ES7+ Optional chaining e nullish coalescing
    if (useUsername && usernamePattern) {
      return content?.replace?.(usernamePattern, 'Usuário') ?? content;
    }
    return content;
  }, [content, useUsername, usernamePattern]);

  // 🎯 Sistema de múltiplas cores e formatação no mesmo texto
  // Formato: [cor]texto em cor[/cor] ou [cor]**texto negrito**[/cor]
  const parseMultiColorText = (text: string): JSX.Element[] => {
    if (!text) return [];

    // Regex para capturar padrões [cor]texto[/cor] com suporte a **negrito**
    const colorPattern = /\[([^\]]+)\](.*?)\[\/\1\]/g;
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = colorPattern.exec(text)) !== null) {
      // Adicionar texto antes da marcação
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText.trim()) {
          parts.push(
            <span key={keyIndex++} style={{ color }}>
              {parseFormattedText(beforeText)}
            </span>
          );
        }
      }

      // Adicionar texto colorido com possível formatação
      const [, colorValue, coloredText] = match;
      parts.push(
        <span key={keyIndex++} style={{ color: colorValue }}>
          {parseFormattedText(coloredText)}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // Adicionar texto restante
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push(
          <span key={keyIndex++} style={{ color }}>
            {parseFormattedText(remainingText)}
          </span>
        );
      }
    }

    // Se não há marcações de cor, retorna o texto com formatação
    return parts.length === 0
      ? [
        <span key="0" style={{ color }}>
          {parseFormattedText(text)}
        </span>,
      ]
      : parts;
  };

  // 🎯 Função para processar formatação (negrito, itálico, etc.)
  const parseFormattedText = (text: string): React.ReactNode => {
    if (!text) return text;

    // Processar **negrito**
    const boldPattern = /\*\*(.*?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = boldPattern.exec(text)) !== null) {
      // Texto antes do negrito
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText) {
          parts.push(beforeText);
        }
      }

      // Texto em negrito
      const [, boldText] = match;
      parts.push(<strong key={`bold-${keyIndex++}`}>{boldText}</strong>);

      lastIndex = match.index + match[0].length;
    }

    // Texto restante
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText) {
        parts.push(remainingText);
      }
    }

    return parts.length === 0 ? text : parts;
  };

  // 🎯 Função para detectar se tem marcações de cor ou formatação
  const hasColorMarkings = useMemo(() => {
    return personalizedContent?.includes('[') && personalizedContent?.includes('[/');
  }, [personalizedContent]);

  // 🎯 Função para detectar formatação simples (sem cores)
  const hasSimpleFormatting = useMemo(() => {
    return !hasColorMarkings && personalizedContent?.includes('**');
  }, [personalizedContent, hasColorMarkings]);

  // Verificar se o conteúdo contém HTML
  const isHtmlContent = useMemo(() => {
    const hasHtml = personalizedContent?.includes('<') && personalizedContent?.includes('>');
    const hasSpanTag = personalizedContent?.includes('<span');
    const hasStrongTag = personalizedContent?.includes('<strong');

    // Debug controlado e deduplicado: definir window.__TEXT_INLINE_DEBUG = true para ver logs
    try {
      const g: any = typeof window !== 'undefined' ? (window as any) : undefined;
      const debugEnabled = g?.__TEXT_INLINE_DEBUG === true;
      if (debugEnabled) {
        // Evitar logs repetitivos para o mesmo estado
        const hash = `${block?.id}|${personalizedContent?.length}|${hasHtml ? 1 : 0}|${hasSpanTag ? 1 : 0
          }|${hasStrongTag ? 1 : 0}`;
        g.__TEXT_INLINE_LOGS = g.__TEXT_INLINE_LOGS || new Set<string>();
        if (!g.__TEXT_INLINE_LOGS.has(hash)) {
          g.__TEXT_INLINE_LOGS.add(hash);
          // eslint-disable-next-line no-console
          console.log('� TextInlineBlock DEBUG COMPLETO:', {
            blockId: block?.id,
            rawContent: personalizedContent,
            contentLength: personalizedContent?.length,
            hasHtml,
            hasSpanTag,
            hasStrongTag,
            willRenderAsHTML: hasHtml || hasSpanTag || hasStrongTag,
            contentPreview: personalizedContent?.substring(0, 200) + '...',
          });
        }
      }
    } catch {
      // noop
    }

    return hasHtml || hasSpanTag || hasStrongTag;
  }, [personalizedContent, block?.id]);

  // ES7+ useCallback para otimização de re-renders
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  // 🎯 EDIÇÃO INLINE - Estados e handlers
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(personalizedContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Atualizar conteúdo de edição quando personalizedContent mudar
  useEffect(() => {
    setEditContent(personalizedContent);
  }, [personalizedContent]);

  // Handler para duplo clique para editar
  const handleDoubleClick = useCallback(() => {
    if (onPropertyChange) {
      setIsEditing(true);
      setEditContent(personalizedContent);
    }
  }, [onPropertyChange, personalizedContent]);

  // Handler para salvar mudanças
  const handleSave = useCallback(() => {
    if (onPropertyChange && editContent !== personalizedContent) {
      onPropertyChange('content', editContent);
    }
    setIsEditing(false);
  }, [onPropertyChange, editContent, personalizedContent]);

  // Handler para cancelar edição
  const handleCancel = useCallback(() => {
    setEditContent(personalizedContent);
    setIsEditing(false);
  }, [personalizedContent]);

  // Handler para teclas durante edição
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  // Auto-focus quando inicia edição
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Auto-resize textarea
  const autoResizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, []);

  useEffect(() => {
    if (isEditing) {
      autoResizeTextarea();
    }
  }, [isEditing, editContent, autoResizeTextarea]);

  // Helper: resolve font size classes allowing raw Tailwind classes
  const resolveFontSizeClass = (size: string | undefined, fallback: string): string => {
    if (!size) return fallback;
    const mapped = fontSizeClasses[size as keyof typeof fontSizeClasses];
    return mapped ?? (typeof size === 'string' ? size : fallback);
  };

  return (
    <div
      className={cn(
        // CANVAS GRID SYSTEM: Compatível com flex-wrap do canvas
        'flex-shrink-0 flex-grow-0',
        // ES7+ Computed property access com nullish coalescing
        gridClasses[gridColumns as keyof typeof gridClasses] ?? gridClasses.auto,

        // VISUAL STYLING: Modular e independente
        'rounded-lg transition-all duration-200',

        // EDITOR STATES: Seleção e interação - ES7+ logical AND
        isSelected && 'ring-2 ring-brand ring-offset-2',
        'cursor-pointer',

        // Estados de edição
        isEditing && 'ring-2 ring-blue-500 ring-offset-2',

        // SPACING - ES7+ Computed property com fallback
        spacingClasses[spacing as keyof typeof spacingClasses] ?? spacingClasses.normal,

        // MARGIN SPACING - Apenas margens verticais no container
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),

        className
      )}
      style={{ backgroundColor }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      // ES7+ Object spread para data attributes
      {...(block?.id && { 'data-block-id': block.id })}
      {...(block?.type && { 'data-block-type': block.type })}
    >
      {isEditing ? (
        // 🎯 MODO EDIÇÃO: Textarea para editar conteúdo
        <div className="w-full">
          <textarea
            ref={textareaRef}
            value={editContent}
            onChange={e => {
              setEditContent(e.target.value);
              autoResizeTextarea();
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              'w-full bg-transparent border-none resize-none outline-none',
              resolveFontSizeClass(fontSize as string, fontSizeClasses.medium),
              fontWeightClasses[fontWeight as keyof typeof fontWeightClasses] ??
              fontWeightClasses.normal,
              textAlignClasses[textAlign as keyof typeof textAlignClasses] ?? textAlignClasses.left,
              'break-words whitespace-pre-wrap',
              lineHeight || 'leading-normal',
              // 🎯 MARGENS LATERAIS aplicadas no textarea de edição
              getMarginClass(marginLeft, 'left'),
              getMarginClass(marginRight, 'right')
            )}
            style={{
              color,
              ...(fontFamily !== 'inherit' && { fontFamily }),
              ...(maxWidth !== 'auto' && {
                maxWidth,
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'block',
              }),
              minHeight: '1.5em',
            }}
            placeholder="Digite seu texto..."
          />
          <div style={{ color: '#8B7355' }}>Cmd/Ctrl + Enter para salvar • Esc para cancelar</div>
        </div>
      ) : (
        // 🎯 MODO VISUALIZAÇÃO: Texto renderizado
        <div
          className={cn(
            // ES7+ Computed properties com fallbacks
            resolveFontSizeClass(fontSize as string, fontSizeClasses.medium),
            fontWeightClasses[fontWeight as keyof typeof fontWeightClasses] ??
            fontWeightClasses.normal,
            textAlignClasses[textAlign as keyof typeof textAlignClasses] ?? textAlignClasses.left,

            // Responsividade e quebra de texto
            'break-words whitespace-pre-wrap',

            // Line height
            lineHeight || 'leading-normal',

            // Hover para indicar que é editável (sem padding lateral para não interferir com margens)
            onPropertyChange && 'hover:bg-gray-50 hover:bg-opacity-50 rounded py-0.5',

            // 🎯 MARGENS LATERAIS aplicadas no conteúdo interno
            getMarginClass(marginLeft, 'left'),
            getMarginClass(marginRight, 'right')
          )}
          style={{
            color,
            ...(fontFamily !== 'inherit' && { fontFamily }),
            ...(maxWidth !== 'auto' && {
              maxWidth,
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block',
            }),
          }}
          title={onPropertyChange ? 'Duplo clique para editar' : undefined}
        >
          {hasColorMarkings ? (
            // 🎯 Renderiza texto com múltiplas cores e formatação usando marcação [cor]**texto**[/cor]
            <>{parseMultiColorText(personalizedContent)}</>
          ) : hasSimpleFormatting ? (
            // 🎯 Renderiza texto com formatação simples **negrito** sem cores
            <span style={{ color }}>{parseFormattedText(personalizedContent)}</span>
          ) : isHtmlContent ? (
            // Renderiza como HTML se detectar qualquer tag HTML
            <div
              dangerouslySetInnerHTML={{ __html: personalizedContent }}
              style={{ display: 'contents' }}
            />
          ) : (
            personalizedContent
          )}
        </div>
      )}
    </div>
  );
};

// ES7+ Export com default + named exports para flexibilidade
export default TextInlineBlock;

// ES7+ Type exports para reutilização
export type { BlockComponentProps };

// ES7+ Const assertion para readonly arrays/objects
export const TEXT_SIZES = ['xs', 'sm', 'medium', 'lg', 'xl', '2xl', '3xl'] as const;
export const TEXT_WEIGHTS = ['light', 'normal', 'medium', 'semibold', 'bold'] as const;
export const TEXT_ALIGNS = ['left', 'center', 'right', 'justify'] as const;

// ES7+ Template literal types (para uso futuro)
export type TemplatePattern = `{${string}}`;

// ES7+ Utility function com advanced features
export const createTextBlock = (
  content: string,
  options: Partial<{
    fontSize: (typeof TEXT_SIZES)[number];
    fontWeight: (typeof TEXT_WEIGHTS)[number];
    textAlign: (typeof TEXT_ALIGNS)[number];
  }> = {}
) => ({
  id: crypto.randomUUID?.() ?? Math.random().toString(36),
  type: 'text-inline',
  properties: {
    content,
    ...options,
  },
});
