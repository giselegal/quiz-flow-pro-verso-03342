/**
 * 🔐 AUTH PROVIDER - LEGACY REDIRECT
 * 
 * ⚠️ DEPRECATED: Este arquivo foi movido para /src/core/contexts/auth/
 * 
 * @deprecated Use import { AuthProvider, useAuth } from '@/core/contexts/auth'
 */

import { appLogger } from '@/lib/utils/appLogger';

// Re-export do core
export { AuthProvider, useAuth } from '@/core/contexts/auth';
export type { User, AuthState, AuthContextValue } from '@/core/contexts/auth';

// Warning em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  appLogger.warn(
    '⚠️ DEPRECATED: AuthProvider de @/contexts/auth/\n' +
    'Migre para: @/core/contexts/auth'
  );
}
