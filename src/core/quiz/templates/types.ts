/**
 * 🎯 TIPOS OFICIAIS - CONTRATO PARA FUNIL/TEMPLATE E STEP
 * 
 * Este arquivo define o contrato oficial para a estrutura de dados de templates,
 * funis e steps, alinhado aos princípios de plataformas como CaktoQuiz e Inlead.
 * 
 * Princípios:
 * - Separação clara entre editor/runtime/core
 * - Tipos imutáveis e fortemente tipados
 * - Versionamento explícito
 * - Validação em camadas
 * 
 * @version 1.0.0
 * @status OFICIAL - Este é o contrato canônico
 */

/**
 * Versão do contrato de template
 * Seguir versionamento semântico
 */
export type TemplateVersion = '1.0.0' | string;

/**
 * Categorias oficiais de templates/funis
 */
export enum TemplateCategoryEnum {
  QUIZ = 'quiz',
  SURVEY = 'survey',
  LEAD_CAPTURE = 'lead-capture',
  PRODUCT_FINDER = 'product-finder',
  ASSESSMENT = 'assessment',
  CUSTOM = 'custom',
}

/**
 * Tipos de steps oficiais no funil
 */
export enum StepTypeEnum {
  INTRO = 'intro',
  QUESTION = 'question',
  TRANSITION = 'transition',
  RESULT = 'result',
  OFFER = 'offer',
  LEAD_FORM = 'lead-form',
  CUSTOM = 'custom',
}

/**
 * Metadata oficial de um Template/Funil
 */
export interface FunnelMetadata {
  /** ID único do template/funil */
  id: string;
  /** Nome descritivo */
  name: string;
  /** Descrição do propósito */
  description: string;
  /** Categoria do template */
  category: TemplateCategoryEnum;
  /** Tags para busca e organização */
  tags: string[];
  /** Versão do template */
  version: TemplateVersion;
  /** Data de criação (ISO 8601) */
  createdAt: string;
  /** Data de última atualização (ISO 8601) */
  updatedAt: string;
  /** Autor/criador */
  author?: string;
  /** URL de thumbnail/preview */
  thumbnailUrl?: string;
  /** Template oficial fornecido pela plataforma */
  isOfficial?: boolean;
}

/**
 * Configurações globais do funil
 */
export interface FunnelSettings {
  /** Tema visual aplicado */
  theme?: string;
  /** Configurações de navegação */
  navigation?: {
    allowBack?: boolean;
    showProgress?: boolean;
    autoAdvance?: boolean;
  };
  /** Configurações de resultado/cálculo */
  scoring?: {
    method?: 'weighted' | 'count' | 'custom';
    resultsMapping?: Record<string, any>;
  };
  /** Integrações externas */
  integrations?: {
    analytics?: boolean;
    crm?: string;
    email?: string;
  };
}

/**
 * Contrato oficial de um Step no funil
 */
export interface FunnelStep {
  /** ID único do step */
  id: string;
  /** Tipo do step */
  type: StepTypeEnum | string;
  /** Ordem no funil (1-based) */
  order: number;
  /** Nome/título do step */
  title: string;
  /** Descrição opcional */
  description?: string;
  /** Array de blocos que compõem o step */
  blocks: string[]; // IDs dos blocos - referência ao BlockRegistry
  /** Configurações específicas do step */
  settings?: {
    /** Requisito de seleção (para questions) */
    required?: boolean;
    /** Número mínimo/máximo de seleções */
    minSelections?: number;
    maxSelections?: number;
    /** Validação customizada */
    validation?: Record<string, any>;
    /** Timeout ou timer */
    timer?: number;
  };
  /** Metadata adicional */
  metadata?: {
    /** Peso para cálculo de resultado */
    weight?: number;
    /** Categoria ou dimensão avaliada */
    dimension?: string;
    /** Tags internas */
    tags?: string[];
  };
}

/**
 * Estrutura oficial completa de um Funil/Template
 * Este é o formato JSON canônico esperado pelo sistema
 */
export interface FunnelTemplate {
  /** Metadata do template */
  metadata: FunnelMetadata;
  /** Configurações globais */
  settings: FunnelSettings;
  /** Array ordenado de steps */
  steps: FunnelStep[];
  /** Referências a blocos utilizados (IDs) */
  blocksUsed: string[];
  /** Schema de validação opcional */
  validationSchema?: string; // referência a schema JSON
}

/**
 * Resultado calculado do funil
 * TODO Wave 2: Expandir com tipos específicos de resultado
 */
export interface FunnelResult {
  /** ID da sessão/execução */
  sessionId: string;
  /** ID do template usado */
  templateId: string;
  /** Timestamp de conclusão */
  completedAt: string;
  /** Respostas coletadas por step */
  responses: Record<string, any>;
  /** Resultado calculado */
  score?: {
    primary?: string;
    secondary?: string[];
    dimensions?: Record<string, number>;
  };
  /** Dados do lead capturado */
  leadData?: {
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
}

/**
 * Contrato para validação de template
 * TODO Wave 2: Implementar validação com Zod
 */
export interface TemplateValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
    code: string;
  }>;
  warnings?: Array<{
    path: string;
    message: string;
  }>;
}
