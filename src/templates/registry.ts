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

// ⚠️ Legacy import removido. Usar lazy loader dinâmico.
import { loadFunnel } from '@/templates/loaders/dynamic';
import { loadStep as loadQuiz21Step } from '@/templates/funnels/quiz21Steps/config';
import { Block } from '@/types/editor';
import { 
  getBuiltInTemplateById, 
  hasBuiltInTemplate,
  listBuiltInTemplateIds 
} from '@/services/templates/builtInTemplates';
import { appLogger } from '@/lib/utils/appLogger';

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

import buildGoldFunnelTemplate from './goldFunnelTemplate';

const TEMPLATE_REGISTRY: Record<string, () => Promise<FullTemplate>> = {
  'quiz21-v4-gold': async () => buildGoldFunnelTemplate(),
  'quiz21StepsComplete': () => loadQuiz21StepsTemplate(),
  'testTemplate': () => loadTestTemplate(),
  'leadMagnetFashion': () => loadLeadMagnetTemplate(),
  'webinarSignup': () => loadWebinarTemplate(),
  'npseSurvey': () => loadNPSTemplate(),
  'roiCalculator': () => loadROITemplate(),
};

// 🎯 TEMPLATE LOADER PRINCIPAL - QUIZ 21 STEPS
async function loadQuiz21StepsTemplate(): Promise<FullTemplate> {
  appLogger.info('🎯 [TemplateRegistry] Carregando quiz21StepsComplete...');
  
  // 1) Carregar funil via lazy loader
  const funnel = await loadFunnel('quiz21StepsComplete', { validate: true, useCache: true });

  // 2) Montar mapa de steps: se vazio (lazy), carregar steps 1..21 sob demanda
  const steps: Record<string, Block[]> = {};
  const maxSteps = (funnel.metadata as any)?.totalSteps || 21;
  const existing = funnel.steps || {} as Record<string, Block[]>;

  if (Object.keys(existing).length > 0) {
    for (const [k, v] of Object.entries(existing)) steps[k] = v as Block[];
  } else {
    for (let i = 1; i <= maxSteps; i++) {
      const id = `step-${String(i).padStart(2, '0')}`;
      try {
        const blocks = (await loadQuiz21Step(i)) as any;
        steps[id] = (blocks?.default ?? blocks) as Block[];
      } catch (e) {
        appLogger.warn(`⚠️ [TemplateRegistry] Step não encontrado: ${id}`);
      }
    }
  }
  const totalSteps = Object.keys(steps).length;

  const template: FullTemplate = {
    id: 'quiz21StepsComplete',
    name: 'Quiz de Estilo Pessoal (21 Etapas)',
    metadata: {
      id: 'quiz21StepsComplete',
      name: 'Quiz de Estilo Pessoal (21 Etapas)',
      description: 'Quiz completo com 21 etapas: coleta de nome, 10 questões pontuadas, 6 questões estratégicas, resultado personalizado e oferta',
      version: (funnel.metadata as any)?.version || '3.0.0',
      totalSteps,
      type: 'quiz',
      tags: (funnel.metadata as any)?.tags || ['fashion', 'personality', 'style', 'quiz', 'conversion'],
      author: (funnel.metadata as any)?.author || 'Quiz Quest Team',
      created: (funnel.metadata as any)?.createdAt || '2024-01-01',
    },
    steps,
    totalSteps,
  };

  appLogger.info(`✅ [TemplateRegistry] Template carregado: ${totalSteps} etapas`);
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
  appLogger.info(`🎯 [TemplateRegistry] Tentando carregar template: ${templateId}`);
  
  // 1️⃣ PRIORIDADE: Verificar se existe template JSON built-in
  if (hasBuiltInTemplate(templateId)) {
    appLogger.info(`✅ [TemplateRegistry] Usando template JSON built-in: ${templateId}`);
    try {
      const builtInTemplate = getBuiltInTemplateById(templateId);
      if (builtInTemplate) {
        // Normalizar template JSON para formato FullTemplate
        const normalized = normalizeBuiltInTemplate(builtInTemplate, templateId);
        appLogger.info(`✅ [TemplateRegistry] Template JSON carregado: ${templateId}`);
        return normalized;
      }
    } catch (error) {
      appLogger.error(`❌ [TemplateRegistry] Erro ao carregar built-in JSON ${templateId}:`, { data: [error] });
      // Continuar para fallback
    }
  }
  
  // 2️⃣ FALLBACK: Usar registry TypeScript
  const loader = TEMPLATE_REGISTRY[templateId];
  if (!loader) {
    appLogger.warn(`⚠️ [TemplateRegistry] Template não encontrado: ${templateId}`);
    appLogger.info('📋 [TemplateRegistry] Templates disponíveis (TS):', { data: [Object.keys(TEMPLATE_REGISTRY)] });
    appLogger.info('📋 [TemplateRegistry] Templates disponíveis (JSON):', { data: [listBuiltInTemplateIds()] });
    return null;
  }

  try {
    const template = await loader();
    appLogger.info(`✅ [TemplateRegistry] Template .ts carregado com sucesso: ${templateId}`);
    return template;
  } catch (error) {
    appLogger.error(`❌ [TemplateRegistry] Erro ao carregar template ${templateId}:`, { data: [error] });
    return null;
  }
}

/**
 * Normaliza template JSON built-in para formato FullTemplate
 * Aceita formatos v3.1 e raw editor export
 * 
 * ESTRUTURAS SUPORTADAS:
 * 1. { steps: { "step-01": Block[] } } - Array direto de blocos
 * 2. { steps: { "step-01": { blocks: Block[] } } } - Objeto com propriedade blocks
 */
function normalizeBuiltInTemplate(builtIn: any, templateId: string): FullTemplate {
  // Converter de formato v3.1 ou raw export
  const steps: Record<string, Block[]> = {};
  let totalSteps = 0;
  
  // Processar steps do template
  if (builtIn.steps && typeof builtIn.steps === 'object') {
    for (const [stepKey, stepData] of Object.entries(builtIn.steps)) {
      // Caso 1: stepData é um array direto de blocos
      if (Array.isArray(stepData)) {
        steps[stepKey] = stepData as Block[];
        totalSteps++;
      }
      // Caso 2: stepData é um objeto com propriedade 'blocks' (formato v3.0)
      else if (stepData && typeof stepData === 'object' && Array.isArray((stepData as any).blocks)) {
        steps[stepKey] = (stepData as any).blocks as Block[];
        totalSteps++;
        appLogger.debug(`[normalizeBuiltInTemplate] ${stepKey}: extraído ${((stepData as any).blocks as any[]).length} blocos do objeto step`);
      }
    }
  }
  
  appLogger.info(`[normalizeBuiltInTemplate] Template ${templateId}: ${totalSteps} steps processados`);
  
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
  appLogger.info(`🔄 [TemplateRegistry] Convertendo template para formato do editor: ${template.id}`);
  
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