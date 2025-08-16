import { useEditor } from '@/context/EditorContext';
import { useTemplateConfig } from '@/hooks/useTemplateConfig';
import ConnectedStep01Template from '../steps/ConnectedStep01Template';
import { ConnectedStep13Template } from '../steps/Step13Template';
import Step20Result from '../steps/Step20Result';
import { useState } from 'react';

interface TemplateRendererProps {
  stepNumber: number;
  sessionId?: string;
  onContinue?: () => void;
}

/**
 * 🎯 TEMPLATE RENDERER HÍBRIDO
 * ✅ Sistema que decide se renderizar template conectado ou usar fallback
 * 
 * Funcionalidades:
 * - Detecta se template tem versão conectada
 * - Usa templates conectados quando disponíveis
 * - Fallback para templates JSON quando necessário
 * - Integração completa com EditorContext e hooks de quiz
 */
export const TemplateRenderer = ({ stepNumber, sessionId, onContinue }: TemplateRendererProps) => {
  const { quizState } = useEditor();
  const { config, loading } = useTemplateConfig(stepNumber);
  const [renderMode, setRenderMode] = useState<'connected' | 'fallback'>('connected');

  // Mapa de templates conectados disponíveis
  const connectedTemplates = {
    1: ConnectedStep01Template,
    13: ConnectedStep13Template,
    20: Step20Result,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-[#B89B7A] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[#432818]">Carregando template...</p>
          <p className="text-sm text-gray-600">Step {stepNumber}</p>
        </div>
      </div>
    );
  }

  // Verificar se existe template conectado para este step
  const ConnectedTemplate = connectedTemplates[stepNumber as keyof typeof connectedTemplates];

  if (ConnectedTemplate && renderMode === 'connected') {
    console.log(`✅ TemplateRenderer: Usando template conectado para step ${stepNumber}`);
    
    // Renderizar template conectado com props apropriadas
    if (stepNumber === 20) {
      return <ConnectedTemplate sessionId={sessionId || 'demo'} onContinue={onContinue} />;
    }
    
    return <ConnectedTemplate sessionId={sessionId || 'demo'} onContinue={onContinue} />;
  }

  // Fallback: renderizar baseado na configuração JSON
  console.log(`📄 TemplateRenderer: Usando fallback JSON para step ${stepNumber}`);
  
  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      {/* Header básico */}
      <div className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            alt="Logo Gisele Galvão"
            className="w-16 h-16 object-contain"
          />
          <div className="text-right text-sm text-gray-600">
            Step {stepNumber} de 21
          </div>
        </div>
      </div>

      {/* Conteúdo principal baseado no tipo de step */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-6">
          {/* Conteúdo baseado no tipo de template */}
          {stepNumber === 1 && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-[#432818]">
                Descubra Seu Estilo Pessoal
              </h1>
              <p className="text-lg text-gray-600">
                Para começar, qual é o seu nome?
              </p>
              <input
                type="text"
                placeholder="Digite seu nome..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89B7A]"
                onChange={(e) => {
                  if (e.target.value.trim()) {
                    quizState.setUserNameFromInput(e.target.value.trim());
                  }
                }}
              />
            </div>
          )}
          
          {stepNumber >= 2 && stepNumber <= 14 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#432818]">
                Questão {stepNumber - 1}
              </h1>
              <p className="text-lg text-gray-600">
                {config?.metadata.name || `Template para step ${stepNumber}`}
              </p>
              <div className="p-8 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">
                  Template JSON em desenvolvimento...
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => setRenderMode('connected')}
                    className="text-[#B89B7A] hover:underline"
                  >
                    Tentar template conectado
                  </button>
                </div>
              </div>
            </div>
          )}

          {stepNumber >= 15 && stepNumber <= 19 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#432818]">
                {config?.metadata.name || `Etapa ${stepNumber}`}
              </h1>
              <div className="p-8 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">
                  Template em desenvolvimento para step {stepNumber}
                </p>
              </div>
            </div>
          )}

          {stepNumber === 21 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#432818]">
                Oferta Final
              </h1>
              <div className="p-8 bg-white rounded-lg border border-gray-200">
                <p className="text-lg text-gray-600">
                  Página de conversão final
                </p>
              </div>
            </div>
          )}

          {/* Botão de continuar */}
          <button
            onClick={onContinue}
            className="w-full py-3 px-6 bg-[#B89B7A] text-white font-semibold rounded-lg hover:bg-[#432818] transition-colors"
          >
            Continuar →
          </button>
        </div>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white/90 p-3 rounded-lg text-xs text-gray-600 border space-y-1">
          <div><strong>Template Renderer Debug</strong></div>
          <div>Step: {stepNumber}</div>
          <div>Mode: {renderMode}</div>
          <div>Connected: {!!ConnectedTemplate ? 'Sim' : 'Não'}</div>
          <div>Config: {config ? 'Carregado' : 'Ausente'}</div>
          <div>User: {quizState.userName || 'não definido'}</div>
          <div>Respostas: {quizState.answers.length}</div>
          <div>Estratégicas: {quizState.strategicAnswers.length}</div>
          <div>
            <button
              onClick={() => setRenderMode(renderMode === 'connected' ? 'fallback' : 'connected')}
              className="text-blue-600 hover:underline"
            >
              Trocar modo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateRenderer;