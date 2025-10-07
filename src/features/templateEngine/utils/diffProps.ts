// Utilitário compartilhado para diff de propriedades de componentes
// Compara props atuais e anteriores/publicadas retornando lista de mudanças
// Cada mudança inclui chave, valor anterior e novo valor

export interface PropDiffEntry {
    key: string;
    before: any;
    after: any;
}

export function diffProps(current?: Record<string, any>, previous?: Record<string, any>): PropDiffEntry[] {
    const c = current || {};
    const p = previous || {};
    const diffs: PropDiffEntry[] = [];
    const keys = new Set([...Object.keys(c), ...Object.keys(p)]);
    keys.forEach(k => {
        const a = c[k];
        const b = p[k];
        if (JSON.stringify(a) !== JSON.stringify(b)) {
            diffs.push({ key: k, before: b, after: a });
        }
    });
    return diffs;
}

// Soma total de diferenças em um conjunto de componentes
export function diffComponentsMap(current: Record<string, any>, previous: Record<string, any>) {
    return Object.keys(current).filter(cid => previous[cid]).map(cid => ({
        id: cid,
        diffs: diffProps(current[cid]?.props, previous[cid]?.props)
    })).filter(e => e.diffs.length > 0);
}
