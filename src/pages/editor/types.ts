/**
 * Editor Types - Tipos específicos do editor visual
 */

export interface EditorElement {
  id: string;
  type: string;
  name?: string;
  content?: any;
  properties?: Record<string, any>;
  styles?: Record<string, any>;
  behaviors?: Record<string, any>;
  visible?: boolean;
  locked?: boolean;
  children?: EditorElement[];
}

export interface EditorState {
  elements: EditorElement[];
  selectedId?: string;
}
