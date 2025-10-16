/**
 * 🎯 RENDERIZADOR ESPECÍFICO PARA QUIZ 21 STEPS
 *
 * Converte dados do quiz21StepsComplete.ts para formato
 * compatível com o editor unificado
 */

import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';

import { convertSectionsToBlocks } from './sectionToBlockConverter';

/**
 * Carrega dados da etapa e converte para formato do editor
 */
export function loadStepBlocks(stepNumber: number): Block[] {
  const stepKey = `step-${stepNumber}`;
  const templateData = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey];

  if (!templateData) {
    console.warn(`❌ Etapa ${stepKey} não encontrada no template`);
    return [];
  }

  // ✅ NOVO: Suporte para formato sections (v3.0) - usado no step-20
  if (templateData.sections && Array.isArray(templateData.sections)) {
    console.log(`🔄 Convertendo ${templateData.sections.length} sections da ${stepKey} para blocos`);
    const blocks = convertSectionsToBlocks(templateData.sections);
    console.log(`✅ ${blocks.length} blocos gerados da ${stepKey}`);
    return blocks;
  }

  // ✅ Suporte para formato blocks (array direto) - etapas 1-19
  if (Array.isArray(templateData)) {
    console.log(`✅ Carregando etapa ${stepKey} com ${templateData.length} blocos`);
    return templateData.map((templateBlock: any) => {
      const block: Block = {
        id: templateBlock.id,
        type: mapBlockType(templateBlock.type),
        order: templateBlock.order,
        content: processContent(templateBlock.content, templateBlock.type),
        properties: templateBlock.properties || {},
      };

      return block;
    });
  }

  console.warn(`❌ Formato desconhecido para ${stepKey}. Esperado: sections[] ou Block[]`);
  return [];
}

/**
 * Mapeia tipos do template para tipos do editor
 */
function mapBlockType(templateType: string): any {
  const typeMapping: Record<string, string> = {
    'quiz-intro-header': 'quiz-intro-header',
    'decorative-bar-inline': 'decorative-bar-inline',
    'text-inline': 'text-inline',
    'image-display-inline': 'image-display-inline',
    'form-input': 'form-input',
    'button-inline': 'button-inline',
    'form-container': 'form-container',
    'options-grid': 'options-grid',
    hero: 'hero',
    text: 'text-inline',
    button: 'button-inline',
    'result-header-inline': 'result-card',
    'style-card-inline': 'style-card-inline',
    'secondary-styles': 'result-card',
    benefits: 'text-inline',
    testimonials: 'text-inline',
    guarantee: 'text-inline',
    'quiz-offer-cta-inline': 'button-inline',
  };

  return typeMapping[templateType] || 'text-inline';
}

/**
 * Processa conteúdo do template para formato do editor
 */
function processContent(content: any, blockType: string): any {
  // Para quiz-intro-header
  if (blockType === 'quiz-intro-header') {
    return {
      title: content.title || 'Título',
      subtitle: content.subtitle || '',
      description: content.description || '',
      showLogo: content.showLogo || false,
      showProgress: content.showProgress || false,
      showNavigation: content.showNavigation || false,
      logoUrl: content.logoUrl || '',
      logoAlt: content.logoAlt || '',
      progressValue: content.progressValue || 0,
      progressMax: content.progressMax || 100,
      showBackButton: content.showBackButton || false,
    };
  }

  // Para form-container (formulário de nome)
  if (blockType === 'form-container') {
    return {
      title: content.title || 'Nome',
      placeholder: content.placeholder || 'Digite seu nome',
      buttonText: content.buttonText || 'Continuar',
      fieldType: content.fieldType || 'text',
      required: content.required || true,
      dataKey: content.dataKey || 'userName',
    };
  }

  // Para options-grid (perguntas com opções)
  if (blockType === 'options-grid') {
    return {
      question: content.question || 'Pergunta',
      options: content.options || [],
      showImages: content.showImages || false,
      columns: content.columns || 2,
      requiredSelections: content.requiredSelections || 1,
      maxSelections: content.maxSelections || 1,
      multipleSelection: content.multipleSelection || false,
      autoAdvanceOnComplete: content.autoAdvanceOnComplete || false,
    };
  }

  // Para hero (páginas de transição)
  if (blockType === 'hero') {
    return {
      title: content.title || 'Título',
      subtitle: content.subtitle || '',
      description: content.description || '',
      imageUrl: content.imageUrl || '',
      buttonText: content.buttonText || 'Continuar',
      showButton: content.showButton || true,
    };
  }

  // Para texto simples
  if (blockType === 'text') {
    return {
      text: content.text || 'Texto',
    };
  }

  // Para botões
  if (blockType === 'button') {
    return {
      buttonText: content.buttonText || 'Botão',
      buttonUrl: content.buttonUrl || '#',
    };
  }

  // Fallback - retorna conteúdo original
  return content;
}

/**
 * Obter informações da etapa
 */
export function getStepInfo(stepNumber: number) {
  return {
    stepNumber,
    stepKey: `step-${stepNumber}`,
    title: getStepTitle(stepNumber),
    subtitle: getStepSubtitle(stepNumber),
    type: getStepType(stepNumber),
    isRequired: stepNumber >= 2 && stepNumber <= 18,
    maxSelections: getMaxSelections(stepNumber),
    description: getStepDescription(stepNumber),
  };
}

function getStepTitle(stepNumber: number): string {
  if (stepNumber === 1) return 'Bem-vindo! Vamos começar?';
  if (stepNumber >= 2 && stepNumber <= 11) return `Questão ${stepNumber - 1} de 10`;
  if (stepNumber === 12) return 'Calculando seu resultado...';
  if (stepNumber >= 13 && stepNumber <= 18) return `Questão estratégica ${stepNumber - 12}`;
  if (stepNumber === 19) return 'Preparando resultado...';
  if (stepNumber === 20) return 'Seu resultado está pronto!';
  if (stepNumber === 21) return 'Oferta especial para você!';
  return `Etapa ${stepNumber}`;
}

function getStepSubtitle(stepNumber: number): string {
  if (stepNumber === 1) return 'Digite seu nome para personalizar sua experiência';
  if (stepNumber >= 2 && stepNumber <= 11) return '';
  if (stepNumber === 12) return 'Enquanto calculamos seu resultado...';
  if (stepNumber >= 13 && stepNumber <= 18) return '';
  if (stepNumber === 19) return 'Seu resultado personalizado está quase pronto...';
  if (stepNumber === 20) return '';
  if (stepNumber === 21) return 'Uma oportunidade única para transformar seu estilo';
  return '';
}

function getStepType(stepNumber: number): string {
  if (stepNumber === 1) return 'intro';
  if (stepNumber >= 2 && stepNumber <= 11) return 'question';
  if (stepNumber === 12 || stepNumber === 19) return 'transition';
  if (stepNumber >= 13 && stepNumber <= 18) return 'strategic';
  if (stepNumber === 20) return 'result';
  if (stepNumber === 21) return 'offer';
  return 'content';
}

function getMaxSelections(stepNumber: number): number {
  if (stepNumber >= 2 && stepNumber <= 11) return 3; // Questões pontuadas
  if (stepNumber >= 13 && stepNumber <= 18) return 1; // Questões estratégicas
  return 0;
}

function getStepDescription(stepNumber: number): string {
  if (stepNumber === 1) return 'Página inicial para coleta do nome e início do quiz';
  if (stepNumber >= 2 && stepNumber <= 11)
    return 'Questões pontuadas para descobrir o estilo predominante';
  if (stepNumber === 12) return 'Página de transição enquanto calcula o resultado';
  if (stepNumber >= 13 && stepNumber <= 18)
    return 'Questões estratégicas para segmentação e ofertas';
  if (stepNumber === 19) return 'Página de preparação do resultado final';
  if (stepNumber === 20) return 'Exibição do resultado do quiz com estilo predominante';
  if (stepNumber === 21) return 'Página de oferta com call-to-action para conversão';
  return '';
}

/**
 * Verifica se uma etapa é válida
 */
export function isValidStep(stepNumber: number): boolean {
  return stepNumber >= 1 && stepNumber <= 21;
}

/**
 * Obtém a etapa anterior
 */
export function getPreviousStep(stepNumber: number): number {
  return Math.max(1, stepNumber - 1);
}

/**
 * Obtém a próxima etapa
 */
export function getNextStep(stepNumber: number): number {
  return Math.min(21, stepNumber + 1);
}
