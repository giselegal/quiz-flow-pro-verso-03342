export type ValidationIssue = { stepId: string; field?: string; message: string; severity: 'error' | 'warning' };

export function validateEditorFunnelSteps(steps: any[]): { valid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    const ids = new Set((steps || []).map(s => s.id));
    for (const s of steps || []) {
        if (s.nextStep && !ids.has(s.nextStep)) {
            issues.push({ stepId: s.id, field: 'nextStep', message: `nextStep "${s.nextStep}" não existe`, severity: 'error' });
        }
        if (s.type === 'question') {
            const hasOptions = (s.blocks || []).some((b: any) => ['quiz-options', 'options-grid'].includes(b.type));
            if (!hasOptions) {
                issues.push({ stepId: s.id, message: 'Pergunta sem opções', severity: 'error' });
            }
        }
    }
    return { valid: issues.filter(i => i.severity === 'error').length === 0, issues };
}
