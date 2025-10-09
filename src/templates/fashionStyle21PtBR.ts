/**
 * Template: Fashion Style 21 (PT-BR)
 * Gera um funil de 21 etapas compatível com o Editor Modular (EditableQuizStep[])
 * Estrutura: 1 intro, 10 perguntas principais, 1 transição, 6 perguntas estratégicas, 1 transição-result, 1 resultado, 1 oferta
 */

import type { EditableQuizStep, BlockComponent } from '@/components/editor/quiz/types';

// Pequena ajuda para criar blocos com ordenação
function makeBlock(id: string, type: string, order: number, props: Record<string, any> = {}, content: Record<string, any> = {}, parentId?: string | null): BlockComponent {
  return { id, type, order, parentId: parentId ?? null, properties: props, content } as BlockComponent;
}

function makeOptions(prefix: string, count: number, withImages = false) {
  const arr = Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}${i + 1}`,
    text: `Opção ${i + 1}`,
    ...(withImages ? { image: `https://placehold.co/320x200?text=Op%20${i + 1}` } : {})
  }));
  return arr;
}

export function buildFashionStyle21Steps(funnelId?: string): EditableQuizStep[] {
  const steps: EditableQuizStep[] = [];

  // 1) Intro (coleta nome + CTA)
  steps.push({
    id: 'step-1',
    type: 'intro',
    order: 1,
    nextStep: 'step-2',
    blocks: [
      makeBlock('b1-1', 'heading', 1, { level: 1, textAlign: 'center', color: '#432818' }, { text: 'Descubra seu estilo pessoal em minutos' }),
      makeBlock('b1-2', 'text', 2, { textAlign: 'center', color: '#6B7280' }, { text: 'Responda algumas perguntas rápidas e receba um resultado personalizado com recomendações.' }),
      makeBlock('b1-3', 'form-input', 3, {}, { label: 'Como posso te chamar?', placeholder: 'Digite seu primeiro nome...' }),
      makeBlock('b1-4', 'button', 4, { action: 'next-step' }, { text: 'Começar' })
    ]
  });

  // 2-11) 10 perguntas principais (multiSelect, 3 seleções obrigatórias)
  for (let i = 2; i <= 11; i++) {
    const order = i;
    const stepId = `step-${i}`;
    const next = i < 11 ? `step-${i + 1}` : 'step-12';
    steps.push({
      id: stepId,
      type: 'question',
      order,
      nextStep: next,
      blocks: [
        makeBlock(`b${i}-t`, 'heading', 1, { level: 2, textAlign: 'left' }, { text: `Pergunta ${i - 1}: selecione 3 opções` }),
        makeBlock(
          `b${i}-o`,
          'quiz-options',
          2,
          { multiSelect: true, requiredSelections: 3, maxSelections: 3, autoAdvance: true, showImages: true, layout: 'auto' },
          { options: makeOptions(`p${i}-opt-`, 6, true) }
        )
      ]
    });
  }

  // 12) Transição
  steps.push({
    id: 'step-12',
    type: 'transition',
    order: 12,
    nextStep: 'step-13',
    blocks: [
      makeBlock('b12-1', 'heading', 1, { level: 2, textAlign: 'center' }, { text: 'Quase lá!' }),
      makeBlock('b12-2', 'text', 2, { textAlign: 'center' }, { text: 'Agora algumas perguntas estratégicas para refinar seu resultado.' }),
      makeBlock('b12-3', 'button', 3, { action: 'next-step' }, { text: 'Continuar' })
    ]
  });

  // 13-18) 6 perguntas estratégicas (1 seleção obrigatória)
  for (let i = 13; i <= 18; i++) {
    const order = i;
    const stepId = `step-${i}`;
    const next = i < 18 ? `step-${i + 1}` : 'step-19';
    steps.push({
      id: stepId,
      type: 'strategic-question',
      order,
      nextStep: next,
      blocks: [
        makeBlock(`b${i}-t`, 'heading', 1, { level: 2, textAlign: 'left' }, { text: `Pergunta estratégica ${i - 12}` }),
        makeBlock(
          `b${i}-o`,
          'quiz-options',
          2,
          { multiSelect: false, requiredSelections: 1, maxSelections: 1, autoAdvance: true, showImages: false, layout: 'auto' },
          { options: makeOptions(`s${i}-opt-`, 4, false) }
        )
      ]
    });
  }

  // 19) Transição para resultado
  steps.push({
    id: 'step-19',
    type: 'transition-result',
    order: 19,
    nextStep: 'step-20',
    blocks: [
      makeBlock('b19-1', 'heading', 1, { level: 2, textAlign: 'center' }, { text: 'Processando seu resultado...' }),
      makeBlock('b19-2', 'text', 2, { textAlign: 'center' }, { text: 'Levamos em conta suas preferências e combinamos com nosso mapa de estilos.' })
    ]
  });

  // 20) Resultado
  steps.push({
    id: 'step-20',
    type: 'result',
    order: 20,
    nextStep: 'step-21',
    blocks: [
      makeBlock('b20-1', 'heading', 1, { level: 2, textAlign: 'center' }, { text: 'Seu resultado personalizado' }),
      makeBlock('b20-2', 'text', 2, { textAlign: 'center' }, { text: 'Seu estilo predominante é: {resultStyle}. Toque em continuar para ver uma oferta especial para você.' }),
      makeBlock('b20-3', 'button', 3, { action: 'next-step' }, { text: 'Ver oferta' })
    ]
  });

  // 21) Oferta
  steps.push({
    id: 'step-21',
    type: 'offer',
    order: 21,
    blocks: [
      makeBlock('b21-1', 'heading', 1, { level: 2, textAlign: 'center' }, { text: 'Oferta Especial' }),
      makeBlock('b21-2', 'text', 2, { textAlign: 'center' }, { text: 'Receba um guia completo com combinações, cores e peças-chave para seu estilo.' }),
      makeBlock('b21-3', 'button', 3, { action: 'open-url', url: 'https://example.com/checkout' }, { text: 'Quero meu guia' })
    ],
    offerMap: {
      // Estrutura simples pronta para evoluir
      default: { sku: 'guia-estilo', price: 97.0 }
    }
  });

  // Se veio um funnelId, guardar como metadata simples
  return steps.map(s => ({ ...s, metadata: { ...(s.metadata || {}), funnelId: funnelId || undefined } }));
}

export default { buildFashionStyle21Steps };
