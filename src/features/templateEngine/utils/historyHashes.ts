// Utilidades frontend para comparar entries de histórico (espelham lógica do backend models.ts)

export function stableHash(obj: any): string {
    const json = JSON.stringify(obj);
    let h = 0, i = 0, len = json.length;
    while (i < len) { h = (h << 5) - h + json.charCodeAt(i++) | 0; }
    return `h${(h >>> 0).toString(36)}`;
}

export function buildMetaHash(meta: any) {
    const pick = { name: meta?.name, slug: meta?.slug, tags: meta?.tags || [], tracking: meta?.tracking || {}, seo: meta?.seo || {} };
    return stableHash(pick);
}

export function buildStagesHash(stages: any[]) {
    const norm = (stages || []).map(s => ({ id: s.id, order: s.order, enabled: s.enabled, comps: [...(s.componentIds || [])] })).sort((a, b) => a.order - b.order);
    return stableHash(norm);
}

export function buildComponentsHash(components: Record<string, any>) {
    const norm = Object.values(components || {}).map((c: any) => ({ id: c.id, type: c.type, propKeys: Object.keys(c.props || {}).sort() })).sort((a, b) => a.id.localeCompare(b.id));
    return stableHash(norm);
}

export interface HistoryHashComparison {
    metaChanged: boolean;
    stagesChanged: boolean;
    componentsChanged: boolean;
    current: { metaHash: string; stagesHash: string; componentsHash: string };
}

export function compareHistoryEntry(draft: any, entry: any): HistoryHashComparison {
    const currentMeta = buildMetaHash(draft.meta);
    const currentStages = buildStagesHash(draft.stages);
    const currentComponents = buildComponentsHash(draft.components);
    return {
        metaChanged: currentMeta !== entry.metaHash,
        stagesChanged: currentStages !== entry.stagesHash,
        componentsChanged: currentComponents !== entry.componentsHash,
        current: { metaHash: currentMeta, stagesHash: currentStages, componentsHash: currentComponents }
    };
}
