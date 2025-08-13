import React from 'react';
import { TemplateProvider } from '@/components/editor-fixed/UnifiedTemplateManager';
import EditorFixedEnhancedPage from '@/pages/editor-fixed-dragdrop-enhanced';
import { useToast } from '@/hooks/use-toast';

/**
 * Página de Teste da Integração Supabase
 * 
 * Wrapper que carrega o EditorFixedEnhanced com todas as dependências
 * necessárias para testar a integração com Supabase.
 * 
 * Features testáveis:
 * - Persistência automática no Supabase
 * - Fallback local em caso de erro
 * - Validação rigorosa de reordenação
 * - Preview mode com bloqueio de mutações
 * - Sincronização bidirecional
 */
const TestSupabaseIntegrationPage: React.FC = () => {
  const { toast } = useToast();

  // Mostrar status da integração
  React.useEffect(() => {
    const isEnabled = import.meta.env.VITE_EDITOR_SUPABASE_ENABLED === 'true';
    const funnelId = import.meta.env.VITE_DEFAULT_FUNNEL_ID || 'default-funnel';
    
    toast({
      title: `🔌 Supabase Integration ${isEnabled ? 'ENABLED' : 'DISABLED'}`,
      description: `Funil: ${funnelId} • Persistência: ${isEnabled ? 'Ativa' : 'Local apenas'}`,
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="h-screen bg-stone-50">
      {/* Header de Status */}
      <div className="bg-white border-b border-stone-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-800">
              🧪 Teste de Integração Supabase
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Editor com persistência híbrida Local/Supabase
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                import.meta.env.VITE_EDITOR_SUPABASE_ENABLED === 'true' 
                  ? 'bg-green-500' 
                  : 'bg-orange-500'
              }`}></div>
              <span className="text-sm font-medium">
                {import.meta.env.VITE_EDITOR_SUPABASE_ENABLED === 'true' ? 'Supabase' : 'Local'}
              </span>
            </div>
            <div className="text-xs text-stone-500">
              v2.0-enhanced
            </div>
          </div>
        </div>
      </div>

      {/* Editor Principal */}
      <div className="h-[calc(100vh-80px)]">
        <TemplateProvider>
          <EditorFixedEnhancedPage />
        </TemplateProvider>
      </div>
    </div>
  );
};

export default TestSupabaseIntegrationPage;