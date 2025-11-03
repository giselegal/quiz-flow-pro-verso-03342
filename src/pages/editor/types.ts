/**
 * Editor Types - Tipos específicos do editor visual
 */

export interface EditorElement {
  id: string;
  type: string;
  content?: any;
  properties?: Record<string, any>;
  children?: EditorElement[];
}

export interface EditorState {
  elements: EditorElement[];
  selectedId?: string;
}
