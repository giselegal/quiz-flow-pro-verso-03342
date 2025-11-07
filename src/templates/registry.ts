/**
 * 🎯 TEMPLATE REGISTRY - SISTEMA DE CARREGAMENTO DE TEMPLATES
 * 
 * Sistema crítico que estava FALTANDO - responsável por:
 * - Carregar templates via URL (ex: /editor/quiz21StepsComplete)
 * - Converter formato de template para editor
 * - Gerenciar cache de templates
 * 
 * PRIORIDADE DE CARREGAMENTO:
 * 1. Templates JSON built-in (src/templates/*.json) - build-time
 * 2. Templates TypeScript (.ts) - runtime fallback
 * 3. Backend templates - se disponível
 */

import { QUIZ_STYLE_21_STEPS_TEMPLATE } from './quiz21StepsComplete';
import { Block } from '@/types/editor';
import { 
  getBuiltInTemplateById, 
  hasBuiltInTemplate,
  listBuiltInTemplateIds 
} from '@/services/templates/builtInTemplates';

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
  'quiz21StepsComplete': () => loadQuiz21StepsTemplate(),
  'testTemplate': () => loadTestTemplate(),
  'leadMagnetFashion': () => loadLeadMagnetTemplate(),
  'webinarSignup': () => loadWebinarTemplate(),
  'npseSurvey': () => loadNPSTemplate(),
  'roiCalculator': () => loadROITemplate(),
};

// 🎯 TEMPLATE LOADER PRINCIPAL - QUIZ 21 STEPS
async function loadQuiz21StepsTemplate(): Promise<FullTemplate> {
  console.log('🎯 [TemplateRegistry] Carregando quiz21StepsComplete...');
  
  const steps: Record<string, Block[]> = {};
  let totalSteps = 0;

  // Converter cada step do template para formato do editor
  for (const [stepKey, stepBlocks] of Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE)) {
    if (stepKey.startsWith('step-') && Array.isArray(stepBlocks)) {
      steps[stepKey] = stepBlocks as Block[];
      totalSteps++;
    }
  }

  const template: FullTemplate = {
    id: 'quiz21StepsComplete',
    name: 'Quiz de Estilo Pessoal (21 Etapas)',
    metadata: {
      id: 'quiz21StepsComplete',
      name: 'Quiz de Estilo Pessoal (21 Etapas)',
      description: 'Quiz completo com 21 etapas: coleta de nome, 10 questões pontuadas, 6 questões estratégicas, resultado personalizado e oferta',
      version: '2.0.0',
      totalSteps,
      type: 'quiz',
      tags: ['fashion', 'personality', 'style', 'quiz', 'conversion'],
      author: 'Quiz Quest Team',
      created: '2024-01-01',
    },
    steps,
    totalSteps,
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
      created: '2024-01-01',
    },
    steps: {
      'step-1': [{ id: 'test-1', type: 'headline', content: { text: 'Teste 1' }, properties: {}, order: 1 }],
      'step-2': [{ id: 'test-2', type: 'headline', content: { text: 'Teste 2' }, properties: {}, order: 1 }],
      'step-3': [{ id: 'test-3', type: 'headline', content: { text: 'Teste 3' }, properties: {}, order: 1 }],
    },
    totalSteps: 3,
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
      created: '2024-01-01',
    },
    steps: {},
    totalSteps: 5,
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
      created: '2024-01-01',
    },
    steps: {},
    totalSteps: 4,
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
      created: '2024-01-01',
    },
    steps: {},
    totalSteps: 6,
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
      created: '2024-01-01',
    },
    steps: {},
    totalSteps: 8,
  };
}

// 🎯 FUNÇÕES PÚBLICAS DO REGISTRY

/**
 * Carrega template completo por ID
 * PRIORIDADE: 1) Built-in JSON, 2) TypeScript modules, 3) Backend
 */
export async function loadFullTemplate(templateId: string): Promise<FullTemplate | null> {
  console.log(`🎯 [TemplateRegistry] Tentando carregar template: ${templateId}`);
  
  // 1️⃣ PRIORIDADE: Verificar se existe template JSON built-in
  if (hasBuiltInTemplate(templateId)) {
    console.log(`✅ [TemplateRegistry] Usando template JSON built-in: ${templateId}`);
    try {
      const builtInTemplate = getBuiltInTemplateById(templateId);
      if (builtInTemplate) {
        // Normalizar template JSON para formato FullTemplate
        const normalized = normalizeBuiltInTemplate(builtInTemplate, templateId);
        console.log(`✅ [TemplateRegistry] Template JSON carregado: ${templateId}`);
        return normalized;
      }
    } catch (error) {
      console.error(`❌ [TemplateRegistry] Erro ao carregar built-in JSON ${templateId}:`, error);
      // Continuar para fallback
    }
  }
  
  // 2️⃣ FALLBACK: Usar registry TypeScript
  const loader = TEMPLATE_REGISTRY[templateId];
  if (!loader) {
    console.warn(`⚠️ [TemplateRegistry] Template não encontrado: ${templateId}`);
    console.log('📋 [TemplateRegistry] Templates disponíveis (TS):', Object.keys(TEMPLATE_REGISTRY));
    console.log('📋 [TemplateRegistry] Templates disponíveis (JSON):', listBuiltInTemplateIds());
    return null;
  }

  try {
    const template = await loader();
    console.log(`✅ [TemplateRegistry] Template .ts carregado com sucesso: ${templateId}`);
    return template;
  } catch (error) {
    console.error(`❌ [TemplateRegistry] Erro ao carregar template ${templateId}:`, error);
    return null;
  }
}

/**
 * Normaliza template JSON built-in para formato FullTemplate
 * Aceita formatos v3.1 e raw editor export
 */
function normalizeBuiltInTemplate(builtIn: any, templateId: string): FullTemplate {
  // Se já está no formato correto
  if (builtIn.steps && builtIn.metadata) {
    return builtIn as FullTemplate;
  }
  
  // Converter de formato v3.1 ou raw export
  const steps: Record<string, Block[]> = {};
  let totalSteps = 0;
  
  // Processar steps do template
  if (builtIn.steps && typeof builtIn.steps === 'object') {
    for (const [stepKey, stepBlocks] of Object.entries(builtIn.steps)) {
      if (Array.isArray(stepBlocks)) {
        steps[stepKey] = stepBlocks as Block[];
        totalSteps++;
      }
    }
  }
  
  return {
    id: templateId,
    name: builtIn.name || builtIn.metadata?.name || templateId,
    metadata: {
      id: templateId,
      name: builtIn.name || builtIn.metadata?.name || templateId,
      description: builtIn.description || builtIn.metadata?.description || '',
      version: builtIn.version || builtIn.metadata?.version || '3.1.0',
      totalSteps,
      type: builtIn.type || builtIn.metadata?.type || 'quiz',
      tags: builtIn.tags || builtIn.metadata?.tags || [],
      author: builtIn.author || builtIn.metadata?.author || 'Unknown',
      created: builtIn.created || builtIn.metadata?.created || new Date().toISOString(),
    },
    steps,
    totalSteps,
  };
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
    metadata: template.metadata,
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
  return templateId in TEMPLATE_REGISTRY;
}

/**
 * Obtém metadados sem carregar o template completo
 */
export async function getTemplateMetadata(templateId: string): Promise<TemplateMetadata | null> {
  const template = await loadFullTemplate(templateId);
  return template?.metadata || null;
}