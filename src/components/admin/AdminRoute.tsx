/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Adicionar validação de props mais robusta
 * - [ ] Implementar sistema de permissões se necessário
 * - [ ] Considerar logging de acesso administrativo
 * - [ ] Adicionar error boundary para componentes admin
 */

import React from 'react';
import { appLogger } from '@/utils/logger';

interface AdminRouteProps {
  children: React.ReactNode;
  requireEditor?: boolean;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children, requireEditor = false }) => {
  appLogger.debug('AdminRoute accessed', { requireEditor });

  // Acesso livre ao painel administrativo - sem autenticação
  return <>{children}</>;
};
