/**
 * useApiError Hook
 * Handles API errors with toast notifications
 */

import { toast } from 'sonner';
import { APIError } from '@/lib/api-client';
import { appLogger } from '@/lib/utils/appLogger';

export function useApiError() {
  const handleError = (error: unknown) => {
    if (error instanceof APIError) {
      // Custom messages by error code
      const messages: Record<string, string> = {
        FUNNEL_NOT_FOUND: 'Funnel não encontrado',
        TEMPLATE_NOT_FOUND: 'Template não encontrado',
        VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
        CONFLICT: 'Conflito detectado. A página será recarregada.',
        UNAUTHORIZED: 'Você precisa fazer login',
        FORBIDDEN: 'Você não tem permissão para esta ação',
        RATE_LIMIT_EXCEEDED: 'Muitas requisições. Aguarde um momento.',
        NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
        DATABASE_ERROR: 'Erro no banco de dados. Tente novamente.',
        INTERNAL_SERVER_ERROR: 'Erro interno. Tente novamente.',
      };

      const message = messages[error.code] || error.message;

      toast.error(message, {
        description: error.details && typeof error.details === 'object'
          ? JSON.stringify(error.details, null, 2)
          : undefined,
        action: error.code === 'CONFLICT' ? {
          label: 'Recarregar',
          onClick: () => window.location.reload(),
        } : undefined,
        duration: 5000,
      });

      // Special handling for auth errors
      if (error.code === 'UNAUTHORIZED') {
        // Optionally redirect to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }

      // Log for debugging
      appLogger.error('[API Error]', { data: [{
                code: error.code,
                message: error.message,
                statusCode: error.statusCode,
                details: error.details,
                requestId: error.requestId,
              }] });
    } else {
      // Generic error
      toast.error('Erro inesperado', {
        description: error instanceof Error ? error.message : 'Tente novamente',
        duration: 5000,
      });

      appLogger.error('[Unexpected Error]', { data: [error] });
    }
  };

  return { handleError };
}
