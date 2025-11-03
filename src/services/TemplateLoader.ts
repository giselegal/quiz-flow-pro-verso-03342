/**
 * 🎯 TEMPLATE LOADER - Sistema de Templates Externos JSON
 * 
 * Carrega funils completos de arquivos JSON externos
 * Permite criar múltiplos funils sem duplicar código TSX
 */

import { appLogger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import type { Block } from '@/types/editor';

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  steps: FunnelStep[];
  metadata?: Record<string, any>;
}

export interface FunnelStep {
  key: string;
  label: string;
  type: 'intro' | 'question' | 'transition' | 'result' | 'offer';
  blocks: Block[];
  metadata?: {
    duration?: number;
    skipable?: boolean;
    [key: string]: any;
  };
}

// Cache global de templates
const templateCache = new Map<string, FunnelTemplate>();

/**
 * Carrega template JSON do servidor com fallback Supabase → JSON
 */
export async function loadFunnelTemplate(templateId: string): Promise<FunnelTemplate> {
  // Check cache primeiro
  if (templateCache.has(templateId)) {
    appLogger.info(`✅ [TemplateLoader] Cache hit: ${templateId}`);
    return templateCache.get(templateId)!;
  }

  appLogger.info(`🔍 [TemplateLoader] Loading template: ${templateId}`);
  
  // 1️⃣ Tentar Supabase primeiro (quiz_production)
  try {
    const { data, error } = await supabase
      .from('quiz_production')
      .select('content, name, metadata')
      .eq('slug', templateId)
      .eq('is_template', true)
      .maybeSingle();

    if (data?.content && !error) {
      appLogger.info(`✅ [DB] Template carregado do Supabase: ${templateId}`);
      
      // Type guards para dados do Supabase
      const metadata = (data.metadata || {}) as Record<string, any>;
      const content = data.content as any;
      
      const template: FunnelTemplate = {
        id: templateId,
        name: data.name || templateId,
        description: metadata.description || '',
        version: metadata.version || '1.0',
        author: metadata.author,
        steps: content.steps || [],
        metadata: metadata,
      };
      
      // Validar estrutura básica
      if (!template.steps || !Array.isArray(template.steps)) {
        throw new Error('Template do DB inválido: steps não é array');
      }
      
      templateCache.set(templateId, template);
      appLogger.info(`✅ [DB] Template cached: ${template.name} (${template.steps.length} steps)`);
      return template;
    }
    
    if (error) {
      appLogger.warn(`⚠️ [DB] Erro ao consultar Supabase: ${error.message}`);
    } else {
      appLogger.warn(`⚠️ [DB] Template não encontrado no Supabase: ${templateId}`);
    }
  } catch (dbError) {
    appLogger.warn(`⚠️ [DB] Fallback para JSON devido a erro:`, dbError);
  }

  // 2️⃣ Fallback: JSON local com múltiplos caminhos
  const paths = [
    `/templates/funnels/${templateId}.json`,           // Flat file
    `/templates/funnels/${templateId}/master.json`,    // Nested master
    `/templates/funnels/${templateId}/index.json`,     // Nested index
    `/templates/${templateId}.json`,                   // Root level (legacy)
  ];

  for (const jsonUrl of paths) {
    try {
      appLogger.info(`🌐 [JSON] Tentando: ${jsonUrl}`);
      
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        appLogger.warn(`⚠️ [JSON] ${jsonUrl} → HTTP ${response.status}`);
        continue; // Tentar próximo caminho
      }
      
      const rawData: any = await response.json();
      
      // 🔄 Adapter: Normalizar formato para FunnelTemplate
      const template: FunnelTemplate = {
        id: rawData.id || rawData.funnelId || templateId,
        name: rawData.name || rawData.metadata?.name || 'Unnamed Template',
        description: rawData.description || '',
        version: rawData.version || '1.0.0',
        steps: [],
        metadata: rawData,
      };
      
      // Converter steps de Object para Array se necessário
      if (rawData.steps) {
        if (Array.isArray(rawData.steps)) {
          template.steps = rawData.steps;
        } else if (typeof rawData.steps === 'object') {
          // Converter object {1: {...}, 2: {...}} para array
          template.steps = Object.entries(rawData.steps).map(([key, stepData]: [string, any]) => ({
            key: `step-${key}`,
            label: `Step ${key}`,
            type: stepData.type || 'question',
            blocks: stepData.blocks || [],
            metadata: stepData,
          }));
        }
      }
      
      // Validar estrutura básica
      if (!template.id || !template.name || template.steps.length === 0) {
        appLogger.warn(`⚠️ [JSON] ${jsonUrl} → Estrutura inválida (id: ${template.id}, name: ${template.name}, steps: ${template.steps.length})`);
        continue;
      }
      
      // Cache template
      templateCache.set(templateId, template);
      
      appLogger.info(`✅ [JSON] Template loaded: ${template.name} (${template.steps.length} steps)`);
      return template;
    } catch (err) {
      appLogger.warn(`⚠️ [JSON] ${jsonUrl} → ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      continue;
    }
  }

  // Se chegou aqui, nenhum caminho funcionou
  appLogger.error(`❌ [TemplateLoader] Template '${templateId}' não encontrado em nenhum caminho:`, paths);
  throw new Error(`Template '${templateId}' não encontrado (tentados: ${paths.length} caminhos)`);
}

/**
 * Lista templates disponíveis
 */
export async function listAvailableTemplates(): Promise<string[]> {
  // Para produção, esta lista poderia vir de uma API
  // Por enquanto, retornamos lista hard-coded
  return [
    'quiz21StepsComplete',
    'funil-emagrecimento',
    'funil-moda',
    'funil-imobiliario',
  ];
}

/**
 * Obtém blocos de um step específico
 */
export function getStepBlocks(template: FunnelTemplate, stepKey: string): Block[] {
  const step = template.steps.find(s => s.key === stepKey);
  return step?.blocks || [];
}

/**
 * Obtém todas as chaves de steps disponíveis
 */
export function getStepKeys(template: FunnelTemplate): string[] {
  return template.steps.map(s => s.key);
}

/**
 * Valida se um template é válido
 */
export function validateTemplate(template: any): template is FunnelTemplate {
  if (!template || typeof template !== 'object') return false;
  if (typeof template.id !== 'string') return false;
  if (typeof template.name !== 'string') return false;
  if (!Array.isArray(template.steps)) return false;
  
  // Validar cada step
  for (const step of template.steps) {
    if (typeof step.key !== 'string') return false;
    if (typeof step.label !== 'string') return false;
    if (!Array.isArray(step.blocks)) return false;
  }
  
  return true;
}

/**
 * Limpa cache de templates (útil para hot-reload em dev)
 */
export function clearTemplateCache(): void {
  templateCache.clear();
  appLogger.info('[TemplateLoader] Template cache cleared');
}

/**
 * Pré-carrega template (útil para performance)
 */
export async function preloadTemplate(templateId: string): Promise<void> {
  if (!templateCache.has(templateId)) {
    await loadFunnelTemplate(templateId);
  }
}

/**
 * Merge template externo com blocos internos
 * Útil para sobrescrever blocos específicos mantendo o resto do template
 */
export function mergeTemplateBlocks(
  template: FunnelTemplate,
  stepKey: string,
  customBlocks: Partial<Block>[]
): FunnelTemplate {
  const step = template.steps.find(s => s.key === stepKey);
  if (!step) return template;

  const mergedBlocks = step.blocks.map(block => {
    const custom = customBlocks.find(c => c.id === block.id);
    return custom ? { ...block, ...custom } : block;
  });

  return {
    ...template,
    steps: template.steps.map(s =>
      s.key === stepKey ? { ...s, blocks: mergedBlocks } : s
    ),
  };
}

/**
 * Converte template para formato legado (backward compatibility)
 */
export function convertToLegacyFormat(template: FunnelTemplate): Record<string, Block[]> {
  return template.steps.reduce((acc, step) => {
    acc[step.key] = step.blocks;
    return acc;
  }, {} as Record<string, Block[]>);
}
