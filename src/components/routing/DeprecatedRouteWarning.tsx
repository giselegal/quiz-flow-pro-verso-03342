import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

interface DeprecatedRouteWarningProps {
  routePath: string;
  recommendedRoute: string;
  reason: string;
  removalVersion?: string;
  children: React.ReactNode;
}

/**
 * 🚨 DEPRECATED ROUTE WARNING
 * 
 * Componente wrapper que exibe warning para rotas obsoletas
 * e redireciona usuário para a rota recomendada.
 */
export const DeprecatedRouteWarning: React.FC<DeprecatedRouteWarningProps> = ({
  routePath,
  recommendedRoute,
  reason,
  removalVersion = 'v4.0 (Janeiro 2026)',
  children,
}) => {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = React.useState(true);
  const [countdown, setCountdown] = React.useState(10);

  useEffect(() => {
    // Toast de aviso
    toast.warning(`Rota Obsoleta: ${routePath}`, {
      description: `Esta rota será removida em ${removalVersion}`,
      duration: 5000,
    });

    // Console warning
    console.warn(`
╔════════════════════════════════════════════════════════════════════════════╗
║                        🚨 AVISO: ROTA OBSOLETA                             ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Rota Atual: ${routePath.padEnd(62)} ║
║  Rota Recomendada: ${recommendedRoute.padEnd(54)} ║
║  Motivo: ${reason.padEnd(62)} ║
║  Remoção Planejada: ${removalVersion.padEnd(51)} ║
║                                                                            ║
║  ✅ Ação Recomendada: Atualize seus bookmarks/links                        ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
    `);

    // Countdown para redirect automático
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(recommendedRoute);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [routePath, recommendedRoute, reason, removalVersion, navigate]);

  if (!showBanner) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de Aviso */}
      <div className="bg-yellow-50 border-b-4 border-yellow-400 p-4">
        <div className="max-w-7xl mx-auto flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              ⚠️ Esta rota está obsoleta e será removida
            </h3>
            
            <div className="space-y-2 text-sm text-yellow-800">
              <p>
                <strong>Rota atual:</strong> <code className="bg-yellow-100 px-2 py-1 rounded">{routePath}</code>
              </p>
              <p>
                <strong>Use em vez disso:</strong>{' '}
                <a
                  href={recommendedRoute}
                  className="text-blue-600 hover:underline font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(recommendedRoute);
                  }}
                >
                  {recommendedRoute}
                </a>
              </p>
              <p>
                <strong>Motivo:</strong> {reason}
              </p>
              <p>
                <strong>Remoção planejada:</strong> {removalVersion}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => navigate(recommendedRoute)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Ir para nova rota agora
              </button>
              
              <p className="text-xs text-yellow-700">
                Redirecionamento automático em <strong>{countdown}s</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowBanner(false)}
            className="text-yellow-600 hover:text-yellow-800 transition-colors"
            aria-label="Fechar aviso"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Conteúdo da rota (se usuário fechar o banner) */}
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default DeprecatedRouteWarning;
