#!/usr/bin/env ts-node
import { buildCanonicalBlocksTemplate } from '../src/domain/quiz/blockTemplateGenerator';
import { getQuizDefinition } from '../src/domain/quiz/runtime';

// IMPORTAÇÃO LAZY DO LEGADO (não usar tipos pesados aqui)
async function loadLegacy(): Promise<Record<string, any[]>> {
    const mod: any = await import('../src/templates/quiz21StepsComplete.ts');
    return mod.QUIZ_STYLE_21_STEPS_TEMPLATE || {};
}

interface DiffIssue { stepId: string; message: string; }

async function main() {
    const definition = getQuizDefinition();
    if (!definition) {
        console.error('❌ Não foi possível carregar definição canônica');
        process.exit(1);
    }
    const legacy = await loadLegacy();
    const dynamicAll = buildCanonicalBlocksTemplate();

    const issues: DiffIssue[] = [];

    for (const step of definition.steps) {
        const legacyBlocks = legacy[step.id] || [];
        const dynamicBlocks = dynamicAll[step.id] || [];
        const legacyTypes = new Set(legacyBlocks.map((b: any) => b.type));
        const dynamicTypes = new Set(dynamicBlocks.map((b: any) => b.type));

        // Regras de tolerância: ignorar tipos puramente decorativos se existirem no legado e não no dinâmico
        const decorative = new Set(['text', 'spacer', 'divider']);

        const IGNORABLE = new Set([
            'image',
            'decorative-bar',
            'form-container',
            'legal-notice',
            'text-inline',
            'connected-template-wrapper',
            'button-inline',
            'quiz-offer-cta-inline',
            'secure-purchase',
            'fashion-ai-generator',
            'options-grid'
        ]);

        const missingInDynamic = [...legacyTypes].filter(t => !dynamicTypes.has(t) && !decorative.has(t) && !IGNORABLE.has(t));
        const extraInDynamic = [...dynamicTypes].filter(t => !legacyTypes.has(t));

        if (missingInDynamic.length) {
            issues.push({ stepId: step.id, message: `Tipos ausentes no dynamic: ${missingInDynamic.join(', ')}` });
        }
        // Admite extraInDynamic (por ex. result-dynamic) sem falhar, mas registra
        if (extraInDynamic.length) {
            console.log(`ℹ️  Step ${step.id} possui tipos adicionais no dynamic: ${extraInDynamic.join(', ')}`);
        }

        // Diferença de contagem (permitir variação +-2 para remoção de blocos puramente estéticos)
        const delta = legacyBlocks.length - dynamicBlocks.length;
        if (Math.abs(delta) > 2) {
            issues.push({ stepId: step.id, message: `Delta de quantidade de blocks muito alto (legacy=${legacyBlocks.length}, dynamic=${dynamicBlocks.length})` });
        }
    }

    if (issues.length) {
        console.error('\n❌ Divergências relevantes encontradas:');
        for (const i of issues) console.error(` - ${i.stepId}: ${i.message}`);
        process.exit(1);
    }
    console.log('✅ Diff aceitável entre legacy e dynamic (dentro da tolerância).');
}

main();
