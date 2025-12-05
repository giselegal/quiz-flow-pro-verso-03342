/**
 * 🔄 BLOCK DATA ADAPTER - Fase 2
 * 
 * Adapter universal para normalizar acesso a dados de blocos
 * Garante compatibilidade entre blocos usando content ou properties
 * 
 * @priority P0 - Critical para renderização correta
 */

import { getBlockConfig } from './blockConfigMerger';

// ============================================================================
// TYPES
// ============================================================================

export interface BlockDataSource {
  id?: string;
  type?: string;
  content?: Record<string, any>;
  properties?: Record<string, any>;
  config?: Record<string, any>;
  [key: string]: any;
}

export interface NormalizedBlockData {
  /** ID único do bloco */
  id: string;
  /** Tipo do bloco */
  type: string;
  /** Dados mesclados (content + properties + config) */
  data: Record<string, any>;
  /** Acesso direto a properties (normalizado) */
  properties: Record<string, any>;
  /** Acesso direto a content (normalizado) */
  content: Record<string, any>;
  /** Helper para acessar valor com fallback */
  get: <T = any>(key: string, fallback?: T) => T;
  /** Helper para verificar se uma propriedade existe */
  has: (key: string) => boolean;
}

// ============================================================================
// ADAPTER PRINCIPAL
// ============================================================================

/**
 * Normaliza qualquer fonte de dados de bloco para um formato unificado
 * 
 * @example
 * ```tsx
 * const blockData = adaptBlockData(block);
 * const title = blockData.get('title', 'Título Padrão');
 * const hasImage = blockData.has('imageUrl');
 * ```
 */
export function adaptBlockData(block: BlockDataSource | null | undefined): NormalizedBlockData {
  if (!block || typeof block !== 'object') {
    return createEmptyBlockData();
  }

  const content = (block.content && typeof block.content === 'object') ? block.content : {};
  const properties = (block.properties && typeof block.properties === 'object') ? block.properties : {};
  const mergedData = getBlockConfig(block);

  return {
    id: block.id || 'unknown',
    type: block.type || 'unknown',
    data: mergedData,
    properties: { ...content, ...properties }, // properties tem precedência
    content,
    get: <T = any>(key: string, fallback?: T): T => {
      const value = mergedData[key];
      return (value !== undefined && value !== null) ? value : (fallback as T);
    },
    has: (key: string): boolean => {
      return key in mergedData && mergedData[key] !== undefined && mergedData[key] !== null;
    },
  };
}

/**
 * Cria dados de bloco vazios (para blocos null/undefined)
 */
function createEmptyBlockData(): NormalizedBlockData {
  return {
    id: 'empty',
    type: 'empty',
    data: {},
    properties: {},
    content: {},
    get: <T = any>(_key: string, fallback?: T): T => fallback as T,
    has: (_key: string): boolean => false,
  };
}

// ============================================================================
// HELPERS ESPECIALIZADOS
// ============================================================================

/**
 * Extrai texto de um bloco com múltiplos fallbacks
 */
export function getBlockText(
  block: BlockDataSource,
  keys: string[] = ['text', 'title', 'label', 'question'],
  fallback = ''
): string {
  const data = adaptBlockData(block);
  
  for (const key of keys) {
    const value = data.get(key);
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  
  return fallback;
}

/**
 * Extrai URL de imagem com múltiplos fallbacks
 */
export function getBlockImage(
  block: BlockDataSource,
  keys: string[] = ['image', 'imageUrl', 'src', 'imageSrc', 'url'],
  fallback?: string
): string | undefined {
  const data = adaptBlockData(block);
  
  for (const key of keys) {
    const value = data.get(key);
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  
  return fallback;
}

/**
 * Extrai opções de um bloco (para grids, selects, etc)
 */
export function getBlockOptions(
  block: BlockDataSource,
  keys: string[] = ['options', 'items', 'choices']
): Array<{
  id: string;
  text: string;
  value?: string;
  image?: string;
  imageUrl?: string;
  [key: string]: any;
}> {
  const data = adaptBlockData(block);
  
  for (const key of keys) {
    const value = data.get(key);
    if (Array.isArray(value)) {
      return value.map((opt, index) => ({
        id: String(opt.id ?? opt.key ?? opt.value ?? `opt-${index}`),
        text: String(opt.text ?? opt.label ?? opt.title ?? `Opção ${index + 1}`),
        value: opt.value ?? opt.id ?? `opt-${index}`,
        image: opt.image ?? opt.imageUrl ?? opt.src,
        imageUrl: opt.imageUrl ?? opt.image ?? opt.src,
        ...opt,
      }));
    }
  }
  
  return [];
}

/**
 * Extrai cor com validação hex
 */
export function getBlockColor(
  block: BlockDataSource,
  key: string,
  fallback = '#000000'
): string {
  const data = adaptBlockData(block);
  const value = data.get(key, fallback);
  
  if (typeof value === 'string') {
    // Validar formato hex
    if (/^#[0-9A-Fa-f]{6}$/i.test(value) || /^#[0-9A-Fa-f]{3}$/i.test(value)) {
      return value;
    }
    // Tentar adicionar # se for um hex sem ele
    if (/^[0-9A-Fa-f]{6}$/i.test(value) || /^[0-9A-Fa-f]{3}$/i.test(value)) {
      return `#${value}`;
    }
  }
  
  return fallback;
}

/**
 * Extrai número com validação
 */
export function getBlockNumber(
  block: BlockDataSource,
  key: string,
  fallback = 0,
  min?: number,
  max?: number
): number {
  const data = adaptBlockData(block);
  const value = data.get(key);
  
  let num = typeof value === 'number' ? value : parseFloat(String(value));
  
  if (isNaN(num)) {
    num = fallback;
  }
  
  if (min !== undefined && num < min) num = min;
  if (max !== undefined && num > max) num = max;
  
  return num;
}

/**
 * Extrai booleano com fallback
 */
export function getBlockBoolean(
  block: BlockDataSource,
  key: string,
  fallback = false
): boolean {
  const data = adaptBlockData(block);
  const value = data.get(key);
  
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  
  return fallback;
}

// ============================================================================
// RE-EXPORTS para conveniência
// ============================================================================

export { getBlockConfig } from './blockConfigMerger';
