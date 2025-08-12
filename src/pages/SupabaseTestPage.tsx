import React, { useEffect, useState } from "react";
import { SupabaseTest } from "../components/test/SupabaseTest";
import { FunnelsProvider } from "../context/FunnelsContext";
import { Toaster } from "../components/ui/toaster";

/**
 * Componente para depurar conflitos no carregamento de etapas
 */
const DebugLogger: React.FC = () => {
  useEffect(() => {
    console.log("[DebugLogger] Componente montado");
    return () => console.log("[DebugLogger] Componente desmontado");
  }, []);

  return null;
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
          style={{ borderColor: "#E5DDD5" }}
        />
      </div>

      <FunnelsProvider debug={debugMode}>
        {debugMode && <DebugLogger />}
        <SupabaseTest />
        <Toaster />
      </FunnelsProvider>
    </div>
  );
};

export default SupabaseTestPage;
