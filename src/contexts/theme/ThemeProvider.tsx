/**
 * 🎨 THEME PROVIDER - LEGACY REDIRECT
 * 
 * ⚠️ DEPRECATED: Este arquivo foi movido para /src/core/contexts/theme/
 * 
 * @deprecated Use import { ThemeProvider, useTheme } from '@/core/contexts/theme'
 */

import { appLogger } from '@/lib/utils/appLogger';

// Re-export do core
export { ThemeProvider, useTheme } from '@/core/contexts/theme';
export type { ThemeMode, ThemeColors, ThemeTypography, ThemeContextValue } from '@/core/contexts/theme';

// Warning em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  appLogger.warn(
    '⚠️ DEPRECATED: ThemeProvider de @/contexts/theme/\n' +
    'Migre para: @/core/contexts/theme'
  );
}
