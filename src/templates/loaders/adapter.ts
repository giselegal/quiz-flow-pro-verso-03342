/**
 * 🔄 ADAPTER DE COMPATIBILIDADE
 * 
 * Garante transição suave entre sistema legado e novo sistema de templates
 */

import { loadFunnel } from '../loaders/dynamic';
import type { Funnel } from '../schemas';

/**
 * Carrega template com fallback automático
 * 
 * Tenta carregar do novo sistema, se falhar, usa sistema legado
 */
export async function loadTemplateWithFallback(
  templateId: string
): Promise<Funnel | null> {
  try {
    // 1. Tentar novo sistema (lazy loading)
    return await loadFunnel(templateId, { validate: true });
  } catch (error) {
    console.warn(`[Adapter] Failed to load from new system, trying legacy...`, error);
    
    // 2. Fallback para sistema legado
    try {
      return await loadLegacyTemplate(templateId);
    } catch (legacyError) {
      console.error(`[Adapter] Failed to load template "${templateId}" from both systems:`, legacyError);
      return null;
    }
  }
}

/**
 * Carrega template do sistema legado
 */
async function loadLegacyTemplate(templateId: string): Promise<Funnel | null> {
  // Importar registry legado dinamicamente
  const { UNIFIED_TEMPLATE_REGISTRY } = await import('../../config/unifiedTemplatesRegistry');
  
  const legacyTemplate = UNIFIED_TEMPLATE_REGISTRY[templateId];
  if (!legacyTemplate) {
    throw new Error(`Template "${templateId}" not found in legacy registry`);
  }

  // Converter formato legado para novo formato Funnel
  return {
    metadata: {
      id: legacyTemplate.id,
      name: legacyTemplate.name,
      description: legacyTemplate.description || '',
      version: legacyTemplate.version,
      author: 'Quiz Flow Pro',
      createdAt: legacyTemplate.createdAt,
      updatedAt: legacyTemplate.updatedAt,
      tags: legacyTemplate.tags || [],
    },
    theme: {
      colors: {
        primary: '#B89B7A',
        secondary: '#1F2937',
        background: '#FAF9F7',
        text: '#1F2937',
      },
      fonts: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
      },
    },
    settings: {
      scoring: {
        enabled: true,
        type: 'simple' as const,
      },
      analytics: {
        enabled: true,
        provider: 'ga4' as const,
      },
    },
    steps: {}, // Legacy não carrega steps aqui
  };
}

/**
 * Verifica se template está migrado para novo sistema
 */
export function isTemplateMigrated(templateId: string): boolean {
  const migratedTemplates = [
    'quiz21StepsComplete',
    'quiz-21-steps',
  ];
  
  return migratedTemplates.includes(templateId);
}

/**
 * Lista templates disponíveis (ambos sistemas)
 */
export async function listAllAvailableTemplates(): Promise<string[]> {
  const { listAvailableFunnels } = await import('../loaders/dynamic');
  const newSystemTemplates = listAvailableFunnels();
  
  // Legacy templates (adicionar conforme necessário)
  const legacyTemplates = [
    'embedded',
    'shortQuiz',
    // ... outros não migrados
  ];
  
  return [...newSystemTemplates, ...legacyTemplates];
}

export default loadTemplateWithFallback;
