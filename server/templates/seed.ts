// Seed inicial de dados reais para o Template Engine
// Popula alguns templates somente se o repositório estiver vazio.
// Mantido simples para desenvolvimento; pode ser desativado via env SEED_TEMPLATES=false

import { templateService } from './service';
import { templateRepo } from './repo';
import { genId } from './models';

function enrichBasicQuiz(templateId: string) {
    // Acessa aggregate completo direto pelo repo para injetar componentes (ainda não há service layer para componentes)
    const aggregate = templateRepo.get(templateId);
    if (!aggregate) return;
    const draft = aggregate.draft;

    // Componentes base (placeholder até haver modelo oficial de opções/perguntas)
    const introComponentId = genId('cmp');
    const questionComponentId = genId('cmp');
    const resultLowComponentId = genId('cmp');
    const resultHighComponentId = genId('cmp');

    draft.components[introComponentId] = {
        id: introComponentId,
        type: 'richText',
        props: { html: '<h1>Bem-vindo ao Quiz de Estilo</h1><p>Descubra seu perfil respondendo algumas perguntas rápidas.</p>' }
    };

    draft.components[questionComponentId] = {
        id: questionComponentId,
        type: 'singleChoiceQuestion',
        props: {
            question: 'Qual padrão de cores você prefere?',
            options: [
                { id: 'opt_a', label: 'Minimalista (tons neutros)' },
                { id: 'opt_b', label: 'Vibrante (cores fortes)' }
            ]
        }
    };

    draft.components[resultLowComponentId] = {
        id: resultLowComponentId,
        type: 'resultBlock',
        props: { title: 'Estilo Minimalista', body: 'Você prefere composições limpas e discretas.' }
    };

    draft.components[resultHighComponentId] = {
        id: resultHighComponentId,
        type: 'resultBlock',
        props: { title: 'Estilo Vibrante', body: 'Você gosta de impacto visual e cores energéticas.' }
    };

    // Vincula componentes aos stages existentes (createBaseTemplate cria stage_intro, stage_q1, stage_result)
    const stageIntro = draft.stages.find(s => s.id === 'stage_intro');
    const stageQ1 = draft.stages.find(s => s.id === 'stage_q1');
    const stageResult = draft.stages.find(s => s.id === 'stage_result');
    if (stageIntro && !stageIntro.componentIds.includes(introComponentId)) stageIntro.componentIds.push(introComponentId);
    if (stageQ1 && !stageQ1.componentIds.includes(questionComponentId)) stageQ1.componentIds.push(questionComponentId);

    // Ajusta outcomes para usar textos separados via components (placeholder: outcomes seguem sendo texto; components podem ser usados por renderer futuro)
    draft.outcomes = [
        { id: 'out_minimal', minScore: 0, maxScore: 25, template: 'Você é Minimalista (score: {{score}})' },
        { id: 'out_vibrant', minScore: 26, maxScore: 9999, template: 'Você é Vibrante (score: {{score}})' }
    ];

    // Scoring simples (sum) com pesos sobre opções da pergunta Q1
    draft.logic.scoring.weights = {
        'stage_q1:opt_a': 10,
        'stage_q1:opt_b': 40
    };

    // Salva alterações
    templateRepo.save(aggregate);
}

function createBranchedQuiz() {
    const agg = templateService.createBase('Quiz Condicional', 'quiz-condicional-demo');
    // Adiciona segunda pergunta para demonstrar branching
    const stage2 = templateService.addStage(agg.draft.id, { type: 'question', afterStageId: 'stage_q1', label: 'Pergunta 2' });
    // Ajusta scoring de exemplo
    templateService.setScoring(agg.draft.id, {
        weights: {
            'stage_q1:opt_a': 5,
            'stage_q1:opt_b': 20,
            [`${stage2.id}:opt_c`]: 30
        }
    });
    // Branching: se score >= 25 pula para result; caso contrário segue fluxo linear (que já chega no result de qualquer forma)
    // Branching: condição simples baseada em score >= 25.
    // Ajustado para formato suportado por ConditionTreeNode (ex: comparação via nó genérico com campo e operador)
    templateService.setBranching(agg.draft.id, [
        {
            fromStageId: 'stage_q1',
            toStageId: 'stage_result',
            conditionTree: {
                op: 'AND',
                conditions: [
                    {
                        op: 'COMPARISON',
                        field: 'score',
                        operator: 'GTE',
                        value: 25
                    } as any // TODO: alinhar quando tipos de ConditionTreeNode forem expostos para comparação de score
                ]
            } as any
        }
    ]);
    return agg.draft.id;
}

export function seedTemplates() {
    if (process.env.SEED_TEMPLATES === 'false') {
        return;
    }
    const already = templateService.listDrafts();
    if (already.length > 0) return; // não sobrescreve

    const basic = templateService.createBase('Quiz Estilo Básico', 'quiz-estilo-basico');
    enrichBasicQuiz(basic.draft.id);
    createBranchedQuiz();
    console.log('[seed] Templates iniciais criados.');
}
