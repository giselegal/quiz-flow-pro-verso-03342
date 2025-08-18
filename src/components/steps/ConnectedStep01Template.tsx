import { useEditor } from '@/context/EditorContext';
import { useTemplateConfig } from '@/hooks/useTemplateConfig';
import { useEffect, useState } from 'react';

/**
 * 🎯 STEP 01 CONECTADO - INTRODUÇÃO E CAPTURA DE NOME
 * ✅ INTEGRADO: useEditor + useTemplateConfig + JSON híbrido
 *
 * Funcionalidades:
 * - Carrega configuração JSON para design e layout
 * - Conecta ao EditorContext.quizState para capturar nome
 * - Aplicar estilos e comportamentos baseados na configuração
 */
export const ConnectedStep01Template = () => {
  const { quizState } = useEditor();
  const { config, loading, getDesignTokens } = useTemplateConfig(1);
  const [localName, setLocalName] = useState('');

  // Aplicar tokens de design da configuração JSON
  const designTokens = getDesignTokens();

  useEffect(() => {
    // Sincronizar nome local com o estado global
    if (quizState.userName) {
      setLocalName(quizState.userName);
    }
  }, [quizState.userName]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localName.trim()) {
      console.log('👤 ConnectedStep01: Capturando nome:', localName);
      quizState.setUserNameFromInput(localName);

      // Disparar evento personalizado para navegação
      const event = new CustomEvent('quiz-form-complete', {
        detail: { formData: { name: localName.trim() } },
      });
      window.dispatchEvent(event);
    }
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#B89B7A] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#432818]">Carregando template...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: designTokens?.backgroundColor || '#FAF9F7',
        fontFamily: designTokens?.fontFamily || "'Playfair Display', serif",
      }}
    >
      {/* Header com logo */}
      <div className="w-full py-6 px-4">
        <div className="flex justify-center">
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            alt="Logo Gisele Galvão"
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Título principal */}
          <div className="space-y-4">
            <h1
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: designTokens?.secondaryColor || '#432818' }}
            >
              Descubra Seu Estilo Pessoal Único
            </h1>
            <p
              className="text-xl md:text-2xl leading-relaxed"
              style={{ color: designTokens?.primaryColor || '#B89B7A' }}
            >
              Um quiz personalizado para revelar o estilo que mais combina com sua personalidade
            </p>
          </div>

          {/* Formulário de nome */}
          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="userName"
                className="text-lg font-medium block"
                style={{ color: designTokens?.secondaryColor || '#432818' }}
              >
                Para começar, qual é o seu nome?
              </label>
              <input
                type="text"
                id="userName"
                value={localName}
                onChange={e => setLocalName(e.target.value)}
                placeholder="Digite seu primeiro nome..."
                className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-[#B89B7A] focus:outline-none text-lg transition-colors"
                style={{
                  background: designTokens?.card.background || '#fff',
                  borderRadius: designTokens?.card.borderRadius || '16px',
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!localName.trim()}
              className="w-full py-4 px-8 text-white font-semibold text-lg rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background: localName.trim()
                  ? designTokens?.button.background || 'linear-gradient(90deg, #B89B7A, #aa6b5d)'
                  : '#ccc',
                borderRadius: designTokens?.button.borderRadius || '10px',
                boxShadow: localName.trim()
                  ? designTokens?.button.shadow || '0 4px 14px rgba(184, 155, 122, 0.15)'
                  : 'none',
              }}
            >
              Começar Quiz →
            </button>
          </form>

          {/* Informações adicionais */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#B89B7A] rounded-full"></span>
                <span>3 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#B89B7A] rounded-full"></span>
                <span>13 perguntas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#B89B7A] rounded-full"></span>
                <span>Resultado personalizado</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Suas respostas são privadas e usadas apenas para calcular seu resultado personalizado.
            </p>
          </div>
        </div>
      </div>

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white/90 p-2 rounded text-xs text-gray-600 border">
          <div>Nome atual: {quizState.userName || 'não definido'}</div>
          <div>Respostas: {quizState.answers.length}</div>
          <div>Template: {config.metadata.id}</div>
        </div>
      )}
    </div>
  );
};

export default ConnectedStep01Template;
