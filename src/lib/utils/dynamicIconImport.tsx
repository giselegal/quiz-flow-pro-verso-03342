// 🚀 FASE 3.4: Tree Shaking - Dynamic import com lazy loading
// ANTES: import * as Icons → carregava TODOS os ícones (~1MB)
// DEPOIS: import apenas tipos + lazy load sob demanda

import { LucideIcon, LucideProps } from 'lucide-react';
import { lazy, ComponentType } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// Cache de ícones já carregados para evitar re-imports
const iconCache = new Map<string, ComponentType<any>>();

// Lista de ícones mais comuns (preload opcional)
const COMMON_ICONS = [
  'Star', 'Check', 'X', 'ChevronLeft', 'ChevronRight',
  'Save', 'Edit', 'Trash', 'Plus', 'Minus', 'Settings',
  'AlertCircle', 'CheckCircle', 'XCircle', 'Loader2'
];

// This function returns a React component type that renders the specified Lucide icon
// Usando dynamic import para tree shaking
export const dynamicIconImport = (iconName: string): React.ElementType => {
  // Default to Star if icon not found
  if (!iconName || typeof iconName !== 'string') {
    return lazy(() => import('lucide-react').then(mod => ({ default: mod.Star })));
  }

  // Convert to pascal case for Lucide component names
  // e.g., 'check-circle' becomes 'CheckCircle'
  const formatIconName = (name: string) => {
    return name
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
  };

  const formattedName = formatIconName(iconName);

  // Check cache first
  if (iconCache.has(formattedName)) {
    return iconCache.get(formattedName)!;
  }

  // Lazy load icon dynamically
  const LazyIcon = lazy(async () => {
    try {
      const icons = await import('lucide-react');
      const IconComponent = icons[formattedName as keyof typeof icons];

      if (IconComponent && typeof IconComponent === 'function') {
        return { default: IconComponent as ComponentType<any> };
      }

      // Fallback to Star
      return { default: icons.Star };
    } catch (error) {
      appLogger.warn(`Icon ${formattedName} not found, using Star as fallback`);
      const icons = await import('lucide-react');
      return { default: icons.Star };
    }
  });

  iconCache.set(formattedName, LazyIcon);
  return LazyIcon;
};

// Function to get all available icon names
// NOTA: Esta função agora requer um import assíncrono
export const getAvailableIcons = async (): Promise<string[]> => {
  try {
    const Icons = await import('lucide-react');
    return Object.keys(Icons)
      .filter(
        key => typeof Icons[key as keyof typeof Icons] === 'function' && key !== 'createLucideIcon',
      )
      .map(key => {
        // Convert PascalCase to kebab-case
        return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      });
  } catch (error) {
    appLogger.error('Error loading icons list:', { data: [error] });
    return [];
  }
};

// Função helper para preload de ícones comuns
export const preloadCommonIcons = async () => {
  const icons = await import('lucide-react');
  COMMON_ICONS.forEach(iconName => {
    if (!iconCache.has(iconName)) {
      const IconComponent = icons[iconName as keyof typeof icons];
      if (IconComponent) {
        iconCache.set(iconName, IconComponent as ComponentType<any>);
      }
    }
  });
};
