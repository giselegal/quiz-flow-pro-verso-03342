import { TemplateAggregate } from './models';
import { validateComponent as validateNewComponent } from './components';

export interface ValidationIssue {
    code: string;
    message: string;
    severity: 'error' | 'warning';
    field?: string; // opcional: campo específico (ex: component.props.options)
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

    // ----------------- Regras adicionais para drafts do adapter legacy -----------------
    if (agg.draft.schemaVersion?.includes('adapter-legacy')) {
        // Marca geral de que este draft está em modo adapter
        warnings.push({ code: 'LEGACY_ADAPTER_SCHEMA', message: 'Draft gerado via adapter legacy – alguns elementos ainda não modularizados.', severity: 'warning' });

        const componentTypes = Object.values(agg.draft.components).map(c => c.type);
        if (componentTypes.length && componentTypes.every(t => t === 'legacyBlocksBundle')) {
            warnings.push({ code: 'LEGACY_PLACEHOLDER_COMPONENTS', message: 'Todos os componentes são bundles legacy (legacyBlocksBundle). Modularização pendente.', severity: 'warning' });
        }
        if (!Object.keys(agg.draft.logic.scoring.weights || {}).length) {
            warnings.push({ code: 'LEGACY_NO_SCORING_WEIGHTS', message: 'Configuração de scoring sem pesos definidos (weights vazio).', severity: 'warning' });
        }
        if (agg.draft.outcomes.length <= 1) {
            warnings.push({ code: 'LEGACY_SINGLE_OUTCOME', message: 'Apenas um outcome definido – segmentação de resultados ausente.', severity: 'warning' });
        }
    }

    // 4. (Experimental) Validação de componentes tipados se presentes
    if (agg.draft.components) {
        for (const comp of Object.values(agg.draft.components)) {
            // Suporte transicional: componentes antigos usam 'type', novos usarão 'kind'
            // Evita quebrar drafts atuais sem 'kind'
            if ((comp as any).kind) {
                try {
                    const issues = validateNewComponent(comp as any);
                    for (const issue of issues) {
                        const code = `COMP_${issue.kind}_${issue.severity.toUpperCase()}`;
                        const entry: ValidationIssue = { code, message: `[${comp.id}] ${issue.message}`, severity: issue.severity, field: issue.field };
                        if (issue.severity === 'error') errors.push(entry); else warnings.push(entry);
                    }
                } catch (e: any) {
                    errors.push({ code: 'COMP_VALIDATION_ERROR', message: `[${comp.id}] Falha ao validar componente: ${e.message}`, severity: 'error' });
                }
            }
        }
    }

    return { errors, warnings };
}
