/**
 * funnelNavigation.ts
 * Utilidades para analisar navegação entre steps (funil).
 */
export interface NavStep {
    id: string;
    order: number;
    nextStep?: string | null;
    autoLinked?: boolean;
}
export interface NavigationIssue {
    type: 'MISSING_NEXT_STEP' | 'MISSING_TARGET' | 'ORPHAN' | 'LOOP' | 'DISCONNECTED';
    stepId: string;
    message: string;
    severity: 'error' | 'warning';
    data?: any;
}
export interface NavigationAnalysis {
    steps: NavStep[];
    issues: NavigationIssue[];
    graph: Record<string, string | null>; // step -> next
    startStep?: string;
    terminalSteps: string[];
    reachable: Set<string>;
}

export function buildNavigationMap(raw: NavStep[]): NavigationAnalysis {
    const steps = [...raw].sort((a, b) => a.order - b.order);
    const idSet = new Set(steps.map(s => s.id));
    const issues: NavigationIssue[] = [];
    const graph: Record<string, string | null> = {};
    steps.forEach(s => { graph[s.id] = s.nextStep ?? null; });

    // Detect missing nextStep (exceto última ordenada)
    const maxOrder = Math.max(...steps.map(s => s.order), 0);
    steps.forEach(s => {
        if (s.order !== maxOrder && (s.nextStep === undefined || s.nextStep === null)) {
            issues.push({
                type: 'MISSING_NEXT_STEP', stepId: s.id,
                message: `Step ${s.id} sem nextStep (exceto último).`, severity: 'error'
            });
        }
    });
    // Target inexistente
    steps.forEach(s => {
        if (s.nextStep && !idSet.has(s.nextStep)) {
            issues.push({ type: 'MISSING_TARGET', stepId: s.id, message: `nextStep aponta para inexistente: ${s.nextStep}`, severity: 'error' });
        }
    });
    // Alcance / órfãos
    const start = steps[0]?.id; // assumindo primeiro como início
    const reachable = new Set<string>();
    let cursor = start;
    const visited: string[] = [];
    while (cursor && !visited.includes(cursor)) {
        reachable.add(cursor);
        visited.push(cursor);
        const nxt = graph[cursor];
        cursor = nxt || '';
    }
    steps.forEach(s => {
        if (!reachable.has(s.id)) {
            issues.push({ type: 'ORPHAN', stepId: s.id, message: `Step ${s.id} não é alcançado a partir do início`, severity: 'warning' });
        }
    });
    // Loop -> se percorremos e acabamos repetindo antes de null
    if (cursor !== '' && cursor) {
        issues.push({ type: 'LOOP', stepId: cursor, message: `Loop detectado em ${cursor}`, severity: 'error' });
    }
    // Desconexões múltiplas (mais de um terminal inesperado)
    const terminalSteps = steps.filter(s => !s.nextStep).map(s => s.id);
    if (terminalSteps.length > 1) {
        terminalSteps.forEach(t => {
            if (t !== steps[steps.length - 1].id) {
                issues.push({ type: 'DISCONNECTED', stepId: t, message: `Terminal antecipado: ${t}`, severity: 'warning' });
            }
        });
    }
    return { steps, issues, graph, startStep: start, terminalSteps, reachable };
}

export function formatNavigationReport(analysis: NavigationAnalysis): string {
    const lines: string[] = [];
    lines.push('Mapa de Navegação:');
    analysis.steps.forEach(s => {
        lines.push(` - ${s.id} -> ${analysis.graph[s.id] || '(fim)'}`);
    });
    if (analysis.issues.length === 0) lines.push('Sem problemas.');
    else {
        lines.push('Problemas:');
        analysis.issues.forEach(i => lines.push(` * [${i.severity}] ${i.message}`));
    }
    return lines.join('\n');
}
