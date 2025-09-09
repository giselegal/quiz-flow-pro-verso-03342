/**
 * 📊 PÁGINA DO DASHBOARD DE ANALYTICS
 * 
 * Página dedicada para visualizar métricas em tempo real
 */

import React from 'react';
import RealTimeDashboard from '@/components/dashboard/RealTimeDashboard';

const DashboardPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <RealTimeDashboard />
        </div>
    );
};

export default DashboardPage;
