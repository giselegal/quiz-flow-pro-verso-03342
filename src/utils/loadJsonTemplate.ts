/**
 * 🔧 JSON TEMPLATE LOADER - Fase 5.1
 * 
 * Carrega templates JSON v3.1 de forma assíncrona com cache
 * Elimina dependência de TSX components
 */

import type { TemplateV3 } from '@/types/template-v3.types';

interface TemplateCache {
  [stepId: string]: TemplateV3 | null;
}

// Cache em memória para evitar múltiplas requisições
const templateCache: TemplateCache = {};

// Flag para controlar carregamento em progresso
const loadingPromises: Record<string, Promise<TemplateV3 | null>> = {};

/**
 * Carrega template JSON do servidor/public folder
 * @param stepId - ID do step (ex: 'step-01', 'step-02')
 * @returns Template v3.1 ou null se não encontrado
 */
export async function loadJsonTemplate(stepId: string): Promise<TemplateV3 | null> {
  // 1. Verificar cache
  if (stepId in templateCache) {
    return templateCache[stepId];
  }

  // 2. Verificar se já está carregando
  if (stepId in loadingPromises) {
    return loadingPromises[stepId];
  }

  // 3. Carregar do servidor
  const loadPromise = (async () => {
    try {
      const response = await fetch(`/templates/${stepId}-template.json`);
      
      if (!response.ok) {
        console.warn(`[loadJsonTemplate] Template não encontrado: ${stepId}`);
        templateCache[stepId] = null;
        return null;
      }

      const json = await response.json();

      // Validar versão do template
      if (json.templateVersion !== '3.1' && json.templateVersion !== '3.0') {
        console.warn(`[loadJsonTemplate] Versão inválida para ${stepId}:`, json.templateVersion);
        templateCache[stepId] = null;
        return null;
      }

      // Armazenar no cache
      templateCache[stepId] = json;
      return json;
    } catch (error) {
      console.error(`[loadJsonTemplate] Erro ao carregar ${stepId}:`, error);
      templateCache[stepId] = null;
      return null;
    } finally {
      // Limpar promise de loading
      delete loadingPromises[stepId];
    }
  })();

  // Armazenar promise para evitar múltiplas requisições
  loadingPromises[stepId] = loadPromise;

  return loadPromise;
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
