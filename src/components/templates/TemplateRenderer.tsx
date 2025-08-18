import { useEditor } from '@/context/EditorContext';
import { useTemplateConfig } from '@/hooks/useTemplateConfig';
import { getStepInfo, STEP_TEMPLATES_MAPPING } from '@/config/stepTemplatesMapping';
import ConnectedStep01Template from '../steps/ConnectedStep01Template';
import { ConnectedStep13Template } from '../steps/Step13Template';
import Step20Result from '../steps/Step20Result';
import { useState } from 'react';
import { runValidation } from '@/utils/validateDataSync';

interface TemplateRendererProps {
  stepNumber?: number;
  templateId?: string;
  fallbackStep?: number;
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
export function TemplateRenderer({
  stepNumber,
  templateId,
  fallbackStep = 1,
  sessionId,
  onContinue,
}: TemplateRendererProps) {
  const { quizState } = useEditor();
  const actualStepNumber = stepNumber || fallbackStep || 1;
  const { config, loading } = useTemplateConfig(actualStepNumber);
  const [renderMode, setRenderMode] = useState<'connected' | 'fallback'>('connected');

  // 🔍 EXECUTAR VALIDAÇÃO DE SINCRONIZAÇÃO
  if (process.env.NODE_ENV === 'development') {
    runValidation();
  }

  // 🎯 NOVA ABORDAGEM: Usar stepTemplatesMapping como fonte única
  const stepTemplate = STEP_TEMPLATES_MAPPING[actualStepNumber];
  const stepInfo = getStepInfo(actualStepNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-[#B89B7A] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[#432818]">Carregando template...</p>
          <p className="text-sm text-gray-600">
            Step {actualStepNumber}: {stepInfo?.name || 'Carregando...'}
          </p>
        </div>
      </div>
    );
  }

  // 🎯 PRIORIDADE 1: Usar template do stepTemplatesMapping
  if (stepTemplate?.templateFunction && renderMode === 'connected') {
    console.log(`✅ TemplateRenderer: Usando stepTemplatesMapping para step ${actualStepNumber}`);
    console.log(`📋 Template info:`, stepInfo);

    try {
      // Obter blocos do template
      const blocks = stepTemplate.templateFunction(quizState);
      
      if (blocks && blocks.length > 0) {
        // Renderizar usando o sistema de blocos JSON
        return (
          <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
            {/* Header com info do step */}
            <div className="w-full py-6 px-4">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <img
                  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                  alt="Logo Gisele Galvão"
                  className="w-16 h-16 object-contain"
                />
                <div className="text-right text-sm text-gray-600">
                  Step {actualStepNumber} de 21 - {stepInfo?.name}
                </div>
              </div>
            </div>

            {/* Conteúdo dos blocos */}
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="max-w-2xl w-full space-y-6">
                {blocks.map((block, index) => (
                  <div key={block.id || index} className="block-container">
                    {/* Aqui seria renderizado o bloco - por agora placeholder */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="text-sm text-gray-500 mb-2">Bloco: {block.type}</div>
                      <div className="text-lg">{block.content || block.properties?.content || 'Conteúdo do bloco'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error(`❌ Erro ao renderizar template ${actualStepNumber}:`, error);
    }
  }

  // 🎯 PRIORIDADE 2: Fallback para templates React legados
  const legacyTemplates = {
    1: ConnectedStep01Template,
    13: ConnectedStep13Template,
    20: Step20Result,
  };

  const LegacyTemplate = legacyTemplates[actualStepNumber as keyof typeof legacyTemplates];

  if (LegacyTemplate) {
    console.log(`🔄 TemplateRenderer: Usando template React legado para step ${actualStepNumber}`);
    
    if (actualStepNumber === 20) {
      return <LegacyTemplate sessionId={sessionId || 'demo'} onContinue={onContinue} />;
    }
    return <LegacyTemplate sessionId={sessionId || 'demo'} onContinue={onContinue} />;
  }

  // Fallback: renderizar baseado na configuração JSON
  console.log(`📄 TemplateRenderer: Usando fallback JSON para step ${actualStepNumber}`);

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
          <div className="text-right text-sm text-gray-600">Step {actualStepNumber} de 21</div>
        </div>
      </div>

      {/* Conteúdo principal baseado no tipo de step */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-6">
          {/* Conteúdo baseado no tipo de template */}
          {actualStepNumber === 1 && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-[#432818]">Descubra Seu Estilo Pessoal</h1>
              <p className="text-lg text-gray-600">Para começar, qual é o seu nome?</p>
              <input
                type="text"
                placeholder="Digite seu nome..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89B7A]"
                onChange={e => {
                  if (e.target.value.trim()) {
                    quizState.setUserNameFromInput(e.target.value.trim());
                  }
                }}
              />
            </div>
          )}

          {actualStepNumber >= 2 && actualStepNumber <= 14 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#432818]">Questão {actualStepNumber - 1}</h1>
              <p className="text-lg text-gray-600">
                {config?.metadata.name || `Template para step ${actualStepNumber}`}
              </p>
              <div className="p-8 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">Template JSON em desenvolvimento...</p>
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

          {actualStepNumber >= 15 && actualStepNumber <= 19 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#432818]">
                {config?.metadata.name || `Etapa ${actualStepNumber}`}
              </h1>
              <div className="p-8 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">Template em desenvolvimento para step {actualStepNumber}</p>
              </div>
            </div>
          )}

          {actualStepNumber === 21 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#432818]">Oferta Final</h1>
              <div className="p-8 bg-white rounded-lg border border-gray-200">
                <p className="text-lg text-gray-600">Página de conversão final</p>
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
          <div>
            <strong>Template Renderer Debug</strong>
          </div>
          <div>Step: {actualStepNumber}</div>
          <div>Mode: {renderMode}</div>
          <div>Template: {stepTemplate ? 'Conectado' : 'Fallback'}</div>
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
