/**
 * 🚨 DISASTER RECOVERY PANEL - Phase 4 Implementation
 * Comprehensive recovery and rollback management
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, RotateCcw, Database, Clock, CheckCircle, XCircle, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { rollbackService, type DeploymentVersion, type RollbackResult } from '@/services/rollback/RollbackService';
import { backupService, type BackupData, type RestorePoint } from '@/services/backup/BackupService';

interface DisasterRecoveryPanelProps {
  className?: string;
}

export const DisasterRecoveryPanel: React.FC<DisasterRecoveryPanelProps> = ({ className }) => {
  const [deployments, setDeployments] = useState<DeploymentVersion[]>([]);
  const [activeDeployment, setActiveDeployment] = useState<DeploymentVersion | null>(null);
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>([]);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDeployments(rollbackService.getDeploymentHistory());
    setActiveDeployment(rollbackService.getActiveDeployment());
    setBackups(backupService.getBackups());
    setRestorePoints(backupService.getRestorePoints());
  };

  const handleRollback = async (targetVersion?: string) => {
    if (isRollingBack) return;

    setIsRollingBack(true);
    
    try {
      toast({
        title: "🔄 Iniciando Rollback",
        description: "Executando rollback para versão anterior...",
      });

      const result: RollbackResult = await rollbackService.rollback(
        targetVersion, 
        'Manual rollback from disaster recovery panel'
      );

      if (result.success) {
        toast({
          title: "✅ Rollback Concluído",
          description: `Rollback de ${result.fromVersion} para ${result.toVersion} executado em ${result.rollbackTime}ms`,
        });
        loadData();
      } else {
        throw new Error('Rollback failed');
      }

    } catch (error) {
      toast({
        title: "❌ Rollback Falhou",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
    } finally {
      setIsRollingBack(false);
    }
  };

  const handleCreateBackup = async () => {
    if (isBackingUp) return;

    setIsBackingUp(true);
    
    try {
      toast({
        title: "💾 Criando Backup",
        description: "Executando backup manual...",
      });

      const backupId = await backupService.createBackup('manual', 'Manual backup from disaster recovery panel');

      toast({
        title: "✅ Backup Criado",
        description: `Backup ${backupId} criado com sucesso`,
      });
      
      loadData();

    } catch (error) {
      toast({
        title: "❌ Backup Falhou",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    if (isRestoring) return;

    setIsRestoring(true);
    
    try {
      toast({
        title: "🔄 Iniciando Restauração",
        description: "Restaurando dados do backup...",
      });

      const success = await backupService.restoreFromBackup(backupId);

      if (success) {
        toast({
          title: "✅ Restauração Concluída",
          description: `Dados restaurados do backup ${backupId}`,
        });
        loadData();
        
        // Recarregar página para aplicar mudanças
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error('Restore failed');
      }

    } catch (error) {
      toast({
        title: "❌ Restauração Falhou",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'standby': return 'bg-blue-500';
      case 'rollback': return 'bg-yellow-500';  
      case 'failed': return 'bg-red-500';
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`} data-testid="disaster-recovery-panel">
      {/* Emergency Actions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Disaster Recovery
          </h2>
          <p className="text-muted-foreground">
            Emergency rollback and backup management
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleRollback()}
            disabled={isRollingBack || !activeDeployment}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {isRollingBack ? 'Rolling Back...' : 'Emergency Rollback'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCreateBackup}
            disabled={isBackingUp}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            {isBackingUp ? 'Creating...' : 'Create Backup'}
          </Button>
        </div>
      </div>

      {/* Current System Status */}
      {activeDeployment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Current Deployment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="font-mono font-medium">{activeDeployment.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <p className="font-medium">{activeDeployment.healthScore}/100</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deployed</p>
                <p className="text-sm">{formatTimestamp(activeDeployment.timestamp)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Tabs */}
      <Tabs defaultValue="deployments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="restore-points">Restore Points</TabsTrigger>
        </TabsList>

        <TabsContent value="deployments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment History</CardTitle>
              <CardDescription>Recent deployments available for rollback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deployments.map((deployment) => (
                  <div key={deployment.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(deployment.status)}>
                          {deployment.status}
                        </Badge>
                        <span className="font-mono text-sm">{deployment.version}</span>
                        <span className="text-sm text-muted-foreground">
                          Build: {deployment.buildId}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatTimestamp(deployment.timestamp)} • Health: {deployment.healthScore}/100
                      </div>
                    </div>
                    
                    {deployment.status !== 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRollback(deployment.id)}
                        disabled={isRollingBack}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Rollback
                      </Button>
                    )}
                  </div>
                ))}
                
                {deployments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p>No deployment history available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>Available backups for data recovery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {backups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(backup.status)}>
                          {backup.status}
                        </Badge>
                        <span className="font-mono text-sm">{backup.type}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatSize(backup.size)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatTimestamp(backup.timestamp)} • {backup.metadata.triggerReason}
                      </div>
                    </div>
                    
                    {backup.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(backup.id)}
                        disabled={isRestoring}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-3 w-3" />
                        Restore
                      </Button>
                    )}
                  </div>
                ))}
                
                {backups.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-8 w-8 mx-auto mb-2" />
                    <p>No backups available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restore-points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restore Points</CardTitle>
              <CardDescription>Verified restoration points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {restorePoints.map((point) => (
                  <div key={point.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {point.verified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">{point.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {point.description} • {formatTimestamp(point.timestamp)}
                      </div>
                      {point.restoreTime && (
                        <div className="text-xs text-muted-foreground">
                          Last restored in {point.restoreTime}ms
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(point.backupId)}
                      disabled={isRestoring || !point.verified}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-3 w-3" />
                      Restore
                    </Button>
                  </div>
                ))}
                
                {restorePoints.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p>No restore points available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DisasterRecoveryPanel;