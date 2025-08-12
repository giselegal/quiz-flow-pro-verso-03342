/**
 * 🎯 TEMPLATES DAS 21 ETAPAS - CARREGAMENTO DINÂMICO
 *
 * Solução para evitar problemas de build com imports diretos de JSON
 */

// Função para carregar template dinamicamente
async function loadTemplate(stepNumber: number): Promise<any> {
  const stepId = stepNumber.toString().padStart(2, '0');

  try {
    // Tentar carregar do public/templates primeiro (para sistema JSON)
    const publicResponse = await fetch(`/templates/step-${stepId}-template.json`);
    if (publicResponse.ok) {
      return await publicResponse.json();
    }

    // Fallback para templates locais se necessário
    const localPath = `./step-${stepId}.json`;
    const localTemplate = await import(localPath);
    return localTemplate.default || localTemplate;
  } catch (error) {
    console.warn(`⚠️ Erro ao carregar template ${stepNumber}:`, error);
    return null;
  }
}

// Cache para templates carregados
const templateCache = new Map<number, any>();

// Exportação principal - compatível com código existente
export const STEP_TEMPLATES = new Proxy({} as Record<number, any>, {
  get(_target, prop) {
    const stepNumber = Number(prop);

    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 21) {
      return undefined;
    }

    // Retornar do cache se disponível
    if (templateCache.has(stepNumber)) {
      return templateCache.get(stepNumber);
    }

    // Carregar dinamicamente e cachear
    loadTemplate(stepNumber).then(template => {
      if (template) {
        templateCache.set(stepNumber, template);
      }
    });

    // Retorno temporário enquanto carrega
    return {
      metadata: {
        id: `quiz-step-${stepNumber.toString().padStart(2, '0')}`,
        name: `Template Step ${stepNumber}`,
        loading: true,
      },
      blocks: [],
      __loading: true,
    };
  },
});

/**
 * 🔧 FUNÇÃO HELPER: Carregar template específico
 */
export async function getStepTemplate(stepNumber: number): Promise<any> {
  if (templateCache.has(stepNumber)) {
    return templateCache.get(stepNumber);
  }

  const template = await loadTemplate(stepNumber);
  if (template) {
    templateCache.set(stepNumber, template);
  }

  return template;
}

/**
 * 🔧 FUNÇÃO HELPER: Pre-carregar todos os templates
 */
export async function preloadAllTemplates(): Promise<void> {
  const promises = [];
  for (let i = 1; i <= 21; i++) {
    promises.push(getStepTemplate(i));
  }

  await Promise.all(promises);
  console.log('✅ Todos os templates foram pré-carregados');
}

/**
 * 🔧 FUNÇÃO HELPER: Verificar se template está carregado
 */
export function isTemplateLoaded(stepNumber: number): boolean {
  return templateCache.has(stepNumber);
}

/**
 * 🔧 FUNÇÃO HELPER: Limpar cache (para desenvolvimento)
 */
export function clearTemplateCache(): void {
  templateCache.clear();
}
