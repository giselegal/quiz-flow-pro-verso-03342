/**
 * 🎨 SISTEMA DE TEMAS PARA QUIZ INTERATIVO
 *
 * Refinamentos visuais e de UX para diferentes contextos
 */

export type QuizTheme = 'default' | 'elegant' | 'modern' | 'minimal' | 'colorful';

export const QUIZ_THEMES = {
  default: {
    name: 'Padrão',
    description: 'Tema equilibrado para uso geral',
    colors: {
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      secondary: 'bg-gray-100',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      background: 'bg-gray-50',
      surface: 'bg-white',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
    },
    spacing: {
      container: 'max-w-4xl mx-auto px-4',
      section: 'mb-8',
      element: 'mb-4',
    },
    borderRadius: 'rounded-lg',
    shadows: 'shadow-lg',
    animations: 'transition-all duration-300',
  },

  elegant: {
    name: 'Elegante',
    description: 'Sofisticado para público executivo',
    colors: {
      primary: 'bg-slate-800',
      primaryHover: 'hover:bg-slate-900',
      secondary: 'bg-slate-100',
      success: 'bg-emerald-600',
      warning: 'bg-amber-600',
      error: 'bg-rose-600',
      background: 'bg-slate-50',
      surface: 'bg-white',
      text: 'text-slate-900',
      textSecondary: 'text-slate-600',
    },
    spacing: {
      container: 'max-w-3xl mx-auto px-6',
      section: 'mb-12',
      element: 'mb-6',
    },
    borderRadius: 'rounded-xl',
    shadows: 'shadow-2xl',
    animations: 'transition-all duration-500',
  },

  modern: {
    name: 'Moderno',
    description: 'Vibrante para público jovem',
    colors: {
      primary: 'bg-gradient-to-r from-purple-600 to-pink-600',
      primaryHover: 'hover:from-purple-700 hover:to-pink-700',
      secondary: 'bg-gray-100',
      success: 'bg-green-400',
      warning: 'bg-yellow-400',
      error: 'bg-red-400',
      background: 'bg-gradient-to-br from-purple-50 to-pink-50',
      surface: 'bg-white/80 backdrop-blur-sm',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
    },
    spacing: {
      container: 'max-w-5xl mx-auto px-4',
      section: 'mb-10',
      element: 'mb-5',
    },
    borderRadius: 'rounded-2xl',
    shadows: 'shadow-xl',
    animations: 'transition-all duration-300 ease-out',
  },

  minimal: {
    name: 'Minimalista',
    description: 'Limpo e focado no conteúdo',
    colors: {
      primary: 'bg-black',
      primaryHover: 'hover:bg-gray-800',
      secondary: 'bg-gray-50',
      success: 'bg-gray-800',
      warning: 'bg-gray-600',
      error: 'bg-gray-900',
      background: 'bg-white',
      surface: 'bg-gray-50',
      text: 'text-black',
      textSecondary: 'text-gray-500',
    },
    spacing: {
      container: 'max-w-2xl mx-auto px-4',
      section: 'mb-16',
      element: 'mb-8',
    },
    borderRadius: 'rounded-none',
    shadows: 'shadow-sm',
    animations: 'transition-opacity duration-200',
  },

  colorful: {
    name: 'Colorido',
    description: 'Divertido para público infantil',
    colors: {
      primary: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
      primaryHover: 'hover:from-blue-600 hover:via-purple-600 hover:to-pink-600',
      secondary: 'bg-yellow-100',
      success: 'bg-green-400',
      warning: 'bg-orange-400',
      error: 'bg-red-400',
      background: 'bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50',
      surface: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
    },
    spacing: {
      container: 'max-w-4xl mx-auto px-4',
      section: 'mb-8',
      element: 'mb-4',
    },
    borderRadius: 'rounded-3xl',
    shadows: 'shadow-2xl',
    animations: 'transition-all duration-500 ease-bounce',
  },
};

/**
 * 🎯 CONFIGURAÇÕES DE ANIMAÇÃO
 */
export const ANIMATION_CONFIGS = {
  pageTransition: {
    enter: 'transform transition-all duration-500 ease-out',
    enterFrom: 'opacity-0 translate-x-8',
    enterTo: 'opacity-100 translate-x-0',
    leave: 'transform transition-all duration-300 ease-in',
    leaveFrom: 'opacity-100 translate-x-0',
    leaveTo: 'opacity-0 -translate-x-8',
  },

  fadeIn: {
    enter: 'transition-opacity duration-300',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
  },

  slideUp: {
    enter: 'transform transition-all duration-400 ease-out',
    enterFrom: 'opacity-0 translate-y-4',
    enterTo: 'opacity-100 translate-y-0',
  },

  bounce: {
    enter: 'transition-transform duration-300 ease-out',
    action: 'hover:scale-105 active:scale-95',
  },

  pulse: {
    action: 'animate-pulse',
  },
};

/**
 * 🎨 PALETAS DE CORES PREDEFINIDAS
 */
export const COLOR_PALETTES = {
  business: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
  creative: ['#7c3aed', '#a855f7', '#c084fc', '#d8b4fe', '#f3e8ff'],
  nature: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#d1fae5'],
  warm: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca'],
  elegant: ['#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f9fafb'],
};

/**
 * 🎭 CONFIGURAÇÕES DE RESPONSIVIDADE
 */
export const RESPONSIVE_CONFIGS = {
  mobile: {
    container: 'px-4',
    text: {
      title: 'text-2xl',
      subtitle: 'text-lg',
      body: 'text-base',
    },
    spacing: 'space-y-4',
    button: 'py-3 px-6 text-base',
  },

  tablet: {
    container: 'px-6',
    text: {
      title: 'text-3xl',
      subtitle: 'text-xl',
      body: 'text-lg',
    },
    spacing: 'space-y-6',
    button: 'py-3 px-8 text-lg',
  },

  desktop: {
    container: 'px-8',
    text: {
      title: 'text-4xl',
      subtitle: 'text-2xl',
      body: 'text-xl',
    },
    spacing: 'space-y-8',
    button: 'py-4 px-10 text-xl',
  },
};

/**
 * 🎯 CONFIGURAÇÕES DE ACESSIBILIDADE
 */
export const ACCESSIBILITY_CONFIGS = {
  focusRing: 'focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50',
  highContrast: {
    text: 'text-gray-900',
    background: 'bg-white',
    border: 'border-gray-900',
  },
  keyboard: {
    navigation: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    skip: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
  },
  screenReader: {
    hidden: 'sr-only',
    describe: 'aria-describedby',
    label: 'aria-label',
  },
};

/**
 * 🎪 EFEITOS ESPECIAIS
 */
export const SPECIAL_EFFECTS = {
  confetti: {
    trigger: 'quiz-complete',
    duration: 3000,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
  },

  progressGlow: {
    class: 'animate-pulse bg-gradient-to-r from-blue-400 to-purple-500',
    duration: 1000,
  },

  successPulse: {
    class: 'animate-bounce text-green-500',
    duration: 500,
  },

  errorShake: {
    class: 'animate-shake text-red-500',
    duration: 300,
  },
};

/**
 * 🎵 CONFIGURAÇÕES DE SOM (OPCIONAL)
 */
export const SOUND_CONFIGS = {
  enabled: false, // Desabilitado por padrão
  volume: 0.3,
  sounds: {
    click: '/sounds/click.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    complete: '/sounds/complete.mp3',
    transition: '/sounds/transition.mp3',
  },
};

/**
 * 🎯 HOOK PARA APLICAR TEMA
 */
export function useQuizTheme(themeName: QuizTheme = 'default') {
  const theme = QUIZ_THEMES[themeName];

  return {
    theme,
    getClass: (element: keyof typeof theme.colors | keyof typeof theme) => {
      if (element in theme.colors) {
        return theme.colors[element as keyof typeof theme.colors];
      }
      return theme[element as keyof typeof theme] || '';
    },
    applyTheme: (element: HTMLElement) => {
      element.style.setProperty('--quiz-primary', theme.colors.primary);
      element.style.setProperty('--quiz-background', theme.colors.background);
      // Adicionar mais propriedades CSS customizadas conforme necessário
    },
  };
}

/**
 * 🎨 CLASSE UTILITÁRIA PARA ESTILOS DINÂMICOS
 */
export class QuizStyleManager {
  private theme: QuizTheme;
  private device: 'mobile' | 'tablet' | 'desktop';

  constructor(theme: QuizTheme = 'default', device: 'mobile' | 'tablet' | 'desktop' = 'desktop') {
    this.theme = theme;
    this.device = device;
  }

  getButtonClass(variant: 'primary' | 'secondary' | 'success' | 'error' = 'primary'): string {
    const themeConfig = QUIZ_THEMES[this.theme];
    const responsiveConfig = RESPONSIVE_CONFIGS[this.device];

    const baseClasses = [
      responsiveConfig.button,
      themeConfig.borderRadius,
      themeConfig.animations,
      'font-medium',
      'focus:outline-none',
      ACCESSIBILITY_CONFIGS.focusRing,
    ];

    const variantClasses = {
      primary: [themeConfig.colors.primary, themeConfig.colors.primaryHover, 'text-white'],
      secondary: [themeConfig.colors.secondary, 'hover:bg-gray-200', 'text-gray-800'],
      success: [themeConfig.colors.success, 'hover:opacity-90', 'text-white'],
      error: [themeConfig.colors.error, 'hover:opacity-90', 'text-white'],
    };

    return [...baseClasses, ...variantClasses[variant]].join(' ');
  }

  getContainerClass(): string {
    const themeConfig = QUIZ_THEMES[this.theme];
    const responsiveConfig = RESPONSIVE_CONFIGS[this.device];

    return [
      themeConfig.spacing.container,
      responsiveConfig.container,
      themeConfig.colors.background,
      'min-h-screen',
    ].join(' ');
  }

  getCardClass(): string {
    const themeConfig = QUIZ_THEMES[this.theme];

    return [
      themeConfig.colors.surface,
      themeConfig.borderRadius,
      themeConfig.shadows,
      'p-6',
      themeConfig.spacing.element,
    ].join(' ');
  }
}
