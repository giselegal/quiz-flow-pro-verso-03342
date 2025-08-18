import { Block } from '@/types/editor';

/**
 * Props base para todos os editores de propriedades
 */
export interface PropertyEditorProps {
  /** Bloco sendo editado */
  block: Block;
  /** Callback para atualizar propriedades do bloco */
  onUpdate: (updates: Record<string, any>) => void;
  /** Callback opcional para validação */
  onValidate?: (isValid: boolean) => void;
  /** Se está em modo preview */
  isPreviewMode?: boolean;
}

/**
 * Configuração de uma propriedade individual
 */
export interface PropertyConfig {
  /** Nome da propriedade */
  name: string;
  /** Tipo do input */
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'number' | 'array' | 'color';
  /** Label exibido */
  label: string;
  /** Se é obrigatória */
  required: boolean;
  /** Opções para select */
  options?: string[];
  /** Valor mínimo para number */
  min?: number;
  /** Valor máximo para number */
  max?: number;
  /** Step para number */
  step?: number;
  /** Placeholder */
  placeholder?: string;
  /** Tipo do item para arrays */
  itemType?: string;
}

/**
 * Configuração completa de um editor de bloco
 */
export interface BlockEditorConfig {
  /** Prioridade do bloco (quanto mais usado) */
  priority: number;
  /** Lista de propriedades editáveis */
  properties: PropertyConfig[];
  /** Nome do componente editor */
  editorComponent: string;
  /** Categoria do bloco */
  category: 'content' | 'form' | 'interaction' | 'navigation' | 'media';
}

/**
 * Registro completo de editores
 */
export interface PropertyEditorRegistry {
  [blockType: string]: BlockEditorConfig;
}

/**
 * Props para componentes de input específicos
 */
export interface PropertyInputProps {
  /** Label do campo */
  label: string;
  /** Valor atual */
  value: any;
  /** Callback de mudança */
  onChange: (value: any) => void;
  /** Se é obrigatório */
  required?: boolean;
  /** Se está com erro */
  error?: boolean;
  /** Mensagem de erro */
  errorMessage?: string;
  /** Placeholder */
  placeholder?: string;
  /** Se está desabilitado */
  disabled?: boolean;
}
