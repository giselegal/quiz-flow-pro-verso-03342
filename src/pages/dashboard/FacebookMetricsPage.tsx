/**
 * 📊 FACEBOOK METRICS PAGE
 * 
 * Página completa para visualizar métricas do Facebook Ads
 */

import React from 'react';
import FacebookMetricsDashboard from '@/components/dashboard/FacebookMetricsDashboard';

const FacebookMetricsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <FacebookMetricsDashboard />
        </div>
    );
};

export default FacebookMetricsPage;