// ✨ SERVIÇO UNIFICADO PARA TEMPLATES POR ETAPA
// Este serviço centraliza o acesso aos templates individuais mantendo a modularidade

// ⚠️ NOTA: Migrado para sistema JSON (step-XX.json) - usa templates dinâmicos
import { getStepTemplate as getJSONTemplate } from '@/config/templates/templates';

// 🔧 CACHE GLOBAL DE TEMPLATES
const TEMPLATE_CACHE = new Map<number, any>();

// 🔧 FUNÇÃO PARA PRÉ-CARREGAR TODOS OS TEMPLATES
async function preloadAllTemplates(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  console.log('🚀 Pré-carregando todos os templates v3...');
  
  const promises = Array.from({ length: 21 }, (_, i) => {
    const stepNumber = i + 1;
    const stepId = stepNumber.toString().padStart(2, '0');
    const templatePath = `/templates/step-${stepId}-v3.json`;
    
    return fetch(templatePath)
      .then(response => {
        if (response.ok) {
          return response.json().then(template => {
            // Converter template para formato compatível
            if (template.sections && Array.isArray(template.sections)) {
              const blocks = template.sections.map((section: any, index: number) => ({
                id: section.id || `section-${index}`,
                type: section.type,
                properties: section.props || {},
                content: {},
                position: section.order || index
              }));
              TEMPLATE_CACHE.set(stepNumber, blocks);
              console.log(`✅ Template ${stepNumber} pré-carregado: ${blocks.length} blocos`);
            } else if (template.blocks && Array.isArray(template.blocks)) {
              TEMPLATE_CACHE.set(stepNumber, template.blocks);
              console.log(`✅ Template ${stepNumber} pré-carregado: ${template.blocks.length} blocos`);
            }
          });
        }
      })
      .catch(error => {
        console.warn(`⚠️ Falha ao pré-carregar template ${stepNumber}:`, error);
      });
  });
  
  await Promise.allSettled(promises);
  console.log(`🎯 Pré-carregamento concluído: ${TEMPLATE_CACHE.size}/21 templates`);
}

// 🔧 FUNÇÃO SÍNCRONA QUE USA CACHE
function getTemplateFromCache(stepNumber: number): any[] {
  const cached = TEMPLATE_CACHE.get(stepNumber);
  if (cached && Array.isArray(cached)) {
    console.log(`💾 Template ${stepNumber} do cache: ${cached.length} blocos`);
    return cached;
  }
  
  console.warn(`❌ Template ${stepNumber} não está no cache`);
  return [];
}

// ✅ INICIALIZAÇÃO IMEDIATA E LAZY LOADING
let preloadingStarted = false;

function ensureTemplateLoaded(stepNumber: number): any[] {
  // Se já tem no cache, retornar imediatamente
  if (TEMPLATE_CACHE.has(stepNumber)) {
    const cached = TEMPLATE_CACHE.get(stepNumber);
    console.log(`⚡ Template ${stepNumber} do cache: ${cached.length} blocos`);
    return cached;
  }

  // Se não está carregando ainda, iniciar agora
  if (!preloadingStarted && typeof window !== 'undefined') {
    console.log('🚀 Iniciando carregamento lazy de templates...');
    preloadingStarted = true;
    preloadAllTemplates(); // Não bloqueia
  }

  // Tentar carregar específico síncrono como fallback
  const stepId = stepNumber.toString().padStart(2, '0');
  const templatePath = `/templates/step-${stepId}-v3.json`;

  try {
    console.log(`🔄 Tentando carregar síncrono: ${templatePath}`);
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', templatePath, false); // síncrono
    xhr.send();

    if (xhr.status === 200) {
      const template = JSON.parse(xhr.responseText);
      if (template.sections && Array.isArray(template.sections)) {
        const blocks = template.sections.map((section: any, index: number) => ({
          id: section.id || `section-${index}`,
          type: section.type,
          properties: section.props || {},
          content: {},
          position: section.order || index
        }));
        
        // Cachear para uso futuro
        TEMPLATE_CACHE.set(stepNumber, blocks);
        console.log(`💾 Template ${stepNumber} carregado síncrono e cacheado: ${blocks.length} blocos`);
        return blocks;
      }
    }
  } catch (error) {
    console.warn(`⚠️ Fallback síncrono falhou para step ${stepNumber}:`, error);
  }

  console.warn(`❌ Nenhum template encontrado para step ${stepNumber}`);
  return [];
}

// Inicializar imediatamente se possível
if (typeof window !== 'undefined') {
  // Aguardar um frame para evitar bloquear renderização inicial
  requestAnimationFrame(() => {
    preloadingStarted = true;
    preloadAllTemplates();
  });
}

export interface StepInfo {
  id: string;
  name: string;
  order: number;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer' | 'custom';
  description: string;
  blocksCount: number;
  hasTemplate: boolean;
  multiSelect?: number;
}

// 🎯 MAPEAMENTO COMPLETO DAS 21 ETAPAS
const STEP_MAPPING: Record<
  number,
  {
    name: string;
    type: StepInfo['type'];
    description: string;
    getTemplate: () => any[];
    multiSelect?: number;
  }
> = {
  1: {
    name: 'Introdução',
    type: 'intro',
    description: 'Apresentação do Quiz de Estilo',
    getTemplate: () => [],
  },
  2: { name: 'Coleta de Nome', type: 'intro', description: 'Captura do nome do participante', getTemplate: () => [] },
  3: { name: 'Q1: Tipo de Roupa', type: 'question', description: 'QUAL O SEU TIPO DE ROUPA FAVORITA?', getTemplate: () => [], multiSelect: 3 },
  4: { name: 'Q2: Personalidade', type: 'question', description: 'RESUMA A SUA PERSONALIDADE:', getTemplate: () => [], multiSelect: 3 },
  5: { name: 'Q3: Estampas', type: 'question', description: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?', getTemplate: () => [], multiSelect: 3 },
  6: { name: 'Q4: Casacos', type: 'question', description: 'QUAL CASACO É SEU FAVORITO?', getTemplate: () => [], multiSelect: 3 },
  7: { name: 'Q5: Calças', type: 'question', description: 'QUAL SUA CALÇA FAVORITA?', getTemplate: () => [], multiSelect: 3 },
  8: { name: 'Q6: Calças (2)', type: 'question', description: 'QUAL SUA CALÇA FAVORITA? (Continuação)', getTemplate: () => [], multiSelect: 3 },
  9: { name: 'Q7: Sapatos', type: 'question', description: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?', getTemplate: () => [], multiSelect: 3 },
  10: { name: 'Q8: Acessórios', type: 'question', description: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?', getTemplate: () => [], multiSelect: 3 },
  11: { name: 'Q9: Tecidos', type: 'question', description: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...', getTemplate: () => [], multiSelect: 3 },
  12: { name: 'Transição Principal', type: 'transition', description: 'Análise dos resultados parciais', getTemplate: () => [] },
  13: { name: 'S1: Guarda-roupa', type: 'strategic', description: 'Percepção sobre o guarda-roupa atual', getTemplate: () => [], multiSelect: 1 },
  14: { name: 'S2: Problemas', type: 'strategic', description: 'Principais problemas com roupas', getTemplate: () => [], multiSelect: 1 },
  15: { name: 'S3: Frequência', type: 'strategic', description: 'Frequência do dilema "com que roupa eu vou?"', getTemplate: () => [], multiSelect: 1 },
  16: { name: 'S4: Investimento', type: 'strategic', description: 'Considerações para investir em roupas', getTemplate: () => [], multiSelect: 1 },
  17: { name: 'S5: Orçamento', type: 'strategic', description: 'Orçamento mensal para roupas', getTemplate: () => [], multiSelect: 1 },
  18: { name: 'S6: Objetivos', type: 'strategic', description: 'O que deseja alcançar com novo estilo', getTemplate: () => [], multiSelect: 1 },
  19: { name: 'Transição Final', type: 'transition', description: 'Preparando resultado personalizado', getTemplate: () => [] },
  20: { name: 'Resultado', type: 'result', description: 'Página de resultado personalizada', getTemplate: () => [] },
  21: { name: 'Oferta', type: 'offer', description: 'Apresentação da oferta final', getTemplate: () => [] },
};

// 🔧 FUNÇÃO REMOVIDA: getJSONTemplateBlocks não é mais necessária
// Os templates agora retornam arrays vazios temporariamente até implementação completa

class StepTemplateService {
  /**
   * Obtém template de uma etapa específica
   */
  getStepTemplate(stepId: string | number): any[] {
    const stepNumber = typeof stepId === 'string' ? parseInt(stepId.replace(/\D/g, '')) : stepId;

    console.log(`🔍 [StepTemplateService] Buscando template para etapa ${stepNumber}`);
    console.log(`🧪 [DEBUG] stepId original:`, stepId);
    console.log(`🧪 [DEBUG] stepNumber convertido:`, stepNumber);

    // ✅ USAR TEMPLATE JSON v3 SÍNCRONO
    try {
      console.log(`🎯 [CORREÇÃO] Carregando template v3 SYNC para etapa ${stepNumber}...`);
      const syncTemplate = ensureTemplateLoaded(stepNumber);
      
      if (syncTemplate && Array.isArray(syncTemplate) && syncTemplate.length > 0) {
        console.log(`✅ Template v3 SYNC carregado para etapa ${stepNumber}: ${syncTemplate.length} blocos`);
        console.log(`🧱 [DEBUG] Tipos de blocos:`, syncTemplate.map((b: any) => b.type));
        return syncTemplate;
      }
      
      console.warn(`⚠️ Template v3 SYNC vazio para etapa ${stepNumber}, tentando async...`);
      
      // Fallback async (não retorna imediatamente, mas popula cache)
      getJSONTemplate(stepNumber).then((asyncTemplate) => {
        if (asyncTemplate && asyncTemplate.blocks) {
          console.log(`🔄 Template async carregado para cache: etapa ${stepNumber}`);
        }
      }).catch(err => {
        console.warn(`⚠️ Template async falhou para etapa ${stepNumber}:`, err);
      });
      
    } catch (error) {
      console.error(`❌ Erro ao carregar template SYNC da etapa ${stepNumber}:`, error);
    }

    // Fallback para o sistema antigo (só como backup)
    const stepMapping = STEP_MAPPING[stepNumber];
    if (stepMapping) {
      console.log(`🔄 Fallback para mapping da etapa ${stepNumber}:`, stepMapping.name);
      try {
        const template = stepMapping.getTemplate();
        if (template && template.length > 0) {
          console.log(`✅ Template fallback carregado para etapa ${stepNumber}: ${template.length} blocos`);
          return template;
        }
      } catch (error) {
        console.error(`❌ Erro no fallback da etapa ${stepNumber}:`, error);
      }
    }

    // Template padrão como último recurso
    console.warn(`⚠️ Usando template padrão para etapa ${stepNumber}`);
    return this.getDefaultTemplate(stepNumber);
  }

  /**
   * Obtém informações de uma etapa
   */
  getStepInfo(stepId: string | number): StepInfo | null {
    const stepNumber = typeof stepId === 'string' ? parseInt(stepId.replace(/\D/g, '')) : stepId;

    const stepMapping = STEP_MAPPING[stepNumber];

    if (!stepMapping) {
      return null;
    }

    let blocksCount = 0;
    let hasTemplate = true;

    try {
      const template = stepMapping.getTemplate();
      blocksCount = template.length;
    } catch (error) {
      hasTemplate = false;
    }

    return {
      id: `etapa-${stepNumber}`,
      name: stepMapping.name,
      order: stepNumber,
      type: stepMapping.type,
      description: stepMapping.description,
      blocksCount,
      hasTemplate,
      multiSelect: stepMapping.multiSelect,
    };
  }

  /**
   * Obtém todas as etapas disponíveis
   */
  getAllSteps(): StepInfo[] {
    return Object.keys(STEP_MAPPING)
      .map(key => parseInt(key))
      .sort((a, b) => a - b)
      .map(stepNumber => this.getStepInfo(stepNumber))
      .filter((step): step is StepInfo => step !== null);
  }

  /**
   * Verifica se uma etapa tem template disponível
   */
  hasStepTemplate(stepId: string | number): boolean {
    const stepNumber = typeof stepId === 'string' ? parseInt(stepId.replace(/\D/g, '')) : stepId;
    return STEP_MAPPING.hasOwnProperty(stepNumber);
  }

  /**
   * Template padrão para etapas sem template específico
   */
  private getDefaultTemplate(stepNumber: number): any[] {
    console.log(`🔧 [StepTemplateService] Gerando template padrão para etapa ${stepNumber}`);

    const defaultTemplate = [
      {
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 96,
          logoHeight: 96,
          progressValue: Math.round((stepNumber / 21) * 100),
          progressMax: 100,
          showBackButton: stepNumber > 1,
        },
      },
      {
        type: 'heading-inline',
        properties: {
          content: `Etapa ${stepNumber}`,
          level: 'h2',
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          marginBottom: 16,
        },
      },
      {
        type: 'text-inline',
        properties: {
          content: 'Esta etapa está sendo desenvolvida. Em breve teremos o conteúdo personalizado.',
          fontSize: 'text-lg',
          textAlign: 'text-center',
          color: '#6B7280',
          marginBottom: 32,
        },
      },
      {
        type: 'button-inline',
        properties: {
          text: 'Continuar',
          variant: 'primary',
          size: 'large',
          fullWidth: true,
          backgroundColor: '#B89B7A',
          textColor: '#ffffff',
        },
      },
    ];

    console.log(`🧱 [DEBUG] Template padrão gerado com ${defaultTemplate.length} blocos`);
    console.log(`🧱 [DEBUG] Tipos: ${defaultTemplate.map(b => b.type).join(', ')}`);

    return defaultTemplate;
  }

  /**
   * Obtém estatísticas dos templates
   */
  getTemplateStats() {
    const allSteps = this.getAllSteps();
    const withTemplate = allSteps.filter(step => step.hasTemplate);
    const totalBlocks = allSteps.reduce((sum, step) => sum + step.blocksCount, 0);

    return {
      totalSteps: allSteps.length,
      stepsWithTemplate: withTemplate.length,
      stepsWithoutTemplate: allSteps.length - withTemplate.length,
      totalBlocks,
      averageBlocksPerStep: Math.round(totalBlocks / allSteps.length),
      completionRate: Math.round((withTemplate.length / allSteps.length) * 100),
    };
  }
}

// 🚀 INSTÂNCIA SINGLETON
export const stepTemplateService = new StepTemplateService();

// 🎯 EXPORTS PARA COMPATIBILIDADE
export { STEP_MAPPING };
export default stepTemplateService;
