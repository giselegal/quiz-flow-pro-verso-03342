/**
 * 🎛️ PAINEL DE MIGRAÇÃO ADMINISTRATIVA
 * Interface para executar migrações via browser
 */

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Play, RefreshCw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { StorageService } from '@/services/core/StorageService';

interface MigrationStatus {
  hasSchema: boolean;
  tablesCreated: string[];
  missingTables: string[];
  needsMigration: boolean;
}

interface MigrationResult {
  success: boolean;
  message: string;
  executed: string[];
  errors: string[];
  timestamp: string;
}

export function MigrationPanel() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Carregar status inicial
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/migrate', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${StorageService.safeGetString('admin_token') || 'dev-token'}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeMigration = async () => {
    setIsExecuting(true);
    setMigrationResult(null);

    try {
      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${StorageService.safeGetString('admin_token') || 'dev-token'}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setMigrationResult(data.migration || data);

      // Atualizar status após migração
      await checkStatus();
    } catch (error: any) {
      setMigrationResult({
        success: false,
        message: 'Erro de conexão',
        executed: [],
        errors: [error.message],
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🚀 Migração do Schema</h1>
        <Button onClick={checkStatus} disabled={isLoading} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Status
        </Button>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Status do Schema
            {status?.hasSchema ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ativo
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Pendente
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Status atual das tabelas do banco de dados</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="ml-2">Verificando status...</span>
            </div>
          ) : status ? (
            <div className="space-y-4">
              {/* Tabelas Criadas */}
              {status.tablesCreated.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-600 mb-2">
                    ✅ Tabelas Existentes ({status.tablesCreated.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {status.tablesCreated.map(table => (
                      <Badge key={table} variant="default" style={{ backgroundColor: '#E5DDD5' }}>
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabelas Ausentes */}
              {status.missingTables.length > 0 && (
                <div>
                  <h4 style={{ color: '#432818' }}>
                    ❌ Tabelas Ausentes ({status.missingTables.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {status.missingTables.map(table => (
                      <Badge key={table} variant="destructive" className="bg-red-100 text-red-800">
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Status de Migração */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {status.needsMigration
                    ? '⚠️ Migração necessária para completar o schema'
                    : '✅ Schema está completo e atualizado'}
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Clique em "Atualizar Status" para verificar o schema
            </div>
          )}
        </CardContent>
      </Card>

      {/* Executar Migração */}
      {status?.needsMigration && (
        <Card>
          <CardHeader>
            <CardTitle>⚡ Executar Migração</CardTitle>
            <CardDescription>Execute a migração para criar as tabelas ausentes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={executeMigration} disabled={isExecuting} className="w-full" size="lg">
              <Play className={`w-4 h-4 mr-2 ${isExecuting ? 'animate-pulse' : ''}`} />
              {isExecuting ? 'Executando Migração...' : 'Executar Migração'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resultado da Migração */}
      {migrationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Resultado da Migração
              {migrationResult.success ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Sucesso
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 mr-1" />
                  Erro
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {migrationResult.timestamp && new Date(migrationResult.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className={migrationResult.success ? 'border-green-200' : 'border-red-200'}>
              <AlertDescription>{migrationResult.message}</AlertDescription>
            </Alert>

            {/* Statements Executados */}
            {migrationResult.executed.length > 0 && (
              <div>
                <h4 className="font-medium text-green-600 mb-2">
                  ✅ Executados ({migrationResult.executed.length})
                </h4>
                <div className="bg-green-50 p-3 rounded-md">
                  {migrationResult.executed.map((item, index) => (
                    <div key={index} style={{ color: '#6B4F43' }}>
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Erros */}
            {migrationResult.errors.length > 0 && (
              <div>
                <h4 style={{ color: '#432818' }}>❌ Erros ({migrationResult.errors.length})</h4>
                <div style={{ backgroundColor: '#FAF9F7' }}>
                  {migrationResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informações Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Informações Técnicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>
            • <strong>Schema:</strong> 002_complete_quiz_schema.sql
          </div>
          <div>
            • <strong>Tabelas principais:</strong> component_types, component_instances,
            component_presets
          </div>
          <div>
            • <strong>Funcionalidades:</strong> IDs semânticos, RLS policies, triggers automáticos
          </div>
          <div>
            • <strong>API:</strong> /api/admin/migrate (GET/POST)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MigrationPanel;
