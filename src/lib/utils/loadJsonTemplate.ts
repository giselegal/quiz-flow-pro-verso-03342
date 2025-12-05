/**
 * 🔧 JSON TEMPLATE LOADER - Fase 5.1
 * ✅ FASE 1.3: AbortController para eliminar race conditions
 * 
 * Carrega templates JSON v3.1 de forma assíncrona com cache e cancelamento
 * Elimina dependência de TSX components
 */

import type { TemplateV3 } from '@/types/template-v3.types';
import { appLogger } from '@/lib/utils/appLogger';

interface TemplateCache {
  [stepId: string]: TemplateV3 | null;
}

// Cache em memória para evitar múltiplas requisições
const templateCache: TemplateCache = {};

// Flag para controlar carregamento em progresso (com AbortController)
const loadingPromises: Record<string, { promise: Promise<TemplateV3 | null>; controller: AbortController }> = {};

/**
 * Carrega template JSON do servidor/public folder
 * @param stepId - ID do step (ex: 'step-01', 'step-02')
 * @param signal - AbortSignal opcional para cancelamento externo
 * @returns Template v3.1 ou null se não encontrado
 */
export async function loadJsonTemplate(
  stepId: string,
  signal?: AbortSignal
): Promise<TemplateV3 | null> {
  // 1. Verificar cache
  if (stepId in templateCache) {
    return templateCache[stepId];
  }

  // 2. Se signal externo já está abortado, retornar imediatamente
  if (signal?.aborted) {
    throw new DOMException('Request aborted', 'AbortError');
  }

  // 3. Verificar se já está carregando
  if (stepId in loadingPromises) {
    const existing = loadingPromises[stepId];
    
    // Se tiver signal externo, vincular ao abort
    if (signal) {
      signal.addEventListener('abort', () => {
        // Não abortar a requisição existente, apenas ignorar o resultado
      }, { once: true });
    }
    
    return existing.promise;
  }

  // 4. Criar AbortController para esta requisição
  const controller = new AbortController();
  
  // Vincular signal externo ao controller interno
  if (signal) {
    signal.addEventListener('abort', () => {
      controller.abort();
    }, { once: true });
  }

  // 5. Carregar do servidor com AbortController
  const loadPromise = (async () => {
    try {
      const response = await fetch(`/templates/${stepId}-template.json`, {
        signal: controller.signal
      });
      
      if (!response.ok) {
        appLogger.warn(`[loadJsonTemplate] Template não encontrado: ${stepId}`);
        templateCache[stepId] = null;
        return null;
      }

      const json = await response.json();

      // Validar versão do template (aceita v3.0, v3.1, v3.2)
      if (!['3.0', '3.1', '3.2'].includes(json.templateVersion)) {
        appLogger.warn(`[loadJsonTemplate] Versão inválida para ${stepId}:`, { data: [json.templateVersion] });
        templateCache[stepId] = null;
        return null;
      }

      // Armazenar no cache
      templateCache[stepId] = json;
      return json;
    } catch (error) {
      // Propagar AbortError para que chamadores possam tratar
      if (error instanceof Error && error.name === 'AbortError') {
        appLogger.info(`[loadJsonTemplate] Requisição cancelada para ${stepId}`);
        throw error;
      }
      
      appLogger.error(`[loadJsonTemplate] Erro ao carregar ${stepId}:`, { data: [error] });
      templateCache[stepId] = null;
      return null;
    } finally {
      // Limpar promise de loading
      delete loadingPromises[stepId];
    }
  })();

  // Armazenar promise e controller
  loadingPromises[stepId] = { promise: loadPromise, controller };

  return loadPromise;
}

/**
 * 🆕 Cancela carregamento em progresso de um step específico
 * @param stepId - ID do step para cancelar
 */
export function abortTemplateLoad(stepId: string): boolean {
  if (stepId in loadingPromises) {
    loadingPromises[stepId].controller.abort();
    delete loadingPromises[stepId];
    appLogger.info(`[loadJsonTemplate] Carregamento de ${stepId} abortado`);
    return true;
  }
  return false;
}

/**
 * 🆕 Cancela todos os carregamentos em progresso
 */
export function abortAllTemplateLoads(): number {
  const count = Object.keys(loadingPromises).length;
  Object.values(loadingPromises).forEach(({ controller }) => {
    controller.abort();
  });
  Object.keys(loadingPromises).forEach(key => delete loadingPromises[key]);
  if (count > 0) {
    appLogger.info(`[loadJsonTemplate] ${count} carregamentos abortados`);
  }
  return count;
}

/**
 * Pré-carrega templates em batch para melhor performance
 * @param stepIds - Array de IDs para pré-carregar
 */
export async function preloadJsonTemplates(stepIds: string[]): Promise<void> {
  const promises = stepIds.map(stepId => loadJsonTemplate(stepId));
  await Promise.allSettled(promises);
}

/**
 * Limpa cache de templates (útil para desenvolvimento)
 */
export function clearTemplateCache(): void {
  Object.keys(templateCache).forEach(key => delete templateCache[key]);
}

/**
 * Verifica se template existe sem carregar (apenas checa cache)
 */
export function hasTemplateInCache(stepId: string): boolean {
  return stepId in templateCache && templateCache[stepId] !== null;
}
