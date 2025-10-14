/**
 * 🏗️ SCHEMA BUILDER - Helper para criação DRY de schemas
 * 
 * Fornece uma API fluente e type-safe para criar schemas de blocos
 * sem duplicação de código.
 */

import { BlockSchema, BlockFieldSchema, FieldGroup } from './types';

/**
 * Builder para criar schemas de forma fluente
 */
export class SchemaBuilder {
  private schema: Partial<BlockSchema> = {
    properties: [],
    groups: [],
  };

  constructor(type: string, label: string) {
    this.schema.type = type;
    this.schema.label = label;
  }

  /**
   * Define a descrição do bloco
   */
  description(text: string): this {
    this.schema.description = text;
    return this;
  }

  /**
   * Define o ícone do bloco
   */
  icon(iconName: string): this {
    this.schema.icon = iconName;
    return this;
  }

  /**
   * Define a categoria do bloco
   */
  category(cat: string): this {
    this.schema.category = cat;
    return this;
  }

  /**
   * Adiciona um grupo de campos
   */
  addGroup(
    id: string,
    label: string,
    options?: Partial<Omit<FieldGroup, 'id' | 'label'>>
  ): this {
    this.schema.groups!.push({
      id,
      label,
      ...options,
    });
    return this;
  }

  /**
   * Adiciona um campo individual
   */
  addField(field: BlockFieldSchema): this {
    this.schema.properties!.push(field);
    return this;
  }

  /**
   * Adiciona múltiplos campos
   */
  addFields(...fields: BlockFieldSchema[]): this {
    this.schema.properties!.push(...fields);
    return this;
  }

  /**
   * Adiciona campos de um preset
   */
  addPreset(presetFn: (group?: string) => BlockFieldSchema | BlockFieldSchema[]): this {
    const result = presetFn();
    if (Array.isArray(result)) {
      this.schema.properties!.push(...result);
    } else {
      this.schema.properties!.push(result);
    }
    return this;
  }

  /**
   * Marca o schema como deprecated
   */
  deprecated(replacedBy?: string): this {
    this.schema.deprecated = true;
    if (replacedBy) {
      this.schema.replacedBy = replacedBy;
    }
    return this;
  }

  /**
   * Define a versão do schema
   */
  version(v: string): this {
    this.schema.version = v;
    return this;
  }

  /**
   * Constrói e retorna o schema final
   */
  build(): BlockSchema {
    // Validação básica
    if (!this.schema.type || !this.schema.label) {
      throw new Error('Schema must have type and label');
    }

    // Ordena grupos por order
    this.schema.groups = this.schema.groups!.sort((a, b) => (a.order || 0) - (b.order || 0));

    return this.schema as BlockSchema;
  }
}

/**
 * Factory function para criar schemas
 */
export function createSchema(type: string, label: string): SchemaBuilder {
  return new SchemaBuilder(type, label);
}

/**
 * Helper para criar grupos padrão
 */
export const standardGroups = {
  content: { id: 'content', label: 'Conteúdo', order: 1 },
  style: { id: 'style', label: 'Estilo', order: 2 },
  layout: { id: 'layout', label: 'Layout', order: 3 },
  logic: { id: 'logic', label: 'Lógica', order: 4 },
  animation: { id: 'animation', label: 'Animação', order: 5 },
};

/**
 * Helper para adicionar grupos padrão
 */
export function addStandardGroups(builder: SchemaBuilder, ...groupIds: (keyof typeof standardGroups)[]): SchemaBuilder {
  groupIds.forEach(id => {
    const group = standardGroups[id];
    builder.addGroup(group.id, group.label, { order: group.order });
  });
  return builder;
}

/**
 * Template para schemas comuns
 */
export const templates = {
  /**
   * Template básico: conteúdo + estilo
   */
  basic: (type: string, label: string) => {
    return createSchema(type, label);
  },

  /**
   * Template completo: conteúdo + estilo + layout
   */
  full: (type: string, label: string) => {
    const builder = createSchema(type, label);
    return addStandardGroups(builder, 'content', 'style', 'layout');
  },

  /**
   * Template interativo: conteúdo + estilo + lógica
   */
  interactive: (type: string, label: string) => {
    const builder = createSchema(type, label);
    return addStandardGroups(builder, 'content', 'style', 'logic');
  },

  /**
   * Template animado: conteúdo + estilo + animação
   */
  animated: (type: string, label: string) => {
    const builder = createSchema(type, label);
    return addStandardGroups(builder, 'content', 'style', 'animation');
  },
};
