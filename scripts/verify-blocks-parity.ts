#!/usr/bin/env ts-node
import { getQuizDefinition } from '../src/domain/quiz/runtime';
import { buildCanonicalBlocksTemplate } from '../src/domain/quiz/blockTemplateGenerator';

interface Issue { stepId: string; message: string; }

function main() {
    const definition = getQuizDefinition();
    if (!definition) {
        console.error('❌ Não foi possível carregar a definição canônica');
        process.exit(1);
    }
    const steps = definition.steps;
    const fullTemplate = buildCanonicalBlocksTemplate();

    const issues: Issue[] = [];

    steps.forEach((s: any) => {
        const blocks = fullTemplate[s.id];
        if (!blocks || blocks.length === 0) {
            issues.push({ stepId: s.id, message: 'Sem blocks gerados' });
            return;
        }
        // Regras específicas
        if (s.type === 'question' && !blocks.find(b => b.type.includes('question'))) {
            issues.push({ stepId: s.id, message: 'Question step sem bloco de pergunta' });
        }
        if (s.type === 'offer' && !blocks.find(b => b.type.includes('offer'))) {
            issues.push({ stepId: s.id, message: 'Offer step sem bloco offer-dynamic' });
        }
        if (s.type === 'result' && !blocks.find(b => b.type.includes('result'))) {
            issues.push({ stepId: s.id, message: 'Result step sem bloco result-dynamic' });
        }
        if (s.type === 'question') {
            const q = blocks.find(b => b.type.includes('question'));
            if (q) {
                if (q.content?.requiredSelections && q.content.requiredSelections > (s.options?.length || 0)) {
                    issues.push({ stepId: s.id, message: 'requiredSelections maior que número de opções' });
                }
                if (q.properties?.layout === 'grid' && !q.properties?.columns) {
                    issues.push({ stepId: s.id, message: 'layout grid sem columns' });
                }
            }
        }
    });

    if (issues.length) {
        console.error('\n❌ Paridade de blocks incompleta:');
        for (const i of issues) {
            console.error(` - ${i.stepId}: ${i.message}`);
        }
        process.exit(1);
    }
    console.log('✅ Todos os steps possuem blocks gerados com regras mínimas.');
}

main();
