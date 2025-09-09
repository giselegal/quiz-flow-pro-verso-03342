/**
 * 📊 PÁGINA DE ANALYTICS DO ADMIN
 * 
 * Integra o dashboard real-time com dados do Supabase
 */

import React from 'react';
import RealTimeDashboard from '@/components/dashboard/RealTimeDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1
          className="text-3xl font-bold text-[#432818]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Analytics & Métricas
        </h1>
        <p className="text-[#8F7A6A] mt-2">
          Análise em tempo real do desempenho dos seus quizzes e funis
        </p>
      </div>

      <RealTimeDashboard />
    </div>
  );
};

export default AnalyticsPage;
