/**
 * RichText Component - Renderiza o novo formato rich-text
 * 
 * Suporta tanto string simples quanto estrutura { type: 'rich-text', blocks: [...] }
 */

import React from 'react';
import { renderRichText, richTextToPlainText, type TextContent } from '@/lib/quiz-v4-saas-adapter';

interface RichTextProps {
    content: TextContent;
    as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
    className?: string;
    highlightClassName?: string;
}

/**
 * Componente RichText - Renderiza texto com highlights semânticos
 */
export function RichText({
    content,
    as: Component = 'p',
    className = '',
    highlightClassName = 'font-semibold text-primary',
}: RichTextProps) {
    // String simples → render direto
    if (typeof content === 'string') {
        return <Component className={className}>{content}</Component>;
    }

    // Rich-text → render com highlights
    return (
        <Component className={className}>
            {renderRichText(content, highlightClassName)}
        </Component>
    );
}

/**
 * Hook para extrair metadados de rich-text
 */
export function useRichTextMeta(content: TextContent) {
    const plainText = React.useMemo(() => richTextToPlainText(content), [content]);

    return {
        plainText,
        length: plainText.length,
        wordCount: plainText.split(/\s+/).length,
        // Para SEO
        excerpt: plainText.substring(0, 160),
    };
}

// ========================================
// EXEMPLO DE USO
// ========================================

/*
// 1. Título com highlights
<RichText 
  content={block.content.title} 
  as="h1"
  className="text-3xl font-bold"
  highlightClassName="text-primary-600 font-extrabold"
/>

// 2. Descrição simples
<RichText 
  content="Texto simples sem highlights"
  as="p"
  className="text-gray-600"
/>

// 3. Com metadados (para SEO)
function IntroBlock({ content }) {
  const { plainText, wordCount } = useRichTextMeta(content.text);
  
  return (
    <>
      <RichText content={content.text} />
      <meta name="description" content={plainText} />
      <span className="word-count">{wordCount} palavras</span>
    </>
  );
}
*/

export default RichText;
