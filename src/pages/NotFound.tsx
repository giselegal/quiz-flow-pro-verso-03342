/**
 * 🚫 PÁGINA 404 - NOT FOUND - VERSÃO CORRIGIDA
 * 
 * Página personalizada para rotas não encontradas com:
 * - Design consistente com o tema
 * - Links úteis para navegação
 * - Informações de debug em desenvolvimento
 * - Corrigido para resolver problemas de importação
 */

import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Home,
  ArrowLeft,
  Settings,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface NotFoundProps {
  message?: string;
  showDebugInfo?: boolean;
}

const NotFound: React.FC<NotFoundProps> = ({
  message = "Página não encontrada",
  showDebugInfo = process.env.NODE_ENV === 'development'
}) => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const suggestedRoutes = [
    { path: '/', label: 'Página Inicial', icon: Home },
    { path: '/admin', label: 'Dashboard Admin', icon: Settings },
    { path: '/editor', label: 'Editor de Funis', icon: ExternalLink },
    { path: '/templates', label: 'Templates', icon: ExternalLink }
  ]; return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Error Icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-2">{message}</p>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Debug Information */}
        {showDebugInfo && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Informações de Debug</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Rota atual:</strong> {currentPath}</p>
                <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
                <p><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 60) + '...' : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suggested Routes */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Que tal visitar uma dessas páginas?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedRoutes.map((route) => (
                <Link key={route.path} href={route.path}>
                  <a className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                    <route.icon className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">{route.label}</span>
                  </a>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>

          <Link href="/">
            <Button className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Página Inicial</span>
            </Button>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Ainda com problemas? Entre em contato com o suporte.</p>
          <p className="mt-1">
            Email: <a href="mailto:suporte@empresa.com" className="text-primary hover:underline">
              suporte@empresa.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;