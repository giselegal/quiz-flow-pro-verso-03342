/**
 * 📊 PÁGINA DE ANALYTICS DO DASHBOARD
 * 
 * Analytics detalhado com gráficos e métricas avançadas
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RealTimeDashboard from '@/components/dashboard/RealTimeDashboard';

const AnalyticsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <RealTimeDashboard />
        </div>
    );
};

export default AnalyticsPage;