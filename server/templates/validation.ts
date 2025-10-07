import { TemplateAggregate } from './models';

export interface ValidationIssue {
    code: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface ValidationReport {
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
}

export function validateTemplate(agg: TemplateAggregate): ValidationReport {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    // 1. Verificar se existe ao menos uma stage result
    if (!agg.draft.stages.some(s => s.type === 'result')) {
        errors.push({ code: 'NO_RESULT_STAGE', message: 'Nenhuma stage do tipo result encontrada.', severity: 'error' });
    }

    // 2. Validar ordenação (sem duplicatas e sequência crescente a partir de 0)
    const orders = agg.draft.stages.map(s => s.order).sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
        if (orders[i] !== i) {
            warnings.push({ code: 'ORDER_GAP', message: `Gap na ordem das stages (esperado ${i} encontrado ${orders[i]}).`, severity: 'warning' });
            break;
        }
    }

    // 3. Validar cobertura de outcomes (gaps ou sobreposição)
    if (agg.draft.outcomes.length > 0) {
        const ranges = agg.draft.outcomes.map(o => ({ id: o.id, min: o.minScore ?? -Infinity, max: o.maxScore ?? Infinity })).sort((a, b) => a.min - b.min);
        for (let i = 0; i < ranges.length - 1; i++) {
            if (ranges[i].max >= ranges[i + 1].min) {
                warnings.push({ code: 'OUTCOME_OVERLAP', message: `Outcomes ${ranges[i].id} e ${ranges[i + 1].id} possuem sobreposição ou intervalo contíguo não exclusivo.`, severity: 'warning' });
            }
            if (ranges[i].max + 1 < ranges[i + 1].min && Number.isFinite(ranges[i].max) && Number.isFinite(ranges[i + 1].min)) {
                errors.push({ code: 'OUTCOME_GAP', message: `Gap entre outcomes ${ranges[i].id} e ${ranges[i + 1].id}.`, severity: 'error' });
            }
        }
    }

    return { errors, warnings };
}
