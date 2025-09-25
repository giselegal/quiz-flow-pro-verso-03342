/**
 * 🧭 PÁGINA DO NAVEGADOR DE TIPOS DE FUNIS
 */

import React from 'react';
import FunnelTypeNavigator from '@/components/FunnelTypeNavigator';

const FunnelTypesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <FunnelTypeNavigator />
        </div>
    );
};

export default FunnelTypesPage;