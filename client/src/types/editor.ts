
export interface EditorBlock {
  id: string;
  type: string;
  content: any;
  order: number;
}

export interface Block extends EditorBlock {}

export interface EditableContent {
  [key: string]: any;
}

export interface EditorConfig {
  blocks: EditorBlock[];
  title?: string;
  description?: string;
  settings?: any;
}
