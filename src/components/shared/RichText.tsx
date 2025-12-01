/**
 * 🎨 RichText Component - Safe HTML Rendering
 * 
 * Componente universal para renderização segura de texto com formatação.
 * Substitui dangerouslySetInnerHTML com parsing semântico e sanitização.
 * 
 * Suporta:
 * - String simples
 * - HTML sanitizado (fallback legacy)
 * - Formato rich-text v4.1-saas
 * 
 * @security Proteção contra XSS via:
 * 1. renderRichText() do adapter (parsing semântico)
 * 2. sanitizeHtml() como fallback para HTML legado
 * 3. Renderização via React elements (não innerHTML)
 */

import React from 'react';
import { renderRichText, richTextToPlainText, type TextContent } from '@/lib/quiz-v4-saas-adapter';
import { sanitizeHtml } from '@/lib/utils/sanitizeHtml';

interface RichTextProps {
    /** Conteúdo a ser renderizado (string, HTML ou formato rich-text) */
    content: TextContent | string;
    /** Tag HTML a ser usada (default: 'p') */
    as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
    /** Classes Tailwind para o container */
    className?: string;
    /** Classes Tailwind para highlights/emphasized text */
    highlightClassName?: string;
    /** Se true, renderiza HTML legado usando dangerouslySetInnerHTML + sanitização */
    allowLegacyHTML?: boolean;
}

/**
 * Componente RichText - Renderização segura de texto formatado
 * 
 * @example
 * // Texto simples
 * <RichText content="Texto sem formatação" />
 * 
 * @example
 * // Rich-text v4.1-saas
 * <RichText 
 *   content={{
 *     type: 'rich-text',
 *     blocks: [
 *       { type: 'plain', value: 'Descubra seu ' },
 *       { type: 'highlight', value: 'estilo predominante' }
 *     ]
 *   }}
 *   as="h1"
 *   highlightClassName="text-primary font-bold"
 * />
 * 
 * @example
 * // HTML legado (sanitizado)
 * <RichText 
 *   content="<strong>Chega</strong> de guarda-roupa lotado"
 *   allowLegacyHTML={true}
 * />
 */
export function RichText({
    content,
    as: Component = 'p',
    className = '',
    highlightClassName = 'font-semibold text-primary',
    allowLegacyHTML = false,
}: RichTextProps) {
    // === CASO 1: Conteúdo vazio ===
    if (!content || (typeof content === 'string' && content.trim() === '')) {
        return <Component className={className} />;
    }

    // === CASO 2: String com HTML legado (fallback) ===
    if (typeof content === 'string' && allowLegacyHTML && /<\/?[a-z][\s\S]*>/i.test(content)) {
        const sanitized = sanitizeHtml(content);
        return (
            <Component
                className={className}
                dangerouslySetInnerHTML={{ __html: sanitized }}
            />
        );
    }

    // === CASO 3: Formato rich-text v4.1-saas (parsing semântico) ===
    try {
        const blocks = renderRichText(content, highlightClassName);

        return (
            <Component className={className}>
                {blocks.map((block, index) => (
                    <span key={block.key || index} className={block.className}>
                        {block.value}
                    </span>
                ))}
            </Component>
        );
    } catch (error) {
        // Fallback: renderizar como texto simples
        const plainText = typeof content === 'string' ? content : JSON.stringify(content);
        return <Component className={className}>{plainText}</Component>;
    }
}

/**
 * Hook para extrair metadados de rich-text
 * Útil para SEO, contagem de palavras, excerpts, etc.
 */
export function useRichTextMeta(content: TextContent | string) {
    const plainText = React.useMemo(() => {
        if (typeof content === 'string') {
            // Remover tags HTML se houver
            return content.replace(/<[^>]*>/g, '');
        }
        return richTextToPlainText(content);
    }, [content]);

    return {
        plainText,
        length: plainText.length,
        wordCount: plainText.split(/\s+/).filter(Boolean).length,
        // Para SEO (meta description)
        excerpt: plainText.substring(0, 160),
        isEmpty: plainText.trim() === '',
    };
}

/**
 * Componente helper para renderizar com metadados
 * Útil para debugging e análise de conteúdo
 */
export function RichTextWithMeta({
    content,
    showMeta = false,
    ...props
}: RichTextProps & { showMeta?: boolean }) {
    const meta = useRichTextMeta(content);

    return (
        <>
            <RichText content={content} {...props} />
            {showMeta && (
                <div className="text-xs text-gray-500 mt-1">
                    {meta.wordCount} palavras · {meta.length} caracteres
                </div>
            )}
        </>
    );
}

// Export default
export default RichText;
