/**
 * 🛡️ EDITOR FALLBACK - Componente de Fallback para Erros de Editor
 * 
 * Componente que detecta e corrige problemas de contexto do editor
 * quando o React Error #300 ocorre.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Settings, 
  Bug,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface EditorFallbackProps {
  error?: Error;
  resetError?: () => void;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export default function EditorFallback({ 
  error, 
  resetError, 
  onRetry, 
  onGoHome 
}: EditorFallbackProps) {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Coletar diagnósticos do sistema
    const collectDiagnostics = () => {
      const diagnostics = {
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'SSR',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
        reactVersion: (React as any).version,
        contextErrors: (window as any).__EDITOR_CONTEXT_ERROR__ || [],
        globalErrors: (window as any).__FIRST_GLOBAL_ERROR__ || null,
        editorElements: typeof document !== 'undefined' ? 
          document.querySelectorAll('[class*="editor"], [class*="Editor"]').length : 0,
        providerElements: typeof document !== 'undefined' ? 
          document.querySelectorAll('[class*="provider"], [class*="Provider"]').length : 0,
        localStorage: typeof localStorage !== 'undefined' ? 
          Object.keys(localStorage).filter(key => key.includes('editor') || key.includes('funnel')).length : 0,
        sessionStorage: typeof sessionStorage !== 'undefined' ? 
          Object.keys(sessionStorage).filter(key => key.includes('editor') || key.includes('funnel')).length : 0
      };

      setDiagnostics(diagnostics);
      return diagnostics;
    };

    collectDiagnostics();
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      // Limpar contextos problemáticos
      if (typeof window !== 'undefined') {
        // Limpar erros de contexto
        delete (window as any).__EDITOR_CONTEXT_ERROR__;
        delete (window as any).__FIRST_GLOBAL_ERROR__;
        
        // Limpar localStorage problemático
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.includes('editor') && key.includes('error')
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }

      // Aguardar um pouco antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onRetry) {
        onRetry();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Erro ao tentar recuperar:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleHardRefresh = () => {
    if (typeof window !== 'undefined') {
      // Limpar cache e recarregar
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('editor') || name.includes('funnel')) {
              caches.delete(name);
            }
          });
        });
      }
      
      // Hard refresh
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header do Erro */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <CardTitle className="text-red-800">
                  Erro no Editor
                </CardTitle>
                <CardDescription className="text-red-600">
                  Ocorreu um erro inesperado no editor. Isso pode ser causado por um problema de contexto.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Mensagem de Erro */}
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Minified React error #300</strong> - visit{' '}
            <a 
              href="https://reactjs.org/docs/error-decoder.html?invariant=300" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://reactjs.org/docs/error-decoder.html?invariant=300
            </a>{' '}
            for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
          </AlertDescription>
        </Alert>

        {/* Ações de Recuperação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Ações de Recuperação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="w-full"
                variant="default"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Tentando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    🔄 Recarregar Página
                  </>
                )}
              </Button>

              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                🏠 Voltar ao Início
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                Se o problema persistir, tente:
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleHardRefresh}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Ctrl+Shift+R (hard refresh)
                </Button>
                <Button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Limpar cache do navegador
                </Button>
                <Button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open(window.location.href, '_blank');
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Usar modo incógnito
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnósticos (apenas em desenvolvimento) */}
        {diagnostics && process.env.NODE_ENV === 'development' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5" />
                Diagnósticos do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Timestamp:</strong> {diagnostics.timestamp}
                  </div>
                  <div>
                    <strong>URL:</strong> {diagnostics.url}
                  </div>
                  <div>
                    <strong>React Version:</strong> {diagnostics.reactVersion}
                  </div>
                  <div>
                    <strong>Context Errors:</strong> {diagnostics.contextErrors.length}
                  </div>
                  <div>
                    <strong>Editor Elements:</strong> {diagnostics.editorElements}
                  </div>
                  <div>
                    <strong>Provider Elements:</strong> {diagnostics.providerElements}
                  </div>
                </div>

                {diagnostics.contextErrors.length > 0 && (
                  <div>
                    <strong>Context Errors:</strong>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(diagnostics.contextErrors, null, 2)}
                    </pre>
                  </div>
                )}

                {diagnostics.globalErrors && (
                  <div>
                    <strong>Global Error:</strong>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(diagnostics.globalErrors, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
