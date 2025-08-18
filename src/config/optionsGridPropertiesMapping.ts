// Tipo para as propriedades do OptionsGrid
export interface OptionsGridProperties {
  // Layout
  columns: number;
  gridGap: number;

  // Imagens
  showImages: boolean;
  imageSize: 'small' | 'medium' | 'large';
  imageWidth: number;
  imageHeight: number;
  imagePosition: 'top' | 'left' | 'right' | 'bottom';
  imageLayout: 'vertical' | 'horizontal';

  // Comportamento
  multipleSelection: boolean;
  maxSelections: number;
  minSelections: number;
  requiredSelections: number;
  allowDeselection: boolean;
  showSelectionCount: boolean;

  // Estilo
  backgroundColor: string;
  selectedColor: string;
  hoverColor: string;
  borderRadius: number;
  padding: number;

  // Opções
  options: Array<{
    id: string;
    text: string;
    imageUrl?: string;
    value?: string;
    category?: string;
  }>;
}

// Valores padrão
export const defaultOptionsGridProperties: OptionsGridProperties = {
  // Layout
  columns: 2,
  gridGap: 16,

  // Imagens
  showImages: true,
  imageSize: 'medium',
  imageWidth: 256,
  imageHeight: 256,
  imagePosition: 'top',
  imageLayout: 'vertical',

  // Comportamento
  multipleSelection: false,
  maxSelections: 1,
  minSelections: 1,
  requiredSelections: 1,
  allowDeselection: true,
  showSelectionCount: true,

  // Estilo
  backgroundColor: '#FFFFFF',
  selectedColor: '#B89B7A',
  hoverColor: '#D4C2A8',
  borderRadius: 8,
  padding: 16,

  // Opções
  options: [],
};

// Presets para diferentes casos de uso
export const optionsGridPresets = {
  styleQuiz: {
    ...defaultOptionsGridProperties,
    columns: 2,
    showImages: true,
    imageSize: 'large' as const,
    multipleSelection: false,
    maxSelections: 1,
    minSelections: 1,
    requiredSelections: 1,
  },

  multipleChoice: {
    ...defaultOptionsGridProperties,
    columns: 1,
    showImages: false,
    multipleSelection: true,
    maxSelections: 3,
    minSelections: 1,
    requiredSelections: 1,
  },

  productGrid: {
    ...defaultOptionsGridProperties,
    columns: 3,
    showImages: true,
    imageSize: 'medium' as const,
    multipleSelection: true,
    maxSelections: 5,
    minSelections: 1,
    requiredSelections: 1,
    gridGap: 24,
  },
};

// Utilitários
export const optionsGridUtils = {
  // Validação básica das propriedades
  validateProperties: (props: Partial<OptionsGridProperties>) => {
    const errors: string[] = [];

    if (props.columns && (props.columns < 1 || props.columns > 4)) {
      errors.push('Colunas devem estar entre 1 e 4');
    }

    if (props.maxSelections && props.minSelections && props.maxSelections < props.minSelections) {
      errors.push('Máximo de seleções deve ser maior ou igual ao mínimo');
    }

    if (props.gridGap && props.gridGap < 0) {
      errors.push('Espaçamento não pode ser negativo');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Mescla props personalizadas com preset
  mergeWithPreset: (
    presetName: keyof typeof optionsGridPresets,
    customProps: Partial<OptionsGridProperties>
  ): OptionsGridProperties => {
    const preset = optionsGridPresets[presetName];
    return {
      ...preset,
      ...customProps,
      options: customProps.options || preset.options,
    };
  },

  // Otimização para dispositivo
  getDeviceOptimizedProps: (
    device: 'mobile' | 'tablet' | 'desktop',
    props: OptionsGridProperties
  ): Partial<OptionsGridProperties> => {
    switch (device) {
      case 'mobile':
        return {
          ...props,
          columns: Math.min(props.columns, 2),
          imageSize: props.imageSize === 'large' ? 'medium' : props.imageSize,
          gridGap: Math.max(8, props.gridGap - 4),
        };
      case 'tablet':
        return {
          ...props,
          columns: Math.min(props.columns, 3),
        };
      default:
        return props;
    }
  },

  // Calcula dimensões de imagem baseado no tamanho
  getImageDimensions: (size: 'small' | 'medium' | 'large'): { width: number; height: number } => {
    const sizes = {
      small: { width: 200, height: 200 },
      medium: { width: 256, height: 256 },
      large: { width: 300, height: 300 },
    };
    return sizes[size];
  },
};
