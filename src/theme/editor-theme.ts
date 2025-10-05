/**
 * 🎨 TEMA CHAKRA UI - EDITOR MODULAR
 * 
 * Configuração personalizada do tema Chakra UI para o editor de quiz
 */

import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Configuração do tema
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Paleta de cores personalizada
const colors = {
  brand: {
    50: '#E6F3FF',
    100: '#BAE0FF',
    200: '#8CCCFF',
    300: '#5BB8FF',
    400: '#2EA4FF',
    500: '#0090FF',
    600: '#0074D9',
    700: '#0058B3',
    800: '#003D8C',
    900: '#002266',
  },
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
  success: {
    500: '#38A169',
  },
  error: {
    500: '#E53E3E',
  },
  warning: {
    500: '#D69E2E',
  },
  info: {
    500: '#3182CE',
  },
};

// Fontes customizadas
const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  mono: `'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
};

// Tamanhos customizados
const sizes = {
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },
};

// Componentes customizados
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
      _focus: {
        boxShadow: '0 0 0 3px rgba(0, 144, 255, 0.6)',
      },
    },
    sizes: {
      sm: {
        fontSize: 'sm',
        px: 3,
        py: 2,
      },
      md: {
        fontSize: 'md',
        px: 4,
        py: 2,
      },
      lg: {
        fontSize: 'lg',
        px: 6,
        py: 3,
      },
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          _disabled: {
            bg: 'brand.500',
          },
        },
        _active: {
          bg: 'brand.700',
        },
      },
      outline: {
        border: '2px solid',
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
          _disabled: {
            bg: 'transparent',
          },
        },
        _active: {
          bg: 'brand.100',
        },
      },
      ghost: {
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
          _disabled: {
            bg: 'transparent',
          },
        },
        _active: {
          bg: 'brand.100',
        },
      },
    },
    defaultProps: {
      size: 'md',
      variant: 'solid',
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'md',
        _focus: {
          borderColor: 'brand.500',
          boxShadow: '0 0 0 1px rgba(0, 144, 255, 0.6)',
        },
      },
    },
    variants: {
      outline: {
        field: {
          border: '2px solid',
          borderColor: 'gray.200',
          _hover: {
            borderColor: 'gray.300',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px rgba(0, 144, 255, 0.6)',
          },
        },
      },
    },
    defaultProps: {
      variant: 'outline',
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'lg',
        boxShadow: 'sm',
        border: '1px solid',
        borderColor: 'gray.200',
        bg: 'white',
      },
      header: {
        p: 4,
        borderBottom: '1px solid',
        borderColor: 'gray.200',
      },
      body: {
        p: 4,
      },
      footer: {
        p: 4,
        borderTop: '1px solid',
        borderColor: 'gray.200',
      },
    },
    variants: {
      elevated: {
        container: {
          boxShadow: 'md',
        },
      },
      outline: {
        container: {
          boxShadow: 'none',
          borderWidth: '2px',
        },
      },
    },
    defaultProps: {
      variant: 'elevated',
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: 'full',
      fontWeight: 'semibold',
      fontSize: 'xs',
      px: 2,
      py: 1,
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
      },
      outline: {
        border: '1px solid',
        borderColor: 'brand.500',
        color: 'brand.500',
      },
      subtle: {
        bg: 'brand.100',
        color: 'brand.800',
      },
    },
    defaultProps: {
      variant: 'subtle',
    },
  },
  Tabs: {
    baseStyle: {
      tab: {
        fontWeight: 'semibold',
        _selected: {
          color: 'brand.500',
          borderColor: 'brand.500',
        },
        _focus: {
          boxShadow: '0 0 0 3px rgba(0, 144, 255, 0.6)',
        },
      },
      tabpanel: {
        p: 4,
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        borderRadius: 'lg',
        boxShadow: 'xl',
      },
      header: {
        fontWeight: 'bold',
        fontSize: 'lg',
      },
      closeButton: {
        _focus: {
          boxShadow: '0 0 0 3px rgba(0, 144, 255, 0.6)',
        },
      },
    },
  },
  Drawer: {
    baseStyle: {
      dialog: {
        bg: 'white',
      },
      header: {
        fontWeight: 'bold',
        fontSize: 'lg',
      },
      closeButton: {
        _focus: {
          boxShadow: '0 0 0 3px rgba(0, 144, 255, 0.6)',
        },
      },
    },
  },
  Tooltip: {
    baseStyle: {
      borderRadius: 'md',
      fontWeight: 'semibold',
      fontSize: 'sm',
      bg: 'gray.700',
      color: 'white',
    },
  },
};

// Estilos globais
const styles = {
  global: {
    body: {
      bg: 'gray.50',
      color: 'gray.800',
    },
    '*::placeholder': {
      color: 'gray.400',
    },
    '*, *::before, &::after': {
      borderColor: 'gray.200',
    },
  },
};

// Configurações de responsividade
const breakpoints = {
  base: '0px',
  sm: '480px',
  md: '768px',
  lg: '992px',
  xl: '1280px',
  '2xl': '1400px',
};

// Tema final
export const editorTheme = extendTheme({
  config,
  colors,
  fonts,
  sizes,
  components,
  styles,
  breakpoints,
  semanticTokens: {
    colors: {
      'editor-bg': 'gray.50',
      'panel-bg': 'white',
      'border': 'gray.200',
      'text-primary': 'gray.800',
      'text-secondary': 'gray.600',
      'text-muted': 'gray.400',
      'accent': 'brand.500',
      'accent-hover': 'brand.600',
      'success': 'green.500',
      'error': 'red.500',
      'warning': 'orange.500',
      'info': 'blue.500',
    },
    space: {
      'editor-padding': '1rem',
      'panel-padding': '1.5rem',
      'component-spacing': '1rem',
    },
  },
  layerStyles: {
    'editor-panel': {
      bg: 'panel-bg',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: 'lg',
      boxShadow: 'sm',
    },
    'component-wrapper': {
      border: '2px solid transparent',
      borderRadius: 'md',
      transition: 'all 0.2s',
      _hover: {
        borderColor: 'accent',
        boxShadow: 'md',
      },
    },
    'selected-component': {
      borderColor: 'accent',
      boxShadow: '0 0 0 3px rgba(0, 144, 255, 0.2)',
    },
  },
  textStyles: {
    'editor-heading': {
      fontSize: 'xl',
      fontWeight: 'bold',
      color: 'text-primary',
    },
    'editor-subheading': {
      fontSize: 'lg',
      fontWeight: 'semibold',
      color: 'text-primary',
    },
    'editor-body': {
      fontSize: 'md',
      color: 'text-primary',
    },
    'editor-caption': {
      fontSize: 'sm',
      color: 'text-secondary',
    },
    'editor-muted': {
      fontSize: 'sm',
      color: 'text-muted',
    },
  },
});

export default editorTheme;