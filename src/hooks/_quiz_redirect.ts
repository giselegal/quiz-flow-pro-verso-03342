/**
 * 🔄 QUIZ HOOKS - LEGACY REDIRECT
 * 
 * ⚠️ DEPRECATED: Estes hooks foram movidos para o core.
 * 
 * MIGRAÇÃO:
 * De: import { useQuizState } from '@/hooks/useQuizState'
 * Para: import { useQuizState } from '@/core/quiz/hooks'
 * 
 * Este arquivo será removido na próxima versão.
 */

import { appLogger } from '@/lib/utils/appLogger';

if (process.env.NODE_ENV === 'development') {
  appLogger.warn(
    '⚠️ DEPRECATED: Importing quiz hooks from @/hooks\n' +
    'Migre para: import from "@/core/quiz/hooks"\n' +
    'Ver: docs/CORE_MIGRATION_GUIDE.md'
  );
}

// Re-export do core
export * from '@/core/quiz/hooks';
