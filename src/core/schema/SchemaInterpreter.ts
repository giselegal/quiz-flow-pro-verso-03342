/**
 * 🎯 SCHEMA INTERPRETER - FASE 1 Registry Universal Dinâmico
 * 
 * Interpreta definições JSON de blocos e mapeia automaticamente
 * tipos de propriedades para controles visuais.
 * 
 * Elimina necessidade de criar componentes TSX para cada tipo de bloco.
 */

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'color' | 'image' | 'select' | 'json';
  control: 'text' | 'textarea' | 'number' | 'toggle' | 'color-picker' | 'image-upload' | 'dropdown' | 'json-editor';
  default?: any;
  options?: Array<{ label: string; value: any }>;
  label?: string;
  description?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
}

export interface BlockTypeSchema {
  type: string;
  label: string;
  category: 'content' | 'interactive' | 'layout' | 'media' | 'quiz';
  icon?: string;
  description?: string;
  properties: Record<string, PropertySchema>;
  defaultProps?: Record<string, any>;
  renderTemplate?: string; // HTML template com placeholders
}

export interface SchemaDefinition {
  version: string;
  blockTypes: Record<string, BlockTypeSchema>;
  globalStyles?: Record<string, any>;
  customControls?: Record<string, any>;
}

/**
 * Interpreta schemas JSON e retorna definições de blocos
 */
export class SchemaInterpreter {
  private schemas: Map<string, BlockTypeSchema> = new Map();
  private controls: Map<string, React.ComponentType<any>> = new Map();

  /**
   * Carrega definição de schema JSON
   */
  loadSchema(schema: SchemaDefinition): void {
    console.log(`[SchemaInterpreter] Carregando ${Object.keys(schema.blockTypes).length} tipos de blocos`);
    
    Object.entries(schema.blockTypes).forEach(([type, definition]) => {
      this.schemas.set(type, definition);
    });

    if (schema.customControls) {
      // Registrar controles customizados
      Object.entries(schema.customControls).forEach(([name, control]) => {
        // TODO: Implementar registro de controles customizados
      });
    }
  }

  /**
   * Obtém schema de um tipo de bloco
   */
  getBlockSchema(type: string): BlockTypeSchema | undefined {
    return this.schemas.get(type);
  }

  /**
   * Obtém todas as categorias de blocos disponíveis
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.schemas.forEach((schema) => {
      categories.add(schema.category);
    });
    return Array.from(categories);
  }

  /**
   * Obtém blocos de uma categoria específica
   */
  getBlocksByCategory(category: string): BlockTypeSchema[] {
    const blocks: BlockTypeSchema[] = [];
    this.schemas.forEach((schema) => {
      if (schema.category === category) {
        blocks.push(schema);
      }
    });
    return blocks;
  }

  /**
   * Gera props padrão para um tipo de bloco
   */
  getDefaultProps(type: string): Record<string, any> {
    const schema = this.schemas.get(type);
    if (!schema) return {};

    if (schema.defaultProps) return schema.defaultProps;

    const defaults: Record<string, any> = {};
    Object.entries(schema.properties).forEach(([key, prop]) => {
      if (prop.default !== undefined) {
        defaults[key] = prop.default;
      }
    });

    return defaults;
  }

  /**
   * Valida props de um bloco contra o schema
   */
  validateProps(type: string, props: Record<string, any>): {
    valid: boolean;
    errors: string[];
  } {
    const schema = this.schemas.get(type);
    if (!schema) {
      return { valid: false, errors: [`Schema não encontrado para tipo: ${type}`] };
    }

    const errors: string[] = [];

    Object.entries(schema.properties).forEach(([key, propSchema]) => {
      const value = props[key];

      // Verificar required
      if (propSchema.required && (value === undefined || value === null)) {
        errors.push(`Propriedade obrigatória ausente: ${key}`);
        return;
      }

      // Validação customizada
      if (value !== undefined && propSchema.validation?.custom) {
        const result = propSchema.validation.custom(value);
        if (result !== true && typeof result === 'string') {
          errors.push(result);
        }
      }
    });

    return { valid: errors.length === 0, errors };
  }

  /**
   * Obtém componente de controle para um tipo de propriedade
   */
  getControlComponent(control: string): React.ComponentType<any> | null {
    return this.controls.get(control) || null;
  }

  /**
   * Registra componente de controle customizado
   */
  registerControl(name: string, component: React.ComponentType<any>): void {
    this.controls.set(name, component);
  }

  /**
   * Exporta schema atual como JSON
   */
  exportSchema(): SchemaDefinition {
    const blockTypes: Record<string, BlockTypeSchema> = {};
    this.schemas.forEach((schema, type) => {
      blockTypes[type] = schema;
    });

    return {
      version: '1.0.0',
      blockTypes,
    };
  }

  /**
   * Limpa todos os schemas registrados
   */
  clear(): void {
    this.schemas.clear();
    this.controls.clear();
  }
}

// Instância singleton
export const schemaInterpreter = new SchemaInterpreter();
