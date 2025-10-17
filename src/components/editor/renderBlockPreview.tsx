// src/components/editor/renderBlockPreview.tsx
// Patch: adiciona onClick/onKey handlers, stopPropagation, acessibilidade e logs para debugging.
// Ajuste o import/paths conforme a estrutura do seu projeto (este arquivo substitui ou complementa o componente de preview do bloco).

import React from 'react';

type Props = {
    block: any;
    selectedBlockId?: string | null;
    onSelectBlock?: (blockId: string | null) => void;
    onDoubleClickBlock?: (blockId: string) => void;
};

const RenderBlockPreview: React.FC<Props> = ({ block, selectedBlockId, onSelectBlock, onDoubleClickBlock }) => {
    const blockId = block?.id ?? 'unknown-block';

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // debug log temporário
        // eslint-disable-next-line no-console
        console.log('[BlockPreview] click', { blockId, stepId: block?.parentId || block?.stepId });
        if (typeof onSelectBlock === 'function') onSelectBlock(blockId);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // eslint-disable-next-line no-console
        console.log('[BlockPreview] dblclick', { blockId });
        if (typeof onDoubleClickBlock === 'function') onDoubleClickBlock(blockId);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // eslint-disable-next-line no-console
            console.log('[BlockPreview] keySelect', { blockId, key: e.key });
            if (typeof onSelectBlock === 'function') onSelectBlock(blockId);
        }
    };

    return (
        <div
            role="button"
            aria-pressed={selectedBlockId === blockId}
            tabIndex={0}
            data-block-id={blockId}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onKeyDown={handleKeyDown}
            className={`block-preview ${selectedBlockId === blockId ? 'block-selected' : ''}`}
            style={{ cursor: 'pointer', outline: selectedBlockId === blockId ? '2px solid #0ea5e9' : 'none' }}
        >
            {block?.content?.text ? <div className="block-text">{block.content.text}</div> : null}
        </div>
    );
};

export default RenderBlockPreview;
