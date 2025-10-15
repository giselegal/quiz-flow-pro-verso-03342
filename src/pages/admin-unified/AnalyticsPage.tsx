/**
 * 📈 ANALYTICS PAGE - Análise Detalhada com Dados Reais
 * Conectado ao Supabase para analytics em tempo real
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Activity, TrendingUp, Users, Clock } from 'lucide-react';

interface AnalyticsData {
  eventsByType: Record<string, number>;
  sessionsByStatus: Record<string, number>;
  recentEvents: any[];
  topMetrics: any[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Buscar eventos por tipo
      const { data: events } = await supabase
        .from('quiz_events')
        .select('event_type');

      const eventsByType = events?.reduce((acc: Record<string, number>, e: any) => {
        acc[e.event_type] = (acc[e.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Buscar sessões por status
      const { data: sessions } = await supabase
        .from('quiz_sessions')
        .select('status');

      const sessionsByStatus = sessions?.reduce((acc: Record<string, number>, s: any) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Buscar eventos recentes
      const { data: recentEvents } = await supabase
        .from('quiz_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      // Buscar top métricas
      const { data: topMetrics } = await supabase
        .from('quiz_analytics')
        .select('metric_name, metric_value')
        .order('metric_value', { ascending: false })
        .limit(5);

      setAnalytics({
        eventsByType,
        sessionsByStatus,
        recentEvents: recentEvents || [],
        topMetrics: topMetrics || []
      });
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Análise detalhada de eventos e métricas em tempo real
        </p>
      </div>

      {/* Event Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(analytics?.eventsByType || {}).slice(0, 4).map(([type, count]) => (
          <Card key={type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {type.replace(/_/g, ' ')}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">eventos</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sessions by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Sessões por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {Object.entries(analytics?.sessionsByStatus || {}).map(([status, count]) => (
              <div key={status} className="space-y-2">
                <p className="text-sm font-medium capitalize">{status}</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{count}</div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.recentEvents.slice(0, 5).map((event, idx) => (
              <div key={event.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="text-sm font-medium capitalize">
                    {event.event_type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Step {event.step_number || 'N/A'}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(event.timestamp).toLocaleTimeString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Top Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.topMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm">{metric.metric_name}</span>
                <span className="text-sm font-bold">{metric.metric_value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
