import { QUIZ_STEPS, STEP_ORDER, type QuizStep } from '../src/data/quizSteps';
import { quizEditorBridge as bridge } from '../src/services/QuizEditorBridge';

async function main() {
    const draftId = process.argv[2] || `draft-dev-${Date.now()}`;
    const name = `Draft Dev ${new Date().toISOString()}`;
    const slug = 'quiz-estilo';

    // Montar steps com id e order a partir do QUIZ_STEPS atual
    const steps = STEP_ORDER.map((id, idx) => {
        const step = QUIZ_STEPS[id] as QuizStep;
        return {
            id,
            order: idx + 1,
            ...step,
        } as any;
    });

    const funnel = {
        id: draftId,
        name,
        slug,
        steps,
        isPublished: false,
        version: 0,
    } as any;

    console.log('💾 Salvando draft em memória:', draftId);
    const savedId = await bridge.saveDraft(funnel);
    console.log('✅ Draft salvo:', savedId);

    // Carregar runtime para checar se o draft é retornado
    const runtime = await bridge.loadForRuntime(savedId);
    console.log('🔎 Runtime steps carregados:', Object.keys(runtime).length);
    const firstStep = runtime[STEP_ORDER[0]];
    console.log('🧪 Primeira etapa (tipo):', firstStep?.type);

    // Não publicamos de fato para produção pois Supabase pode estar stubado.
    // Em vez disso, abriremos a URL de preview:
    const url = `http://localhost:8080/quiz-estilo?draft=${savedId}`;
    console.log('\n🔗 Abra o preview no navegador:', url);
}

main().catch((e) => {
    console.error('❌ Seed draft falhou:', e);
    process.exit(1);
});
