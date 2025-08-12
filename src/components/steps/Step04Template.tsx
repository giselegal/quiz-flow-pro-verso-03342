import React, { useEffect } from 'react';

/**
 * Step04Template - Componente para Etapa 4 do Quiz
 *
 * Template para questão 3: Configurável via painel de propriedades
 * Integração com sistema de quiz e editor de propriedades
 */

// ✅ INTERFACE OBRIGATÓRIA PARA O EDITOR
interface Step04TemplateProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;

  properties?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    questionCounter?: string;
    backgroundColor?: string;
    textColor?: string;
    showProgress?: boolean;
    progressValue?: number;
    buttonText?: string;
    multipleSelection?: boolean;
    minSelections?: number;
    maxSelections?: number;
    columns?: number;
    imageSize?: number;
  };

  isEditing?: boolean;
  isSelected?: boolean;
  onUpdate?: (id: string, updates: any) => void;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

// ✅ COMPONENTE PRINCIPAL
export const Step04Template: React.FC<Step04TemplateProps> = ({
  id,
  className = '',
  style = {},
  properties = {
    enabled: true,
    title: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
    subtitle: '',
    questionCounter: 'Questão 3 de 10',
    backgroundColor: '#FEFEFE',
    textColor: '#432818',
    showProgress: true,
    progressValue: 30,
    buttonText: 'Continuar',
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
      console.log(`Step04Template ${id} entered editing mode`);
    }
  }, [isEditing, id]);

  useEffect(() => {
    console.log(`Step04Template ${id} properties updated:`, properties);
  }, [properties, id]);

  // ✅ FUNÇÃO DE CLIQUE
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();

    if (isEditing) {
      console.log(`Step04Template ${id} clicked in editing mode`);
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
      className={`step04-template ${className} ${isEditing ? 'editing-mode' : ''}`}
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
            📝 Selecione até 3 opções que mais representam seu estilo visual
          </p>

          {/* Grid de Opções Visuais */}
          <div 
            className="grid gap-4 max-w-4xl mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${properties.columns}, 1fr)` 
            }}
          >
            {[
              { id: '3a', text: 'Visual leve, despojado e natural', category: 'Natural', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp' },
              { id: '3b', text: 'Visual clássico e tradicional', category: 'Clássico', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp' },
              { id: '3c', text: 'Visual casual com toque atual', category: 'Contemporâneo', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp' },
              { id: '3d', text: 'Visual refinado e imponente', category: 'Elegante', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp' },
              { id: '3e', text: 'Visual romântico, feminino e delicado', category: 'Romântico', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp' },
              { id: '3f', text: 'Visual sensual, com saia justa e decote', category: 'Sexy', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp' },
              { id: '3g', text: 'Visual marcante e urbano (jeans + jaqueta)', category: 'Dramático', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp' },
              { id: '3h', text: 'Visual criativo, colorido e ousado', category: 'Criativo', imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp' }
            ].map((option) => (
              <div key={option.id} className="option-card p-3 bg-white rounded-lg border border-gray-200 hover:border-[#B89B7A] cursor-pointer transition-all">
                <div 
                  className="w-full rounded mb-3 bg-gray-100"
                  style={{ 
                    height: `${(properties.imageSize || 256) / 4}px`,
                    backgroundImage: `url(${option.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="text-xs font-semibold text-[#B89B7A] mb-1">{option.category}</div>
                <p className="text-xs text-gray-700">{option.text}</p>
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
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step 04</span>
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
export const getStep04Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step04-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 30,
        progressMax: 100,
        showBackButton: true,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: 'step04-question-title',
      type: 'text-inline',
      properties: {
        content: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
        level: 'h2',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 0,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 📊 CONTADOR DE QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: 'step04-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 3 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 🎯 AGRUPAMENTO DE OPÇÕES (EDITÁVEL COMO BLOCO ÚNICO)
    {
      id: 'step04-visual-options',
      type: 'options-grid',
      properties: {
        questionId: 'q3',
        options: [
          {
            id: '3a',
            text: 'Visual leve, despojado e natural',
            value: '3a',
            category: 'Natural',
            styleCategory: 'Natural',
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
            marginTop: 0,
            spacing: 'small',
            marginBottom: 0,
          },
          {
            id: '3b',
            text: 'Visual clássico e tradicional',
            value: '3b',
            category: 'Clássico',
            styleCategory: 'Clássico',
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp',
          },
          {
            id: '3c',
            text: 'Visual casual com toque atual',
            value: '3c',
            category: 'Contemporâneo',
            styleCategory: 'Contemporâneo',
            points: 1,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
          },
          {
            id: '3d',
            text: 'Visual refinado e imponente',
            value: '3d',
            category: 'Elegante',
            styleCategory: 'Elegante',
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp',
          },
          {
            id: '3e',
            text: 'Visual romântico, feminino e delicado',
            value: '3e',
            category: 'Romântico',
            styleCategory: 'Romântico',
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
          },
          {
            id: '3f',
            text: 'Visual sensual, com saia justa e decote',
            value: '3f',
            category: 'Sexy',
            styleCategory: 'Sexy',
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
          },
          {
            id: '3g',
            text: 'Visual marcante e urbano (jeans + jaqueta)',
            value: '3g',
            category: 'Dramático',
            styleCategory: 'Dramático',
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
          },
          {
            id: '3h',
            text: 'Visual criativo, colorido e ousado',
            value: '3h',
            category: 'Criativo',
            styleCategory: 'Criativo',
            points: 1,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
          },
        ],
        columns: 2,
        showImages: true,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 1,
        validationMessage: 'Selecione até 3 opções',
        gridGap: 16,
        responsiveColumns: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 0,
        requiredSelections: 3,
        enableButtonOnlyWhenValid: false,
        instantActivation: true,
        showValidationFeedback: true,
      },
    },
    // 🔘 BOTÃO DE NAVEGAÇÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: 'step04-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Continuar',
        variant: 'primary',
        size: 'large',
        fullWidth: true,
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabled: true,
        requiresValidSelection: true,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },
  ];
};

export default getStep04Template;
