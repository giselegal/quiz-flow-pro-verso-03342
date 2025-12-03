/**
 * 📊 ANALYTICS SIDEBAR - PHASE 2
 * 
 * Real-time analytics sidebar for the editor.
 * Displays live metrics from Supabase.
 * 
 * Features:
 * - Active sessions count
 * - Conversion rate
 * - Average session duration
 * - Hourly activity chart
 * - Device statistics
 */

import React, { memo } from 'react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Activity, 
  Monitor, 
  Smartphone, 
  Tablet,
  RefreshCw,
  AlertCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsSidebar = memo(({
  isOpen,
  onClose,
}: AnalyticsSidebarProps) => {
  const { 
    liveActivity, 
    liveStepStats,
    dropoffAlerts,
    isConnected, 
    error,
    refresh,
    clearAlerts,
  } = useRealTimeAnalytics({
    aggregationInterval: 30000, // 30s refresh
    enableConversionNotifications: true,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Analytics em Tempo Real</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className={cn(
        'px-4 py-2 text-sm flex items-center gap-2',
        isConnected ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700',
      )}>
        <div className={cn(
          'w-2 h-2 rounded-full',
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500',
        )} />
        {isConnected ? 'Conectado • Dados ao vivo' : 'Conectando...'}
      </div>

      {/* Error State */}
      {error && (
        <div className="px-4 py-3 bg-red-50 text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error.message}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Dropoff Alerts */}
        {dropoffAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-red-700 uppercase">
                Alertas de Dropoff
              </h3>
              <button
                onClick={clearAlerts}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Limpar
              </button>
            </div>
            {dropoffAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.alertId}
                className={cn(
                  'p-3 rounded-lg text-sm',
                  alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800',
                )}
              >
                <div className="font-medium">
                  Step {alert.stepNumber}: {alert.dropoffRate.toFixed(1)}% dropoff
                </div>
                <div className="text-xs opacity-75">
                  {alert.affectedUsers} usuários afetados
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="Sessões Ativas"
            value={liveActivity.activeSessions}
            icon={<Users className="w-4 h-4" />}
            color="blue"
          />
          <MetricCard
            title="Conversão Atual"
            value={`${liveActivity.currentConversionRate.toFixed(1)}%`}
            icon={<TrendingUp className="w-4 h-4" />}
            color="green"
          />
          <MetricCard
            title="Usuários Ativos"
            value={liveActivity.activeUsers}
            icon={<Activity className="w-4 h-4" />}
            color="purple"
          />
          <MetricCard
            title="Conversões Recentes"
            value={liveActivity.recentConversions}
            subtitle="últimos 5 min"
            icon={<Clock className="w-4 h-4" />}
            color="orange"
          />
        </div>

        {/* Step Progress */}
        {liveStepStats.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-700 uppercase">
              Progresso por Step
            </h3>
            <div className="space-y-1">
              {liveStepStats.slice(0, 10).map((stat) => (
                <div key={stat.stepNumber} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-8">
                    #{stat.stepNumber}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, stat.completionRate)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">
                    {stat.activeUsers} users
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-gray-400 text-center">
          Última atualização: {liveActivity.lastUpdate.toLocaleTimeString('pt-BR')}
        </div>
      </div>
    </div>
  );
});

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const MetricCard = memo(({
  title,
  value,
  subtitle,
  icon,
  color,
}: MetricCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('p-1.5 rounded-md', colorClasses[color])}>
          {icon}
        </div>
        <span className="text-xs text-gray-500">{title}</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      {subtitle && (
        <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
      )}
    </div>
  );
});

export default AnalyticsSidebar;
