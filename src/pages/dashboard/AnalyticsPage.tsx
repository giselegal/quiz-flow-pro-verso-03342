/**
 * 📊 PÁGINA DE ANALYTICS DO DASHBOARD
 * 
 * Analytics detalhado com gráficos e métricas avançadas
 */

import React from 'react';
import RealTimeDashboard from '@/components/dashboard/RealTimeDashboard';

const AnalyticsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <RealTimeDashboard />
        </div>
    );
};

export default AnalyticsPage;