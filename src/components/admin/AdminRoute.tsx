// @ts-nocheck
import React from "react";

interface AdminRouteProps {
  children: React.ReactNode;
  requireEditor?: boolean;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children, requireEditor = false }) => {
  // Acesso livre ao painel administrativo - sem autenticação
  return <>{children}</>;
};
