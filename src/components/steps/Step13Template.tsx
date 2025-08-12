/**
 * Step13Template - Template Modular para Etapa 13 do Quiz
 *
 * ✅ APENAS TEMPLATE MODULAR - Compatível com sistema de blocos
 * ❌ Componente monolítico removido para evitar conflitos arquiteturais
 */

// ✅ FUNÇÃO DE TEMPLATE (MANTIDA PARA COMPATIBILIDADE)
export const getStep13Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: 'progress-header-step13',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 65,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '13 de 21',
        spacing: 'small',
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: 'decorative-bar-step13',
      type: 'decorative-bar-inline',
      properties: {
        width: '100%',
        height: 4,
        color: '#B89B7A',
        gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
        borderRadius: 3,
        marginTop: 0,
        marginBottom: 32,
        showShadow: true,
        spacing: 'small',
      },
    },

    // 📱 TÍTULO DA TRANSIÇÃO
    {
      id: 'transition-title-step13',
      type: 'text-inline',
      properties: {
        content: 'Vamos conhecer você melhor!',
        fontSize: 'text-4xl md:text-5xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 24,
        spacing: 'medium',
      },
    },

    // 📝 SUBTÍTULO EXPLICATIVO
    {
      id: 'transition-subtitle-step13',
      type: 'text-inline',
      properties: {
        content:
          'Agora vamos fazer algumas perguntas estratégicas para personalizar ainda mais seu resultado.',
        fontSize: 'text-lg md:text-xl',
        textAlign: 'text-center',
        color: '#432818',
        opacity: 0.8,
        marginBottom: 32,
        maxWidth: '640px',
        spacing: 'medium',
      },
    },

    // 🔄 BOTÃO DE CONTINUAR
    {
      id: 'continue-button-step13',
      type: 'button-inline',
      properties: {
        text: 'Continuar →',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#FFFFFF',
        hoverBackgroundColor: '#A1835D',
        borderRadius: 12,
        padding: '16px 32px',
        fontSize: 'text-lg',
        fontWeight: 'font-semibold',
        marginTop: 16,
        marginBottom: 32,
        showShadow: true,
        spacing: 'medium',
      },
    },

    // 📊 INDICADOR DE PROGRESSO
    {
      id: 'progress-indicator-step13',
      type: 'text-inline',
      properties: {
        content: 'Etapa 13 de 21',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#432818',
        opacity: 0.6,
        marginTop: 24,
        spacing: 'small',
      },
    },
  ];
};

// ✅ EXPORT PADRÃO (COMPATIBILIDADE)
export default getStep13Template;
  id,
  className = '',
  style = {},
  properties = {
    enabled: true,
    title: 'QUESTÃO 12 - CONFIGURAR NO PAINEL',
    subtitle: '',
    questionCounter: 'Questão 12 de 10',
    backgroundColor: '#FEFEFE',
    textColor: '#432818',
    showProgress: true,
    progressValue: 65,
    buttonText: 'Próxima Questão →',
    multipleSelection: true,
    minSelections: 1,
    maxSelections: 3,
    columns: 2,
    imageSize: 256,
  },
  isEditing = false,
  isSelected = false,
  onUpdate,
  onClick,
}) => {
  // ✅ DEBUG E MONITORAMENTO
  useEffect(() => {
    if (isEditing) {
      console.log(`Step13Template ${id} entered editing mode`);
    }
  }, [isEditing, id]);

  useEffect(() => {
    console.log(`Step13Template ${id} properties updated:`, properties);
  }, [properties, id]);

  // ✅ FUNÇÃO DE CLIQUE
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();

    if (isEditing) {
      console.log(`Step13Template ${id} clicked in editing mode`);
      onUpdate?.(id, { lastClicked: new Date().toISOString() });
    }
  };

  // ✅ ESTILOS DINÂMICOS
  const containerStyles: React.CSSProperties = {
    backgroundColor: properties.backgroundColor,
    color: properties.textColor,
    width: '100%',
    minHeight: '500px',
    padding: '24px',
    boxSizing: 'border-box',
    position: 'relative',
    cursor: isEditing ? 'pointer' : 'default',
    border: isSelected ? '2px dashed #B89B7A' : '1px solid #e5e7eb',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    opacity: properties.enabled === false ? 0.5 : 1,
    pointerEvents: properties.enabled === false ? 'none' : 'auto',
    ...style,
  };

  // ✅ RENDERIZAÇÃO CONDICIONAL QUANDO DESABILITADO
  if (!properties.enabled && !isEditing) {
    return null;
  }

  return (
    <div
      id={id}
      className={`step13-template ${className} ${isEditing ? 'editing-mode' : ''}`}
      style={containerStyles}
      onClick={handleClick}
    >
      {/* Header com Progresso */}
      {properties.showProgress && (
        <div className="step-header mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500"
              style={{ width: `${properties.progressValue}%` }}
            />
          </div>
        </div>
      )}

      {/* Conteúdo da Questão */}
      <div className="step-content text-center">
        {/* Título da Questão */}
        <h1 className="text-2xl font-bold mb-2" style={{ color: properties.textColor }}>
          {properties.title}
        </h1>

        {/* Contador da Questão */}
        {properties.questionCounter && (
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            {properties.questionCounter}
          </p>
        )}

        {/* Área de Conteúdo Configurável */}
        <div className="content-area mb-6 p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">
            📝 Conteúdo da Etapa 13 - Configure no painel de propriedades
          </p>

          {/* Placeholder para opções */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-4 bg-white rounded border border-gray-200">
                <div className="w-full h-20 bg-gray-100 rounded mb-2"></div>
                <p className="text-xs text-gray-400">Opção {i}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Continuar */}
        <div className="button-section">
          <button
            className="w-full max-w-md py-3 px-6 bg-[#B89B7A] text-white font-semibold rounded-md hover:bg-[#A1835D] transition-all duration-300"
            disabled={isEditing}
          >
            {properties.buttonText}
          </button>
        </div>

        {/* Info sobre Seleção */}
        {properties.multipleSelection && (
          <p className="text-xs text-gray-500 mt-4">
            Selecione entre {properties.minSelections} e {properties.maxSelections} opções
          </p>
        )}
      </div>

      {/* Indicadores de Estado no Modo de Edição */}
      {isEditing && (
        <div className="absolute top-2 right-2 flex gap-2 items-center">
          {!properties.enabled && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Desabilitado</span>
          )}
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step 13</span>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && isEditing && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 font-mono">ID: {id}</div>
      )}
    </div>
  );
};

// ✅ FUNÇÃO DE TEMPLATE (MANTIDA PARA COMPATIBILIDADE)
export const getStep13Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: 'progress-header-step13',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 65,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '13 de 21',
        spacing: 'small',
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: 'decorative-bar-step13',
      type: 'decorative-bar-inline',
      properties: {
        width: '100%',
        height: 4,
        color: '#B89B7A',
        gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
        borderRadius: 3,
        marginTop: 0,
        marginBottom: 32,
        showShadow: true,
        spacing: 'small',
      },
    },

    // 📱 TÍTULO DA TRANSIÇÃO
    {
      id: 'transition-title-step13',
      type: 'text-inline',
      properties: {
        content: 'Quase lá! Processando suas Preferências...',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        fontFamily: 'Playfair Display, serif',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 24,
        lineHeight: '1.2',
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🖼️ IMAGEM DE LOADING/TRANSIÇÃO
    {
      id: 'transition-image-step13',
      type: 'image-display-inline',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838154/20250509_2149_Or%C3%A7amento_e_Investimento_simple_compose_01jtvtc8grfgxdq3pvr9c4jqan_drrewn.webp',
        alt: 'Processando suas preferências de estilo',
        width: 500,
        height: 350,
        className: 'object-cover w-full max-w-lg h-72 rounded-xl mx-auto shadow-lg',
        textAlign: 'text-center',
        marginBottom: 32,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 💭 TEXTO DESCRITIVO
    {
      id: 'transition-description-step13',
      type: 'text-inline',
      properties: {
        content: 'Estamos analisando suas escolhas para criar um perfil de estilo único para você.',
        fontSize: 'text-lg',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 40,
        lineHeight: '1.6',
        spacing: 'small',
        marginTop: 0,
      },
    },
  ];
};
