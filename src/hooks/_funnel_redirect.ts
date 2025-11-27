/**
 * 🔄 FUNNEL HOOKS - LEGACY REDIRECT
 * 
 * ⚠️ DEPRECATED: Estes hooks foram movidos para o core.
 * 
 * MIGRAÇÃO:
 * De: import { useFunnelLoader } from '@/hooks/useFunnelLoader'
 * Para: import { useFunnelLoader } from '@/core/funnel/hooks'
 * 
 * Este arquivo será removido na próxima versão.
 */

import { appLogger } from '@/lib/utils/appLogger';

if (process.env.NODE_ENV === 'development') {
  appLogger.warn(
    '⚠️ DEPRECATED: Importing funnel hooks from @/hooks\n' +
    'Migre para: import from "@/core/funnel/hooks"\n' +
    'Ver: docs/CORE_MIGRATION_GUIDE.md'
  );
}

// Re-export do core
export * from '@/core/funnel/hooks';
