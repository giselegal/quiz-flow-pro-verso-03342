/**
 * Sistema de Design e Identidade Visual da Marca
 * Cores, tipografia, espaçamentos e padrões responsivos unificados
 */

// =====================================================
// CORES DA MARCA
// =====================================================
export const BRAND_COLORS = {
  // Cores primárias da marca
  primary: {
    main: '#B89B7A',      // Dourado principal
    hover: '#a08965',     // Dourado hover
    light: '#D4C4A8',     // Dourado claro
    dark: '#8F7A6A',      // Dourado escuro
  },
  
  // Cores secundárias
  secondary: {
    main: '#432818',      // Marrom escuro
    hover: '#2a1910',     // Marrom hover
    light: '#8F7A6A',     // Marrom claro
    dark: '#1a0f08',      // Marrom muito escuro
  },
  
  // Cores neutras
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  },
  
  // Cores de status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// =====================================================
// GRADIENTES DA MARCA
// =====================================================
export const BRAND_GRADIENTS = {
  primary: 'linear-gradient(135deg, #B89B7A 0%, #A68B6A 100%)',
  secondary: 'linear-gradient(135deg, #8B7355 0%, #7A6245 100%)',
  hero: 'linear-gradient(135deg, #B89B7A 0%, #8B7355 100%)',
  elegant: 'linear-gradient(135deg, #D4C4B0 0%, #B89B7A 50%, #8B7355 100%)',
};

// =====================================================
// TIPOGRAFIA RESPONSIVA
// =====================================================
export const TYPOGRAPHY = {
  // Títulos responsivos
  heading: {
    h1: 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold',
    h2: 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold',
    h3: 'text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold',
    h4: 'text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold',
    h5: 'text-base md:text-lg lg:text-xl xl:text-2xl font-semibold',
    h6: 'text-sm md:text-base lg:text-lg xl:text-xl font-semibold',
  },
  
  // Texto do corpo responsivo
  body: {
    xl: 'text-lg md:text-xl lg:text-2xl leading-relaxed',
    large: 'text-base md:text-lg lg:text-xl leading-relaxed',
    medium: 'text-sm md:text-base lg:text-lg leading-relaxed',
    small: 'text-xs md:text-sm lg:text-base leading-relaxed',
  },
  
  // Botões responsivos
  button: {
    xl: 'text-lg md:text-xl font-semibold',
    large: 'text-base md:text-lg font-semibold',
    medium: 'text-sm md:text-base font-semibold',
    small: 'text-xs md:text-sm font-semibold',
  },
};

// =====================================================
// ESPAÇAMENTOS RESPONSIVOS
// =====================================================
export const SPACING = {
  // Padding responsivo
  padding: {
    xs: 'p-2 md:p-3',
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
    xl: 'p-8 md:p-12',
    '2xl': 'p-12 md:p-16',
  },
  
  // Margin responsivo
  margin: {
    xs: 'm-2 md:m-3',
    sm: 'm-3 md:m-4',
    md: 'm-4 md:m-6',
    lg: 'm-6 md:m-8',
    xl: 'm-8 md:m-12',
    '2xl': 'm-12 md:m-16',
  },
  
  // Gap responsivo
  gap: {
    xs: 'gap-2 md:gap-3',
    sm: 'gap-3 md:gap-4',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
    xl: 'gap-8 md:gap-12',
  },
};

// =====================================================
// COMPONENTES DE BOTÃO RESPONSIVOS
// =====================================================
export const BUTTON_STYLES = {
  // Variantes com cores da marca
  variants: {
    primary: 'bg-[#B89B7A] hover:bg-[#A68B6A] text-white border-[#B89B7A] hover:border-[#A68B6A]',
    secondary: 'bg-[#8B7355] hover:bg-[#7A6245] text-white border-[#8B7355] hover:border-[#7A6245]',
    outline: 'bg-transparent hover:bg-[#B89B7A] text-[#B89B7A] hover:text-white border-[#B89B7A]',
    ghost: 'bg-transparent hover:bg-[#D4C4B0] text-[#B89B7A] hover:text-[#8B7355] border-transparent',
    accent: 'bg-gradient-to-r from-[#B89B7A] to-[#8B7355] text-white border-transparent shadow-lg hover:shadow-xl',
  },
  
  // Tamanhos responsivos
  sizes: {
    xs: 'px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm',
    sm: 'px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base',
    md: 'px-4 py-2 md:px-6 md:py-2.5 text-base md:text-lg',
    lg: 'px-6 py-2.5 md:px-8 md:py-3 text-lg md:text-xl',
    xl: 'px-8 py-3 md:px-10 md:py-4 text-xl md:text-2xl',
  },
};

// =====================================================
// BREAKPOINTS E RESPONSIVIDADE
// =====================================================
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const RESPONSIVE_PATTERNS = {
  // Layouts responsivos
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  grid: {
    '2cols': 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6',
    '3cols': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
    '4cols': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6',
    auto: 'grid grid-cols-1 md:grid-cols-auto gap-4 md:gap-6',
  },
  
  // Flex responsivo
  flex: {
    col: 'flex flex-col',
    colToRow: 'flex flex-col md:flex-row',
    rowToCol: 'flex flex-row md:flex-col',
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    wrap: 'flex flex-wrap',
  },
  
  // Texto responsivo
  text: {
    center: 'text-center',
    centerToLeft: 'text-center md:text-left',
    leftToCenter: 'text-left md:text-center',
  },
  
  // Visibilidade responsiva
  visibility: {
    mobileOnly: 'block md:hidden',
    desktopOnly: 'hidden md:block',
    tabletUp: 'hidden md:block',
    mobileToTablet: 'block lg:hidden',
  },
};

// =====================================================
// ANIMAÇÕES E TRANSIÇÕES
// =====================================================
export const ANIMATIONS = {
  // Transições básicas
  transition: 'transition-all duration-300 ease-in-out',
  transitionFast: 'transition-all duration-150 ease-in-out',
  transitionSlow: 'transition-all duration-500 ease-in-out',
  
  // Hover effects
  hover: {
    scale: 'hover:scale-105 active:scale-95',
    lift: 'hover:-translate-y-1 hover:shadow-lg',
    glow: 'hover:shadow-xl hover:shadow-primary/20',
    fade: 'hover:opacity-80',
  },
  
  // Animações de entrada
  enter: {
    fadeIn: 'animate-in fade-in duration-300',
    slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
    slideDown: 'animate-in slide-in-from-top-4 duration-300',
    slideLeft: 'animate-in slide-in-from-right-4 duration-300',
    slideRight: 'animate-in slide-in-from-left-4 duration-300',
    scaleIn: 'animate-in zoom-in-95 duration-300',
  },
};

// =====================================================
// SOMBRAS E EFEITOS
// =====================================================
export const EFFECTS = {
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    brand: 'shadow-lg shadow-[#B89B7A]/20',
    glow: 'shadow-2xl shadow-[#B89B7A]/30',
  },
  
  borders: {
    brand: 'border-[#B89B7A]',
    brandLight: 'border-[#D4C4B0]',
    subtle: 'border-[#E5E7EB]',
  },
  
  focus: {
    brand: 'focus:ring-4 focus:ring-[#B89B7A]/20 focus:border-[#B89B7A]',
    outline: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
  },
};

// =====================================================
// UTILITÁRIOS PARA COMPONENTES INLINE
// =====================================================
export const INLINE_COMPONENT_BASE = {
  // Container base para todos os componentes inline
  container: 'w-full flex items-center justify-center min-h-[60px] p-4',
  content: 'flex items-center gap-4 max-w-4xl w-full',
  
  // Estados de interação
  interactive: 'cursor-pointer transition-all duration-300',
  selected: 'ring-2 ring-blue-500 bg-blue-50',
  hover: 'hover:bg-gray-50 hover:shadow-md',
  
  // Responsividade mobile
  mobile: {
    stack: 'flex-col md:flex-row',
    center: 'text-center md:text-left',
    fullWidth: 'w-full md:w-auto',
  },
};

// =====================================================
// FUNÇÕES UTILITÁRIAS
// =====================================================
export const getBrandColor = (color: keyof typeof BRAND_COLORS, shade?: string) => {
  const colorObj = BRAND_COLORS[color];
  if (typeof colorObj === 'string') return colorObj;
  
  // Para cores com subpropriedades
  if (typeof colorObj === 'object' && colorObj !== null) {
    if (shade && shade in colorObj) {
      return (colorObj as any)[shade];
    }
    // Retorna a cor principal se disponível, senão a primeira propriedade
    return (colorObj as any).main || Object.values(colorObj)[0];
  }
  
  return '#B89B7A'; // fallback
};

export const getResponsiveClass = (base: string, responsive: Record<string, string>) => {
  return `${base} ${Object.entries(responsive).map(([breakpoint, value]) => 
    breakpoint === 'base' ? value : `${breakpoint}:${value}`
  ).join(' ')}`;
};

export const combineClasses = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};
