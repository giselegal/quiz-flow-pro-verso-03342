/**
 * 📊 FACEBOOK METRICS PAGE - DADOS REAIS
 * 
 * Página dedicada às métricas do Facebook integradas com Supabase
 */

import React from 'react';
import { EnhancedUnifiedDataService } from '@/services/core/EnhancedUnifiedDataService'; from 'react';
import FacebookMetricsDashboard from '@/components/dashboard/FacebookMetricsDashboard';

const FacebookMetricsPage: React.FC = () => {
    return (
        <div className="space-y-6 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Métricas do Facebook</h1>
                <p className="text-gray-600">Acompanhe o desempenho das suas campanhas do Facebook Ads</p>
            </div>
            
            <FacebookMetricsDashboard showComparison={true} />
        </div>
    );
};

export default FacebookMetricsPage;