// blockSchemas.ts - Configurações de blocos para o editor

export type BlockType =
  | 'text'
  | 'header'
  | 'button'
  | 'image'
  | 'spacer'
  | 'richtext'
  | 'quiz_step';

export interface BaseBlockData {
  id: string;
  type: BlockType;
}

export interface TextBlockData extends BaseBlockData {
  type: 'text';
  text: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
}

export interface HeaderBlockData extends BaseBlockData {
  type: 'header';
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
}

export interface ButtonBlockData extends BaseBlockData {
  type: 'button';
  text: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  link?: string;
}

export interface ImageBlockData extends BaseBlockData {
  type: 'image';
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export interface SpacerBlockData extends BaseBlockData {
  type: 'spacer';
  height: number;
}

export interface RichTextBlockData extends BaseBlockData {
  type: 'richtext';
  content: string;
}

export interface QuizStepBlockData extends BaseBlockData {
  type: 'quiz_step';
  question: string;
  options: Array<{
    id: string;
    text: string;
    points?: Record<string, number>;
  }>;
}

export type BlockData =
  | TextBlockData
  | HeaderBlockData
  | ButtonBlockData
  | ImageBlockData
  | SpacerBlockData
  | RichTextBlockData
  | QuizStepBlockData;

// Schema para validação dos blocos
export const blockSchemas = {
  text: {
    type: 'text' as const,
    defaultData: {
      text: 'Novo texto',
      fontSize: 16,
      fontWeight: 'normal' as const,
      textAlign: 'left' as const,
      color: '#000000',
    },
  },
  header: {
    type: 'header' as const,
    defaultData: {
      text: 'Novo cabeçalho',
      level: 2 as const,
      textAlign: 'left' as const,
      color: '#000000',
    },
  },
  button: {
    type: 'button' as const,
    defaultData: {
      text: 'Clique aqui',
      variant: 'primary' as const,
      size: 'md' as const,
      fullWidth: false,
      link: '',
    },
  },
  image: {
    type: 'image' as const,
    defaultData: {
      src: '',
      alt: 'Imagem',
      width: 400,
      height: 300,
      objectFit: 'cover' as const,
    },
  },
  spacer: {
    type: 'spacer' as const,
    defaultData: {
      height: 20,
    },
  },
  richtext: {
    type: 'richtext' as const,
    defaultData: {
      content: '<p>Texto rico editável</p>',
    },
  },
  quiz_step: {
    type: 'quiz_step' as const,
    defaultData: {
      question: 'Nova pergunta',
      options: [
        { id: '1', text: 'Opção 1', points: {} },
        { id: '2', text: 'Opção 2', points: {} },
      ],
    },
  },
};

export default blockSchemas;
