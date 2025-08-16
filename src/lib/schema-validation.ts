// src/lib/schema-validation.ts

export interface ComponentInstance {
  id: string;
  component_type_key: string;
  funnel_id: string;
  step_number: number;
  instance_key: string;
  order_index: number;
  custom_styling?: any;
  content_data?: any;
}

export const validateComponentInstanceInsert = (data: any): ComponentInstance => {
  // Basic validation for component instance
  return {
    id: data.id || '',
    component_type_key: data.component_type_key || '',
    funnel_id: data.funnel_id || '',
    step_number: data.step_number || 0,
    instance_key: data.instance_key || '',
    order_index: data.order_index || 0,
    custom_styling: data.custom_styling,
    content_data: data.content_data
  };
};

// Alias for backward compatibility
export const validateComponentInstance = validateComponentInstanceInsert;
