/**
 * 🧱 TIPOS OFICIAIS - CONTRATO PARA BLOCKS
 * 
 * Este arquivo define o contrato oficial para a estrutura de dados de blocos,
 * alinhado aos princípios de plataformas como CaktoQuiz e Inlead.
 * 
 * Princípios:
 * - Blocks são unidades atômicas de UI/funcionalidade
 * - Propriedades fortemente tipadas
 * - Separação clara entre dados e renderização
 * - Composição sobre herança
 * 
 * @version 1.0.0
 * @status OFICIAL - Este é o contrato canônico
 */

/**
 * Categorias oficiais de blocos
 */
export enum BlockCategoryEnum {
  /** Blocos de introdução (logos, títulos, hero) */
  INTRO = 'intro',
  /** Blocos de pergunta/interação */
  QUESTION = 'question',
  /** Blocos de transição/feedback */
  TRANSITION = 'transition',
  /** Blocos de resultado */
  RESULT = 'result',
  /** Blocos de oferta/CTA */
  OFFER = 'offer',
  /** Blocos de formulário/captura */
  FORM = 'form',
  /** Blocos de mídia (imagem, vídeo) */
  MEDIA = 'media',
  /** Blocos de conteúdo (texto, rich text) */
  CONTENT = 'content',
  /** Blocos de layout/estrutura */
  LAYOUT = 'layout',
  /** Blocos customizados */
  CUSTOM = 'custom',
}

/**
 * Tipos de propriedades suportadas
 */
export enum PropertyTypeEnum {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  COLOR = 'color',
  URL = 'url',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  RANGE = 'range',
  JSON = 'json',
  ARRAY = 'array',
  OBJECT = 'object',
}

/**
 * Definição de uma propriedade configurável do bloco
 */
export interface BlockPropertyDefinition {
  /** Chave única da propriedade */
  key: string;
  /** Tipo da propriedade */
  type: PropertyTypeEnum;
  /** Label para exibição no editor */
  label: string;
  /** Descrição/help text */
  description?: string;
  /** Valor padrão */
  defaultValue?: any;
  /** Propriedade obrigatória */
  required?: boolean;
  /** Validação adicional */
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: Array<{ value: any; label: string }>;
  };
  /** Categoria de agrupamento no editor */
  category?: 'content' | 'style' | 'behavior' | 'advanced';
  /** Condição para exibir (dependência de outra prop) */
  showIf?: {
    property: string;
    value: any;
  };
}

/**
 * Schema de definição oficial de um tipo de bloco
 * Registrado no BlockRegistry
 */
export interface BlockDefinition {
  /** Tipo único do bloco (ex: 'intro-logo', 'question-single-choice') */
  type: string;
  /** Nome legível do bloco */
  name: string;
  /** Descrição do propósito */
  description: string;
  /** Categoria do bloco */
  category: BlockCategoryEnum;
  /** Ícone para o editor */
  icon?: string;
  /** Propriedades configuráveis */
  properties: BlockPropertyDefinition[];
  /** Valores padrão das propriedades */
  defaultProperties: Record<string, any>;
  /** Tags para busca/filtro */
  tags?: string[];
  /** Bloco experimental/beta */
  experimental?: boolean;
  /** Versão mínima requerida */
  minVersion?: string;
}

/**
 * Instância de um bloco em um step
 * Este é o dado que será serializado/persistido
 */
export interface BlockInstance {
  /** ID único da instância */
  id: string;
  /** Tipo do bloco (referência ao BlockDefinition) */
  type: string;
  /** Valores das propriedades configuradas */
  properties: Record<string, any>;
  /** Ordem no step */
  order: number;
  /** Metadata adicional */
  metadata?: {
    /** Label customizado */
    label?: string;
    /** Notas do editor */
    notes?: string;
    /** Bloqueado para edição */
    locked?: boolean;
  };
  /** Blocos filhos (para containers/layouts) */
  children?: BlockInstance[];
}

/**
 * Configuração de renderização de um bloco
 * Usado pelo runtime para renderizar o bloco
 */
export interface BlockRenderConfig {
  /** ID da instância */
  instanceId: string;
  /** Tipo do bloco */
  type: string;
  /** Props computadas para o componente React */
  props: Record<string, any>;
  /** Contexto de execução */
  context?: {
    /** Está em modo de edição */
    isEditing?: boolean;
    /** Bloco está selecionado */
    isSelected?: boolean;
    /** Dados de runtime (respostas, estado) */
    runtimeData?: Record<string, any>;
  };
}

/**
 * Resultado da validação de um bloco
 * TODO Wave 2: Implementar validação runtime
 */
export interface BlockValidationResult {
  valid: boolean;
  errors: Array<{
    property: string;
    message: string;
    code: string;
  }>;
}

/**
 * Aliases/mapeamento de tipos legados para novos tipos
 * Usado para migração gradual
 */
export interface BlockTypeAlias {
  /** Tipo legado */
  legacyType: string;
  /** Tipo oficial novo */
  officialType: string;
  /** Mapeamento de propriedades (legacyProp -> officialProp) */
  propertyMapping?: Record<string, string>;
  /** Transformação customizada de dados */
  transform?: (legacyData: any) => BlockInstance;
}
