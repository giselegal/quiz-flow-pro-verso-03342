
export interface EditableContent {
  text?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: string[];
  question?: string;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  type?: 'text' | 'multiple_choice' | 'single_choice' | 'rating';
  required?: boolean;
  hint?: string;
  tags?: string[];
  
  // Additional properties that were missing
  textColor?: string;
  src?: string;
  height?: string;
  author?: string;
  
  // Style properties
  style?: {
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    textAlign?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    boxShadow?: string;
    letterSpacing?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    objectFit?: string;
    [key: string]: any;
  };
  
  [key: string]: any;
}

export interface EditorBlock {
  id: string;
  type: string;
  content: EditableContent;
  order: number;
}

export interface EditorConfig {
  blocks: EditorBlock[];
  settings?: {
    title?: string;
    description?: string;
    theme?: string;
  };
}
