/**
 * 📋 PÁGINA DE PARTICIPANTES
 * 
 * Página dedicada para visualizar e gerenciar participantes do quiz
 */

import React, { useState, useCallback } from 'react';
import ParticipantsTable from '@/components/dashboard/ParticipantsTable';
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard';
import AdvancedAnalytics from '@/components/dashboard/AdvancedAnalytics';
import ReportGenerator from '@/components/dashboard/ReportGenerator';
import DashboardControls from '@/components/dashboard/DashboardControls';

const ParticipantsPage: React.FC = () => {
    const [currentView, setCurrentView] = useState<'analytics' | 'table' | 'both'>('both');
    const [analyticsFilters, setAnalyticsFilters] = useState({
        dateRange: 'all',
        deviceType: 'all',
        status: 'all'
    });

    const handleRefresh = useCallback(() => {
        // Função para forçar refresh dos componentes
        window.location.reload();
    }, []);

    const handleExport = useCallback(() => {
        // Função para exportar dados (implementar se necessário)
        console.log('Exportar dados...');
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1
                    className="text-3xl font-bold text-[#432818]"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                >
                    Dashboard de Participantes
                </h1>
                <p className="text-[#8F7A6A] mt-2">
                    Análise completa do desempenho do quiz e comportamento dos usuários
                </p>
            </div>

            {/* CONTROLES DO DASHBOARD */}
            <DashboardControls
                currentView={currentView}
                onViewChange={setCurrentView}
                onRefresh={handleRefresh}
                onExport={handleExport}
                analyticsFilters={analyticsFilters}
                onFiltersChange={setAnalyticsFilters}
            />

            {/* DASHBOARD DE ANALYTICS */}
            {(currentView === 'analytics' || currentView === 'both') && (
                <section>
                    <h2 className="text-xl font-semibold text-[#432818] mb-4">
                        📊 Analytics e Métricas
                    </h2>
                    <AnalyticsDashboard />
                </section>
            )}

            {/* ANALYTICS AVANÇADOS */}
            {(currentView === 'analytics' || currentView === 'both') && (
                <section>
                    <h2 className="text-xl font-semibold text-[#432818] mb-4">
                        🎯 Análises Avançadas
                    </h2>
                    <AdvancedAnalytics filters={analyticsFilters} />
                </section>
            )}

            {/* TABELA DE PARTICIPANTES */}
            {(currentView === 'table' || currentView === 'both') && (
                <section>
                    <h2 className="text-xl font-semibold text-[#432818] mb-4">
                        📋 Lista Detalhada de Participantes
                    </h2>
                    <ParticipantsTable />
                </section>
            )}

            {/* GERADOR DE RELATÓRIOS */}
            {(currentView === 'analytics' || currentView === 'both') && (
                <section>
                    <h2 className="text-xl font-semibold text-[#432818] mb-4">
                        📄 Relatórios e Exportação
                    </h2>
                    <ReportGenerator />
                </section>
            )}
        </div>
    );
};

export default ParticipantsPage;
