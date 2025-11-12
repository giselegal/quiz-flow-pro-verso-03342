/**
 * 🔄 TEMPLATE PROCESSOR
 * Processa templates dinâmicos substituindo {{variáveis}} por valores reais
 * Remove duplicação config/properties e injeta theme/assets
 */

import type {
  DynamicTemplate,
  ProcessedTemplate,
  TemplateVariables,
  TemplateProcessingResult,
} from '@/types/dynamic-template';
import { themeConfig } from '@/config/theme.config';
import { assetsConfig, resolveAsset } from '@/config/assets.config';
import { appLogger } from '@/lib/utils/logger';

// ============================================
// 1. CONFIGURAÇÃO GLOBAL
// ============================================

/**
 * Variáveis disponíveis para substituição
 */
const TEMPLATE_VARIABLES: TemplateVariables = {
  theme: themeConfig,
  assets: assetsConfig,
};

// ============================================
// 2. PROCESSAMENTO PRINCIPAL
// ============================================

/**
 * Processa template dinâmico, substituindo todas as variáveis
 */
export function processTemplate(
  template: DynamicTemplate,
  customVariables?: Partial<TemplateVariables>
): TemplateProcessingResult {
  const startTime = performance.now();
  
  try {
    // Merge variáveis customizadas
    const variables: TemplateVariables = {
      theme: { ...TEMPLATE_VARIABLES.theme, ...customVariables?.theme },
      assets: { ...TEMPLATE_VARIABLES.assets, ...customVariables?.assets },
    };
    
    // Validação de variáveis
    const validation = validateTemplateVariables(template, variables);
    if (!validation.valid) {
      appLogger.warn(`⚠️ Template ${template.metadata.id} tem variáveis não definidas:`, validation.missing);
    }
    
    // Clone profundo do template
    const processed: ProcessedTemplate = JSON.parse(JSON.stringify(template));
    
    // Estatísticas
    let variablesReplaced = 0;
    let blocksProcessed = 0;
    const warnings: string[] = [];
    
    // Processar cada bloco
    for (const block of processed.blocks) {
      blocksProcessed++;
      
      // Processar properties (único objeto agora, config foi removido)
      if (block.properties) {
        const result = processObject(block.properties, variables);
        block.properties = result.data;
        variablesReplaced += result.count;
        warnings.push(...result.warnings);
      }
    }
    
    const endTime = performance.now();
    const processingTime = (endTime - startTime).toFixed(2);
    
    appLogger.info(
      `✅ Template ${template.metadata.id} processado: ${variablesReplaced} variáveis, ${blocksProcessed} blocos (${processingTime}ms)`
    );
    
    const isDev = Boolean((import.meta as any)?.env?.DEV);
    const statsBase: any = {
      variablesReplaced,
      blocksProcessed,
    };
    if (isDev) {
      const originalSize = JSON.stringify(template).length;
      const processedSize = JSON.stringify(processed).length;
      const reduction = ((1 - processedSize / originalSize) * 100).toFixed(1);
      statsBase.sizeReduction = `${reduction}%`;
    }
    return {
      success: true,
      template: processed,
      warnings: warnings.length > 0 ? warnings : undefined,
      stats: statsBase,
    };
  } catch (error) {
    appLogger.error(`❌ Erro ao processar template ${template.metadata.id}:`, error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// ============================================
// 3. SUBSTITUIÇÃO DE VARIÁVEIS
// ============================================

/**
 * Processa objeto recursivamente substituindo variáveis
 */
function processObject(
  obj: any,
  variables: TemplateVariables
): { data: any; count: number; warnings: string[] } {
  let count = 0;
  const warnings: string[] = [];
  
  function process(value: any): any {
    if (typeof value === 'string') {
      return processString(value, variables, (replaced) => {
        if (replaced) count++;
      }, warnings);
    }
    
    if (Array.isArray(value)) {
      return value.map(process);
    }
    
    if (value && typeof value === 'object') {
      const processed: any = {};
      for (const [key, val] of Object.entries(value)) {
        processed[key] = process(val);
      }
      return processed;
    }
    
    return value;
  }
  
  return { data: process(obj), count, warnings };
}

/**
 * Processa string substituindo variáveis {{path}}
 */
function processString(
  str: string,
  variables: TemplateVariables,
  onReplace?: (replaced: boolean) => void,
  warnings?: string[]
): string {
  // Regex para encontrar {{variavel}}
  const regex = /\{\{([^}]+)\}\}/g;
  
  let replaced = false;
  const result = str.replace(regex, (match, path) => {
    const trimmedPath = path.trim();
    
    try {
      const value = resolveVariable(trimmedPath, variables);
      
      if (value === undefined) {
        warnings?.push(`Variável não encontrada: ${trimmedPath}`);
        return match; // Mantém original se não encontrar
      }
      
      replaced = true;
      return String(value);
    } catch (error) {
      warnings?.push(`Erro ao resolver ${trimmedPath}: ${error}`);
      return match;
    }
  });
  
  onReplace?.(replaced);
  return result;
}

/**
 * Resolve variável por caminho (theme.colors.primary → valor)
 */
function resolveVariable(path: string, variables: TemplateVariables): any {
  // Casos especiais: assets.XXX (asset IDs)
  if (path.startsWith('assets.') && !path.includes('.cloudinary.') && !path.includes('.fallback.')) {
    const assetId = path.replace('assets.', '');
    return resolveAsset(assetId);
  }
  
  // Caso normal: navegação no objeto
  const keys = path.split('.');
  let current: any = variables;
  
  for (const key of keys) {
    if (current && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current;
}

// ============================================
// 4. VALIDAÇÃO
// ============================================

/**
 * Valida se todas as variáveis usadas existem no config
 */
function validateTemplateVariables(
  template: DynamicTemplate,
  variables: TemplateVariables
): { valid: boolean; missing: string[] } {
  const missing = new Set<string>();
  
  function checkValue(value: any) {
    if (typeof value === 'string') {
      const regex = /\{\{([^}]+)\}\}/g;
      let match;
      
      while ((match = regex.exec(value)) !== null) {
        const path = match[1].trim();
        
        try {
          const resolved = resolveVariable(path, variables);
          if (resolved === undefined) {
            missing.add(path);
          }
        } catch {
          missing.add(path);
        }
      }
    } else if (Array.isArray(value)) {
      value.forEach(checkValue);
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(checkValue);
    }
  }
  
  template.blocks.forEach(block => {
    if (block.properties) checkValue(block.properties);
  });
  
  return { valid: missing.size === 0, missing: Array.from(missing) };
}

// ============================================
// 5. UTILITÁRIOS
// ============================================

/**
 * Remove duplicação config/properties (para migração)
 * Se config e properties são idênticos, mantém apenas properties
 */
export function removeDuplicateConfig(template: any): any {
  const cleaned = JSON.parse(JSON.stringify(template));
  
  for (const block of cleaned.blocks || []) {
    if (block.config && block.properties) {
      // Verifica se são idênticos
      const configStr = JSON.stringify(block.config);
      const propertiesStr = JSON.stringify(block.properties);
      
      if (configStr === propertiesStr) {
        delete block.config; // Remove config duplicado
      }
    }
  }
  
  return cleaned;
}

/**
 * Converte URLs hardcoded para variáveis (para migração)
 */
export function convertHardcodedUrls(template: any): any {
  const converted = JSON.parse(JSON.stringify(template));
  
  function convertValue(value: any): any {
    if (typeof value === 'string') {
      // URLs do Cloudinary
      if (value.includes('cloudinary.com')) {
        // Tenta mapear para asset ID
        const assetId = findAssetIdForUrl(value);
        if (assetId) {
          return `{{assets.${assetId}}}`;
        }
      }
      
      // Cores hex
      if (/^#[A-Fa-f0-9]{6}$/.test(value)) {
        const colorVar = findColorVariable(value);
        if (colorVar) {
          return `{{theme.colors.${colorVar}}}`;
        }
      }
    }
    
    if (Array.isArray(value)) {
      return value.map(convertValue);
    }
    
    if (value && typeof value === 'object') {
      const converted: any = {};
      for (const [key, val] of Object.entries(value)) {
        converted[key] = convertValue(val);
      }
      return converted;
    }
    
    return value;
  }
  
  for (const block of converted.blocks || []) {
    if (block.properties) {
      block.properties = convertValue(block.properties);
    }
  }
  
  return converted;
}

/**
 * Encontra asset ID para URL (helper para migração)
 */
function findAssetIdForUrl(url: string): string | null {
  // Mapeamento simplificado (você pode expandir isso)
  const mappings: Record<string, string> = {
    'Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png': 'hero-intro',
    'LOGO_DA_MARCA_GISELE_l78gin.png': 'logo-main',
    // ... adicionar mais conforme necessário
  };
  
  for (const [pattern, assetId] of Object.entries(mappings)) {
    if (url.includes(pattern)) return assetId;
  }
  
  return null;
}

/**
 * Encontra variável de cor para valor hex
 */
function findColorVariable(hex: string): string | null {
  const { colors } = TEMPLATE_VARIABLES.theme;
  
  for (const [key, value] of Object.entries(colors)) {
    if (value.toLowerCase() === hex.toLowerCase()) {
      return key;
    }
  }
  
  return null;
}

/**
 * Estatísticas de processamento
 */
export function getProcessingStats(templates: DynamicTemplate[]): {
  totalTemplates: number;
  totalBlocks: number;
  avgVariablesPerTemplate: number;
  estimatedSizeReduction: string;
} {
  let totalBlocks = 0;
  let totalVariables = 0;
  
  for (const template of templates) {
    totalBlocks += template.blocks.length;
    
    // Conta variáveis
    const str = JSON.stringify(template);
    const matches = str.match(/\{\{[^}]+\}\}/g);
    totalVariables += matches?.length || 0;
  }
  
  return {
    totalTemplates: templates.length,
    totalBlocks,
    avgVariablesPerTemplate: Math.round(totalVariables / templates.length),
    estimatedSizeReduction: '45-60%', // Baseado em análise anterior
  };
}
