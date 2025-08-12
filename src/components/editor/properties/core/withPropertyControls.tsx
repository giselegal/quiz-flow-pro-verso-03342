import { useUnifiedProperties } from '@/hooks/useUnifiedProperties';
import React from 'react';
import type { BaseProperty, PropertyConfig } from './types';

export interface WithPropertyControlsProps {
  properties: BaseProperty[];
  onUpdate: (key: string, value: any) => void;
}

export const withPropertyControls = (
  WrappedComponent: React.FC<WithPropertyControlsProps>,
  config: PropertyConfig = {}
) => {
  return (props: any) => {
    const { properties, updateProperty } = useUnifiedProperties(
      props.blockType,
      props.blockId,
      props.block
    );

    const handleUpdate = (key: string, value: any) => {
      // Aplicar middlewares antes da atualização
      let transformedValue = value;
      if (config.middleware) {
        for (const middleware of config.middleware) {
          if (middleware.beforeUpdate) {
            transformedValue = middleware.beforeUpdate(transformedValue);
          }
        }
      }

      // Aplicar validações configuradas
      if (config.validators && config.validators[key]) {
        const isValid = config.validators[key](transformedValue);
        if (!isValid) return;
      }

      // Aplicar transformadores específicos
      if (config.transformers && config.transformers[key]) {
        transformedValue = config.transformers[key](transformedValue);
      }

      // Atualizar valor
      updateProperty(key, transformedValue);

      // Aplicar middlewares após atualização
      if (config.middleware) {
        for (const middleware of config.middleware) {
          if (middleware.afterUpdate) {
            middleware.afterUpdate(transformedValue);
          }
        }
      }
    };

    return <WrappedComponent {...props} properties={properties} onUpdate={handleUpdate} />;
  };
};
