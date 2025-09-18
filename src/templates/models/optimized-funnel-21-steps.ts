// Modelo derivado do config otimizado das 21 etapas, convertido
// para o formato simples esperado pelo Editor (mapa de step -> blocos)
import OPTIMIZED_CONFIG from '@/config/optimized21StepsFunnel';

type StepBlocks = Record<string, Array<{ type: string; properties?: Record<string, any> }>>;

const stepsMap: StepBlocks = (OPTIMIZED_CONFIG.steps || []).reduce(
    (acc: StepBlocks, step: any) => {
        const key = step?.id || step?.name || '';
        if (!key) return acc;
        acc[key] = (step.blocks || []).map((b: any) => ({ type: b.type, properties: b.properties }));
        return acc;
    },
    {}
);

export default {
    id: 'optimized-21-steps-funnel',
    name: 'Funil Quiz 21 Etapas (Otimizado)',
    version: 1,
    metadata: {
        collectUserName: true,
        seo: {
            title: 'Quiz de Estilo Pessoal (Otimizado)',
            description: 'Descubra seu estilo com 21 etapas otimizadas',
        },
        pixel: {},
        utm: {},
        webhooks: {},
    },
    steps: stepsMap,
    variables: [
        { key: 'romantico', label: 'Romântico', description: '', scoringWeight: 1 },
        { key: 'classico', label: 'Clássico', description: '', scoringWeight: 1 },
        { key: 'natural', label: 'Natural', description: '', scoringWeight: 1 },
        { key: 'elegante', label: 'Elegante', description: '', scoringWeight: 1 },
        { key: 'dramatico', label: 'Dramático', description: '', scoringWeight: 1 },
        { key: 'criativo', label: 'Criativo', description: '', scoringWeight: 1 },
        { key: 'contemporaneo', label: 'Contemporâneo', description: '', scoringWeight: 1 },
    ],
} as const;
