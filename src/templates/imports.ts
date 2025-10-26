/**
 * 🎯 CENTRALIZED TEMPLATE IMPORTS
 * 
 * Este arquivo centraliza todos os imports de templates para evitar
 * warnings do Vite sobre imports dinâmicos/estáticos misturados.
 */

// Import estático do template principal
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from './quiz21StepsComplete';
import { TemplateRegistry } from '@/services/TemplateRegistry';
import { normalizeTemplateBlocks } from '@/utils/blockNormalization';

// Export centralizado para uso em imports dinâmicos (fonte canônica)
export const getQuiz21StepsTemplate = () => {
  // Anexar metadado de origem no objeto retornado
  const normalized = normalizeTemplateBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
  (normalized as any)._source = 'ts';
  return normalized as any;
};

/**
 * Obtém o template de um step específico preferindo o TemplateRegistry.
 * Caso não exista no registry, cai para o template TS normalizado.
 */
export const getStepTemplate = (stepId: string) => {
  const stepKey = stepId.match(/^step-(\d{1,2})$/)
    ? `step-${String(parseInt(stepId.replace('step-', ''), 10)).padStart(2, '0')}`
    : stepId;

  const registry = TemplateRegistry.getInstance();
  const fromRegistry = registry.get(stepKey);
  if (fromRegistry) {
    return { step: fromRegistry, source: 'registry' as const };
  }

  const template = getQuiz21StepsTemplate() as any;
  return { step: template?.[stepKey], source: 'ts' as const };
};

// Função para carregar template de forma consistente
export const loadTemplate = async (templateId: string) => {
  // Normaliza ID recebido (aceita step-2 ou step-02)
  const stepNumber = templateId.replace(/^step-/, '').padStart(2, '0');
  const stepId = `step-${stepNumber}`;

  // Template completo (fonte TS normalizada)
  const template = getQuiz21StepsTemplate() as any;

  // Navegador: tentar aplicar override via JSON de blocos (v3.1) ou v3 sections.
  // Ordem de preferência:
  // 1) /templates/blocks/step-XX.json (v3.1 blocos)
  // 2) /templates/step-XX-v3.json (v3 sections)
  // Rodamos isso de forma best-effort, com BASE_URL, dedupe e evitando fetches paralelos.
  if (typeof window !== 'undefined') {
    const w = window as any;
    w.__jsonV3Overrides = w.__jsonV3Overrides || new Set<string>(); // passos com override aplicado
    w.__jsonV3Attempts = w.__jsonV3Attempts || new Set<string>();   // passos já tentados (inclui 404)
    w.__jsonV3InFlight = w.__jsonV3InFlight || new Map<string, Promise<boolean>>(); // tentativas em andamento
    // Flag opcional: no editor, preferir sections v3 (atômicos) ao invés de overrides de blocks
    w.__editorPreferSectionsV3 = w.__editorPreferSectionsV3 ?? false;

    const base: string = (import.meta as any)?.env?.BASE_URL || '/';
    const baseTrimmed = base.replace(/\/$/, '');
    const urlBlocks = `${baseTrimmed}/templates/blocks/${stepId}.json`;
    const urlV3 = `${baseTrimmed}/templates/${stepId}-v3.json`;

    const shouldAttempt = !w.__jsonV3Overrides.has(stepId) && !w.__jsonV3Attempts.has(stepId);
    if (shouldAttempt) {
      // Reutiliza uma única promessa em caso de chamadas concorrentes
      if (!w.__jsonV3InFlight.has(stepId)) {
        w.__jsonV3InFlight.set(
          stepId,
          (async () => {
            try {
              let resp: Response | undefined;
              // 1) tentar blocos v3.1 (somente se não estivermos em modo editor preferindo sections)
              if (!w.__editorPreferSectionsV3) {
                resp = await fetch(urlBlocks, { cache: 'no-store' });
                if (resp.ok) {
                  const json = await resp.json();
                  const registry = TemplateRegistry.getInstance();
                  registry.registerOverride(stepId, json as any);
                  w.__jsonV3Overrides.add(stepId);
                  if (process.env.NODE_ENV === 'development') {
                    console.log(`🧩 [imports] Override JSON v3.1 (blocks) aplicado para ${stepId}`);
                  }
                  return true;
                }
              }
              // 2) tentar v3 sections (preferido em editor quando __editorPreferSectionsV3 = true)
              resp = await fetch(urlV3, { cache: 'no-store' });
              if (resp.ok) {
                const json = await resp.json();
                const registry = TemplateRegistry.getInstance();
                registry.registerOverride(stepId, json as any);
                w.__jsonV3Overrides.add(stepId);
                if (process.env.NODE_ENV === 'development') {
                  console.log(`🧩 [imports] Override JSON v3 (sections) aplicado para ${stepId}`);
                }
                return true;
              }
              return false;
            } catch {
              return false;
            } finally {
              // Marcar como tentado para evitar spam de 404; novo build/refresh limpa este estado.
              w.__jsonV3Attempts.add(stepId);
            }
          })()
        );
      }
      // Aguarda a primeira tentativa quando chamado inline; ignora o resultado.
      try { await w.__jsonV3InFlight.get(stepId); } catch { }
      // limpeza de referência em voo após término
      w.__jsonV3InFlight.delete(stepId);
    }
  }

  // Step específico preferindo Registry (permite overrides por JSON)
  const { step, source: stepSource } = getStepTemplate(stepId);

  if (process.env.NODE_ENV === 'development') {
    console.log(`📦 [loadTemplate] step=${stepId} • source=${stepSource}`);
  }

  return {
    template,
    source: 'ts' as const,
    step,
  };
};

// Export do template para compatibilidade
export { QUIZ_STYLE_21_STEPS_TEMPLATE };

// 🚀 Registrar todos os steps no TemplateRegistry em tempo de build/import
try {
  const registry = TemplateRegistry.getInstance();
  const entries = Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE);
  let registered = 0;
  const registeredKeys: string[] = [];

  for (const [key, template] of entries) {
    if (key.startsWith('step-')) {
      // normaliza id para step-XX
      const match = key.match(/^step-(\d{1,2})$/);
      const normalizedKey = match ? `step-${parseInt(match[1], 10).toString().padStart(2, '0')}` : key;

      // Verificar se já existe
      if (registry.has(normalizedKey)) {
        console.warn(`⚠️  Step '${normalizedKey}' já está registrado. Sobrescrevendo...`);
      }

      // normaliza tipos (aliases → canônico 'options-grid')
      const normalizedTemplate = normalizeTemplateBlocks({ [normalizedKey]: template } as any)[normalizedKey];
      registry.register(normalizedKey, normalizedTemplate as any);
      registeredKeys.push(normalizedKey);
      registered++;
    }
  }

  console.log(`✅ TemplateRegistry registrado: ${registered} steps`);
  console.log(`📋 Steps registrados:`, registeredKeys.sort());
} catch (err) {
  console.error('❌ Erro ao registrar templates no TemplateRegistry:', err);
}

// 🌐 Browser-only: pré-carregar overrides JSON v3 para steps conhecidos (1..21)
if (typeof window !== 'undefined') {
  const w = window as any;
  if (!w.__jsonV3Preloaded) {
    w.__jsonV3Preloaded = true;
    // Disparar no próximo tick para não bloquear o bootstrap
    setTimeout(async () => {
      try {
        const registry = TemplateRegistry.getInstance();
        const ids = Array.from({ length: 21 }, (_, i) => `step-${String(i + 1).padStart(2, '0')}`);
        const base: string = (import.meta as any)?.env?.BASE_URL || '/';
        const baseTrimmed = base.replace(/\/$/, '');
        // Reutiliza o mesmo mecanismo de tentativa para deduplicar com loadTemplate
        w.__jsonV3Overrides = w.__jsonV3Overrides || new Set<string>();
        w.__jsonV3Attempts = w.__jsonV3Attempts || new Set<string>();
        w.__jsonV3InFlight = w.__jsonV3InFlight || new Map<string, Promise<boolean>>();

        await Promise.all(
          ids.map(async (id) => {
            if (w.__jsonV3Overrides.has(id) || w.__jsonV3Attempts.has(id)) return;
            const urlBlocks = `${baseTrimmed}/templates/blocks/${id}.json`;
            const urlV3 = `${baseTrimmed}/templates/${id}-v3.json`;
            if (!w.__jsonV3InFlight.has(id)) {
              w.__jsonV3InFlight.set(
                id,
                (async () => {
                  try {
                    // 1) tentar blocos v3.1
                    let resp = await fetch(urlBlocks, { cache: 'no-store' });
                    if (resp.ok) {
                      const json = await resp.json();
                      registry.registerOverride(id, json as any);
                      w.__jsonV3Overrides.add(id);
                      if (process.env.NODE_ENV === 'development') {
                        console.log(`🧩 [imports] Override JSON v3.1 (blocks) pré-carregado para ${id}`);
                      }
                      return true;
                    }
                    // 2) tentar v3 sections
                    resp = await fetch(urlV3, { cache: 'no-store' });
                    if (resp.ok) {
                      const json = await resp.json();
                      registry.registerOverride(id, json as any);
                      w.__jsonV3Overrides.add(id);
                      if (process.env.NODE_ENV === 'development') {
                        console.log(`🧩 [imports] Override JSON v3 (sections) pré-carregado para ${id}`);
                      }
                      return true;
                    }
                    return false;
                  } catch {
                    return false;
                  } finally {
                    w.__jsonV3Attempts.add(id);
                  }
                })()
              );
            }
            try { await w.__jsonV3InFlight.get(id); } catch { }
            w.__jsonV3InFlight.delete(id);
          })
        );
      } catch {
        // silencioso
      }
    }, 0);
  }
}
