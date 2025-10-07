import React from 'react';
import { TemplateDraft } from '../../../../server/templates/models';
import { renderComponent } from './registry';

export function useRenderStage(draft: TemplateDraft | undefined, stageId: string | undefined) {
    return React.useMemo(() => {
        if (!draft || !stageId) return [] as React.ReactElement[];
        const stage = draft.stages.find(s => s.id === stageId);
        if (!stage) return [];
        const elements: React.ReactElement[] = [];
        for (const cid of stage.componentIds) {
            const comp = (draft as any).components[cid];
            if (!comp) continue;
            elements.push(renderComponent(comp, { draft, stageId }));
        }
        return elements;
    }, [draft, stageId]);
}
