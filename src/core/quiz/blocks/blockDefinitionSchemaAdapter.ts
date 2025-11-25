import type { BlockDefinition, BlockPropertyDefinition } from './types';
import { PropertyTypeEnum } from './types';
import type { BlockTypeSchema, PropertySchema } from '@/core/schema/SchemaInterpreter';

const CATEGORY_FALLBACK: BlockTypeSchema['category'] = 'content';

const propertyTypeToSchema = (property: BlockPropertyDefinition): Pick<PropertySchema, 'type' | 'control'> => {
  switch (property.type) {
    case PropertyTypeEnum.TEXT:
    case PropertyTypeEnum.URL:
      return { type: 'string', control: 'text' };
    case PropertyTypeEnum.TEXTAREA:
      return { type: 'string', control: 'textarea' };
    case PropertyTypeEnum.NUMBER:
      return { type: 'number', control: 'number' };
    case PropertyTypeEnum.BOOLEAN:
      return { type: 'boolean', control: 'toggle' };
    case PropertyTypeEnum.COLOR:
      return { type: 'color', control: 'color-picker' };
    case PropertyTypeEnum.SELECT:
      return { type: 'select', control: 'dropdown' };
    case PropertyTypeEnum.MULTISELECT:
      return { type: 'json', control: 'options-list' };
    case PropertyTypeEnum.RANGE:
      return { type: 'number', control: 'range' };
    case PropertyTypeEnum.JSON:
    case PropertyTypeEnum.ARRAY:
    case PropertyTypeEnum.OBJECT:
      return { type: 'json', control: 'json-editor' };
    default:
      return { type: 'string', control: 'text' };
  }
};

const normalizeOptions = (property: BlockPropertyDefinition): PropertySchema['options'] => {
  if (!property.validation?.options) return undefined;

  if (Array.isArray(property.validation.options)) {
    return property.validation.options.map((option) => {
      if (typeof option === 'string') {
        return { label: option, value: option };
      }
      return {
        label: option.label ?? String(option.value),
        value: option.value,
      };
    });
  }

  if (typeof property.validation.options === 'string') {
    return [{ label: property.validation.options, value: property.validation.options }];
  }

  return undefined;
};

const normalizeCategory = (category?: string): BlockTypeSchema['category'] => {
  if (!category) return CATEGORY_FALLBACK;
  const normalized = category.toLowerCase();
  if (
    normalized === 'content' ||
    normalized === 'interactive' ||
    normalized === 'layout' ||
    normalized === 'media' ||
    normalized === 'quiz'
  ) {
    return normalized;
  }
  return CATEGORY_FALLBACK;
};

export const blockDefinitionToSchema = (definition: BlockDefinition): BlockTypeSchema => {
  const properties: Record<string, PropertySchema> = {};

  definition.properties.forEach((property) => {
    const typeInfo = propertyTypeToSchema(property);
    properties[property.key] = {
      ...typeInfo,
      label: property.label,
      description: property.description,
      default: property.defaultValue,
      required: property.required,
      validation: {
        min: property.validation?.min,
        max: property.validation?.max,
        pattern: property.validation?.pattern,
        enum: Array.isArray(property.validation?.options)
          ? property.validation?.options
              .filter((option): option is string => typeof option === 'string')
          : undefined,
      },
      options: normalizeOptions(property),
    };
  });

  return {
    type: definition.type,
    label: definition.name,
    category: normalizeCategory(definition.category),
    icon: definition.icon,
    description: definition.description,
    properties,
    defaultProps: definition.defaultProperties,
  };
};
