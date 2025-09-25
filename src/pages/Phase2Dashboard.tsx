/**
 * 🚀 PHASE 2 DASHBOARD - Enterprise Control Center
 */

import { useState, useEffect } from 'react';
import { MultiTenantService } from '@/services/MultiTenantService';
import { AdvancedPersonalizationEngine } from '@/services/AdvancedPersonalizationEngine';
import { EnterpriseIntegrations } from '@/services/EnterpriseIntegrations';
import { WhiteLabelPlatform } from '@/services/WhiteLabelPlatform';

export default function Phase2Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhase2Metrics();
  }, []);

  const loadPhase2Metrics = async () => {
    try {
      const multiTenant = MultiTenantService.getInstance();
      const personalization = AdvancedPersonalizationEngine.getInstance();
      const integrations = EnterpriseIntegrations.getInstance();
      const whiteLabelPlatform = WhiteLabelPlatform.getInstance();

      const data = {
        multiTenant: multiTenant.getGlobalMetrics(),
        personalization: personalization.getPersonalizationMetrics(),
        integrations: integrations.getIntegrationMetrics(),
        whiteLabel: whiteLabelPlatform.getPlatformMetrics(),
        totalROI: 0
      };

      // Calculate combined ROI
      data.totalROI = 8000 + 10000 + 5000 + 7000; // Conservative estimate

      setMetrics(data);
    } catch (error) {
      console.error('Error loading Phase 2 metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Carregando Sistema Enterprise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🚀 Fase 2 - Enterprise Platform
              </h1>
              <p className="text-purple-200 mt-1">
                Multi-tenant • Personalization • Integrations • White-label
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">
                R$ {metrics?.totalROI?.toLocaleString()}/mês
              </div>
              <div className="text-sm text-purple-200">Projeção ROI</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatusCard
            title="Multi-tenant"
            value={metrics?.multiTenant?.totalTenants || 0}
            subtitle="Tenants Ativos"
            icon="🏢"
            color="blue"
            revenue={8000}
          />
          <StatusCard
            title="Personalization AI"
            value={`${metrics?.personalization?.avgConversionLift * 100}%`}
            subtitle="Lift Conversão"
            icon="🎨"
            color="purple"
            revenue={10000}
          />
          <StatusCard
            title="Integrations"
            value={metrics?.integrations?.activeIntegrations || 0}
            subtitle="Integrações Ativas"
            icon="🔗"
            color="green"
            revenue={5000}
          />
          <StatusCard
            title="White-label"
            value={metrics?.whiteLabel?.overview?.activeClients || 0}
            subtitle="Clientes Ativos"
            icon="🏷️"
            color="orange"
            revenue={7000}
          />
        </div>

        {/* Detailed Metrics */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Multi-tenant Metrics */}
          <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              🏢 Multi-tenant Architecture
            </h3>
            <div className="space-y-4">
              <MetricRow
                label="Total de Tenants"
                value={metrics?.multiTenant?.totalTenants}
                change="+15%"
              />
              <MetricRow
                label="Receita Total"
                value={`R$ ${metrics?.multiTenant?.totalRevenue?.toLocaleString()}`}
                change="+23%"
              />
              <MetricRow
                label="Usuários Totais"
                value={metrics?.multiTenant?.totalUsers?.toLocaleString()}
                change="+18%"
              />
              <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
                <div className="text-sm text-blue-200">Distribuição de Planos</div>
                <div className="flex justify-between mt-2 text-white">
                  <span>Starter: {metrics?.multiTenant?.planDistribution?.starter}</span>
                  <span>Pro: {metrics?.multiTenant?.planDistribution?.professional}</span>
                  <span>Enterprise: {metrics?.multiTenant?.planDistribution?.enterprise}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personalization Metrics */}
          <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              🎨 AI Personalization
            </h3>
            <div className="space-y-4">
              <MetricRow
                label="Personalizações Ativas"
                value={metrics?.personalization?.totalPersonalizations}
                change="+42%"
              />
              <MetricRow
                label="Lift Médio Conversão"
                value={`${(metrics?.personalization?.avgConversionLift * 100).toFixed(1)}%`}
                change="+5.2%"
              />
              <MetricRow
                label="Impacto Receita"
                value={`R$ ${metrics?.personalization?.revenueImpact?.toLocaleString()}`}
                change="+31%"
              />
              <div className="mt-4 p-3 bg-purple-500/20 rounded-lg">
                <div className="text-sm text-purple-200">Confiança AI</div>
                <div className="flex items-center mt-2">
                  <div className="flex-1 bg-purple-900/30 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(metrics?.personalization?.aiConfidence * 100)}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-white font-semibold">
                    {(metrics?.personalization?.aiConfidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Integrations Metrics */}
          <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              🔗 Enterprise Integrations
            </h3>
            <div className="space-y-4">
              <MetricRow
                label="Integrações Totais"
                value={metrics?.integrations?.totalIntegrations}
                change="+8"
              />
              <MetricRow
                label="Taxa Sucesso Sync"
                value={`${Math.round((metrics?.integrations?.syncSuccess / (metrics?.integrations?.syncSuccess + metrics?.integrations?.syncErrors)) * 100)}%`}
                change="+2%"
              />
              <MetricRow
                label="Health Score"
                value={`${metrics?.integrations?.healthScore}%`}
                change="+5%"
              />
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div className="bg-green-500/20 p-2 rounded text-center">
                  <div className="text-green-400 font-semibold">{metrics?.integrations?.byType?.crm}</div>
                  <div className="text-green-200">CRM</div>
                </div>
                <div className="bg-blue-500/20 p-2 rounded text-center">
                  <div className="text-blue-400 font-semibold">{metrics?.integrations?.byType?.email}</div>
                  <div className="text-blue-200">Email</div>
                </div>
                <div className="bg-purple-500/20 p-2 rounded text-center">
                  <div className="text-purple-400 font-semibold">{metrics?.integrations?.byType?.ecommerce}</div>
                  <div className="text-purple-200">Ecommerce</div>
                </div>
              </div>
            </div>
          </div>

          {/* White-label Metrics */}
          <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              🏷️ White-label Platform
            </h3>
            <div className="space-y-4">
              <MetricRow
                label="Clientes Ativos"
                value={metrics?.whiteLabel?.overview?.activeClients}
                change="+12"
              />
              <MetricRow
                label="Receita Mensal"
                value={`R$ ${metrics?.whiteLabel?.overview?.monthlyRevenue?.toLocaleString()}`}
                change="+28%"
              />
              <MetricRow
                label="Taxa Crescimento"
                value={metrics?.whiteLabel?.growth?.growthRate}
                change="+3%"
              />
              <div className="mt-4 p-3 bg-orange-500/20 rounded-lg">
                <div className="text-sm text-orange-200">Top Client</div>
                <div className="text-white font-semibold mt-1">
                  {metrics?.whiteLabel?.topPerformingClients?.[0]?.name || 'N/A'}
                </div>
                <div className="text-orange-300 text-sm">
                  R$ {metrics?.whiteLabel?.topPerformingClients?.[0]?.revenue?.toLocaleString()}/mês
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Phase Preview */}
        <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur rounded-xl border border-purple-500/30 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              🌟 Próxima Fase: AI Enterprise Suite
            </h2>
            <p className="text-purple-200 mb-6">
              Machine Learning avançado, Automação completa, Análise preditiva
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-3xl mb-2">🤖</div>
                <div className="text-white font-semibold">AI Automation</div>
                <div className="text-purple-200 text-sm">ROI: +R$ 15k/mês</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-3xl mb-2">🔮</div>
                <div className="text-white font-semibold">Predictive Analytics</div>
                <div className="text-purple-200 text-sm">ROI: +R$ 12k/mês</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-white font-semibold">Real-time AI</div>
                <div className="text-purple-200 text-sm">ROI: +R$ 18k/mês</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatusCard({ title, value, subtitle, icon, color, revenue }: any) {
  const colorClasses = {
    blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
    purple: 'from-purple-600/20 to-purple-800/20 border-purple-500/30',
    green: 'from-green-600/20 to-green-800/20 border-green-500/30',
    orange: 'from-orange-600/20 to-orange-800/20 border-orange-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} backdrop-blur rounded-xl border p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className="text-green-400 font-semibold text-sm">
          +R$ {revenue.toLocaleString()}/mês
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-300">{subtitle}</div>
      <div className="text-xs text-gray-400 mt-2">{title}</div>
    </div>
  );
}

function MetricRow({ label, value, change }: any) {
  const isPositive = change?.startsWith('+');
  
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-300">{label}</span>
      <div className="text-right">
        <span className="text-white font-semibold">{value}</span>
        {change && (
          <span className={`ml-2 text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}