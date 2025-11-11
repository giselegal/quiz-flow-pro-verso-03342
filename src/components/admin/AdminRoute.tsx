/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Adicionar validação de props mais robusta
 * - [ ] Implementar sistema de permissões se necessário
 * - [ ] Considerar logging de acesso administrativo
 * - [ ] Adicionar error boundary para componentes admin
 */

import React from 'react';
import { appLogger } from '@/lib/utils/appLogger';

interface AdminRouteProps {
  children: React.ReactNode;
  requireEditor?: boolean;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children, requireEditor = false }) => {
  appLogger.info('AdminRoute accessed', { data: [{ requireEditor }] });

  // Acesso livre ao painel administrativo - sem autenticação
  return <>{children}</>;
};
