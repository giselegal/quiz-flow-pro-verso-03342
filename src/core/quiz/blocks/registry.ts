/**
 * 🎯 BLOCK REGISTRY OFICIAL - CENTRAL
 * 
 * Registry centralizado para todos os tipos de blocos do sistema.
 * Define o contrato oficial e mapeia tipos legados.
 * 
 * Responsabilidades:
 * - Registrar e validar definições de blocos
 * - Mapear tipos legados para tipos oficiais
 * - Fornecer defaults e validação
 * - Suportar extensibilidade
 * 
 * @version 1.0.0
 * @status OFICIAL - Este é o registry canônico
 */

import type {
  BlockDefinition,
  BlockCategoryEnum,
  PropertyTypeEnum,
  BlockTypeAlias,
} from './types';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Registry principal de blocos
 */
export class BlockRegistryClass {
  private definitions = new Map<string, BlockDefinition>();
  private aliases = new Map<string, BlockTypeAlias>();

  /**
   * Registrar uma definição de bloco
   */
  register(definition: BlockDefinition): void {
    if (this.definitions.has(definition.type)) {
      appLogger.warn(`[BlockRegistry] Tipo '${definition.type}' já registrado - sobrescrevendo`);
    }
    this.definitions.set(definition.type, definition);
  }

  /**
   * Registrar múltiplas definições de uma vez
   */
  registerMany(definitions: BlockDefinition[]): void {
    definitions.forEach((def) => this.register(def));
  }

  /**
   * Obter definição de um bloco por tipo
   */
  getDefinition(type: string): BlockDefinition | undefined {
    // Verificar se é um alias primeiro
    const alias = this.aliases.get(type);
    if (alias) {
      return this.definitions.get(alias.officialType);
    }
    return this.definitions.get(type);
  }

  /**
   * Verificar se um tipo está registrado
   */
  hasType(type: string): boolean {
    return this.definitions.has(type) || this.aliases.has(type);
  }

  /**
   * Listar todos os tipos registrados
   */
  getAllTypes(): string[] {
    return Array.from(this.definitions.keys());
  }

  /**
   * Listar definições por categoria
   */
  getByCategory(category: BlockCategoryEnum | string): BlockDefinition[] {
    return Array.from(this.definitions.values()).filter(
      (def) => def.category === category
    );
  }

  /**
   * Registrar um alias de tipo legado
   */
  registerAlias(alias: BlockTypeAlias): void {
    this.aliases.set(alias.legacyType, alias);
  }

  /**
   * Resolver tipo oficial a partir de tipo legado
   */
  resolveType(type: string): string {
    const alias = this.aliases.get(type);
    return alias ? alias.officialType : type;
  }

  /**
   * Obter todos os aliases de um tipo oficial
   */
  getAliases(officialType: string): string[] {
    const aliases: string[] = [];
    this.aliases.forEach((alias, legacyType) => {
      if (alias.officialType === officialType) {
        aliases.push(legacyType);
      }
    });
    return aliases;
  }
}

// Singleton instance
export const BlockRegistry = new BlockRegistryClass();

/**
 * =================================================================
 * DEFINIÇÕES OFICIAIS DE BLOCOS
 * =================================================================
 * 
 * Abaixo estão as definições oficiais dos blocos atualmente em uso.
 * Mapeiam os tipos do sistema atual para o contrato oficial.
 * 
 * TODO Wave 2: Expandir com propriedades completas e validação
 * TODO Wave 3: Migrar componentes para consumir estas definições
 */

// Helper para criar definição de propriedade
const prop = (
  key: string,
  type: PropertyTypeEnum,
  label: string,
  defaultValue?: any,
  options?: Partial<BlockDefinition['properties'][0]>
): BlockDefinition['properties'][0] => ({
  key,
  type,
  label,
  defaultValue,
  category: 'content',
  ...options,
});

/**
 * =================================================================
 * BLOCOS DE INTRODUÇÃO (INTRO)
 * =================================================================
 */

BlockRegistry.register({
  type: 'intro-logo-header',
  name: 'Logo Header',
  description: 'Bloco de cabeçalho com logo e título',
  category: 'intro' as BlockCategoryEnum,
  icon: 'layout-header',
  properties: [
    prop('logoUrl', 'url' as PropertyTypeEnum, 'URL do Logo', ''),
    prop('title', 'text' as PropertyTypeEnum, 'Título', 'Descubra seu estilo'),
    prop('subtitle', 'textarea' as PropertyTypeEnum, 'Subtítulo', ''),
    prop('showLogo', 'boolean' as PropertyTypeEnum, 'Mostrar Logo', true),
    prop('textAlign', 'select' as PropertyTypeEnum, 'Alinhamento', 'center', {
      validation: { options: [
        { value: 'left', label: 'Esquerda' },
        { value: 'center', label: 'Centro' },
        { value: 'right', label: 'Direita' },
      ]},
    }),
  ],
  defaultProperties: {
    logoUrl: '',
    title: 'Descubra seu estilo',
    subtitle: '',
    showLogo: true,
    textAlign: 'center',
  },
  tags: ['intro', 'header', 'logo'],
});

BlockRegistry.register({
  type: 'intro-form',
  name: 'Formulário de Introdução',
  description: 'Formulário de captura de lead inicial',
  category: 'intro' as BlockCategoryEnum,
  icon: 'form',
  properties: [
    prop('title', 'text' as PropertyTypeEnum, 'Título do Formulário', 'Comece por aqui'),
    prop('fields', 'array' as PropertyTypeEnum, 'Campos', []),
    prop('submitText', 'text' as PropertyTypeEnum, 'Texto do Botão', 'Iniciar'),
  ],
  defaultProperties: {
    title: 'Comece por aqui',
    fields: ['name', 'email'],
    submitText: 'Iniciar',
  },
  tags: ['form', 'lead-capture'],
});

BlockRegistry.register({
  type: 'intro-title',
  name: 'Título',
  description: 'Bloco de título/heading',
  category: 'intro' as BlockCategoryEnum,
  icon: 'heading',
  properties: [
    prop('text', 'text' as PropertyTypeEnum, 'Texto', ''),
    prop('level', 'select' as PropertyTypeEnum, 'Nível', 'h1', {
      validation: { options: [
        { value: 'h1', label: 'H1' },
        { value: 'h2', label: 'H2' },
        { value: 'h3', label: 'H3' },
      ]},
    }),
  ],
  defaultProperties: {
    text: 'Título',
    level: 'h1',
  },
  tags: ['text', 'heading'],
});

BlockRegistry.register({
  type: 'intro-description',
  name: 'Descrição',
  description: 'Bloco de texto descritivo',
  category: 'intro' as BlockCategoryEnum,
  icon: 'text',
  properties: [
    prop('text', 'textarea' as PropertyTypeEnum, 'Texto', ''),
  ],
  defaultProperties: {
    text: '',
  },
  tags: ['text', 'description'],
});

BlockRegistry.register({
  type: 'intro-image',
  name: 'Imagem',
  description: 'Bloco de exibição de imagem',
  category: 'intro' as BlockCategoryEnum,
  icon: 'image',
  properties: [
    prop('src', 'url' as PropertyTypeEnum, 'URL da Imagem', ''),
    prop('alt', 'text' as PropertyTypeEnum, 'Texto Alternativo', ''),
  ],
  defaultProperties: {
    src: '',
    alt: 'Imagem',
  },
  tags: ['image', 'media'],
});

BlockRegistry.register({
  type: 'intro-logo',
  name: 'Logo',
  description: 'Bloco de logo',
  category: 'intro' as BlockCategoryEnum,
  icon: 'image',
  properties: [
    prop('src', 'url' as PropertyTypeEnum, 'URL do Logo', ''),
    prop('alt', 'text' as PropertyTypeEnum, 'Texto Alternativo', 'Logo'),
  ],
  defaultProperties: {
    src: '',
    alt: 'Logo',
  },
  tags: ['logo', 'branding'],
});

/**
 * =================================================================
 * BLOCOS DE PERGUNTA (QUESTION)
 * =================================================================
 */

BlockRegistry.register({
  type: 'question-progress',
  name: 'Barra de Progresso',
  description: 'Indicador visual de progresso',
  category: 'question' as BlockCategoryEnum,
  icon: 'progress',
  properties: [
    prop('current', 'number' as PropertyTypeEnum, 'Etapa Atual', 1),
    prop('total', 'number' as PropertyTypeEnum, 'Total de Etapas', 10),
    prop('showPercentage', 'boolean' as PropertyTypeEnum, 'Mostrar Porcentagem', true),
  ],
  defaultProperties: {
    current: 1,
    total: 10,
    showPercentage: true,
  },
  tags: ['progress', 'ui'],
});

BlockRegistry.register({
  type: 'question-number',
  name: 'Número da Pergunta',
  description: 'Exibe o número/contagem da pergunta',
  category: 'question' as BlockCategoryEnum,
  icon: 'hash',
  properties: [
    prop('number', 'text' as PropertyTypeEnum, 'Número', '1 de 10'),
  ],
  defaultProperties: {
    number: '1 de 10',
  },
  tags: ['question', 'counter'],
});

BlockRegistry.register({
  type: 'question-text',
  name: 'Texto da Pergunta',
  description: 'Texto principal da pergunta',
  category: 'question' as BlockCategoryEnum,
  icon: 'message-square',
  properties: [
    prop('text', 'textarea' as PropertyTypeEnum, 'Texto da Pergunta', ''),
  ],
  defaultProperties: {
    text: '',
  },
  tags: ['question', 'text'],
});

BlockRegistry.register({
  type: 'question-options',
  name: 'Opções de Resposta',
  description: 'Grade de opções de múltipla escolha',
  category: 'question' as BlockCategoryEnum,
  icon: 'grid',
  properties: [
    prop('options', 'array' as PropertyTypeEnum, 'Opções', []),
    prop('layout', 'select' as PropertyTypeEnum, 'Layout', 'grid', {
      validation: { options: [
        { value: 'grid', label: 'Grade' },
        { value: 'list', label: 'Lista' },
      ]},
    }),
    prop('multiselect', 'boolean' as PropertyTypeEnum, 'Múltipla Escolha', false),
    prop('minSelections', 'number' as PropertyTypeEnum, 'Mínimo de Seleções', 1),
    prop('maxSelections', 'number' as PropertyTypeEnum, 'Máximo de Seleções', 1),
  ],
  defaultProperties: {
    options: [],
    layout: 'grid',
    multiselect: false,
    minSelections: 1,
    maxSelections: 1,
  },
  tags: ['question', 'options', 'choice'],
});

/**
 * =================================================================
 * BLOCOS DE RESULTADO (RESULT)
 * =================================================================
 */

BlockRegistry.register({
  type: 'result-header',
  name: 'Cabeçalho de Resultado',
  description: 'Cabeçalho da página de resultado',
  category: 'result' as BlockCategoryEnum,
  icon: 'award',
  properties: [
    prop('title', 'text' as PropertyTypeEnum, 'Título', 'Seu Resultado'),
    prop('subtitle', 'text' as PropertyTypeEnum, 'Subtítulo', ''),
    prop('showCelebration', 'boolean' as PropertyTypeEnum, 'Mostrar Animação', true),
  ],
  defaultProperties: {
    title: 'Seu Resultado',
    subtitle: '',
    showCelebration: true,
  },
  tags: ['result', 'header'],
});

BlockRegistry.register({
  type: 'result-score',
  name: 'Pontuação/Score',
  description: 'Exibe a pontuação ou resultado calculado',
  category: 'result' as BlockCategoryEnum,
  icon: 'bar-chart',
  properties: [
    prop('scoreType', 'text' as PropertyTypeEnum, 'Tipo de Score', 'primary'),
    prop('displayFormat', 'select' as PropertyTypeEnum, 'Formato', 'percentage', {
      validation: { options: [
        { value: 'percentage', label: 'Porcentagem' },
        { value: 'label', label: 'Rótulo' },
        { value: 'number', label: 'Número' },
      ]},
    }),
  ],
  defaultProperties: {
    scoreType: 'primary',
    displayFormat: 'percentage',
  },
  tags: ['result', 'score'],
});

/**
 * =================================================================
 * BLOCOS DE OFERTA (OFFER)
 * =================================================================
 */

BlockRegistry.register({
  type: 'offer-cta',
  name: 'Call-to-Action',
  description: 'Botão de ação principal da oferta',
  category: 'offer' as BlockCategoryEnum,
  icon: 'mouse-pointer',
  properties: [
    prop('text', 'text' as PropertyTypeEnum, 'Texto do Botão', 'Ver Oferta'),
    prop('url', 'url' as PropertyTypeEnum, 'URL de Destino', ''),
    prop('style', 'select' as PropertyTypeEnum, 'Estilo', 'primary', {
      validation: { options: [
        { value: 'primary', label: 'Primário' },
        { value: 'secondary', label: 'Secundário' },
      ]},
    }),
  ],
  defaultProperties: {
    text: 'Ver Oferta',
    url: '',
    style: 'primary',
  },
  tags: ['cta', 'button'],
});

/**
 * =================================================================
 * ALIASES - TIPOS LEGADOS
 * =================================================================
 * 
 * Mapeamento de tipos antigos para novos tipos oficiais.
 * Permite migração gradual sem quebrar código existente.
 * 
 * TODO Wave 2: Adicionar transformadores de propriedades
 */

// Aliases de introdução
BlockRegistry.registerAlias({
  legacyType: 'intro-hero',
  officialType: 'intro-logo-header',
});

BlockRegistry.registerAlias({
  legacyType: 'quiz-intro-header',
  officialType: 'intro-logo-header',
});

BlockRegistry.registerAlias({
  legacyType: 'hero-block',
  officialType: 'intro-logo-header',
});

BlockRegistry.registerAlias({
  legacyType: 'hero',
  officialType: 'intro-logo-header',
});

BlockRegistry.registerAlias({
  legacyType: 'welcome-form',
  officialType: 'intro-form',
});

BlockRegistry.registerAlias({
  legacyType: 'welcome-form-block',
  officialType: 'intro-form',
});

BlockRegistry.registerAlias({
  legacyType: 'heading',
  officialType: 'intro-title',
});

BlockRegistry.registerAlias({
  legacyType: 'title',
  officialType: 'intro-title',
});

BlockRegistry.registerAlias({
  legacyType: 'image-display-inline',
  officialType: 'intro-image',
});

// Aliases de resultado
BlockRegistry.registerAlias({
  legacyType: 'step20-result-header',
  officialType: 'result-header',
});

/**
 * =================================================================
 * EXPORTS
 * =================================================================
 */

export { BlockRegistry as default };
export type { BlockDefinition } from './types';
export type { BlockRegistryClass };

/**
 * =================================================================
 * EXTENSÕES - Quiz21 Complete
 * =================================================================
 * 
 * Registra blocos adicionais após a inicialização
 */
import { registerQuiz21Extensions } from './extensions';

// Registrar extensões após BlockRegistry estar pronto
registerQuiz21Extensions(BlockRegistry);
import { appLogger } from '@/lib/utils/appLogger';
