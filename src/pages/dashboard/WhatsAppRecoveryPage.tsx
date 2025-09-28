/**
 * 🤖 PÁGINA DE RECUPERAÇÃO VIA WHATSAPP
 * 
 * Página completa para configurar e monitorar o sistema
 * de recuperação de carrinho via WhatsApp + Hotmart
 */

import React from 'react';
import { WhatsAppRecoveryDashboard } from '@/components/dashboard/WhatsAppRecoveryDashboard';

const WhatsAppRecoveryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <WhatsAppRecoveryDashboard />
      </div>
    </div>
  );
};

export default WhatsAppRecoveryPage;
