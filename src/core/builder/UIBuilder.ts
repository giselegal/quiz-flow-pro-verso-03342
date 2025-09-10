/**
 * 🏗️ UI BUILDER - Sistema de construção avançado para layouts e interfaces
 * 
 * Builder Pattern para criação de layouts responsivos, temas customizados,
 * e interfaces otimizadas para conversão.
 */

import { ComponentConfig } from './ComponentBuilder';

// ✨ TIPOS DO UI BUILDER
export interface LayoutConfig {
  id: string;
  name: string;
  type: LayoutType;
  breakpoints: Breakpoints;
  grid: GridConfig;
  components: PositionedComponent[];
  theme: ThemeConfig;
  animations: AnimationConfig[];
  accessibility: AccessibilityConfig;
}

export type LayoutType = 
  | 'single-column' 
  | 'two-column' 
  | 'three-column' 
  | 'grid' 
  | 'masonry' 
  | 'custom';

export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  ultrawide?: number;
}

export interface GridConfig {
  columns: number;
  rows?: number;
  gap: string;
  padding: string;
  maxWidth?: string;
  autoFlow?: 'row' | 'column' | 'dense';
}

export interface PositionedComponent {
  component: ComponentConfig;
  position: ComponentPosition;
  responsive: ResponsiveSettings;
  order?: number;
}

export interface ComponentPosition {
  gridColumn?: string;
  gridRow?: string;
  x?: number;
  y?: number;
  width?: string;
  height?: string;
  zIndex?: number;
}

export interface ResponsiveSettings {
  mobile?: Partial<ComponentPosition>;
  tablet?: Partial<ComponentPosition>;
  desktop?: Partial<ComponentPosition>;
  hidden?: ('mobile' | 'tablet' | 'desktop')[];
}

export interface ThemeConfig {
  name: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  shadows: ShadowConfig;
  borders: BorderConfig;
  customCSS?: string;
}

export interface ColorPalette {
  primary: ColorVariants;
  secondary: ColorVariants;
  accent: ColorVariants;
  neutral: ColorVariants;
  semantic: SemanticColors;
}

export interface ColorVariants {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base color
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface TypographyConfig {
  fontFamily: {
    primary: string;
    secondary?: string;
    mono?: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface SpacingConfig {
  unit: number; // Base unit in px
  scale: number[]; // Multipliers: [0, 1, 2, 4, 8, 16, 32, 64]
}

export interface ShadowConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface BorderConfig {
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  width: {
    thin: string;
    medium: string;
    thick: string;
  };
}

export interface AnimationConfig {
  id: string;
  name: string;
  type: AnimationType;
  trigger: AnimationTrigger;
  duration: number;
  delay?: number;
  easing?: string;
  properties: AnimationProperty[];
}

export type AnimationType = 
  | 'fade' 
  | 'slide' 
  | 'scale' 
  | 'rotate' 
  | 'bounce' 
  | 'custom';

export type AnimationTrigger = 
  | 'load' 
  | 'scroll' 
  | 'hover' 
  | 'click' 
  | 'focus' 
  | 'visible';

export interface AnimationProperty {
  property: string;
  from: string;
  to: string;
}

export interface AccessibilityConfig {
  focusVisible: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: {
    skipLinks: boolean;
    landmarks: boolean;
    descriptions: boolean;
  };
  keyboard: {
    navigation: boolean;
    shortcuts: KeyboardShortcut[];
  };
}

export interface KeyboardShortcut {
  key: string;
  action: string;
  description: string;
}

// ✨ TEMPLATES DE LAYOUT
export const LAYOUT_TEMPLATES = {
  'quiz-single': {
    name: 'Quiz Single Column',
    type: 'single-column' as LayoutType,
    grid: {
      columns: 1,
      gap: '2rem',
      padding: '1rem',
      maxWidth: '600px'
    }
  },

  'quiz-split': {
    name: 'Quiz Split Layout',
    type: 'two-column' as LayoutType,
    grid: {
      columns: 2,
      gap: '3rem',
      padding: '2rem',
      maxWidth: '1200px'
    }
  },

  'landing-hero': {
    name: 'Landing Page Hero',
    type: 'single-column' as LayoutType,
    grid: {
      columns: 1,
      gap: '0',
      padding: '0',
      maxWidth: '100%'
    }
  },

  'dashboard-grid': {
    name: 'Dashboard Grid',
    type: 'grid' as LayoutType,
    grid: {
      columns: 12,
      gap: '1rem',
      padding: '1rem',
      autoFlow: 'dense'
    }
  }
} as const;

// ✨ TEMAS PREDEFINIDOS
export const THEME_PRESETS = {
  'modern-blue': {
    name: 'Modern Blue',
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a'
      }
    }
  },

  'warm-orange': {
    name: 'Warm Orange',
    colors: {
      primary: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12'
      }
    }
  },

  'minimal-gray': {
    name: 'Minimal Gray',
    colors: {
      primary: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827'
      }
    }
  }
} as const;

/**
 * 🏗️ UI BUILDER CLASS
 */
export class UIBuilder {
  private config: LayoutConfig;

  constructor(name: string, type: LayoutType = 'single-column') {
    this.config = {
      id: this.generateId(),
      name,
      type,
      breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        ultrawide: 1440
      },
      grid: {
        columns: type === 'single-column' ? 1 : 12,
        gap: '1rem',
        padding: '1rem'
      },
      components: [],
      theme: this.getDefaultTheme(),
      animations: [],
      accessibility: this.getDefaultAccessibility()
    };
  }

  private generateId(): string {
    return `layout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ✨ CONFIGURAÇÃO BÁSICA

  /**
   * Define tipo de layout
   */
  withType(type: LayoutType): UIBuilder {
    this.config.type = type;
    return this;
  }

  /**
   * Configura breakpoints responsivos
   */
  withBreakpoints(breakpoints: Partial<Breakpoints>): UIBuilder {
    this.config.breakpoints = { ...this.config.breakpoints, ...breakpoints };
    return this;
  }

  /**
   * Configura grid
   */
  withGrid(grid: Partial<GridConfig>): UIBuilder {
    this.config.grid = { ...this.config.grid, ...grid };
    return this;
  }

  // ✨ TEMAS E ESTILOS

  /**
   * Aplica tema predefinido
   */
  withTheme(themeName: keyof typeof THEME_PRESETS): UIBuilder {
    const preset = THEME_PRESETS[themeName];
    this.config.theme = {
      ...this.config.theme,
      name: preset.name,
      colors: {
        ...this.config.theme.colors,
        ...preset.colors
      }
    };
    return this;
  }

  /**
   * Customiza cores do tema
   */
  withColors(colors: Partial<ColorPalette>): UIBuilder {
    this.config.theme.colors = {
      ...this.config.theme.colors,
      ...colors
    };
    return this;
  }

  /**
   * Configura tipografia
   */
  withTypography(typography: Partial<TypographyConfig>): UIBuilder {
    this.config.theme.typography = {
      ...this.config.theme.typography,
      ...typography
    };
    return this;
  }

  /**
   * Adiciona CSS customizado
   */
  withCustomCSS(css: string): UIBuilder {
    this.config.theme.customCSS = css;
    return this;
  }

  // ✨ COMPONENTES E POSICIONAMENTO

  /**
   * Adiciona componente ao layout
   */
  addComponent(
    component: ComponentConfig,
    position?: ComponentPosition,
    responsive?: ResponsiveSettings
  ): UIBuilder {
    this.config.components.push({
      component,
      position: position || this.getDefaultPosition(),
      responsive: responsive || {},
      order: this.config.components.length
    });
    return this;
  }

  /**
   * Posiciona componente em grid específico
   */
  placeInGrid(
    component: ComponentConfig,
    column: string,
    row?: string,
    responsive?: ResponsiveSettings
  ): UIBuilder {
    return this.addComponent(component, {
      gridColumn: column,
      gridRow: row
    }, responsive);
  }

  /**
   * Posiciona componente em coordenadas absolutas
   */
  placeAt(
    component: ComponentConfig,
    x: number,
    y: number,
    width?: string,
    height?: string
  ): UIBuilder {
    return this.addComponent(component, {
      x,
      y,
      width,
      height
    });
  }

  /**
   * Organiza componentes automaticamente
   */
  autoArrange(): UIBuilder {
    const columns = this.config.grid.columns;
    
    this.config.components.forEach((positioned, index) => {
      if (this.config.type === 'grid') {
        const col = (index % columns) + 1;
        const row = Math.floor(index / columns) + 1;
        positioned.position.gridColumn = col.toString();
        positioned.position.gridRow = row.toString();
      } else {
        positioned.order = index;
      }
    });

    return this;
  }

  // ✨ ANIMAÇÕES

  /**
   * Adiciona animação global
   */
  withAnimation(animation: Omit<AnimationConfig, 'id'>): UIBuilder {
    this.config.animations.push({
      ...animation,
      id: this.generateId()
    });
    return this;
  }

  /**
   * Adiciona animação de entrada
   */
  withEntranceAnimation(
    type: AnimationType = 'fade',
    duration: number = 300,
    delay: number = 0
  ): UIBuilder {
    return this.withAnimation({
      name: `entrance-${type}`,
      type,
      trigger: 'load',
      duration,
      delay,
      properties: this.getAnimationProperties(type, 'in')
    });
  }

  /**
   * Adiciona animações de scroll
   */
  withScrollAnimations(): UIBuilder {
    this.config.components.forEach((_, index) => {
      this.withAnimation({
        name: `scroll-reveal-${index}`,
        type: 'fade',
        trigger: 'scroll',
        duration: 600,
        delay: index * 100,
        properties: [
          { property: 'opacity', from: '0', to: '1' },
          { property: 'transform', from: 'translateY(20px)', to: 'translateY(0)' }
        ]
      });
    });
    return this;
  }

  // ✨ ACESSIBILIDADE

  /**
   * Configura acessibilidade
   */
  withAccessibility(config: Partial<AccessibilityConfig>): UIBuilder {
    this.config.accessibility = {
      ...this.config.accessibility,
      ...config
    };
    return this;
  }

  /**
   * Habilita suporte completo a acessibilidade
   */
  withFullAccessibility(): UIBuilder {
    return this.withAccessibility({
      focusVisible: true,
      highContrast: true,
      reducedMotion: true,
      screenReader: {
        skipLinks: true,
        landmarks: true,
        descriptions: true
      },
      keyboard: {
        navigation: true,
        shortcuts: [
          { key: 'Tab', action: 'next-element', description: 'Próximo elemento' },
          { key: 'Shift+Tab', action: 'prev-element', description: 'Elemento anterior' },
          { key: 'Enter', action: 'activate', description: 'Ativar elemento' },
          { key: 'Escape', action: 'close', description: 'Fechar modal/dropdown' }
        ]
      }
    });
  }

  // ✨ TEMPLATES

  /**
   * Aplica template de layout
   */
  fromTemplate(templateName: keyof typeof LAYOUT_TEMPLATES): UIBuilder {
    const template = LAYOUT_TEMPLATES[templateName];
    
    this.config.name = template.name;
    this.config.type = template.type;
    this.config.grid = { ...this.config.grid, ...template.grid };

    return this;
  }

  // ✨ OTIMIZAÇÃO

  /**
   * Otimiza o layout para performance
   */
  optimize(): UIBuilder {
    // Otimização 1: Remover animações desnecessárias
    if (this.config.animations.length > 10) {
      this.config.animations = this.config.animations.slice(0, 10);
    }

    // Otimização 2: Simplificar grid se possível
    if (this.config.components.length <= 1 && this.config.grid.columns > 1) {
      this.config.grid.columns = 1;
      this.config.type = 'single-column';
    }

    // Otimização 3: Configurar lazy loading para componentes não visíveis
    this.config.components.forEach(positioned => {
      if (!positioned.component.metadata) {
        positioned.component.metadata = {};
      }
      positioned.component.metadata.lazyLoad = true;
    });

    return this;
  }

  /**
   * Otimiza para mobile
   */
  optimizeForMobile(): UIBuilder {
    // Reduzir colunas no mobile
    this.config.components.forEach(positioned => {
      if (!positioned.responsive.mobile) {
        positioned.responsive.mobile = {};
      }
      positioned.responsive.mobile.gridColumn = '1 / -1'; // Full width
    });

    // Reduzir animações no mobile
    this.config.animations = this.config.animations.filter(anim => 
      anim.type === 'fade' || anim.duration <= 300
    );

    return this;
  }

  // ✨ MÉTODOS AUXILIARES

  private getDefaultTheme(): ThemeConfig {
    return {
      name: 'Default',
      colors: {
        primary: THEME_PRESETS['modern-blue'].colors.primary,
        secondary: THEME_PRESETS['minimal-gray'].colors.primary,
        accent: THEME_PRESETS['warm-orange'].colors.primary,
        neutral: THEME_PRESETS['minimal-gray'].colors.primary,
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6'
        }
      },
      typography: {
        fontFamily: {
          primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          secondary: 'Poppins, sans-serif',
          mono: 'JetBrains Mono, monospace'
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75'
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        }
      },
      spacing: {
        unit: 4,
        scale: [0, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96]
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
      },
      borders: {
        radius: {
          sm: '0.25rem',
          md: '0.5rem',
          lg: '0.75rem',
          full: '9999px'
        },
        width: {
          thin: '1px',
          medium: '2px',
          thick: '4px'
        }
      }
    };
  }

  private getDefaultAccessibility(): AccessibilityConfig {
    return {
      focusVisible: true,
      highContrast: false,
      reducedMotion: false,
      screenReader: {
        skipLinks: false,
        landmarks: false,
        descriptions: false
      },
      keyboard: {
        navigation: true,
        shortcuts: []
      }
    };
  }

  private getDefaultPosition(): ComponentPosition {
    return {};
  }

  private getAnimationProperties(type: AnimationType, direction: 'in' | 'out'): AnimationProperty[] {
    const properties: Record<AnimationType, AnimationProperty[]> = {
      fade: [
        { property: 'opacity', from: direction === 'in' ? '0' : '1', to: direction === 'in' ? '1' : '0' }
      ],
      slide: [
        { property: 'transform', from: direction === 'in' ? 'translateX(-100%)' : 'translateX(0)', to: direction === 'in' ? 'translateX(0)' : 'translateX(100%)' }
      ],
      scale: [
        { property: 'transform', from: direction === 'in' ? 'scale(0.8)' : 'scale(1)', to: direction === 'in' ? 'scale(1)' : 'scale(0.8)' },
        { property: 'opacity', from: direction === 'in' ? '0' : '1', to: direction === 'in' ? '1' : '0' }
      ],
      rotate: [
        { property: 'transform', from: direction === 'in' ? 'rotate(-180deg)' : 'rotate(0deg)', to: direction === 'in' ? 'rotate(0deg)' : 'rotate(180deg)' }
      ],
      bounce: [
        { property: 'transform', from: 'translateY(-30px)', to: 'translateY(0px)' },
        { property: 'opacity', from: '0', to: '1' }
      ],
      custom: []
    };

    return properties[type] || properties.fade;
  }

  // ✨ CONSTRUÇÃO FINAL

  /**
   * Gera CSS para o layout
   */
  generateCSS(): string {
    const theme = this.config.theme;
    const breakpoints = this.config.breakpoints;

    const css = `
      /* Layout Base */
      .layout-${this.config.id} {
        display: grid;
        grid-template-columns: repeat(${this.config.grid.columns}, 1fr);
        gap: ${this.config.grid.gap};
        padding: ${this.config.grid.padding};
        ${this.config.grid.maxWidth ? `max-width: ${this.config.grid.maxWidth};` : ''}
        margin: 0 auto;
      }

      /* Theme Colors */
      :root {
        --color-primary-500: ${theme.colors.primary[500]};
        --color-secondary-500: ${theme.colors.secondary[500]};
        --color-accent-500: ${theme.colors.accent[500]};
        --color-success: ${theme.colors.semantic.success};
        --color-warning: ${theme.colors.semantic.warning};
        --color-error: ${theme.colors.semantic.error};
        --color-info: ${theme.colors.semantic.info};
      }

      /* Typography */
      .layout-${this.config.id} {
        font-family: ${theme.typography.fontFamily.primary};
        font-size: ${theme.typography.fontSize.base};
        line-height: ${theme.typography.lineHeight.normal};
      }

      /* Responsive Breakpoints */
      @media (max-width: ${breakpoints.mobile}px) {
        .layout-${this.config.id} {
          grid-template-columns: 1fr;
          padding: 1rem;
        }
      }

      @media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop}px) {
        .layout-${this.config.id} {
          grid-template-columns: repeat(${Math.min(this.config.grid.columns, 6)}, 1fr);
        }
      }

      /* Animations */
      ${this.config.animations.map(anim => `
        .animation-${anim.id} {
          animation: ${anim.name} ${anim.duration}ms ${anim.easing || 'ease'} ${anim.delay || 0}ms;
        }

        @keyframes ${anim.name} {
          from {
            ${anim.properties.map(prop => `${prop.property}: ${prop.from};`).join('\n    ')}
          }
          to {
            ${anim.properties.map(prop => `${prop.property}: ${prop.to};`).join('\n    ')}
          }
        }
      `).join('\n')}

      /* Accessibility */
      ${this.config.accessibility.focusVisible ? `
        .layout-${this.config.id} *:focus-visible {
          outline: 2px solid var(--color-primary-500);
          outline-offset: 2px;
        }
      ` : ''}

      ${this.config.accessibility.reducedMotion ? `
        @media (prefers-reduced-motion: reduce) {
          .layout-${this.config.id} * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      ` : ''}

      /* Custom CSS */
      ${theme.customCSS || ''}
    `;

    return css.trim();
  }

  /**
   * Constrói o layout final
   */
  build(): LayoutConfig {
    return { ...this.config };
  }
}

// ✨ FACTORY FUNCTIONS

/**
 * Cria um layout simples de coluna única
 */
export function createSingleColumnLayout(name: string): UIBuilder {
  return new UIBuilder(name, 'single-column').fromTemplate('quiz-single');
}

/**
 * Cria um layout de duas colunas
 */
export function createTwoColumnLayout(name: string): UIBuilder {
  return new UIBuilder(name, 'two-column').fromTemplate('quiz-split');
}

/**
 * Cria um layout de grid responsivo
 */
export function createGridLayout(name: string, columns: number = 12): UIBuilder {
  return new UIBuilder(name, 'grid').withGrid({ columns });
}

/**
 * Cria um layout otimizado para quiz
 */
export function createQuizLayout(name: string): UIBuilder {
  return new UIBuilder(name, 'single-column')
    .fromTemplate('quiz-single')
    .withTheme('modern-blue')
    .withEntranceAnimation('fade', 300)
    .withScrollAnimations()
    .optimizeForMobile();
}

/**
 * Cria um layout para landing page
 */
export function createLandingLayout(name: string): UIBuilder {
  return new UIBuilder(name, 'single-column')
    .fromTemplate('landing-hero')
    .withTheme('warm-orange')
    .withFullAccessibility()
    .optimize();
}

export default UIBuilder;
