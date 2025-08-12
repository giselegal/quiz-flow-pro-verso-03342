// =====================================================================
// components/editor/theme/editorTheme.ts - Tema do editor
// =====================================================================

export const editorTheme = {
  // Core Colors
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },

  // Component Styles
  components: {
    panel: {
      background: 'bg-white',
      border: 'border-gray-200',
      shadow: 'shadow-sm',
      header: 'bg-gray-50 border-b border-gray-200',
    },

    button: {
      primary: 'bg-[#B89B7A] hover:bg-[#A38A69] text-white',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      ghost: 'hover:bg-gray-100 text-gray-600',
      destructive: 'bg-red-600 hover:bg-red-700 text-white',
    },

    input: {
      base: 'border-gray-300 focus:border-[#B89B7A] focus:ring-[#B89B7A]',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    },

    status: {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      warning: 'bg-stone-100 text-stone-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
    },

    history: {
      current: 'bg-[#B89B7A]/10 border-[#B89B7A]/30 text-[#432818]',
      past: 'bg-white hover:bg-gray-50 text-gray-700',
      future: 'bg-gray-50 text-gray-400',
    },
  },

  // Spacing
  spacing: {
    panel: 'p-4',
    section: 'space-y-4',
    item: 'space-y-2',
    inline: 'space-x-2',
  },

  // Typography
  typography: {
    title: 'text-lg font-semibold text-gray-900',
    subtitle: 'text-base font-medium text-gray-800',
    body: 'text-sm text-gray-700',
    caption: 'text-xs text-gray-500',
    label: 'text-sm font-medium text-gray-700',
  },

  // Layout
  layout: {
    header: 'h-12',
    sidebar: 'w-64',
    statusBar: 'h-8',
  },

  // Animation
  animation: {
    transition: 'transition-all duration-200 ease-in-out',
    hover: 'transform hover:scale-105',
    focus: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
  },

  // Icons
  icons: {
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
  },
};

// Helper functions
export const getStatusColor = (status: 'active' | 'inactive' | 'warning' | 'error') => {
  return editorTheme.components.status[status];
};

export const getButtonVariant = (variant: 'primary' | 'secondary' | 'ghost' | 'destructive') => {
  return editorTheme.components.button[variant];
};

export const getHistoryState = (state: 'current' | 'past' | 'future') => {
  return editorTheme.components.history[state];
};
