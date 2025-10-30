import React, { useEffect } from 'react';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';

type BlockLike = { id?: string; type?: string; order?: number; content?: any; properties?: any };

interface Props {
    data?: { id?: string };
    blocks?: BlockLike[];
    editor?: { actions?: { ensureStepLoaded?: (stepId: string) => Promise<void> | void } };
}

export default function ModularIntroStep({ data, blocks, editor }: Props) {
    const stepId = data?.id || '';

    useEffect(() => {
        if ((!blocks || blocks.length === 0) && stepId && editor?.actions?.ensureStepLoaded) {
            editor.actions.ensureStepLoaded(stepId);
        }
    }, [blocks, stepId, editor?.actions]);

    if (!blocks || blocks.length === 0) return null;

    return (
        <div>
            {blocks.map((block, idx) => (
                <UniversalBlockRenderer key={block.id || idx} block={block as any} />
            ))}
        </div>
    );
}
