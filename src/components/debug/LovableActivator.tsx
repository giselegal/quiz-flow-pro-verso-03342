import React, { useEffect, useState } from 'react';

interface LovableActivatorProps {
  forceActivate?: boolean;
}

export const LovableActivator: React.FC<LovableActivatorProps> = ({ forceActivate = false }) => {
  const [lovableStatus, setLovableStatus] = useState({
    isActive: false,
    hasConfig: false,
    currentPath: '',
    searchParams: '',
    shouldActivate: false,
    error: null as string | null,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const searchParams = window.location.search;

      // Condições para ativar Lovable
      const shouldActivate =
        forceActivate ||
        currentPath.includes('/admin') ||
        currentPath === '/' ||
        currentPath.startsWith('/dashboard') ||
        currentPath.startsWith('/resultado/') ||
        currentPath.includes('/editor') ||
        searchParams.includes('lovable=true');

      const hasConfig = !!(window as any).LOVABLE_CONFIG;

      try {
        if (shouldActivate && !hasConfig) {
          console.log('🚀 Ativando Lovable...');

          // Configurar Lovable
          (window as any).LOVABLE_CONFIG = {
            projectId: 'quiz-sell-genius',
            apiBaseUrl: 'https://api.lovable.dev',
            environment: process.env.NODE_ENV || 'development',
          };

          // Adicionar classes necessárias ao body
          document.body.classList.add('lovable-editable-page');
          document.body.setAttribute('data-lovable-root', 'true');

          console.log('✅ Lovable ativado com sucesso!');
          console.log('📝 Config:', (window as any).LOVABLE_CONFIG);
        }

        setLovableStatus({
          isActive: shouldActivate && !!(window as any).LOVABLE_CONFIG,
          hasConfig: !!(window as any).LOVABLE_CONFIG,
          currentPath,
          searchParams,
          shouldActivate,
          error: null,
        });
      } catch (error) {
        console.error('❌ Erro ao ativar Lovable:', error);
        setLovableStatus(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }));
      }
    }
  }, [forceActivate]);

  // Auto-ativar se estiver na URL correta
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('lovable') === 'true' || urlParams.get('activate') === 'lovable') {
        console.log('🔄 Auto-ativando Lovable baseado na URL...');
        setLovableStatus(prev => ({ ...prev, shouldActivate: true }));
      }
    }
  }, []);

  if (!lovableStatus.shouldActivate && !forceActivate) {
    return null;
  }

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      <h3 className="font-bold mb-2">🚀 Lovable Status</h3>

      <div className="space-y-1 text-sm">
        <div>
          <strong>Ativo:</strong> {lovableStatus.isActive ? '✅ Sim' : '❌ Não'}
        </div>

        <div>
          <strong>Config:</strong> {lovableStatus.hasConfig ? '✅ Carregada' : '❌ Ausente'}
        </div>

        <div>
          <strong>Caminho:</strong> {lovableStatus.currentPath}
        </div>

        {lovableStatus.searchParams && (
          <div>
            <strong>Params:</strong> {lovableStatus.searchParams}
          </div>
        )}

        {lovableStatus.error && (
          <div className="text-red-200">
            <strong>Erro:</strong> {lovableStatus.error}
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <button
          onClick={() => {
            window.location.href =
              window.location.href + (window.location.search ? '&' : '?') + 'lovable=true';
          }}
          style={{ color: '#B89B7A' }}
        >
          Ativar Lovable
        </button>

        <button
          onClick={() => {
            console.log('📊 Debug Lovable:', {
              window_LOVABLE_CONFIG: (window as any).LOVABLE_CONFIG,
              body_classes: document.body.className,
              body_attributes: {
                'data-lovable-root': document.body.getAttribute('data-lovable-root'),
              },
              pathname: window.location.pathname,
              search: window.location.search,
              href: window.location.href,
            });
          }}
          style={{ color: '#6B4F43' }}
        >
          Debug Info
        </button>
      </div>
    </div>
  );
};

export default LovableActivator;
