export type BlockLike = { id?: string; questionId?: string; type?: string;[k: string]: any };

export function scanDuplicateQuestionIds(allSteps: Record<string, BlockLike[]>) {
    try {
        const map = new Map<string, string[]>();
        for (const [stepKey, blocks] of Object.entries(allSteps)) {
            for (const b of blocks || []) {
                const qid = String((b as any)?.questionId ?? '');
                if (!qid) continue;
                const list = map.get(qid) || [];
                list.push(`${stepKey}#${b?.id ?? 'no-id'}`);
                map.set(qid, list);
            }
        }

        const duplicates = Array.from(map.entries()).filter(([, refs]) => refs.length > 1);
        (window as any).__EDITOR_DUP_QID__ = duplicates;
        if (process.env.NODE_ENV === 'development' && duplicates.length) {
            // eslint-disable-next-line no-console
            console.warn('[duplicateQuestionScanner] Duplicates found:', duplicates.slice(0, 5));
        }
        return duplicates;
    } catch (e) {
        return [] as Array<[string, string[]]>;
    }
}

export default { scanDuplicateQuestionIds };
