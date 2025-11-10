/**
 * 🎯 DYNAMIC TEMPLATE TYPES
 * Sistema de templates dinâmicos com variáveis {{theme}}, {{assets}}
 * Elimina duplicação config/properties e hardcoding
 */

// ============================================
// 1. VARIÁVEIS DE TEMPLATE
// ============================================

/**
 * Variáveis disponíveis nos templates JSON
 * Exemplo: "color: {{theme.colors.primary}}"
 */
export interface TemplateVariables {
  theme: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent: string;
      error: string;
      success: string;
    };
    fonts: {
      heading: string;
      body: string;
      sizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  assets: {
    cloudinary: {
      baseUrl: string;
      paths: {
        hero: string;
        logo: string;
        icons: string;
        questions: string;
      };
    };
    fallback: {
      hero: string;
      logo: string;
    };
  };
}

// ============================================
// 2. TEMPLATE DINÂMICO (SEM DUPLICAÇÃO)
// ============================================

/**
 * Template v3.1 dinâmico - SEM duplicação config/properties
 */
export interface DynamicTemplate {
  templateVersion: '3.1' | '3.2';
  metadata: {
    id: string;
    name: string;
    description: string;
    category: 'intro' | 'question' | 'result' | 'transition';
    tags: string[];
  };
  
  // ❌ REMOVIDO: theme inline (agora vem de config)
  // theme?: { colors: {...} }
  
  blocks: DynamicBlock[];
  
  analytics?: {
    events: string[];
    trackingId: string;
  };
}

/**
 * Block dinâmico - USA APENAS properties (não mais config)
 */
export interface DynamicBlock {
  id: string;
  type: BlockType;
  
  // ✅ APENAS properties (config foi removido)
  properties: Record<string, any>;
  
  // ❌ REMOVIDO: config (era 100% duplicado)
  // config?: Record<string, any>;
}

export type BlockType =
  | 'hero-block'
  | 'welcome-form-block'
  | 'question-block'
  | 'result-block'
  | 'transition-block'
  | 'text-block'
  | 'image-block';

// ============================================
// 3. TEMPLATE PROCESSADO (APÓS SUBSTITUIÇÃO)
// ============================================

/**
 * Template após processamento de variáveis
 * {{theme.colors.primary}} → "#B89B7A"
 * {{assets.cloudinary.hero}} → "https://res.cloudinary.com/..."
 */
export interface ProcessedTemplate extends Omit<DynamicTemplate, 'blocks'> {
  blocks: ProcessedBlock[];
}

export interface ProcessedBlock extends Omit<DynamicBlock, 'properties'> {
  properties: Record<string, any>; // Todas as variáveis já substituídas
}

// ============================================
// 4. UTILITÁRIOS
// ============================================

/**
 * Verifica se string contém variáveis não processadas
 */
export function hasUnprocessedVariables(str: string): boolean {
  return /\{\{[^}]+\}\}/.test(str);
}

/**
 * Extrai todas as variáveis de uma string
 * "color: {{theme.colors.primary}}" → ["theme.colors.primary"]
 */
export function extractVariables(str: string): string[] {
  const matches = str.matchAll(/\{\{([^}]+)\}\}/g);
  return Array.from(matches, m => m[1].trim());
}

/**
 * Valida se todas as variáveis usadas existem no config
 */
export function validateTemplateVariables(
  template: DynamicTemplate,
  variables: TemplateVariables
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  const checkValue = (value: any) => {
    if (typeof value === 'string' && hasUnprocessedVariables(value)) {
      const vars = extractVariables(value);
      vars.forEach(v => {
        // Verifica se variável existe em variables
        const path = v.split('.');
        let current: any = variables;
        
        for (const key of path) {
          if (!(key in current)) {
            missing.push(v);
            return;
          }
          current = current[key];
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach(checkValue);
    }
  };
  
  template.blocks.forEach(block => checkValue(block.properties));
  
  return { valid: missing.length === 0, missing: [...new Set(missing)] };
}

// ============================================
// 5. TIPOS DE RETORNO
// ============================================

export interface TemplateProcessingResult {
  success: boolean;
  template?: ProcessedTemplate;
  error?: string;
  warnings?: string[];
  stats?: {
    variablesReplaced: number;
    blocksProcessed: number;
    sizeReduction: string; // "45% menor"
  };
}
