
export const BRAND_COLORS = {
  primary: '#B89B7A',
  secondary: '#432818',
  accent: '#8F7A6A',
  text: '#432818',
  background: '#FAF9F7',
  // Additional color variants
  main: {
    light: '#D4C4A0',
    default: '#B89B7A',
    dark: '#8F7A6A'
  },
  neutral: {
    50: '#FAF9F7',
    100: '#F5F2E9',
    200: '#E8E1D1',
    300: '#D4C4A0',
    400: '#8F7A6A',
    500: '#432818',
    600: '#2D1A10',
    gray600: '#4A5568'
  },
  // Brand colors for compatibility
  brand: ['#B89B7A', '#432818', '#8F7A6A'],
  light: '#D4C4A0'
};

export const TYPOGRAPHY = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  // Additional typography variants
  heading: {
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.75rem',
    h4: '1.5rem',
    h5: '1.25rem',
    h6: '1rem'
  },
  body: {
    large: '1.125rem',
    medium: '1rem',
    small: '0.875rem'
  }
};

export const SPACING = {
  padding: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  },
  margin: {
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8'
  }
};

export const ANIMATIONS = {
  transition: 'transition-all duration-200',
  hover: {
    lift: 'hover:transform hover:scale-105',
    shadow: 'hover:shadow-lg'
  }
};

export const EFFECTS = {
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  },
  shadows: [
    'shadow-sm',
    'shadow-md',
    'shadow-lg',
    'shadow-xl'
  ],
  border: {
    default: 'border border-gray-200',
    focus: 'border-blue-500'
  }
};

export const RESPONSIVE_PATTERNS = {
  mobile: 'block sm:hidden',
  tablet: 'hidden sm:block lg:hidden',
  desktop: 'hidden lg:block'
};
