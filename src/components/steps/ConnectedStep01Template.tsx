import { useEditor } from '@/context/EditorContext';
import { useTemplateConfig } from '@/hooks/useTemplateConfig';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Design tokens centralizados - otimizados
const colors = {
  primary: '#B89B7A',
  primaryDark: '#A1835D',
  secondary: '#432818',
  background: '#FEFEFE',
  backgroundAlt: '#F8F5F0',
  text: '#432818',
  textLight: '#6B7280',
  border: '#E5E7EB',
};

// URLs otimizadas pré-construídas para performance
const LOGO_BASE_URL = 'https://res.cloudinary.com/der8kogzu/image/upload/';
const LOGO_IMAGE_ID = 'v1752430327/LOGO_DA_MARCA_GISELE_l78gin';

const STATIC_LOGO_IMAGE_URLS = {
  webp: `${LOGO_BASE_URL}f_webp,q_70,w_120,h_50,c_fit/${LOGO_IMAGE_ID}.webp`,
  png: `${LOGO_BASE_URL}f_png,q_70,w_120,h_50,c_fit/${LOGO_IMAGE_ID}.png`,
};

/**
 * 🎯 STEP 01 CONECTADO - MODERNIZADO E OTIMIZADO
 * ✅ INTEGRADO: useEditor + useTemplateConfig + Performance otimizada
 * ✅ Design responsivo e acessível
 * ✅ URLs pré-construídas para LCP
 * ✅ Validação em tempo real
 */
export const ConnectedStep01Template = () => {
  const { quizState } = useEditor();
  const { config, loading, getDesignTokens } = useTemplateConfig(1);
  const [localName, setLocalName] = useState('');
  const [error, setError] = useState('');

  // Aplicar tokens de design da configuração JSON
  const designTokens = getDesignTokens();
  
  useEffect(() => {
    // Sincronizar nome local com o estado global
    if (quizState.userName) {
      setLocalName(quizState.userName);
    }
    
    // Reportar Web Vitals na inicialização
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark('step01-mounted');
    }
  }, [quizState.userName]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação modernizada
    if (!localName.trim()) {
      setError('Por favor, digite seu nome para continuar');
      return;
    }
    
    setError(''); // Limpar erro
    console.log('👤 ConnectedStep01: Capturando nome:', localName);
    quizState.setUserNameFromInput(localName);
    
    // Disparar evento personalizado para navegação
    const event = new CustomEvent('quiz-form-complete', {
      detail: { formData: { name: localName.trim() } }
    });
    window.dispatchEvent(event);
    
    // Reportar interação para analytics
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark('user-interaction');
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
    <main
      className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-white to-gray-50 py-8"
      style={{
        backgroundColor: designTokens?.backgroundColor || colors.background,
        fontFamily: designTokens?.fontFamily || "'Playfair Display', serif"
      }}
      data-section="intro"
    >
      {/* Skip link para acessibilidade */}
      <a 
        href="#quiz-form" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white text-[#432818] px-4 py-2 rounded-md shadow-md"
      >
        Pular para o formulário
      </a>
      
      <header className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-8 mx-auto">
        {/* Logo centralizado - renderização otimizada */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <picture>
              <source srcSet={STATIC_LOGO_IMAGE_URLS.webp} type="image/webp" />
              <img
                src={STATIC_LOGO_IMAGE_URLS.png}
                alt="Logo Gisele Galvão"
                className="h-auto mx-auto"
                width={120}
                height={50}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  aspectRatio: '120 / 50',
                }}
              />
            </picture>
            {/* Barra dourada */}
            <div
              className="h-[3px] bg-[#B89B7A] rounded-full mt-1.5"
              style={{
                width: '300px',
                maxWidth: '90%',
                margin: '0 auto',
              }}
            />
          </div>
        </div>

        {/* Título principal modernizado */}
        <h1
          className="text-2xl font-bold text-center leading-tight px-2 sm:text-3xl md:text-4xl playfair-display"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            color: designTokens?.secondaryColor || colors.secondary
          }}
        >
          <span className="text-[#B89B7A]">Chega</span> de um guarda-roupa lotado e da sensação de que nada combina com{' '}
          <span className="text-[#B89B7A]">Você</span>.
        </h1>
      </header>

      <section className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-6 md:space-y-8 mx-auto">
        {/* Texto descritivo */}
        <p 
          className="text-sm text-center leading-relaxed px-2 sm:text-base"
          style={{ color: colors.textLight }}
        >
          Em poucos minutos, descubra seu{' '}
          <span className="font-semibold text-[#B89B7A]">
            Estilo Predominante
          </span>{' '}
          — e aprenda a montar looks que realmente refletem sua{' '}
          <span className="font-semibold" style={{ color: colors.secondary }}>
            essência
          </span>, com
          praticidade e{' '}
          <span className="font-semibold" style={{ color: colors.secondary }}>
            confiança
          </span>.
        </p>

        {/* Formulário modernizado */}
        <div id="quiz-form" className="mt-8">
          <form
            onSubmit={handleNameSubmit}
            className="w-full space-y-6"
            autoComplete="off"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: colors.secondary }}
              >
                NOME <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                placeholder="Digite seu nome"
                value={localName}
                onChange={(e) => {
                  setLocalName(e.target.value);
                  if (error) setError('');
                }}
                className={cn(
                  "w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-offset-2 focus:ring-offset-[#FEFEFE] focus-visible:ring-offset-[#FEFEFE]",
                  error 
                    ? "border-red-500 focus:ring-red-500 focus-visible:ring-red-500" 
                    : "border-[#B89B7A] focus:ring-[#A1835D] focus-visible:ring-[#A1835D]"
                )}
                autoFocus
                aria-required="true"
                autoComplete="off"
                inputMode="text"
                maxLength={32}
                aria-invalid={!!error}
                aria-describedby={error ? "name-error" : undefined}
                required
              />
              {error && (
                <p id="name-error" className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>
              )}
            </div>
            
            <button
              type="submit"
              className={cn(
                'w-full py-2 px-3 text-sm font-semibold rounded-md shadow-md transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2',
                'sm:py-3 sm:px-4 sm:text-base',
                'md:py-3.5 md:text-lg',
                localName.trim() 
                  ? 'bg-[#B89B7A] text-white hover:bg-[#A1835D] active:bg-[#947645] hover:shadow-lg transform hover:scale-[1.01]' 
                  : 'bg-[#B89B7A]/50 text-white/90 cursor-not-allowed'
              )}
              aria-disabled={!localName.trim()}
            >
              <span className="flex items-center justify-center gap-2">
                {localName.trim() ? 'Quero Descobrir meu Estilo Agora!' : 'Digite seu nome para continuar'}
              </span>
            </button>

            <p className="text-xs text-center pt-1" style={{ color: colors.textLight }}>
              Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa{' '}
              <a 
                href="#" 
                className="text-[#B89B7A] hover:text-[#A1835D] underline focus:outline-none focus:ring-1 focus:ring-[#B89B7A] rounded"
              >
                política de privacidade
              </a>
            </p>
          </form>
        </div>
      </section>
      
      {/* Rodapé */}
      <footer className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 text-center mx-auto">
        <p className="text-xs" style={{ color: colors.textLight }}>
          © {new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados
        </p>
      </footer>

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white/90 p-2 rounded text-xs text-gray-600 border">
          <div>Nome atual: {quizState.userName || 'não definido'}</div>
          <div>Respostas: {quizState.answers.length}</div>
          <div>Template: {config.metadata.id}</div>
        </div>
      )}
    </main>
  );
};

export default ConnectedStep01Template;