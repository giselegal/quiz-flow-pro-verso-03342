/**
 * 🎯 TEMPLATE REGISTRY - SISTEMA DE CARREGAMENTO DE TEMPLATES
 * 
 * Sistema crítico que estava FALTANDO - responsável por:
 * - Carregar templates via URL (ex: /editor/quiz21StepsComplete)
 * - Converter formato de template para editor
 * - Gerenciar cache de templates
 */

// Legacy template import (ainda necessário até migrar para published runtime)
// Legacy removido: agora usamos adapter para evitar acoplamento direto
import { quizLegacyTemplateAdapter } from '@/services/legacy/QuizLegacyTemplateAdapter';
import { QUIZ_ESTILO_TEMPLATE_ID, canonicalizeQuizEstiloId, warnIfDeprecatedQuizEstilo } from '@/domain/quiz/quiz-estilo-ids';
import { Block } from '@/types/editor';

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  totalSteps: number;
  type: 'quiz' | 'funnel' | 'survey';
  tags: string[];
  author: string;
  created: string;
}

export interface FullTemplate {
  id: string;
  name: string;
  metadata: TemplateMetadata;
  steps: Record<string, Block[]>;
  totalSteps: number;
}

// 🎯 REGISTRY DE TEMPLATES DISPONÍVEIS
const TEMPLATE_REGISTRY: Record<string, () => Promise<FullTemplate>> = {
  // Mapear sempre o ID canônico - aliases resolvidos em loadFullTemplate
  [QUIZ_ESTILO_TEMPLATE_ID]: () => loadQuiz21StepsTemplate(),
  'testTemplate': () => loadTestTemplate(),
  'leadMagnetFashion': () => loadLeadMagnetTemplate(),
  'webinarSignup': () => loadWebinarTemplate(),
  'npseSurvey': () => loadNPSTemplate(),
  'roiCalculator': () => loadROITemplate(),
};

// 🎯 TEMPLATE LOADER PRINCIPAL - QUIZ 21 STEPS
async function loadQuiz21StepsTemplate(): Promise<FullTemplate> {
  console.log('🎯 [TemplateRegistry] Carregando quiz-estilo (legacy quiz21StepsComplete)...');

  const steps: Record<string, Block[]> = {};
  let totalSteps = 0;

  // Converter cada step do template para formato do editor
  const all = await quizLegacyTemplateAdapter.getAll();
  for (const [stepKey, stepBlocks] of Object.entries(all)) {
    if (stepKey.startsWith('step-') && Array.isArray(stepBlocks)) {
      steps[stepKey] = stepBlocks as Block[];
      totalSteps++;
    }
  }

  const template: FullTemplate = {
    id: QUIZ_ESTILO_TEMPLATE_ID,
    name: 'Quiz de Estilo Pessoal (21 Etapas)',
    metadata: {
      id: QUIZ_ESTILO_TEMPLATE_ID,
      name: 'Quiz de Estilo Pessoal (21 Etapas)',
      description: 'Quiz completo com 21 etapas: coleta de nome, 10 questões pontuadas, 6 questões estratégicas, resultado personalizado e oferta',
      version: '2.0.0',
      totalSteps,
      type: 'quiz',
      tags: ['fashion', 'personality', 'style', 'quiz', 'conversion'],
      author: 'Quiz Quest Team',
      created: '2024-01-01'
    },
    steps,
    totalSteps
  };

  console.log(`✅ [TemplateRegistry] Template carregado: ${totalSteps} etapas`);
  return template;
}

// 🎯 PLACEHOLDER TEMPLATES (para futuras expansões)
async function loadTestTemplate(): Promise<FullTemplate> {
  return {
    id: 'testTemplate',
    name: 'Template de Teste',
    metadata: {
      id: 'testTemplate',
      name: 'Template de Teste',
      description: 'Template simples para testes',
      version: '1.0.0',
      totalSteps: 3,
      type: 'quiz',
      tags: ['test'],
      author: 'Dev Team',
      created: '2024-01-01'
    },
    steps: {
      'step-1': [{ id: 'test-1', type: 'headline', content: { text: 'Teste 1' }, properties: {}, order: 1 }],
      'step-2': [{ id: 'test-2', type: 'headline', content: { text: 'Teste 2' }, properties: {}, order: 1 }],
      'step-3': [{ id: 'test-3', type: 'headline', content: { text: 'Teste 3' }, properties: {}, order: 1 }]
    },
    totalSteps: 3
  };
}

async function loadLeadMagnetTemplate(): Promise<FullTemplate> {
  return {
    id: 'leadMagnetFashion',
    name: 'Lead Magnet Fashion',
    metadata: {
      id: 'leadMagnetFashion',
      name: 'Lead Magnet Fashion',
      description: 'Template para captura de leads em moda',
      version: '1.0.0',
      totalSteps: 5,
      type: 'funnel',
      tags: ['lead-magnet', 'fashion'],
      author: 'Marketing Team',
      created: '2024-01-01'
    },
    steps: {},
    totalSteps: 5
  };
}

async function loadWebinarTemplate(): Promise<FullTemplate> {
  return {
    id: 'webinarSignup',
    name: 'Webinar Signup',
    metadata: {
      id: 'webinarSignup',
      name: 'Webinar Signup',
      description: 'Template para inscrição em webinars',
      version: '1.0.0',
      totalSteps: 4,
      type: 'funnel',
      tags: ['webinar', 'signup'],
      author: 'Marketing Team',
      created: '2024-01-01'
    },
    steps: {},
    totalSteps: 4
  };
}

async function loadNPSTemplate(): Promise<FullTemplate> {
  return {
    id: 'npseSurvey',
    name: 'NPS Survey',
    metadata: {
      id: 'npseSurvey',
      name: 'NPS Survey',
      description: 'Template para pesquisa de NPS',
      version: '1.0.0',
      totalSteps: 6,
      type: 'survey',
      tags: ['nps', 'survey'],
      author: 'Analytics Team',
      created: '2024-01-01'
    },
    steps: {},
    totalSteps: 6
  };
}

async function loadROITemplate(): Promise<FullTemplate> {
  return {
    id: 'roiCalculator',
    name: 'ROI Calculator',
    metadata: {
      id: 'roiCalculator',
      name: 'ROI Calculator',
      description: 'Template para calculadora de ROI',
      version: '1.0.0',
      totalSteps: 8,
      type: 'funnel',
      tags: ['calculator', 'roi'],
      author: 'Business Team',
      created: '2024-01-01'
    },
    steps: {},
    totalSteps: 8
  };
}

// 🎯 FUNÇÕES PÚBLICAS DO REGISTRY

/**
 * Carrega template completo por ID
 */
export async function loadFullTemplate(templateId: string): Promise<FullTemplate | null> {
  warnIfDeprecatedQuizEstilo(templateId);
  const canonical = canonicalizeQuizEstiloId(templateId) || templateId;
  console.log(`🎯 [TemplateRegistry] Tentando carregar template: ${templateId} (canonical: ${canonical})`);

  const loader = TEMPLATE_REGISTRY[canonical];
  if (!loader) {
    console.warn(`⚠️ [TemplateRegistry] Template não encontrado: ${templateId}`);
    console.log('📋 [TemplateRegistry] Templates disponíveis:', Object.keys(TEMPLATE_REGISTRY));
    return null;
  }

  try {
    const template = await loader();
    if (template.id !== canonical) {
      // Normalizar id interno
      (template as any).id = canonical;
      (template as any).metadata.id = canonical;
    }
    console.log(`✅ [TemplateRegistry] Template carregado com sucesso: ${canonical}`);
    return template;
  } catch (error) {
    console.error(`❌ [TemplateRegistry] Erro ao carregar template ${canonical}:`, error);
    return null;
  }
}

/**
 * Converte template para formato esperado pelo editor
 */
export function convertTemplateToEditorFormat(template: FullTemplate): any {
  console.log(`🔄 [TemplateRegistry] Convertendo template para formato do editor: ${template.id}`);

  // O formato já está correto (steps com Block[])
  return {
    id: template.id,
    name: template.name,
    steps: template.steps,
    metadata: template.metadata
  };
}

/**
 * Lista todos os templates disponíveis
 */
export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATE_REGISTRY);
}

/**
 * Verifica se template existe
 */
export function templateExists(templateId: string): boolean {
  const canonical = canonicalizeQuizEstiloId(templateId) || templateId;
  return canonical in TEMPLATE_REGISTRY;
}

/**
 * Obtém metadados sem carregar o template completo
 */
export async function getTemplateMetadata(templateId: string): Promise<TemplateMetadata | null> {
  const template = await loadFullTemplate(templateId);
  return template?.metadata || null;
}