/**
 * 🔧 BLOCK CONFIG MERGER - Fase 1 (P0)
 * 
 * Unifica a lógica de merge de configurações de blocos
 * Garante que Canvas e Preview usem EXATAMENTE a mesma transformação
 */

export interface BlockConfig {
  id?: string;
  type?: string;
  content?: Record<string, any>;
  properties?: Record<string, any>;
  config?: Record<string, any>;
  [key: string]: any;
}

/**
 * Mescla content + properties + config com prioridade: config > properties > content
 * USADO POR: Canvas, Preview, Runtime
 */
export function getBlockConfig(block: BlockConfig | null | undefined): Record<string, any> {
  if (!block || typeof block !== 'object') {
    return {};
  }

  const content = (block.content && typeof block.content === 'object') ? block.content : {};
  const properties = (block.properties && typeof block.properties === 'object') ? block.properties : {};
  const config = (block.config && typeof block.config === 'object') ? block.config : {};

  // Prioridade: config > properties > content
  return { ...content, ...properties, ...config };
}

/**
 * Normaliza uma opção genérica para o formato padrão
 */
export function normalizeOption(opt: any): { id: string; text: string; image?: string } {
  if (!opt) return { id: 'unknown', text: 'Opção' };

  return {
    id: String(opt.id ?? opt.key ?? opt.value ?? `opt-${Date.now()}`),
    text: String(opt.text ?? opt.label ?? 'Opção'),
    image: opt.image ?? opt.imageUrl ?? opt.src ?? undefined
  };
}

/**
 * Extrai opções normalizadas de um bloco
 */
export function extractOptions(block: BlockConfig): Array<{ id: string; text: string; image?: string }> {
  const cfg = getBlockConfig(block);
  const rawOptions = cfg.options;

  if (!Array.isArray(rawOptions)) {
    return [];
  }

  return rawOptions.map(normalizeOption);
}

/**
 * Extrai texto de questão de um bloco
 */
export function extractQuestionText(block: BlockConfig, fallback?: string): string | undefined {
  const cfg = getBlockConfig(block);
  return cfg.question || cfg.questionText || cfg.text || fallback || undefined;
}

/**
 * Extrai número da questão
 */
export function extractQuestionNumber(block: BlockConfig): string | number | undefined {
  const cfg = getBlockConfig(block);
  return cfg.questionNumber ?? undefined;
}
