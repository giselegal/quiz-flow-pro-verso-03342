/**
 * 💾 PÁGINA DE BACKUP - DADOS REAIS
 * 
 * Sistema de backup integrado com Supabase
 */

import React, { useState, useEffect } from 'react';
import { EnhancedUnifiedDataService } from '@/services/core/EnhancedUnifiedDataService';
import { useBackupSystem } from '@/hooks/useBackupSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Archive, Trash2, Clock, Database } from 'lucide-react';

interface BackupJob {
  id: string;
  type: string;
  status: string;
  created_at: string;
  completed_at?: string;
  size_bytes?: number;
  description?: string;
}

const BackupPage: React.FC = () => {
  // Real data integration
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const metrics = await EnhancedUnifiedDataService.getRealTimeMetrics();
        setRealTimeMetrics(metrics);
        console.log('✅ BackupPage carregado com dados reais:', metrics);
      } catch (error) {
        console.error('❌ Erro ao carregar dados reais:', error);
      }
    };
    
    loadRealData();
  }, []);
  
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
      const backupList = await listBackups();
      setBackups(backupList || []);
    } catch (error) {
      console.error('Erro ao carregar backups:', error);
    }
  };

  const handleCreateBackup = async () => {
    try {
      const backup = await createBackup(['funnels', 'quiz_sessions', 'quiz_users']);
      setCurrentBackup(backup);
      await loadBackups();
    } catch (error) {
      console.error('Erro ao criar backup:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sistema de Backup</h1>
        <p className="text-gray-600">Backup e restore de dados do sistema</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Total de Backups</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{backups.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Último Backup</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {backups[0]?.created_at ? new Date(backups[0].created_at).toLocaleString() : 'Nenhum backup'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Archive className="h-5 w-5" />
              <span>Status Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              ✅ Operacional
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Backup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleCreateBackup} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              Criar Backup Completo
            </Button>
            
            <Button onClick={createEmergencyBackup} variant="outline" disabled={isLoading}>
              <Archive className="h-4 w-4 mr-2" />
              Backup Emergencial
            </Button>
            
            <Button onClick={cleanupOldBackups} variant="outline" disabled={isLoading}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Backups Antigos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Backup Status */}
      {currentBackup && (
        <Card>
          <CardHeader>
            <CardTitle>Backup em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>ID:</strong> {currentBackup.id}</p>
              <p><strong>Tipo:</strong> {currentBackup.type}</p>
              <p><strong>Status:</strong> {currentBackup.status}</p>
              <Badge variant="outline">
                {currentBackup.status === 'completed' ? '✅ Concluído' : '🔄 Em andamento'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Backups</CardTitle>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <p className="text-gray-500">Nenhum backup encontrado</p>
          ) : (
            <div className="space-y-3">
              {backups.slice(0, 10).map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{backup.type}</p>
                    <p className="text-sm text-gray-600">{backup.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(backup.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {backup.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupPage;
