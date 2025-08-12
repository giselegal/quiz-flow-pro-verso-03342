import React, { useEffect } from 'react';

/**
 * Step05Template - Componente para Etapa 5 do Quiz
 *
 * Template para questão 4: Configurável via painel de propriedades
 * Integração com sistema de quiz e editor de propriedades
 */

// ✅ INTERFACE OBRIGATÓRIA PARA O EDITOR
interface Step05TemplateProps {
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
export const Step05Template: React.FC<Step05TemplateProps> = ({
  id,
  className = '',
  style = {},
  properties = {
    enabled: true,
    title: 'QUESTÃO 4 - CONFIGURAR NO PAINEL',
    subtitle: '',
    questionCounter: 'Questão 4 de 10',
    backgroundColor: '#FEFEFE',
    textColor: '#432818',
    showProgress: true,
    progressValue: 25,
    buttonText: 'Próxima Questão →',
    multipleSelection: true,
    minSelections: 3,
    autoAdvance: true,
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
      console.log(`Step05Template ${id} entered editing mode`);
    }
  }, [isEditing, id]);

  useEffect(() => {
    console.log(`Step05Template ${id} properties updated:`, properties);
  }, [properties, id]);

  // ✅ FUNÇÃO DE CLIQUE
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();

    if (isEditing) {
      console.log(`Step05Template ${id} clicked in editing mode`);
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
      className={`step05-template ${className} ${isEditing ? 'editing-mode' : ''}`}
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
            📝 Conteúdo da Etapa 5 - Configure no painel de propriedades
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
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Step 05</span>
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
export const getStep05Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step05-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 25,
        progressMax: 100,
        showBackButton: true,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: 'step05-question-title',
      type: 'text-inline',
      properties: {
        content: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
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
      id: 'step05-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 5 de 10',
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
      id: 'step05-details-options',
      type: 'options-grid',
      properties: {
        questionId: 'q5',
        options: [
          {
            id: '5a',
            text: 'Próxima Questão →',
            value: '5a',
            category: 'Natural',
            styleCategory: 'Natural',
            points: 1,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp',
            marginTop: 0,
            spacing: 'small',
            marginBottom: 0,
          },
          {
            id: '5b',
            text: 'Próxima Questão →',
            value: '5b',
            category: 'Clássico',
            styleCategory: 'Clássico',
            points: 1,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp',
          },
          {
            id: '5c',
            text: 'Próxima Questão →',
            value: '5c',
            category: 'Contemporâneo',
            styleCategory: 'Contemporâneo',
            points: 1,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp',
          },
          {
            id: '5d',
            text: 'Próxima Questão →',
            value: '5d',
            category: 'Elegante',
            styleCategory: 'Elegante',
            points: 1,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp',
          },
          {
            id: '5e',
            text: 'Próxima Questão →',
            value: '5e',
            category: 'Romântico',
            styleCategory: 'Romântico',
            points: 1,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp',
          },
          {
            id: '5f',
            text: 'Próxima Questão →',
            value: '5f',
            category: 'Sexy',
            styleCategory: 'Sexy',
            points: 1,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp',
          },
          {
            id: '5g',
            text: 'Próxima Questão →',
            value: '5g',
            category: 'Dramático',
            styleCategory: 'Dramático',
            points: 1,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp',
          },
          {
            id: '5h',
            text: 'Próxima Questão →',
            value: '5h',
            category: 'Criativo',
            styleCategory: 'Criativo',
            points: 1,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp',
          },
        ],
        columns: 2,
        showImages: true,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 3,
        autoAdvance: true,
        validationMessage: 'Selecione até 3 opções',
        gridGap: 16,
        responsiveColumns: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        requiredSelections: 3,
        enableButtonOnlyWhenValid: false,
        instantActivation: true,
        showValidationFeedback: true,
      },
    },

    // 🔘 BOTÃO DE NAVEGAÇÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: 'step05-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Próxima Questão →',
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

export default getStep05Template;
