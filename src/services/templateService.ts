import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../templates/quiz21StepsComplete';
import type { Block, BlockType } from '../types/editor';

export interface TemplateData {
  blocks: Block[];
  templateVersion: string;
}

export interface StepLoadResult {
  blocks: Block[];
  step: number;
  metadata: {
    name: string;
    description: string;
    step: number;
    category: string;
    tags: string[];
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}

function getFallbackBlocksForStep(step: number): Block[] {
  // 🎯 PRIMEIRA TENTATIVA: Usar blocos do template completo
  const stepId = `step-${step}`;
  const templateBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];

  if (templateBlocks && templateBlocks.length > 0) {
    console.log(`✅ Usando template oficial para etapa ${step} (${templateBlocks.length} blocos)`);
    return templateBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));
  }

  // 🔄 FALLBACK: Gerar blocos básicos se o template não existir
  console.log(`⚠️ Template não encontrado para etapa ${step}, usando fallback`);

  const baseId = `step-${step}-fallback`;

  // Etapa 1: Coleta de nome (como no QuizFlowPage)
  if (step === 1) {
    return [
      {
        id: `${baseId}-title`,
        type: 'heading' as BlockType,
        content: { text: 'Bem-vindo ao Quiz!', level: 1 },
        order: 0,
        properties: { text: 'Bem-vindo ao Quiz!', level: 1, textAlign: 'center', color: '#432818' },
      },
      {
        id: `${baseId}-subtitle`,
        type: 'text' as BlockType,
        content: { text: 'Qual é o seu primeiro nome?' },
        order: 1,
        properties: {
          text: 'Qual é o seu primeiro nome?',
          textAlign: 'center',
          fontSize: '18px',
          color: '#666666',
        },
      },
      {
        id: `${baseId}-input`,
        type: 'input' as BlockType,
        content: { placeholder: 'Digite seu nome', type: 'text' },
        order: 2,
        properties: { placeholder: 'Digite seu nome', type: 'text', required: true },
      },
      {
        id: `${baseId}-button`,
        type: 'button' as BlockType,
        content: { text: 'Começar Quiz' },
        order: 3,
        properties: {
          text: 'Começar Quiz',
          backgroundColor: '#B89B7A',
          textColor: '#FFFFFF',
          fullWidth: true,
        },
      },
    ];
  }

  // Etapas 2-11: Questões que pontuam (como no QuizFlowPage)
  if (step >= 2 && step <= 11) {
    const questionNumber = step - 1;
    return [
      {
        id: `${baseId}-progress`,
        type: 'progress' as BlockType,
        content: { value: (questionNumber / 10) * 100, max: 100 },
        order: 0,
        properties: { value: (questionNumber / 10) * 100, max: 100, color: '#B89B7A' },
      },
      {
        id: `${baseId}-counter`,
        type: 'text' as BlockType,
        content: { text: `Pergunta ${questionNumber} de 10` },
        order: 1,
        properties: {
          text: `Pergunta ${questionNumber} de 10`,
          textAlign: 'center',
          fontSize: '14px',
          color: '#666666',
        },
      },
      {
        id: `${baseId}-question`,
        type: 'heading' as BlockType,
        content: {
          text: `Pergunta ${questionNumber}: Configure no painel de propriedades`,
          level: 2,
        },
        order: 2,
        properties: {
          text: `Pergunta ${questionNumber}: Configure no painel de propriedades`,
          level: 2,
          textAlign: 'center',
          color: '#432818',
        },
      },
      {
        id: `${baseId}-options`,
        type: 'options-grid' as BlockType,
        content: { options: [] },
        order: 3,
        properties: {
          options: [
            { id: 'opt1', text: 'Opção 1', value: 'option1' },
            { id: 'opt2', text: 'Opção 2', value: 'option2' },
            { id: 'opt3', text: 'Opção 3', value: 'option3' },
            { id: 'opt4', text: 'Opção 4', value: 'option4' },
          ],
          layout: 'grid',
          columns: 2,
        },
      },
    ];
  }

  // Etapa 12: Transição (como no QuizFlowPage)
  if (step === 12) {
    return [
      {
        id: `${baseId}-title`,
        type: 'heading' as BlockType,
        content: { text: 'Primeira Fase Concluída!', level: 2 },
        order: 0,
        properties: {
          text: 'Primeira Fase Concluída!',
          level: 2,
          textAlign: 'center',
          color: '#432818',
        },
      },
      {
        id: `${baseId}-message`,
        type: 'text' as BlockType,
        content: { text: 'Agora vamos entender melhor seus objetivos!' },
        order: 1,
        properties: {
          text: 'Agora vamos entender melhor seus objetivos!',
          textAlign: 'center',
          fontSize: '18px',
          color: '#666666',
        },
      },
      {
        id: `${baseId}-button`,
        type: 'button' as BlockType,
        content: { text: 'Continuar' },
        order: 2,
        properties: { text: 'Continuar', backgroundColor: '#B89B7A', textColor: '#FFFFFF' },
      },
    ];
  }

  // Etapas 13-18: Questões estratégicas (como no QuizFlowPage)
  if (step >= 13 && step <= 18) {
    const strategicNumber = step - 12;
    return [
      {
        id: `${baseId}-counter`,
        type: 'text' as BlockType,
        content: { text: `Pergunta Estratégica ${strategicNumber} de 6` },
        order: 0,
        properties: {
          text: `Pergunta Estratégica ${strategicNumber} de 6`,
          textAlign: 'center',
          fontSize: '14px',
          color: '#666666',
        },
      },
      {
        id: `${baseId}-question`,
        type: 'heading' as BlockType,
        content: { text: `Questão Estratégica ${strategicNumber}: Configure no painel`, level: 2 },
        order: 1,
        properties: {
          text: `Questão Estratégica ${strategicNumber}: Configure no painel`,
          level: 2,
          textAlign: 'center',
          color: '#432818',
        },
      },
      {
        id: `${baseId}-options`,
        type: 'options-grid' as BlockType,
        content: { options: [] },
        order: 2,
        properties: {
          options: [
            { id: 'opt1', text: 'Opção A', value: 'optionA' },
            { id: 'opt2', text: 'Opção B', value: 'optionB' },
          ],
          layout: 'grid',
          columns: 2,
        },
      },
    ];
  }

  // Etapa 19: Calculando resultados (como no QuizFlowPage)
  if (step === 19) {
    return [
      {
        id: `${baseId}-title`,
        type: 'heading' as BlockType,
        content: { text: 'Calculando seus resultados...', level: 2 },
        order: 0,
        properties: {
          text: 'Calculando seus resultados...',
          level: 2,
          textAlign: 'center',
          color: '#432818',
        },
      },
      {
        id: `${baseId}-spinner`,
        type: 'loading' as BlockType,
        content: { type: 'spinner' },
        order: 1,
        properties: { type: 'spinner', text: 'Analisando suas respostas...' },
      },
    ];
  }

  // Etapa 20: Resultado personalizado (como no QuizFlowPage)
  if (step === 20) {
    return [
      {
        id: `${baseId}-result`,
        type: 'quiz-result' as BlockType,
        content: { showSecondaryStyles: true, showOffer: true },
        order: 0,
        properties: { showSecondaryStyles: true, showOffer: true },
      },
      {
        id: `${baseId}-button`,
        type: 'button' as BlockType,
        content: { text: 'Ver Oferta Especial' },
        order: 1,
        properties: {
          text: 'Ver Oferta Especial',
          backgroundColor: '#B89B7A',
          textColor: '#FFFFFF',
        },
      },
    ];
  }

  // Etapa 21: Oferta especial (como no QuizFlowPage)
  if (step === 21) {
    return [
      {
        id: `${baseId}-title`,
        type: 'heading' as BlockType,
        content: { text: 'Oferta Especial!', level: 1 },
        order: 0,
        properties: { text: 'Oferta Especial!', level: 1, textAlign: 'center', color: '#432818' },
      },
      {
        id: `${baseId}-offer`,
        type: 'offer-card' as BlockType,
        content: {
          title: 'Baseado no seu resultado, temos algo perfeito para você!',
          description: 'Aproveite 50% de desconto no nosso curso personalizado',
          oldPrice: 'R$ 497',
          newPrice: 'R$ 247',
        },
        order: 1,
        properties: {
          title: 'Baseado no seu resultado, temos algo perfeito para você!',
          description: 'Aproveite 50% de desconto no nosso curso personalizado',
          oldPrice: 'R$ 497',
          newPrice: 'R$ 247',
          backgroundColor: '#22C55E',
        },
      },
      {
        id: `${baseId}-cta`,
        type: 'button' as BlockType,
        content: { text: 'Garantir Desconto Agora' },
        order: 2,
        properties: {
          text: 'Garantir Desconto Agora',
          backgroundColor: '#FFFFFF',
          textColor: '#22C55E',
          fullWidth: true,
        },
      },
    ];
  }

  // Fallback para outras etapas
  return [
    {
      id: `${baseId}-header`,
      type: 'heading' as BlockType,
      content: { text: `Etapa ${step}`, level: 1 },
      order: 0,
      properties: { text: `Etapa ${step}`, level: 1, textAlign: 'center', color: '#432818' },
    },
    {
      id: `${baseId}-text`,
      type: 'text' as BlockType,
      content: { text: `Conteúdo da etapa ${step} - Configure no painel de propriedades` },
      order: 1,
      properties: {
        text: `Conteúdo da etapa ${step} - Configure no painel de propriedades`,
        textAlign: 'center',
        fontSize: '16px',
        color: '#666666',
      },
    },
  ];
}

const templateService = {
  async getTemplates(): Promise<TemplateData[]> {
    return [];
  },
  async getTemplate(_id: string): Promise<TemplateData | null> {
    return null;
  },
  async searchTemplates(_query: string): Promise<TemplateData[]> {
    return [];
  },
  async getTemplateByStep(step: number): Promise<TemplateData | null> {
    if (step < 1 || step > 21) {
      console.warn(`⚠️ getTemplateByStep(${step}): Etapa inválida`);
      return null;
    }

    console.log(`🔄 getTemplateByStep(${step}): Carregando template...`);

    try {
      const fallbackBlocks = getFallbackBlocksForStep(step);

      const templateData: TemplateData = {
        templateVersion: '1.0.0',
        blocks: fallbackBlocks,
      };

      console.log(
        `✅ getTemplateByStep(${step}): Template gerado com ${fallbackBlocks.length} blocos`
      );
      return templateData;
    } catch (error) {
      console.error(`❌ Erro ao gerar template da etapa ${step}:`, error);
      return null;
    }
  },
  convertTemplateBlocksToEditorBlocks(templateBlocks: Block[] = []): Block[] {
    return templateBlocks.map((block, index) => ({
      id: block.id,
      type: block.type as BlockType,
      content: block.content || {},
      order: index,
      properties: block.properties || {},
    }));
  },
};

export async function loadStepTemplate(step: number): Promise<StepLoadResult | null> {
  if (step < 1 || step > 21) return null;

  console.log(`🔄 loadStepTemplate(${step}): Iniciando carregamento...`);

  // Tentar carregar do template oficial primeiro
  const stepId = `step-${step}`;
  const templateBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];

  let blocks: Block[];
  let source: string;

  if (templateBlocks && templateBlocks.length > 0) {
    blocks = templateBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));
    source = 'template oficial';
    console.log(`✅ Template oficial carregado para etapa ${step} (${blocks.length} blocos)`);
  } else {
    blocks = getFallbackBlocksForStep(step);
    source = 'fallback';
    console.log(`⚠️ Usando fallback para etapa ${step} (${blocks.length} blocos)`);
  }

  // Obter nome da questão do template
  const questionName = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).includes(stepId)
    ? Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).find(([key]) => key === stepId)?.[1]?.[0]
        ?.content?.title || `Etapa ${step}`
    : `Etapa ${step}`;

  return {
    blocks,
    step,
    metadata: {
      name: questionName,
      description: `Template da etapa ${step} (${source})`,
      step,
      category:
        step === 1
          ? 'introduction'
          : step >= 2 && step <= 11
            ? 'quiz-questions'
            : step === 12
              ? 'transition'
              : step >= 13 && step <= 18
                ? 'strategic-questions'
                : step === 19
                  ? 'processing'
                  : step === 20
                    ? 'result'
                    : step === 21
                      ? 'offer'
                      : 'default',
      tags: [source, 'quiz', 'style'],
      version: '2.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

export default templateService;
