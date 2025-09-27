/**
 * Configuração específica para componentes de questões com opções e imagens
 * Baseado na análise do OptionsGridBlock e layout responsivo
 */

export interface OptionItem {
  id: string;
  text: string;
  value: string;
  imageUrl?: string;
  category?: string;
}

export interface OptionsGridConfig {
  title: string;
  options: OptionItem[];
  columns: 1 | 2 | 3 | 4 | 'auto'; // 'auto' detecta automaticamente baseado nas imagens
  showImages: boolean;
  imageSize: 'small' | 'medium' | 'large';
  multipleSelection: boolean;
  maxSelections: number;
  minSelections: number;
  validationMessage: string;
  gridGap: number;
  selectedOptions: string[];
}

/**
 * Sistema de tamanhos de imagem responsivos
 */
export const IMAGE_SIZE_CLASSES = {
  small: {
    mobile: 'h-32', // 128px
    tablet: 'sm:h-40', // 160px
    desktop: 'md:h-44', // 176px
    xl: 'lg:h-48', // 192px
  },
  medium: {
    mobile: 'h-40', // 160px
    tablet: 'sm:h-48', // 192px
    desktop: 'md:h-52', // 208px
    xl: 'lg:h-56', // 224px
  },
  large: {
    mobile: 'h-48', // 192px
    tablet: 'sm:h-56', // 224px
    desktop: 'md:h-60', // 240px
    xl: 'lg:h-64', // 256px
  },
};

/**
 * Configurações de layout responsivo para grids
 */
export const GRID_LAYOUT_CONFIG = {
  withImages: {
    mobile: 'grid-cols-1',
    tablet: 'sm:grid-cols-2',
    desktop: 'md:grid-cols-2', // Máximo 2 colunas para imagens
  },
  textOnly: {
    mobile: 'grid-cols-1',
    tablet: 'sm:grid-cols-1',
    desktop: 'md:grid-cols-1', // Sempre 1 coluna para melhor legibilidade
  },
};

/**
 * Configurações de aspecto dos cards
 */
export const CARD_ASPECT_CONFIG = {
  withImages: {
    aspectRatio: 'aspect-[3/4]', // 75% - mais quadrado
    minHeight: 'auto',
    padding: 'py-1 px-1 sm:px-2',
  },
  textOnly: {
    aspectRatio: 'aspect-auto',
    minHeight: 'min-h-[60px]',
    padding: 'py-3 px-4',
  },
};

/**
 * Sistema de cores do tema para opções
 */
export const OPTIONS_THEME_COLORS = {
  primary: '#B89B7A',
  primaryLight: '#D4C4A0',
  background: '#FAF9F7',
  neutral: '#zinc-200',
  text: '#432818',
  textSecondary: '#8F7A6A',
  overlay: 'bg-opacity-20',
  error: '#ef4444',
  success: '#22c55e',
};

/**
 * Configurações de estados visuais
 */
export const VISUAL_STATES_CONFIG = {
  default: {
    border: 'border-zinc-200',
    background: 'bg-white',
    shadow: 'shadow-sm',
    transform: 'scale-100',
  },
  hover: {
    border: 'hover:border-[#B89B7A]',
    background: 'hover:bg-[#FAF9F7]',
    shadow: 'hover:shadow-lg',
    transform: 'hover:scale-[1.02]',
  },
  selected: {
    border: 'border-[#B89B7A]',
    background: 'bg-[#FAF9F7]',
    shadow: 'shadow-lg',
    transform: 'scale-[1.02]',
  },
  disabled: {
    opacity: 'opacity-50',
    cursor: 'cursor-not-allowed',
    pointerEvents: 'pointer-events-none',
  },
};

/**
 * Configurações de animação e transição
 */
export const ANIMATION_CONFIG = {
  transition: 'transition-all duration-300 ease-in-out',
  selectionIndicator: {
    animation: 'animate-pulse',
    size: 'w-5 h-5 sm:w-6 sm:h-6',
    position: 'absolute top-2 right-2',
    background: 'bg-[#B89B7A]',
    iconSize: 'w-3 h-3 sm:w-4 sm:h-4',
  },
  overlay: {
    transition: 'transition-opacity duration-300',
    background: 'bg-[#B89B7A] bg-opacity-20',
    borderRadius: 'rounded-t-lg',
  },
};

/**
 * Configurações de espaçamento responsivo
 */
export const SPACING_CONFIG = {
  container: {
    padding: 'py-2 sm:py-3 md:py-4',
    spacing: 'space-y-3 sm:space-y-4',
  },
  grid: {
    mobile: 'gap-3',
    tablet: 'sm:gap-4',
    desktop: 'md:gap-5',
  },
  cards: {
    withImages: {
      padding: 'py-1 px-1 sm:px-2',
      textSize: 'text-xs sm:text-sm',
      leading: 'leading-tight',
    },
    textOnly: {
      padding: 'py-2 px-3',
      textSize: 'text-sm sm:text-base',
      leading: 'leading-relaxed',
    },
  },
  title: {
    margin: 'mb-3 sm:mb-4 md:mb-6',
    padding: 'px-1 sm:px-2',
    textSize: 'text-lg sm:text-xl md:text-2xl',
  },
};

/**
 * Configurações de acessibilidade
 */
export const ACCESSIBILITY_CONFIG = {
  button: {
    role: 'button',
    type: 'button',
    focusVisible:
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89B7A] focus-visible:ring-offset-2',
  },
  image: {
    alt: 'text',
    width: '256',
    height: '256',
    loading: 'lazy' as const,
  },
  touchTarget: {
    minSize: '44px', // Mínimo recomendado para touch
    class: 'touch-manipulation',
  },
};

/**
 * Configurações de validação
 */
export const VALIDATION_CONFIG = {
  messages: {
    selectMinimum: (min: number) => `Selecione pelo menos ${min} opção(ões)`,
    selectMaximum: (max: number) => `Máximo de ${max} seleções permitidas`,
    selectRequired: 'Selecione uma opção para continuar',
  },
  styles: {
    error: {
      container: 'mt-2 sm:mt-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-md',
      text: 'text-sm sm:text-base text-red-600',
    },
    info: {
      container: 'mt-2 sm:mt-3 p-2 sm:p-3 bg-[#FAF9F7] border border-[#B89B7A]/20 rounded-md',
      text: 'text-sm sm:text-base text-[#8F7A6A]',
    },
  },
};

/**
 * Configurações padrão para diferentes casos de uso
 */
export const PRESET_CONFIGS = {
  /**
   * Quiz de estilo com imagens grandes
   */
  styleQuizWithImages: {
    title: 'Qual estilo combina mais com você?',
    columns: 'auto', // Auto-detecta: 2 com imagens, 1 só texto
    showImages: true,
    imageSize: 'large',
    multipleSelection: false,
    maxSelections: 1,
    minSelections: 1,
    validationMessage: 'Selecione o estilo que mais combina com você',
    gridGap: 20,
  } as Partial<OptionsGridConfig>,

  /**
   * Pesquisa de satisfação com múltipla escolha
   */
  satisfactionSurvey: {
    title: 'Quais recursos você mais utiliza? (Selecione até 3)',
    columns: 1,
    showImages: false,
    multipleSelection: true,
    maxSelections: 3,
    minSelections: 1,
    validationMessage: 'Selecione de 1 a 3 recursos',
    gridGap: 12,
  } as Partial<OptionsGridConfig>,

  /**
   * Seleção de produtos com imagens médias
   */
  productSelection: {
    title: 'Escolha seus produtos favoritos:',
    columns: 3,
    showImages: true,
    imageSize: 'medium',
    multipleSelection: true,
    maxSelections: 5,
    minSelections: 1,
    validationMessage: 'Selecione pelo menos um produto',
    gridGap: 16,
  } as Partial<OptionsGridConfig>,

  /**
   * Quiz de personalidade simples
   */
  personalityQuiz: {
    title: 'Como você se definiria?',
    columns: 1,
    showImages: false,
    multipleSelection: false,
    maxSelections: 1,
    minSelections: 1,
    validationMessage: 'Selecione a opção que melhor te define',
    gridGap: 8,
  } as Partial<OptionsGridConfig>,
};

/**
 * Utilitários para configuração de opções com imagens
 */
export class OptionsGridUtils {
  /**
   * Detecta automaticamente se as opções contêm imagens
   */
  static hasImages(options: OptionItem[]): boolean {
    return options.some(option => option.imageUrl && option.imageUrl.trim() !== '');
  }

  /**
   * Retorna as classes CSS do grid baseado no conteúdo
   */
  static getGridClasses(options: OptionItem[]): string {
    const hasImages = this.hasImages(options);

    if (hasImages) {
      return `${GRID_LAYOUT_CONFIG.withImages.mobile} ${GRID_LAYOUT_CONFIG.withImages.tablet}`;
    } else {
      return GRID_LAYOUT_CONFIG.textOnly.mobile;
    }
  }

  /**
   * Retorna as classes de altura da imagem baseado no tamanho
   */
  static getImageHeightClasses(size: 'small' | 'medium' | 'large'): string {
    const config = IMAGE_SIZE_CLASSES[size];
    return `${config.mobile} ${config.tablet} ${config.desktop} ${config.xl}`;
  }

  /**
   * Retorna a configuração de aspecto do card
   */
  static getCardAspectConfig(hasImage: boolean) {
    return hasImage ? CARD_ASPECT_CONFIG.withImages : CARD_ASPECT_CONFIG.textOnly;
  }

  /**
   * Gera URL de fallback para imagens quebradas
   */
  static getFallbackImageUrl(
    text: string = 'Erro',
    width: number = 256,
    height: number = 256
  ): string {
    return `https://placehold.co/${width}x${height}/cccccc/333333?text=${encodeURIComponent(text)}`;
  }

  /**
   * Valida configuração de opções
   */
  static validateConfig(config: Partial<OptionsGridConfig>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!config.options || config.options.length === 0) {
      errors.push('Pelo menos uma opção é obrigatória');
    }

    if (
      config.maxSelections &&
      config.minSelections &&
      config.maxSelections < config.minSelections
    ) {
      errors.push('maxSelections deve ser maior ou igual a minSelections');
    }

    if (config.columns && config.columns !== 'auto' && (typeof config.columns === 'number' && (config.columns < 1 || config.columns > 4))) {
      errors.push('columns deve estar entre 1 e 4, ou usar "auto"');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Mescla configuração personalizada com preset
   */
  static mergeWithPreset(
    presetName: keyof typeof PRESET_CONFIGS,
    customConfig: Partial<OptionsGridConfig>
  ): OptionsGridConfig {
    const preset = PRESET_CONFIGS[presetName];
    return {
      ...preset,
      ...customConfig,
      options: customConfig.options || [],
    } as OptionsGridConfig;
  }

  /**
   * Gera configuração otimizada para dispositivo
   */
  static getDeviceOptimizedConfig(
    device: 'mobile' | 'tablet' | 'desktop',
    baseConfig: OptionsGridConfig
  ): Partial<OptionsGridConfig> {
    const optimizations = {
      mobile: {
        columns: baseConfig.columns === 'auto' ? ('auto' as const) : Math.min(baseConfig.columns as number, 2) as 1 | 2 | 3 | 4,
        imageSize: baseConfig.imageSize === 'large' ? ('medium' as const) : baseConfig.imageSize,
        gridGap: Math.max(8, baseConfig.gridGap - 4),
      },
      tablet: {
        columns: baseConfig.columns === 'auto' ? ('auto' as const) : Math.min(baseConfig.columns as number, 3) as 1 | 2 | 3 | 4,
        imageSize: baseConfig.imageSize,
        gridGap: baseConfig.gridGap,
      },
      desktop: {
        columns: baseConfig.columns,
        imageSize: baseConfig.imageSize,
        gridGap: Math.min(24, baseConfig.gridGap + 4),
      },
    };

    return optimizations[device];
  }
}

export default {
  IMAGE_SIZE_CLASSES,
  GRID_LAYOUT_CONFIG,
  CARD_ASPECT_CONFIG,
  OPTIONS_THEME_COLORS,
  VISUAL_STATES_CONFIG,
  ANIMATION_CONFIG,
  SPACING_CONFIG,
  ACCESSIBILITY_CONFIG,
  VALIDATION_CONFIG,
  PRESET_CONFIGS,
  OptionsGridUtils,
};
