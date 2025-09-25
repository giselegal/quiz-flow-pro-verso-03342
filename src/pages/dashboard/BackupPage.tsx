/**
 * 💾 PÁGINA DE BACKUP & RECOVERY - FASE 4
 * Sistema completo de backup e disaster recovery
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBackupSystem } from '@/hooks/useBackupSystem';
import { 
  HardDrive,
  Shield,
  Download,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
  Database,
  Archive,
  History
} from 'lucide-react';

interface BackupJob {
  id: string;
  type: 'full' | 'incremental' | 'selective' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed';
  tables: string[];
  description?: string;
  size_bytes?: number;
  created_at: string;
  completed_at?: string;
}

export const BackupPage: React.FC = () => {
  const { 
    isLoading, 
    error, 
    createBackup, 
    listBackups,
    createEmergencyBackup,
    cleanupOldBackups
  } = useBackupSystem();
  
  const [backups, setBackups] = useState<BackupJob[]>([]);
  const [currentBackup, setCurrentBackup] = useState<BackupJob | null>(null);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const backupList = await listBackups(undefined, 10);
      setBackups(backupList);
    } catch (err) {
      console.error('Erro ao carregar backups:', err);
    }
  };

  const handleCreateBackup = async (type: 'full' | 'incremental' | 'selective' = 'full') => {
    try {
      const backup = await createBackup({
        type,
        description: `Backup ${type} criado manualmente em ${new Date().toLocaleString()}`
      });
      setCurrentBackup(backup);
      await loadBackups();
    } catch (err) {
      console.error('Erro ao criar backup:', err);
    }
  };

  const handleEmergencyBackup = async () => {
    try {
      const backup = await createEmergencyBackup('Backup de emergência solicitado pelo usuário');
      setCurrentBackup(backup);
      await loadBackups();
    } catch (err) {
      console.error('Erro ao criar backup de emergência:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>;
      case 'running':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Executando</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 KB';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Métricas de Backup */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">ATIVO</div>
            <p className="text-xs text-muted-foreground">
              Sistema de backup operacional
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backups Totais</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {backups[0] ? new Date(backups[0].created_at).toLocaleDateString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {backups[0] ? `${backups[0].type} - ${getStatusBadge(backups[0].status)}` : 'Nenhum backup'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espaço Utilizado</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(backups.reduce((acc, b) => acc + (b.size_bytes || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Total armazenado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Criar Backup</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => handleCreateBackup('full')}
              disabled={isLoading}
              className="h-20 flex-col space-y-2"
            >
              <HardDrive className="w-6 h-6" />
              <span>Backup Completo</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => handleCreateBackup('incremental')}
              disabled={isLoading}
              className="h-20 flex-col space-y-2"
            >
              <Upload className="w-6 h-6" />
              <span>Backup Incremental</span>
            </Button>

            <Button 
              variant="outline"
              onClick={() => handleCreateBackup('selective')}
              disabled={isLoading}
              className="h-20 flex-col space-y-2"
            >
              <Database className="w-6 h-6" />
              <span>Backup Seletivo</span>
            </Button>

            <Button 
              variant="destructive"
              onClick={handleEmergencyBackup}
              disabled={isLoading}
              className="h-20 flex-col space-y-2"
            >
              <Shield className="w-6 h-6" />
              <span>Backup Emergência</span>
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              Erro: {error}
            </div>
          )}

          {currentBackup && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                {getStatusIcon(currentBackup.status)}
                <span className="font-medium">
                  Backup em execução: {currentBackup.type}
                </span>
                {getStatusBadge(currentBackup.status)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {currentBackup.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Backups */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Histórico de Backups</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={cleanupOldBackups}>
              <Archive className="w-4 h-4 mr-2" />
              Limpeza
            </Button>
            <Button variant="outline" size="sm" onClick={loadBackups}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum backup encontrado</p>
                <p className="text-sm">Crie seu primeiro backup usando as opções acima</p>
              </div>
            ) : (
              backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(backup.status)}
                    <div>
                      <div className="font-medium">
                        Backup {backup.type} • {backup.id.slice(0, 8)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {backup.description || 'Sem descrição'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Criado: {new Date(backup.created_at).toLocaleString()}
                        {backup.completed_at && (
                          <> • Concluído: {new Date(backup.completed_at).toLocaleString()}</>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      {getStatusBadge(backup.status)}
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(backup.size_bytes)}
                      </div>
                    </div>
                    {backup.status === 'completed' && (
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupPage;