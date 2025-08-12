import { useUnifiedProperties } from '@/hooks/useUnifiedProperties';
import React from 'react';
import type { BaseProperty, PropertyConfig } from './types';

export interface WithPropertyControlsProps {
  properties: BaseProperty[];
  onUpdate: (key: string, value: any) => void;
}

export const withPropertyControls = (
  WrappedComponent: React.FC<WithPropertyControlsProps>,
  config: Partial<PropertyConfig> = {}
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
      if (config.middlewares?.beforeUpdate) {
        for (const middleware of config.middlewares.beforeUpdate) {
          transformedValue = middleware(transformedValue);
        }
      }

      // Atualizar valor
      updateProperty(key, transformedValue);

      // Aplicar middlewares após atualização
      if (config.middlewares?.afterUpdate) {
        for (const middleware of config.middlewares.afterUpdate) {
          middleware({ key } as any);
        }
      }
    };

    return <WrappedComponent {...props} properties={properties} onUpdate={handleUpdate} />;
  };
};
