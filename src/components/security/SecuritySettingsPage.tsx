/**
 * Página de Configurações de Segurança
 * Interface para gerenciar configurações de segurança do usuário
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { useBackupSystem } from '@/hooks/useBackupSystem';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Lock, 
  Key, 
  Clock, 
  Database, 
  AlertTriangle,
  CheckCircle,
  Download,
  Settings,
  RefreshCw
} from 'lucide-react';

interface SecuritySettings {
  id?: string;
  user_id: string;
  two_factor_enabled: boolean;
  backup_notifications: boolean;
  security_alerts: boolean;
  session_timeout: number;
  last_password_change?: string | null;
  login_attempts?: number | null;
  locked_until?: string | null;
}

export const SecuritySettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const { 
    logSecurityEvent, 
    checkHealth, 
    systemStatus,
    isSystemHealthy 
  } = useSecurityMonitor();
  
  const {
    createBackup,
    listBackups,
    cleanupOldBackups,
    isLoading: backupLoading
  } = useBackupSystem();

  const [recentBackups, setRecentBackups] = useState<any[]>([]);

  useEffect(() => {
    loadSecuritySettings();
    loadRecentBackups();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_security_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Convert null values to appropriate defaults
        const processedData: SecuritySettings = {
          ...data,
          two_factor_enabled: data.two_factor_enabled ?? false,
          backup_notifications: data.backup_notifications ?? true,
          security_alerts: data.security_alerts ?? true,
          session_timeout: data.session_timeout ?? 3600
        };
        setSettings(processedData);
      } else {
        // Criar configuração padrão
        const defaultSettings: SecuritySettings = {
          user_id: user.id,
          two_factor_enabled: false,
          backup_notifications: true,
          security_alerts: true,
          session_timeout: 3600
        };
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to load security settings:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar configurações de segurança.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentBackups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const backups = await listBackups(user.id, 5);
      setRecentBackups(backups);
    } catch (error) {
      console.error('Failed to load recent backups:', error);
    }
  };

  const saveSecuritySettings = async (updatedSettings: Partial<SecuritySettings>) => {
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !settings) return;

      const newSettings = { ...settings, ...updatedSettings };

      const { error } = await supabase
        .from('user_security_settings')
        .upsert({
          ...newSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(newSettings);

      // Log da alteração
      await logSecurityEvent({
        event_type: 'security_settings_updated',
        event_data: {
          changes: Object.keys(updatedSettings),
          two_factor_enabled: newSettings.two_factor_enabled
        },
        severity: 'medium'
      });

      toast({
        title: "Sucesso",
        description: "Configurações de segurança atualizadas.",
      });

    } catch (error) {
      console.error('Failed to save security settings:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await createBackup({
        type: 'full',
        description: 'Manual backup from security settings',
        user_id: user.id
      });

      toast({
        title: "Backup Criado",
        description: "Backup iniciado com sucesso.",
      });

      // Recarregar lista de backups
      await loadRecentBackups();

    } catch (error) {
      console.error('Backup creation failed:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar backup.",
        variant: "destructive"
      });
    }
  };

  const handleCleanupBackups = async () => {
    try {
      await cleanupOldBackups();
      toast({
        title: "Sucesso",
        description: "Backups antigos removidos com sucesso.",
      });
      await loadRecentBackups();
    } catch (error) {
      console.error('Cleanup failed:', error);
      toast({
        title: "Erro",
        description: "Falha ao limpar backups antigos.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Carregando configurações...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Não foi possível carregar as configurações de segurança.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Configurações de Segurança</h1>
      </div>

      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Status do Sistema
            {isSystemHealthy ? (
              <Badge variant="default">
                <CheckCircle className="w-3 h-3 mr-1" />
                Saudável
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Atenção Requerida
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Último Health Check:</span>
              <span className="ml-2">
                {systemStatus ? new Date(systemStatus.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">Eventos Críticos:</span>
              <span className="ml-2 text-destructive">
                {systemStatus?.summary?.critical_events || 0}
              </span>
            </div>
            <div>
              <span className="font-medium">Tentativas de Login:</span>
              <span className="ml-2">
                {settings.login_attempts || 0}
              </span>
            </div>
          </div>
          <Button onClick={checkHealth} size="sm" className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Verificar Sistema
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="authentication">Autenticação</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="security-alerts">Alertas de Segurança</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações sobre eventos de segurança
                  </p>
                </div>
                <Switch
                  id="security-alerts"
                  checked={settings.security_alerts}
                  onCheckedChange={(checked) => 
                    saveSecuritySettings({ security_alerts: checked })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backup-notifications">Notificações de Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações sobre status de backups
                  </p>
                </div>
                <Switch
                  id="backup-notifications"
                  checked={settings.backup_notifications}
                  onCheckedChange={(checked) => 
                    saveSecuritySettings({ backup_notifications: checked })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Timeout da Sessão (segundos)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.session_timeout}
                  onChange={(e) => 
                    saveSecuritySettings({ session_timeout: parseInt(e.target.value) || 3600 })
                  }
                  disabled={isSaving}
                  min={300}
                  max={86400}
                />
                <p className="text-sm text-muted-foreground">
                  Tempo limite para sessões inativas (5 min - 24 horas)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Autenticação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicionar camada extra de segurança ao login
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.two_factor_enabled}
                  onCheckedChange={(checked) => 
                    saveSecuritySettings({ two_factor_enabled: checked })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <Label>Última Alteração de Senha</Label>
                  <p className="text-sm">
                    {settings.last_password_change 
                      ? new Date(settings.last_password_change).toLocaleDateString()
                      : 'Não registrado'
                    }
                  </p>
                </div>
                <div>
                  <Label>Status da Conta</Label>
                  <p className="text-sm">
                    {settings.locked_until && new Date(settings.locked_until) > new Date() 
                      ? 'Bloqueada temporariamente'
                      : 'Ativa'
                    }
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Sistema de Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateBackup}
                  disabled={backupLoading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Criar Backup Manual
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleCleanupBackups}
                  disabled={backupLoading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Limpar Backups Antigos
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Backups Recentes</Label>
                {recentBackups.length > 0 ? (
                  <div className="space-y-2">
                    {recentBackups.map((backup: any) => (
                      <div key={backup.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{backup.type}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {new Date(backup.created_at).toLocaleString()}
                          </span>
                        </div>
                        <Badge variant={
                          backup.status === 'completed' ? 'default' :
                          backup.status === 'failed' ? 'destructive' : 'secondary'
                        }>
                          {backup.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum backup encontrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Monitoramento de Atividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Sessões Ativas:</span>
                    <span className="ml-2">1</span>
                  </div>
                  <div>
                    <span className="font-medium">Último Acesso:</span>
                    <span className="ml-2">Agora</span>
                  </div>
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    O monitoramento detalhado de sessões será implementado em breve.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};