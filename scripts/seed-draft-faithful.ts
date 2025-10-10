import { QUIZ_STEPS, STEP_ORDER, type QuizStep } from '../src/data/quizSteps';
import { quizEditorBridge as bridge } from '../src/services/QuizEditorBridge';
import fs from 'fs';
import path from 'path';

// Mapear imagens por estilo para preencher opções sem imagem nas perguntas principais
const CLOUD_BASE = 'https://res.cloudinary.com/dqljyf76t/image/upload/';
const STYLE_IMAGES: Record<string, string> = {
    natural: `${CLOUD_BASE}v1744735329/11_hqmr8l.webp`,
    classico: `${CLOUD_BASE}v1744735330/12_edlmwf.webp`,
    contemporaneo: `${CLOUD_BASE}v1744735317/4_snhaym.webp`,
    elegante: `${CLOUD_BASE}v1744735330/14_l2nprc.webp`,
    romantico: `${CLOUD_BASE}v1744735317/15_xezvcy.webp`,
    sexy: `${CLOUD_BASE}v1744735316/16_mpqpew.webp`,
    dramatico: `${CLOUD_BASE}v1744735319/17_m5ogub.webp`,
    criativo: `${CLOUD_BASE}v1744735317/18_j8ipfb.webp`,
};

function withPatchedImages(step: QuizStep, stepId: string): QuizStep {
    // Apenas para perguntas principais (type: 'question')
    if (step.type === 'question' && Array.isArray(step.options)) {
        const options = step.options.map((opt: any) => {
            if (!opt?.image && opt?.id && STYLE_IMAGES[opt.id]) {
                return { ...opt, image: STYLE_IMAGES[opt.id] };
            }
            return opt;
        });
        return { ...step, options } as QuizStep;
    }
    return step;
}

async function main() {
    const draftId = process.argv[2] || `draft-faithful-${Date.now()}`;
    const name = `Quiz Estilo Pessoal (Faithful Draft) ${new Date().toISOString()}`;
    const slug = 'quiz-estilo';

    // Montar steps com imagens preenchidas quando faltar
    const steps = STEP_ORDER.map((id, idx) => {
        const original = QUIZ_STEPS[id] as QuizStep;
        const patched = withPatchedImages(original, id);
        return {
            id,
            order: idx + 1,
            ...patched,
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

    // Salvar modelo em JSON para auditoria
    const outDir = path.resolve(process.cwd(), 'scripts/outputs');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'quiz-estilo-faithful.json');
    fs.writeFileSync(outFile, JSON.stringify(funnel, null, 2));
    console.log(`📄 Modelo fiel salvo em: ${path.relative(process.cwd(), outFile)}`);

    // Persistir como rascunho via bridge do editor
    console.log('💾 Salvando draft fiel em memória:', draftId);
    const savedId = await bridge.saveDraft(funnel);
    console.log('✅ Draft salvo:', savedId);

    // Sanidade de runtime
    const runtime = await bridge.loadForRuntime(savedId);
    console.log('🔎 Runtime steps carregados:', Object.keys(runtime).length);
    const firstStep = runtime[STEP_ORDER[0]];
    console.log('🧪 Primeira etapa (tipo):', (firstStep as any)?.type);

    const url = `http://localhost:8080/quiz-estilo?draft=${savedId}`;
    console.log('\n🔗 Abra o preview no navegador:', url);
}

main().catch((e) => {
    console.error('❌ Seed draft fiel falhou:', e);
    process.exit(1);
});
