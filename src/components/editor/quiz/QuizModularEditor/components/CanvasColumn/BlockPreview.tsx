import React from 'react';
import type { Block } from '@/services/UnifiedTemplateRegistry';
import sanitizeHtml from '@/utils/sanitizeHtml';

export type BlockPreviewProps = {
    block: Block;
    onQuickInsert?: (blockId: string) => void;
};

const Placeholder: React.FC<{ onQuickInsert?: () => void }> = ({ onQuickInsert }) => (
    <div className="text-xs text-muted-foreground">
        <div className="opacity-70">Sem conteúdo</div>
        {onQuickInsert && (
            <button
                className="mt-1 px-2 py-1 border rounded text-[10px] hover:bg-accent"
                onClick={onQuickInsert}
            >
                + Inserir aqui
            </button>
        )}
    </div>
);

export default function BlockPreview({ block, onQuickInsert }: BlockPreviewProps) {
    const type = String(block.type);
    const content: any = (block as any).content || {};
    const props: any = (block as any).properties || {};

    // intro-title
    if (type === 'intro-title' || type === 'quiz-intro-header' || type === 'heading' || type === 'text-inline') {
        const html = content.title || content.text || props.titleHtml || '';
        if (!html) return <Placeholder onQuickInsert={onQuickInsert ? () => onQuickInsert(block.id) : undefined} />;
        return (
            <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(String(html)) }} />
            </div>
        );
    }

    // intro-description
    if (type === 'intro-description' || type === 'text') {
        const html = content.description || content.text || '';
        if (!html) return <Placeholder onQuickInsert={onQuickInsert ? () => onQuickInsert(block.id) : undefined} />;
        return (
            <div className="prose prose-sm max-w-none opacity-90">
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(String(html)) }} />
            </div>
        );
    }

    // intro-logo / intro-image
    if (type === 'intro-logo' || type === 'intro-image' || type === 'image' || type === 'image-display-inline') {
        const url = content.imageUrl || props.imageUrl || props.logoUrl;
        if (!url) return <Placeholder onQuickInsert={onQuickInsert ? () => onQuickInsert(block.id) : undefined} />;
        return (
            <div className="w-full flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={content.alt || 'imagem'} className="max-h-20 object-contain" />
            </div>
        );
    }

    // intro-form (placeholder)
    if (type === 'intro-form' || type === 'form-container') {
        const hasFields = Array.isArray(content.fields) && content.fields.length > 0;
        if (!hasFields) return <Placeholder onQuickInsert={onQuickInsert ? () => onQuickInsert(block.id) : undefined} />;
        return (
            <div className="text-xs">Formulário com {content.fields.length} campos</div>
        );
    }

    // Default: JSON preview
    return (
        <pre className="text-[10px] whitespace-pre-wrap break-all opacity-70">{JSON.stringify(content || props || {}, null, 2)}</pre>
    );
}
