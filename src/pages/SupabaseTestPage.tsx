import React, { useEffect, useState } from 'react';
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import { Toaster } from '../components/ui/toaster';

/**
 * Componente para depurar conflitos no carregamento de etapas
 */
const DebugLogger: React.FC = () => {
  useEffect(() => {
    console.log('[DebugLogger] Componente montado');
    return () => console.log('[DebugLogger] Componente desmontado');
  }, []);

  return null;
};

/**
 * Componente de teste básico do Supabase
 */
const SupabaseTest: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste Supabase</h1>
      <p>Teste básico da integração com Supabase usando FunnelMasterProvider.</p>
    </div>
  );
};

/**
 * Página para testar a integração com Supabase
 */
const SupabaseTestPage: React.FC = () => {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 bg-stone-100 flex items-center gap-2">
        <label htmlFor="debug-toggle" className="text-sm font-medium">
          Modo de depuração
        </label>
        <input
          id="debug-toggle"
          type="checkbox"
          checked={debugMode}
          onChange={e => setDebugMode(e.target.checked)}
          style={{ borderColor: '#E5DDD5' }}
        />
      </div>

      <FunnelMasterProvider
        debugMode={debugMode}
        enableCache={true}
      >
        {debugMode && <DebugLogger />}
        <SupabaseTest />
        <Toaster />
      </FunnelMasterProvider>
    </div>
  );
};

export default SupabaseTestPage;
