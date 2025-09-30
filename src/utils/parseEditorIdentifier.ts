/**
 * Parser planejado para substituir heurística frágil em useEditorRouteInfo.
 * Estratégia futura:
 *  - Prefixos explícitos: tpl- (template), fn- (funnel)
 *  - Versões: sufixo @v2 para distinguir estruturas
 *  - Exemplo URLs: /editor/tpl-quiz-estilo , /editor/fn-12345
 * Backwards compatibility: detectar identificadores sem prefixo e classificar via fallback (regex atual).
 */
export interface ParsedEditorIdentifier {
    raw: string;
    kind: 'template' | 'funnel' | 'unknown';
    id: string;
    version?: string;
    legacy: boolean; // true se veio sem prefixo
}

const TEMPLATE_PREFIX = 'tpl-';
const FUNNEL_PREFIX = 'fn-';

export function parseEditorIdentifier(raw: string): ParsedEditorIdentifier {
    let legacy = false;
    let id = raw;
    let version: string | undefined;
    let kind: ParsedEditorIdentifier['kind'] = 'unknown';

    // versão (ex: id@v2)
    if (raw.includes('@')) {
        const [base, ver] = raw.split('@');
        id = base;
        version = ver;
    }

    if (id.startsWith(TEMPLATE_PREFIX)) {
        kind = 'template';
        id = id.substring(TEMPLATE_PREFIX.length);
    } else if (id.startsWith(FUNNEL_PREFIX)) {
        kind = 'funnel';
        id = id.substring(FUNNEL_PREFIX.length);
    } else {
        // legacy fallback
        legacy = true;
        // heurística provisória simplificada (delegada a camada atual)
        if (/^(step-|template|quiz|test|funnel|default-|optimized-|style-)/i.test(id)) kind = 'template';
        else kind = 'funnel';
    }

    return { raw, kind, id, version, legacy };
}
