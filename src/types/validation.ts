export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  errors?: ValidationError[];
}

export interface TemplateValidationResult {
  isValid: boolean;
  errors: Record<string, Record<string, ValidationError[]>>;
}

export interface FieldValidationResult {
  success: boolean;
  errors?: ValidationError[];
}

export interface ValidationService {
  validateTemplate: (
    blocks: Array<{
      id: string;
      type: string;
      values: Record<string, unknown>;
    }>
  ) => TemplateValidationResult;

  validateStep: (
    stepId: string,
    blocks: Array<{
      id: string;
      type: string;
      values: Record<string, unknown>;
    }>
  ) => TemplateValidationResult;

  validateTemplateField: (
    blockId: string,
    fieldId: string,
    value: unknown,
    blockType: string
  ) => ValidationResult;

  hasTemplateErrors: boolean;
}
