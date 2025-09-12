import { PropertyCategory, PropertyType } from '@/hooks/useUnifiedProperties';

export interface BaseProperty {
  key: string;
  type: PropertyType;
  label: string;
  category: PropertyCategory;
  value: any;
  defaultValue?: any;
  description?: string; // Add optional description property
  validation?: (value: any) => boolean | string;
}

export interface PropertyEditorProps {
  property: BaseProperty;
  onChange: (key: string, value: any) => void;
}

export interface PropertyMiddleware {
  beforeUpdate?: (value: any) => any;
  afterUpdate?: (value: any) => any;
  validate?: (value: any) => boolean;
}

export interface PropertyConfig {
  properties: BaseProperty[];
  middlewares: {
    beforeUpdate?: ((value: any) => any)[];
    validation?: ((property: BaseProperty) => boolean)[];
    afterUpdate?: ((property: BaseProperty) => any)[];
  };
}

export type PropertyEditorComponent = React.FC<PropertyEditorProps>;

export interface PropertyEditorRegistry {
  [key: string]: PropertyEditorComponent;
}
