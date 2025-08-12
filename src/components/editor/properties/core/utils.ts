import type { BaseProperty, PropertyMiddleware } from './types';

export const validateProperty = (property: BaseProperty): boolean => {
  if (!property.key || property.value === undefined) return false;

  if (property.validation) {
    const result = property.validation(property.value);
    return typeof result === 'boolean' ? result : false;
  }

  return true;
};

export const applyMiddlewares = (value: any, middlewares: PropertyMiddleware[]): any => {
  let result = value;

  // Aplicar transformações before
  for (const middleware of middlewares) {
    if (middleware.beforeUpdate) {
      result = middleware.beforeUpdate(result);
    }
  }

  // Aplicar validações
  for (const middleware of middlewares) {
    if (middleware.validate && !middleware.validate(result)) {
      return value; // Retorna valor original se falhar validação
    }
  }

  // Aplicar transformações after
  for (const middleware of middlewares) {
    if (middleware.afterUpdate) {
      result = middleware.afterUpdate(result);
    }
  }

  return result;
};

export const createPropertyConfig = (
  key: string,
  defaultValue: any,
  middlewares: PropertyMiddleware[] = []
) => ({
  key,
  defaultValue,
  middlewares,
});

// Utilitário para gerar IDs únicos
export const generatePropertyId = () => `prop_${Math.random().toString(36).substr(2, 9)}`;

// Cache de propriedades para otimização
const propertyCache = new Map<string, BaseProperty>();

export const getCachedProperty = (key: string): BaseProperty | undefined => propertyCache.get(key);

export const setCachedProperty = (key: string, property: BaseProperty): void => {
  propertyCache.set(key, property);
}; // Utilitário para agrupar propriedades por categoria
export const groupPropertiesByCategory = (properties: BaseProperty[]) => {
  return properties.reduce(
    (acc, property) => {
      const category = property.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(property);
      return acc;
    },
    {} as Record<string, BaseProperty[]>
  );
};
