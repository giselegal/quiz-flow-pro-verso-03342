import React from 'react';
import { SupabaseTest } from '../components/test/SupabaseTest';
import { FunnelsProvider } from '../context/FunnelsContext';

/**
 * Página para testar a integração com Supabase
 */
const SupabaseTestPage: React.FC = () => {
  return (
    <FunnelsProvider>
      <SupabaseTest />
    </FunnelsProvider>
  );
};

export default SupabaseTestPage;
