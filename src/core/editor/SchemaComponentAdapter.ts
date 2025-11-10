/**
 * 🔄 SCHEMA COMPONENT ADAPTER - FASE 2 Integração
 * 
 * Adapta BlockTypeSchema (JSON) para ComponentLibraryItem (Editor)
 * Permite carregar blocos dinamicamente no editor visual
 */

import { schemaInterpreter, BlockTypeSchema } from '@/core/schema/SchemaInterpreter';
import { Box, Type, Image, Square, Brain, Target, Layout as LayoutIcon } from 'lucide-react';
import { appLogger } from '@/lib/utils/appLogger';

// Mapeamento de categorias para ícones
const CATEGORY_ICONS: Record<string, any> = {
  content: Type,
  interactive: Square,
  layout: Box,
  media: Image,
  quiz: Brain,
};

export interface ComponentLibraryItem {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType;
  description: string;
  defaultElement: Partial<EditorElement>;
  preview: string;
  aiEnhanced?: boolean;
}

interface EditorElement {
  id: string;
  type: string;
  name: string;
  content?: any;
  properties?: Record<string, any>;
  styles?: Record<string, any>;
  behaviors?: Record<string, any>;
  children?: EditorElement[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  rotation?: number;
  scale?: number;
  locked?: boolean;
  visible?: boolean;
  layer?: number;
  tags?: string[];
}

/**
 * Converte BlockTypeSchema para ComponentLibraryItem
 */
export function schemaToComponentLibraryItem(
  schema: BlockTypeSchema
): ComponentLibraryItem {
  const defaultProps = schemaInterpreter.getDefaultProps(schema.type);

  return {
    id: schema.type,
    name: schema.label,
    category: capitalizeCategory(schema.category),
    icon: CATEGORY_ICONS[schema.category] || Box,
    description: schema.description || `Bloco do tipo ${schema.label}`,
    defaultElement: {
      type: schema.type,
      properties: defaultProps,
      content: {},
      styles: {},
      behaviors: {},
      children: [],
    },
    preview: `/previews/${schema.type}.svg`,
    aiEnhanced: schema.type.includes('quiz') || schema.type.includes('ai'),
  };
}

/**
 * Carrega todos os blocos do registry como ComponentLibraryItems
 */
export function loadComponentsFromRegistry(): ComponentLibraryItem[] {
  const categories = schemaInterpreter.getCategories();
  const items: ComponentLibraryItem[] = [];

  categories.forEach((category) => {
    const blocks = schemaInterpreter.getBlocksByCategory(category);
    blocks.forEach((schema) => {
      items.push(schemaToComponentLibraryItem(schema));
    });
  });

  appLogger.info(`[SchemaAdapter] Carregados ${items.length} componentes do registry`);
  return items;
}

/**
 * Agrupa componentes por categoria
 */
export function groupComponentsByCategory(
  items: ComponentLibraryItem[]
): Record<string, ComponentLibraryItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ComponentLibraryItem[]>);
}

/**
 * Cria EditorElement a partir de BlockTypeSchema
 */
export function createElementFromSchema(
  type: string,
  overrides?: Partial<EditorElement>
): EditorElement {
  const schema = schemaInterpreter.getBlockSchema(type);
  
  if (!schema) {
    throw new Error(`Schema não encontrado para tipo: ${type}`);
  }

  const defaultProps = schemaInterpreter.getDefaultProps(type);
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    type,
    name: schema.label,
    content: {},
    properties: defaultProps,
    styles: {},
    behaviors: {},
    children: [],
    position: { x: 0, y: 0 },
    size: { width: 300, height: 200 },
    rotation: 0,
    scale: 1,
    locked: false,
    visible: true,
    layer: 0,
    tags: [schema.category],
    ...overrides,
  };
}

/**
 * Helper: Capitaliza primeira letra de cada palavra
 */
function capitalizeCategory(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Valida se um elemento está conforme o schema
 */
export function validateElement(element: EditorElement): {
  valid: boolean;
  errors: string[];
} {
  return schemaInterpreter.validateProps(element.type, element.properties || {});
}
