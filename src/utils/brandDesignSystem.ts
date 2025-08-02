
export const BRAND_COLORS = {
  primary: '#B89B7A',
  secondary: '#432818',
  accent: '#8F7A6A',
  text: '#432818',
  background: '#FAF9F7'
};

export const TYPOGRAPHY = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
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
