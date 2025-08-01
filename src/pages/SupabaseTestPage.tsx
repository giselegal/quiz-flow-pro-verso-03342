import React from 'react';
import { SupabaseTest } from '../components/test/SupabaseTest';
import { FunnelsProvider } from '../context/FunnelsContext';
import { Toaster } from '../components/ui/toaster';

/**
 * Página para testar a integração com Supabase
 */
const SupabaseTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <FunnelsProvider>
        <SupabaseTest />
        <Toaster />
      </FunnelsProvider>
    </div>
  );
};

export default SupabaseTestPage;
