/**
 * 🎨 useTheme - Hook de Tema Unificado
 * 
 * Hook adapter que conecta ao themeStore Zustand.
 * Mantém compatibilidade com código existente que usa useTheme.
 * 
 * @example
 * ```tsx
 * const { theme, setTheme, toggleTheme, isDark } = useTheme();
 * ```
 */

import { useThemeStore } from '@/contexts/store/themeStore';
import { useMemo } from 'react';

export function useTheme() {
  const store = useThemeStore();

  return useMemo(
    () => ({
      // State
      theme: store.theme,
      resolvedTheme: store.resolvedTheme,
      isDark: store.resolvedTheme === 'dark',
      isLight: store.resolvedTheme === 'light',

      // Actions
      setTheme: store.setTheme,
      toggleTheme: store.toggleTheme,
    }),
    [store.theme, store.resolvedTheme, store.setTheme, store.toggleTheme],
  );
}

export default useTheme;
