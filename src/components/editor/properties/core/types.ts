import { PropertyCategory, PropertyType } from '@/hooks/useUnifiedProperties';

export interface BaseProperty {
  key: string;
  type: PropertyType;
  label: string;
  category: PropertyCategory;
  value: any;
  defaultValue?: any;
  description?: string;
  validation?: (value: any) => boolean | string;
}

// Specific property types for enhanced editors
export interface ScoreValuesProperty extends Omit<BaseProperty, 'type'> {
  type: 'scoreValues';
  value: Array<{ value: number; label: string }>;
}

export interface EnhancedUploadProperty extends Omit<BaseProperty, 'type'> {
  type: 'enhancedUpload';
  value: { type: 'file' | 'url'; url: string; name?: string; size?: number } | null;
  accept?: string;
  maxSize?: number;
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
