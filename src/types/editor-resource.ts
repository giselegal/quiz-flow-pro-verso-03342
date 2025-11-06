/**
 * 🎯 EDITOR RESOURCE - Tipo Unificado
 * 
 * Template e Funnel são apenas recursos com diferentes características
 * Elimina duplicação de lógica e simplifica arquitetura
 */

export type EditorResourceType = 'template' | 'funnel' | 'draft';

export type EditorResourceSource = 'local' | 'supabase' | 'embedded';

export interface EditorResource {
  /** Identificador único do recurso */
  id: string;

  /** Tipo do recurso */
  type: EditorResourceType;

  /** Nome/título do recurso */
  name: string;

  /** Origem dos dados */
  source: EditorResourceSource;

  /** Se é somente leitura (ex: templates built-in) */
  isReadOnly?: boolean;

  /** Se permite clonagem */
  canClone?: boolean;

  /** Metadata adicional */
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    version?: number;
    description?: string;
    tags?: string[];
  };
}

export interface EditorResourceLoader {
  /** Carrega um recurso por ID */
  load(resourceId: string): Promise<EditorResource>;

  /** Salva alterações no recurso */
  save(resource: EditorResource): Promise<void>;

  /** Clona um recurso (template → funnel, ou funnel → novo funnel) */
  clone(resourceId: string, newName?: string): Promise<EditorResource>;

  /** Lista recursos disponíveis */
  list(filter?: { type?: EditorResourceType; source?: EditorResourceSource }): Promise<EditorResource[]>;
}

/**
 * Identifica o tipo de recurso baseado no ID
 * 
 * Exemplos:
 * - "quiz21StepsComplete" → template
 * - "step-01" → template (step individual)
 * - UUID → funnel do Supabase
 */
export function detectResourceType(resourceId: string): EditorResourceType {
  // UUIDs são sempre funnels do Supabase
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(resourceId)) {
    return 'funnel';
  }

  // IDs começando com "draft-" são rascunhos
  if (resourceId.startsWith('draft-')) {
    return 'draft';
  }

  // IDs específicos conhecidos como templates
  const knownTemplates = [
    'quiz21StepsComplete',
    'quiz-21-steps',
    'intro-simples',
    'resultado-completo',
  ];

  if (knownTemplates.some(t => resourceId.toLowerCase().includes(t.toLowerCase()))) {
    return 'template';
  }

  // Padrão step-XX também são templates
  if (/^step-\d{2}$/i.test(resourceId)) {
    return 'template';
  }

  // Default: assumir que é funnel
  return 'funnel';
}

/**
 * Detecta a origem do recurso baseado no ID e contexto
 */
export function detectResourceSource(resourceId: string, hasSupabaseAccess: boolean): EditorResourceSource {
  const type = detectResourceType(resourceId);

  // Templates são sempre local/embedded
  if (type === 'template') {
    return 'embedded';
  }

  // Drafts são sempre local (localStorage)
  if (type === 'draft') {
    return 'local';
  }

  // Funnels com Supabase disponível
  if (hasSupabaseAccess) {
    return 'supabase';
  }

  // Fallback para local
  return 'local';
}
