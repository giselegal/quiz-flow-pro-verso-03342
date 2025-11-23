/**
 * 🔴 PÁGINA DE MONITORAMENTO AO VIVO - FASE 2 TASK 8
 * 
 * Dashboard de monitoramento em tempo real com Supabase Realtime:
 * - Atividade ao vivo (sessões ativas, conversões recentes)
 * - Stream de eventos em tempo real
 * - Alertas de dropoff críticos
 * - Estatísticas por step em tempo real
 * 
 * @version 1.0.0 - Real-time Monitoring
 */

import React from 'react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Activity,
    Users,
    TrendingUp,
    Clock,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Wifi,
    WifiOff,
    Bell,
    BellOff,
    Zap,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const LiveMonitoringPage: React.FC = () => {
    const {
        liveActivity,
        recentEvents,
        dropoffAlerts,
        liveStepStats,
        isConnected,
        error,
        reconnect,
        clearAlerts,
        refresh,
    } = useRealTimeAnalytics({
        funnelId: 'quiz-21-steps-integrated',
        dropoffThreshold: 30,
        enableConversionNotifications: true,
        onConversion: (event) => {
            console.log('🎉 Nova conversão:', event);
            // Aqui você pode adicionar notificações do navegador
        },
        onDropoffAlert: (alert) => {
            console.warn('⚠️ Alerta de dropoff:', alert);
            // Aqui você pode adicionar notificações de alerta
        },
    });

    return (
        <div className="space-y-6 p-6">
            {/* Header com Status de Conexão */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#432818] to-[#6B4F43] bg-clip-text text-transparent">
                            Monitoramento ao Vivo
                        </h1>
                        <div className="flex items-center gap-2">
                            {isConnected ? (
                                <Badge variant="default" className="bg-green-600">
                                    <Wifi className="w-3 h-3 mr-1" />
                                    Conectado
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    <WifiOff className="w-3 h-3 mr-1" />
                                    Desconectado
                                </Badge>
                            )}
                            <Badge variant="outline" className="animate-pulse">
                                <Activity className="w-3 h-3 mr-1" />
                                Ao Vivo
                            </Badge>
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Atualizações em tempo real via Supabase Realtime
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refresh}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar
                    </Button>
                    {!isConnected && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={reconnect}
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            Reconectar
                        </Button>
                    )}
                </div>
            </div>

            {/* Erro de Conexão */}
            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erro de Conexão</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        <span>{error.message}</span>
                        <Button size="sm" variant="outline" onClick={reconnect}>
                            Tentar Novamente
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Métricas em Tempo Real */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            {liveActivity.activeSessions}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {liveActivity.activeUsers} usuários únicos
                        </p>
                        <div className="flex items-center mt-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2" />
                            <span className="text-xs text-muted-foreground">
                                Atualizado {formatDistanceToNow(liveActivity.lastUpdate, {
                                    locale: ptBR,
                                    addSuffix: true
                                })}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversões (5min)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {liveActivity.recentConversions}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {liveActivity.currentConversionRate.toFixed(1)}% taxa atual
                        </p>
                        <div className="flex items-center mt-2">
                            <CheckCircle2 className="w-3 h-3 text-green-600 mr-1" />
                            <span className="text-xs text-muted-foreground">
                                Últimos 5 minutos
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">
                            {dropoffAlerts.length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {dropoffAlerts.filter(a => a.severity === 'critical').length} críticos
                        </p>
                        {dropoffAlerts.length > 0 && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="mt-2 text-xs"
                                onClick={clearAlerts}
                            >
                                <BellOff className="w-3 h-3 mr-1" />
                                Limpar
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Eventos (1min)</CardTitle>
                        <Activity className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">
                            {recentEvents.length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Stream de eventos
                        </p>
                        <div className="flex items-center mt-2">
                            <Zap className="w-3 h-3 text-purple-600 mr-1" />
                            <span className="text-xs text-muted-foreground">
                                Tempo real
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alertas de Dropoff */}
            {dropoffAlerts.length > 0 && (
                <Card className="border-orange-200 bg-orange-50/50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-orange-600" />
                                <CardTitle>Alertas de Dropoff</CardTitle>
                            </div>
                            <Button size="sm" variant="ghost" onClick={clearAlerts}>
                                Limpar Todos
                            </Button>
                        </div>
                        <CardDescription>
                            Dropoffs anormais detectados em tempo real
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {dropoffAlerts.map((alert) => (
                                <Alert
                                    key={alert.alertId}
                                    variant={alert.severity === 'critical' ? 'destructive' : 'default'}
                                    className="py-3"
                                >
                                    <AlertTriangle className="h-4 w-4" />
                                    <div className="flex items-center justify-between flex-1">
                                        <div>
                                            <AlertTitle className="text-sm">
                                                Step {alert.stepNumber} - Dropoff de {alert.dropoffRate.toFixed(1)}%
                                            </AlertTitle>
                                            <AlertDescription className="text-xs">
                                                {alert.affectedUsers} usuários afetados • {' '}
                                                {formatDistanceToNow(alert.timestamp, { locale: ptBR, addSuffix: true })}
                                            </AlertDescription>
                                        </div>
                                        <Badge
                                            variant={
                                                alert.severity === 'critical' ? 'destructive' :
                                                    alert.severity === 'high' ? 'default' :
                                                        'outline'
                                            }
                                        >
                                            {alert.severity}
                                        </Badge>
                                    </div>
                                </Alert>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Grid: Stream de Eventos + Estatísticas por Step */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stream de Eventos */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Stream de Eventos
                        </CardTitle>
                        <CardDescription>
                            Eventos de sessão em tempo real
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {recentEvents.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>Aguardando eventos...</p>
                                </div>
                            ) : (
                                recentEvents.map((event, idx) => (
                                    <div
                                        key={`${event.sessionId}-${idx}`}
                                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        {event.eventType === 'started' && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                        )}
                                        {event.eventType === 'completed' && (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        )}
                                        {event.eventType === 'abandoned' && (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">
                                                {event.eventType === 'started' && 'Sessão Iniciada'}
                                                {event.eventType === 'completed' && 'Sessão Concluída'}
                                                {event.eventType === 'abandoned' && 'Sessão Abandonada'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {event.sessionId.slice(0, 8)}... • {' '}
                                                {event.currentStep && `Step ${event.currentStep} • `}
                                                {formatDistanceToNow(event.timestamp, {
                                                    locale: ptBR,
                                                    addSuffix: true
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Estatísticas por Step */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Atividade por Step
                        </CardTitle>
                        <CardDescription>
                            Estatísticas em tempo real de cada step
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {liveStepStats.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>Nenhuma atividade recente</p>
                                </div>
                            ) : (
                                liveStepStats
                                    .filter(s => s.activeUsers > 0)
                                    .slice(0, 10)
                                    .map((step) => (
                                        <div
                                            key={step.stepNumber}
                                            className="flex items-center justify-between p-3 rounded-lg border"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                    {step.stepNumber}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        {step.activeUsers} {step.activeUsers === 1 ? 'usuário' : 'usuários'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {step.averageTimeSpent.toFixed(0)}s médio • {step.completionRate.toFixed(0)}% conclusão
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                Ativo
                                            </Badge>
                                        </div>
                                    ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LiveMonitoringPage;
