import FunnelDebugPanel from '@/components/debug/FunnelDebugPanel';
import FunnelActivationDemo from '@/components/demo/FunnelActivationDemo';

/**
 * Página de Teste do Sistema de Ativação das 21 Etapas
 *
 * Esta página demonstra o funcionamento completo do sistema de ativação automática
 * das etapas do funil, incluindo:
 *
 * - Demo interativo com questões reais
 * - Painel de debug em tempo real
 * - Monitoramento do progresso
 * - Testes de ativação automática
 *
 * URL: /test-funnel-activation
 */

export default function TestFunnelActivationPage() {
  const [showDebugPanel, setShowDebugPanel] = React.useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Teste: Sistema de Ativação das 21 Etapas
              </h1>
              <p className="text-slate-600 mt-1">
                Demonstração completa do funil inteligente com ativação automática
              </p>
            </div>

            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showDebugPanel ? 'Ocultar Debug' : 'Mostrar Debug'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Principal */}
          <div className="lg:col-span-2">
            <FunnelActivationDemo />
          </div>

          {/* Instruções */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Como Testar:</h2>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                  <div>
                    <strong>Digite seu nome</strong>
                    <p>A etapa 2 será ativada automaticamente</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                  <div>
                    <strong>Responda as questões</strong>
                    <p>Selecione 3 opções para ativar a próxima etapa</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                  <div>
                    <strong>Monitore o Debug</strong>
                    <p>Veja as etapas sendo ativadas em tempo real</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    4
                  </div>
                  <div>
                    <strong>Teste os Controles</strong>
                    <p>Use os botões de teste no painel de debug</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-slate-50 rounded-lg border">
                <h3 className="font-medium text-slate-800 mb-2">Funcionalidades Testadas:</h3>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>✅ Ativação automática por nome preenchido</li>
                  <li>✅ Ativação por quantidade de seleções</li>
                  <li>✅ Sistema de progresso visual</li>
                  <li>✅ Monitoramento em tempo real</li>
                  <li>✅ Reset e controles de debug</li>
                  <li>✅ Integração com hooks React</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebugPanel && (
        <FunnelDebugPanel isVisible={true} onToggle={() => setShowDebugPanel(false)} />
      )}

      {/* Footer */}
      <div className="bg-slate-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold mb-2">Sistema de 21 Etapas Implementado!</h2>
          <p className="text-slate-300 mb-4">
            Ativação inteligente baseada em regras JSON • Monitoramento em tempo real • Prettier
            aplicado
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span>🎯 21 Templates JSON gerados</span>
            <span>⚡ Sistema de ativação automática</span>
            <span>🔍 Painel de debug avançado</span>
            <span>🎨 Componentes especializados</span>
          </div>
        </div>
      </div>
    </div>
  );
}
