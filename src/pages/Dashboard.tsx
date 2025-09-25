/**
 * 🚀 ACTIVATED DASHBOARD PAGE - Strategic Resource Activation
 */

import React from 'react';
import { ActivatedDashboard } from '@/components/ActivatedDashboard';
import { ActivationStatus } from '@/components/ActivationStatus';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ActivatedDashboard />
      <ActivationStatus />
    </div>
  );
};

export default Dashboard;