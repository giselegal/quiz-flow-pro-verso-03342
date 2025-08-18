// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Bell,
  Settings,
  Mail,
  Smartphone,
  Activity,
  Clock,
  BarChart3,
  X,
  Trash2,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ABTestMetrics {
  variant: 'A' | 'B';
  route: string;
  description: string;
  pixelId: string;
  visitors: number;
  conversionRate: number;
  quizStarts: number;
  quizCompletions: number;
  leads: number;
  sales: number;
  averageSessionTime: number;
  bounceRate: number;
  revenue: number;
}

interface ABTestAlertsProps {
  metrics: { A: ABTestMetrics; B: ABTestMetrics };
  significance: boolean;
  confidenceLevel: number;
  winner: 'A' | 'B' | 'tie' | null;
}

interface AlertConfig {
  enabled: boolean;
  significanceThreshold: number;
  minimumSampleSize: number;
  emailNotifications: boolean;
  emailAddress: string;
  autoEndTest: boolean;
  maxDuration: number; // dias
}

interface ABTestAlert {
  id: string;
  type: 'significance_reached' | 'sample_size_warning' | 'duration_warning' | 'conversion_anomaly';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  variant?: 'A' | 'B';
  metric?: string;
  value?: number;
}

const ABTestAlerts: React.FC<ABTestAlertsProps> = ({
  metrics,
  significance,
  confidenceLevel,
  winner,
}) => {
  const [config, setConfig] = useState<AlertConfig>({
    enabled: true,
    significanceThreshold: 95,
    minimumSampleSize: 100,
    emailNotifications: false,
    emailAddress: '',
    autoEndTest: false,
    maxDuration: 30,
  });

  const [alerts, setAlerts] = useState<ABTestAlert[]>([]);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem('abtest_alert_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    // Carregar alertas salvos
    const savedAlerts = localStorage.getItem('abtest_alerts');
    if (savedAlerts) {
      setAlerts(
        JSON.parse(savedAlerts).map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
        }))
      );
    }
  }, []);

  useEffect(() => {
    // Verificar alertas quando métricas mudarem
    if (config.enabled && metrics) {
      checkForAlerts();
    }
  }, [metrics, significance, confidenceLevel, winner, config.enabled]);

  useEffect(() => {
    // Salvar configurações quando alteradas
    localStorage.setItem('abtest_alert_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    // Salvar alertas quando alterados
    localStorage.setItem('abtest_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const checkForAlerts = () => {
    if (!config.enabled || !metrics) return;

    try {
      const now = new Date();
      const newAlerts: ABTestAlert[] = [];

      // 1. Verificar significância estatística
      if (confidenceLevel >= config.significanceThreshold && significance && winner !== 'tie') {
        const existingAlert = alerts.find(
          a => a.type === 'significance_reached' && !a.acknowledged
        );
        if (!existingAlert) {
          newAlerts.push({
            id: `significance_${Date.now()}`,
            type: 'significance_reached',
            severity: 'high',
            title: '🎯 Significância Estatística Atingida!',
            message: `O teste A/B atingiu ${confidenceLevel.toFixed(1)}% de confiança. A Versão ${winner} está vencendo com uma taxa de conversão de ${winner === 'A' ? metrics.A.conversionRate.toFixed(2) : metrics.B.conversionRate.toFixed(2)}%.`,
            timestamp: now,
            acknowledged: false,
            variant: winner as 'A' | 'B',
            metric: 'conversion_rate',
            value: confidenceLevel,
          });
        }
      }

      // 2. Verificar tamanho mínimo da amostra
      const totalSample = metrics.A.visitors + metrics.B.visitors;
      if (totalSample < config.minimumSampleSize && totalSample > 10) {
        const existingAlert = alerts.find(a => a.type === 'sample_size_warning' && !a.acknowledged);
        if (!existingAlert) {
          newAlerts.push({
            id: `sample_${Date.now()}`,
            type: 'sample_size_warning',
            severity: 'medium',
            title: '⚠️ Amostra Pequena',
            message: `Tamanho atual da amostra: ${totalSample}. Recomenda-se aguardar pelo menos ${config.minimumSampleSize} visitantes para resultados confiáveis.`,
            timestamp: now,
            acknowledged: false,
            metric: 'sample_size',
            value: totalSample,
          });
        }
      }

      // 3. Verificar anomalias de conversão
      const conversionDiff = Math.abs(metrics.A.conversionRate - metrics.B.conversionRate);
      if (conversionDiff > 50 && totalSample > 50) {
        const existingAlert = alerts.find(a => a.type === 'conversion_anomaly' && !a.acknowledged);
        if (!existingAlert) {
          newAlerts.push({
            id: `anomaly_${Date.now()}`,
            type: 'conversion_anomaly',
            severity: 'high',
            title: '🚨 Anomalia Detectada',
            message: `Diferença muito grande entre as versões (${conversionDiff.toFixed(1)}%). Verifique se há problemas técnicos.`,
            timestamp: now,
            acknowledged: false,
            metric: 'conversion_rate',
            value: conversionDiff,
          });
        }
      }

      // Adicionar novos alertas
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]);

        // Mostrar toast para alertas de alta prioridade
        newAlerts.forEach(alert => {
          if (alert.severity === 'high') {
            toast({
              title: alert.title,
              description: alert.message,
              variant: alert.severity === 'high' ? 'destructive' : 'default',
            });
          }
        });
      }

      setLastCheck(now);
    } catch (error) {
      console.error('Erro ao verificar alertas:', error);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert => (alert.id === alertId ? { ...alert, acknowledged: true } : alert))
    );
  };

  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    toast({
      title: 'Alertas Limpos',
      description: 'Todos os alertas foram removidos',
    });
  };

  const getAlertIcon = (type: ABTestAlert['type']) => {
    switch (type) {
      case 'significance_reached':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sample_size_warning':
        return <AlertTriangle className="h-4 w-4 text-stone-600" />;
      case 'duration_warning':
        return <Clock className="h-4 w-4 text-[#B89B7A]" />;
      case 'conversion_anomaly':
        return <AlertTriangle style={{ color: '#432818' }} />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: ABTestAlert['severity']) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-stone-50';
      case 'low':
        return 'border-[#B89B7A]/30 bg-[#B89B7A]/10';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <div className="space-y-6">
      {/* Status e Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Sistema de Alertas A/B
              </CardTitle>
              <CardDescription>
                Monitoramento automático do teste com {unacknowledgedAlerts.length} alertas ativos
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={config.enabled ? 'default' : 'secondary'}>
                {config.enabled ? 'Ativo' : 'Inativo'}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              {alerts.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAllAlerts}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Tudo
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#B89B7A]">{alerts.length}</div>
              <div className="text-sm text-muted-foreground">Total de Alertas</div>
            </div>
            <div className="text-center">
              <div style={{ color: '#432818' }}>{unacknowledgedAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Não Confirmados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{acknowledgedAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Confirmados</div>
            </div>
            <div className="text-center">
              <div style={{ color: '#6B4F43' }}>
                {Math.floor((new Date().getTime() - lastCheck.getTime()) / 60000)}
                min
              </div>
              <div className="text-sm text-muted-foreground">Última Verificação</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações (Expansível) */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Alertas</CardTitle>
            <CardDescription>Personalize como e quando os alertas são gerados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="alert-enabled"
                    checked={config.enabled}
                    onCheckedChange={checked => setConfig(prev => ({ ...prev, enabled: checked }))}
                  />
                  <Label htmlFor="alert-enabled">Ativar Sistema de Alertas</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="significance-threshold">Nível de Confiança Mínimo (%)</Label>
                <Input
                  id="significance-threshold"
                  type="number"
                  min="80"
                  max="99"
                  value={config.significanceThreshold}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      significanceThreshold: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimum-sample">Tamanho Mínimo da Amostra</Label>
                <Input
                  id="minimum-sample"
                  type="number"
                  min="50"
                  max="1000"
                  value={config.minimumSampleSize}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      minimumSampleSize: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-duration">Duração Máxima (dias)</Label>
                <Input
                  id="max-duration"
                  type="number"
                  min="7"
                  max="90"
                  value={config.maxDuration}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      maxDuration: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Switch
                  id="email-notifications"
                  checked={config.emailNotifications}
                  onCheckedChange={checked =>
                    setConfig(prev => ({
                      ...prev,
                      emailNotifications: checked,
                    }))
                  }
                />
                <Label htmlFor="email-notifications">Notificações por Email</Label>
              </div>
              {config.emailNotifications && (
                <Input
                  placeholder="seu-email@exemplo.com"
                  value={config.emailAddress}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      emailAddress: e.target.value,
                    }))
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Alertas Ativos */}
      {unacknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle style={{ color: '#432818' }} />
              Alertas Ativos ({unacknowledgedAlerts.length})
            </CardTitle>
            <CardDescription>Alertas que requerem sua atenção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {unacknowledgedAlerts.map(alert => (
              <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <AlertTitle className="text-sm font-medium">{alert.title}</AlertTitle>
                      <AlertDescription className="text-sm mt-1">{alert.message}</AlertDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => clearAlert(alert.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Histórico de Alertas */}
      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Histórico de Alertas ({acknowledgedAlerts.length})
            </CardTitle>
            <CardDescription>Alertas já confirmados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {acknowledgedAlerts.slice(0, 5).map(alert => (
              <div
                key={alert.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type)}
                  <span className="text-sm">{alert.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {alert.timestamp.toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
            {acknowledgedAlerts.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{acknowledgedAlerts.length - 5} alertas mais antigos
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Estado Vazio */}
      {alerts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum Alerta</h3>
              <p className="text-muted-foreground">
                O sistema está monitorando seu teste A/B. Alertas aparecerão aqui quando necessário.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ABTestAlerts;
